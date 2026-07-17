/**
 * Shared engine used by every per-site scraper: rate-limited fetch with a
 * plain-HTTP-then-Playwright fallback, generic dealer-card text parsing,
 * and CSV output. See sites/*.js for the site-specific bits (search URL
 * construction, card selectors, exclude/min-cars config).
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function politeDelay(minMs, maxMs) {
  const ms = minMs + Math.random() * (maxMs - minMs);
  return sleep(ms);
}

// UK postcode regex (reasonably permissive).
const POSTCODE_RE = /\b([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})\b/i;

// UK phone number heuristics: 0XXXX XXXXXX / 03XX / +44 formats.
const PHONE_RE = /(\+44\s?\d{2,4}|\(?0\d{2,4}\)?)[\s-]?\d{3,4}[\s-]?\d{3,4}/;

// "NN cars" / "NN vehicles in stock" style text on dealer cards.
const CAR_COUNT_RE = /(\d[\d,]*)\s*(?:cars?|vehicles?|used cars?)\b/i;

function parseDealerBlock(text, href) {
  const postcodeMatch = text.match(POSTCODE_RE);
  const phoneMatch = text.match(PHONE_RE);
  const carCountMatch = text.match(CAR_COUNT_RE);

  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const name = lines.find(
    (l) =>
      !POSTCODE_RE.test(l) &&
      !PHONE_RE.test(l) &&
      !CAR_COUNT_RE.test(l) &&
      l.length > 1
  );

  let town = null;
  if (postcodeMatch) {
    const postcodeLine = lines.find((l) => l.includes(postcodeMatch[0]));
    if (postcodeLine) {
      const before = postcodeLine.slice(0, postcodeLine.indexOf(postcodeMatch[0]));
      const cleaned = before.replace(/,\s*$/, '').trim();
      if (cleaned && !PHONE_RE.test(cleaned)) town = cleaned;
    }
  }

  return {
    name: name || null,
    town,
    postcode: postcodeMatch ? postcodeMatch[0].toUpperCase() : null,
    phone: phoneMatch ? phoneMatch[0].trim() : null,
    carsOnForecourt: carCountMatch
      ? parseInt(carCountMatch[1].replace(/,/g, ''), 10)
      : null,
    profileUrl: href || null,
  };
}

function isExcludedGroup(name, excludeGroups) {
  const lower = name.toLowerCase();
  return excludeGroups.some((g) => lower.includes(g.toLowerCase()));
}

async function fetchPlain(url, userAgent) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': userAgent || DEFAULT_USER_AGENT,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-GB,en;q=0.9',
    },
  });
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.text();
}

function looksBlocked(html) {
  if (!html || html.length < 500) return true;
  const lowered = html.toLowerCase();
  return (
    lowered.includes('captcha') ||
    lowered.includes('access denied') ||
    lowered.includes('are you a robot') ||
    lowered.includes('request blocked')
  );
}

class SiteScraper {
  constructor(opts) {
    this.name = opts.name;
    this.buildSearchUrl = opts.buildSearchUrl; // (postcode, radiusMiles, pageNum) => url
    this.cardSelectors = opts.cardSelectors; // array of CSS selectors to try, in order
    this.linkSelector = opts.linkSelector; // selector for the dealer-profile link within/around a card
    this.baseUrl = opts.baseUrl;
    this.hasNextPage = opts.hasNextPage || (() => false);
    this.userAgent = opts.userAgent || DEFAULT_USER_AGENT;
    this.rateLimit = opts.rateLimit || { minDelayMs: 2500, maxDelayMs: 5000 };
    this.maxRetries = opts.maxRetries || 4;
    this.maxPages = opts.maxPages || 50;

    this.browser = null;
    this.context = null;
    this.usePlaywright = false;
  }

  async ensureBrowser() {
    if (this.browser) return;
    const { chromium } = require('playwright');
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext({ userAgent: this.userAgent });
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
    }
  }

  async fetchWithPlaywright(url) {
    await this.ensureBrowser();
    const page = await this.context.newPage();
    try {
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      if (resp && !resp.ok() && resp.status() !== 304) {
        throw Object.assign(new Error(`HTTP ${resp.status()}`), { status: resp.status() });
      }
      return await page.content();
    } finally {
      await page.close();
    }
  }

  async fetchWithRetry(url) {
    let lastErr;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        let html;
        if (this.usePlaywright) {
          html = await this.fetchWithPlaywright(url);
        } else {
          try {
            html = await fetchPlain(url, this.userAgent);
            if (looksBlocked(html)) throw new Error('Response looked blocked/bot-gated');
          } catch (plainErr) {
            console.warn(
              `[${this.name}] plain HTTP failed for ${url} (${plainErr.message}); switching to Playwright.`
            );
            this.usePlaywright = true;
            html = await this.fetchWithPlaywright(url);
          }
        }
        return html;
      } catch (err) {
        lastErr = err;
        const status = err.status;
        const retryable = !status || status === 403 || status === 429 || status >= 500;
        if (!retryable || attempt === this.maxRetries) throw err;
        const backoffMs = Math.min(30000, 2000 * 2 ** (attempt - 1)) + Math.random() * 1000;
        console.warn(
          `[${this.name}] attempt ${attempt} failed for ${url} (${err.message}); retrying in ${Math.round(
            backoffMs / 1000
          )}s`
        );
        await sleep(backoffMs);
      }
    }
    throw lastErr;
  }

  async extractDealersFromHtml(html) {
    await this.ensureBrowser();
    const page = await this.context.newPage();
    const results = [];
    try {
      await page.setContent(html, { waitUntil: 'domcontentloaded' });

      let cards = [];
      for (const sel of this.cardSelectors) {
        cards = await page.$$(sel);
        if (cards.length > 0) break;
      }

      for (const card of cards) {
        const text = await card.innerText().catch(() => '');
        if (!text || !text.trim()) continue;

        let href = await card.getAttribute('href').catch(() => null);
        if (!href && this.linkSelector) {
          const linkEl = await card.$(this.linkSelector).catch(() => null);
          href = linkEl ? await linkEl.getAttribute('href').catch(() => null) : null;
        }
        if (href && href.startsWith('/')) href = `${this.baseUrl}${href}`;

        const parsed = parseDealerBlock(text, href);
        if (parsed.name) results.push(parsed);
      }
    } finally {
      await page.close();
    }
    return results;
  }

  async scrape(postcode, radiusMiles) {
    const allDealers = [];
    const seen = new Set();

    for (let pageNum = 1; pageNum <= this.maxPages; pageNum++) {
      const url = this.buildSearchUrl(postcode, radiusMiles, pageNum);
      console.log(`[${this.name}] fetching page ${pageNum}: ${url}`);

      let html;
      try {
        html = await this.fetchWithRetry(url);
      } catch (err) {
        console.error(`[${this.name}] giving up on page ${pageNum}: ${err.message}`);
        break;
      }

      const dealers = await this.extractDealersFromHtml(html);
      if (dealers.length === 0) {
        console.log(`[${this.name}] no dealer cards found on page ${pageNum}; stopping.`);
        break;
      }

      let newCount = 0;
      for (const d of dealers) {
        const key = d.profileUrl || `${d.name}|${d.postcode}`;
        if (seen.has(key)) continue;
        seen.add(key);
        allDealers.push(d);
        newCount++;
      }
      console.log(`[${this.name}] page ${pageNum}: ${dealers.length} cards, ${newCount} new`);

      if (newCount === 0 && !this.hasNextPage(html)) break;

      await politeDelay(this.rateLimit.minDelayMs, this.rateLimit.maxDelayMs);
    }

    return allDealers;
  }
}

function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function writeCsv(rows, outPath, extraColumn) {
  const headers = ['dealer_name', 'town', 'postcode', 'phone', 'cars_on_forecourt'];
  if (extraColumn) headers.push(extraColumn);
  const lines = [headers.join(',')];
  for (const row of rows) {
    const values = [row.name, row.town, row.postcode, row.phone, row.carsOnForecourt];
    if (extraColumn) values.push(row[extraColumn] ?? row.source);
    lines.push(values.map(csvEscape).join(','));
  }
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, lines.join('\n') + '\n', 'utf8');
}

function filterDealers(dealers, { minCars, excludeGroups }) {
  return dealers.filter((d) => {
    if (!d.name) return false;
    if (isExcludedGroup(d.name, excludeGroups)) return false;
    if (d.carsOnForecourt === null || d.carsOnForecourt < minCars) return false;
    return true;
  });
}

module.exports = {
  DEFAULT_USER_AGENT,
  sleep,
  politeDelay,
  POSTCODE_RE,
  PHONE_RE,
  CAR_COUNT_RE,
  parseDealerBlock,
  isExcludedGroup,
  SiteScraper,
  csvEscape,
  writeCsv,
  filterDealers,
};
