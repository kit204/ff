// Standalone sanity test for the extraction/filter/CSV pipeline, run against
// a local mock HTML fixture (no network access required). This proves the
// parsing logic works; it does not prove any site's live markup still
// matches the selector guesses in sites/*.js.

'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { parseDealerBlock, isExcludedGroup, filterDealers } = require('../lib/common');

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
    results.push(parseDealerBlock(text, href));
  }

  const excludeGroups = [
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
  ];
  const filtered = filterDealers(results, { minCars: 20, excludeGroups });

  console.log(JSON.stringify(filtered, null, 2));

  const expectedNames = ['Headingley Quality Cars', 'Leeds Independent Motors'];
  const gotNames = filtered.map((d) => d.name).sort();
  const ok = JSON.stringify(gotNames) === JSON.stringify(expectedNames);

  console.log(ok ? 'PASS' : 'FAIL');
  await browser.close();
  process.exitCode = ok ? 0 : 1;
}

run();
