// Standalone sanity test for the extraction/filter/CSV pipeline, run against
// a local mock HTML fixture (no network access required). This proves the
// parsing logic works; it does not prove AutoTrader's live markup still
// matches the SELECTORS guesses in scrape_autotrader_dealers.js.

'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const mod = require('../scrape_autotrader_dealers.js');

async function run() {
  const html = fs.readFileSync(path.join(__dirname, 'mock_search_page.html'), 'utf8');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setContent(html, { waitUntil: 'domcontentloaded' });

  const cards = await page.$$('article');
  console.log(`Found ${cards.length} mock dealer cards`);

  const results = [];
  for (const card of cards) {
    const text = await card.innerText();
    const linkEl = await card.$('a');
    const href = linkEl ? await linkEl.getAttribute('href') : null;
    const parsed = mod.parseDealerBlock(text, href);
    results.push(parsed);
  }

  console.log(JSON.stringify(results, null, 2));

  const filtered = results.filter((d) => {
    if (!d.name) return false;
    if (mod.isExcludedGroup(d.name)) return false;
    if (d.carsOnForecourt === null || d.carsOnForecourt < 20) return false;
    return true;
  });

  console.log('--- Filtered (>=20 cars, non-franchise) ---');
  console.log(JSON.stringify(filtered, null, 2));

  const expectedNames = ['Leeds Independent Motors', 'Headingley Quality Cars'];
  const gotNames = filtered.map((d) => d.name).sort();
  const ok =
    gotNames.length === expectedNames.length &&
    gotNames.every((n, i) => n === expectedNames.sort()[i]);

  console.log(ok ? 'PASS' : 'FAIL');

  await browser.close();
  process.exitCode = ok ? 0 : 1;
}

run();
