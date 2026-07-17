#!/usr/bin/env node
/**
 * Scrapes AutoTrader UK's dealer search (autotrader.co.uk/car-dealers/search)
 * for dealers within a radius of a postcode, then filters and exports to CSV.
 *
 * Strategy:
 *   1. Try plain HTTP fetch for each search results page (fast, cheap).
 *   2. If a page comes back blocked (403/429, or looks like a bot-check /
 *      empty shell), fall back to a real Playwright browser for that page
 *      and continue from there for the rest of the run.
 *   3. Rate-limit every request (randomised delay + retry w/ backoff).
 *
 * Selectors are kept in one CONFIG block below and matching also falls back
 * to regex-over-text-content heuristics, since AutoTrader's markup/class
 * names change over time. Re-check SELECTORS against the live DOM before
 * relying on this in production; run `node inspect_page.js` (see README) to
 * dump the current markup if extraction comes back empty.
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const CONFIG = {
  postcode: 'LS1',
  radiusMiles: 15,
  minCarsOnForecourt: 20,
  // Franchise / large dealer groups to exclude. Matched case-insensitively
  // as a substring against the scraped dealer name.
  excludeGroups: [
    'JCT600',
    'Vertu',
    'Evans Halshaw',
    'Stoneacre',
    'D.M. Keith',
    'DM Keith',
    'Cars2',
    'RRG',
    'Arnold Clark',
    'Big Motoring World',
  ],
  baseUrl: 'https://www.autotrader.co.uk',
  searchPath: '/car-dealers/search',
  outputCsv: path.join(__dirname, 'output', 'ls1_15mi_independent_dealers.csv'),
  rawJsonLog: path.join(__dirname, 'output', 'raw_dealers.json'),
  maxPages: 50, // safety cap
  minDelayMs: 2500,
  maxDelayMs: 5000,
  maxRetries: 4,
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function politeDelay() {
  const ms =
    CONFIG.minDelayMs + Math.random() * (CONFIG.maxDelayMs - CONFIG.minDelayMs);
  return sleep(ms);
}

function buildSearchUrl(pageNum) {
  const params = new URLSearchParams({
    postcode: CONFIG.postcode,
    radius: String(CONFIG.radiusMiles),
    page: String(pageNum),
  });
  return `${CONFIG.baseUrl}${CONFIG.searchPath}?${params.toString()}`;
}

function isExcludedGroup(name) {
  const lower = name.toLowerCase();
  return CONFIG.excludeGroups.some((g) => lower.includes(g.toLowerCase()));
}

// UK postcode regex (reasonably permissive, matches full or outward+inward).
const POSTCODE_RE =
  /\b([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})\b/i;

// UK phone number heuristics: tel: links, or 0XXXX XXXXXX / 03XX / +44 formats.
const PHONE_RE = /(\+44\s?\d{2,4}|\(?0\d{2,4}\)?)[\s-]?\d{3,4}[\s-]?\d{3,4}/;

// "NN cars" / "NN vehicles in stock" style text on dealer cards.
const CAR_COUNT_RE = /(\d[\d,]*)\s*(?:cars?|vehicles?)\b/i;

function parseDealerBlock(text, href) {
  const postcodeMatch = text.match(POSTCODE_RE);
  const phoneMatch = text.match(PHONE_RE);
  const carCountMatch = text.match(CAR_COUNT_RE);

  // Name heuristic: first non-empty line of the block that isn't a
  // postcode/phone/car-count fragment.
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

  // Town heuristic: the line containing the postcode is usually
  // "Town, POSTCODE" or "Town POSTCODE" — take whatever precedes the
  // postcode on that line, minus trailing comma/whitespace.
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

// ---------------------------------------------------------------------------
// Fetch strategy: plain HTTP first, Playwright fallback
// ---------------------------------------------------------------------------

async function fetchPlain(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': CONFIG.userAgent,
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

let browser = null;
let context = null;
let usePlaywright = false;

async function ensureBrowser() {
  if (browser) return;
  const { chromium } = require('playwright');
  browser = await chromium.launch({ headless: true });
  context = await browser.newContext({ userAgent: CONFIG.userAgent });
}

async function fetchWithPlaywright(url) {
  await ensureBrowser();
  const page = await context.newPage();
  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    if (resp && !resp.ok() && resp.status() !== 304) {
      throw Object.assign(new Error(`HTTP ${resp.status()}`), { status: resp.status() });
    }
    const html = await page.content();
    return html;
  } finally {
    await page.close();
  }
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

async function fetchWithRetry(url) {
  let lastErr;
  for (let attempt = 1; attempt <= CONFIG.maxRetries; attempt++) {
    try {
      let html;
      if (usePlaywright) {
        html = await fetchWithPlaywright(url);
      } else {
        try {
          html = await fetchPlain(url);
          if (looksBlocked(html)) {
            throw new Error('Response looked blocked/bot-gated');
          }
        } catch (plainErr) {
          console.warn(
            `[fetch] plain HTTP failed for ${url} (${plainErr.message}); switching to Playwright for the rest of the run.`
          );
          usePlaywright = true;
          html = await fetchWithPlaywright(url);
        }
      }
      return html;
    } catch (err) {
      lastErr = err;
      const status = err.status;
      const retryable = !status || status === 403 || status === 429 || status >= 500;
      if (!retryable || attempt === CONFIG.maxRetries) throw err;
      const backoffMs = Math.min(30000, 2000 * 2 ** (attempt - 1)) + Math.random() * 1000;
      console.warn(
        `[fetch] attempt ${attempt} failed for ${url} (${err.message}); retrying in ${Math.round(
          backoffMs / 1000
        )}s`
      );
      await sleep(backoffMs);
    }
  }
  throw lastErr;
}

// ---------------------------------------------------------------------------
// Page parsing (Playwright DOM extraction; falls back to regex-on-HTML if
// Playwright is unavailable for this call, e.g. when plain fetch succeeded).
// ---------------------------------------------------------------------------

const SELECTORS = {
  // Best-guess container for a single dealer result card. Adjust after
  // inspecting the live DOM (see README "If selectors stop matching").
  dealerCard: '[data-testid*="dealer"], article, li.search-page__result',
  dealerLink: 'a[href*="/car-dealers/details"], a[href*="/dealers/"]',
};

async function extractDealersFromHtml(html, pageUrl) {
  // Use Playwright's DOMParser-less approach: spin up a lightweight page
  // with the captured HTML set via page.setContent so we can use real CSS
  // selectors regardless of whether the HTML came from fetch() or Playwright.
  await ensureBrowser();
  const page = await context.newPage();
  const results = [];
  try {
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    let cards = await page.$$(SELECTORS.dealerCard);
    if (cards.length === 0) {
      // Fallback: treat each dealer-profile link's ancestor block as a card.
      cards = await page.$$(`${SELECTORS.dealerLink}`);
    }

    for (const card of cards) {
      const text = await card.innerText().catch(() => '');
      if (!text || !text.trim()) continue;

      let href = await card.getAttribute('href').catch(() => null);
      if (!href) {
        const linkEl = await card.$(SELECTORS.dealerLink).catch(() => null);
        href = linkEl ? await linkEl.getAttribute('href').catch(() => null) : null;
      }
      if (href && href.startsWith('/')) href = `${CONFIG.baseUrl}${href}`;

      const parsed = parseDealerBlock(text, href);
      if (parsed.name) results.push(parsed);
    }
  } finally {
    await page.close();
  }
  return results;
}

function hasNextPage(html) {
  return /rel=["']next["']|next-page|"hasNextPage":true/i.test(html);
}

// ---------------------------------------------------------------------------
// CSV output
// ---------------------------------------------------------------------------

function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function writeCsv(rows, outPath) {
  const headers = ['dealer_name', 'town', 'postcode', 'phone', 'cars_on_forecourt'];
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(
      [row.name, row.town, row.postcode, row.phone, row.carsOnForecourt]
        .map(csvEscape)
        .join(',')
    );
  }
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, lines.join('\n') + '\n', 'utf8');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const allDealers = [];
  const seenProfileUrls = new Set();

  for (let pageNum = 1; pageNum <= CONFIG.maxPages; pageNum++) {
    const url = buildSearchUrl(pageNum);
    console.log(`[scrape] fetching page ${pageNum}: ${url}`);

    let html;
    try {
      html = await fetchWithRetry(url);
    } catch (err) {
      console.error(`[scrape] giving up on page ${pageNum}: ${err.message}`);
      break;
    }

    const dealers = await extractDealersFromHtml(html, url);
    if (dealers.length === 0) {
      console.log(`[scrape] no dealer cards found on page ${pageNum}; stopping.`);
      break;
    }

    let newCount = 0;
    for (const d of dealers) {
      const key = d.profileUrl || `${d.name}|${d.postcode}`;
      if (seenProfileUrls.has(key)) continue;
      seenProfileUrls.add(key);
      allDealers.push(d);
      newCount++;
    }
    console.log(`[scrape] page ${pageNum}: ${dealers.length} cards, ${newCount} new dealers`);

    if (newCount === 0 && !hasNextPage(html)) break;

    await politeDelay();
  }

  fs.mkdirSync(path.dirname(CONFIG.rawJsonLog), { recursive: true });
  fs.writeFileSync(CONFIG.rawJsonLog, JSON.stringify(allDealers, null, 2), 'utf8');

  const filtered = allDealers.filter((d) => {
    if (!d.name) return false;
    if (isExcludedGroup(d.name)) return false;
    if (d.carsOnForecourt === null || d.carsOnForecourt < CONFIG.minCarsOnForecourt) {
      return false;
    }
    return true;
  });

  writeCsv(filtered, CONFIG.outputCsv);

  console.log(
    `[scrape] done. ${allDealers.length} dealers found, ${filtered.length} after filtering. ` +
      `CSV: ${CONFIG.outputCsv}`
  );

  if (browser) await browser.close();
}

if (require.main === module) {
  main().catch(async (err) => {
    console.error('[scrape] fatal error:', err);
    if (browser) await browser.close();
    process.exitCode = 1;
  });
}

module.exports = { parseDealerBlock, isExcludedGroup, CONFIG };
