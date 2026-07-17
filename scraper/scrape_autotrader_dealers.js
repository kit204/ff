#!/usr/bin/env node
/**
 * AutoTrader-only convenience entry point. For multi-site scraping
 * (AutoTrader + CarGurus + AA Cars + Motors.co.uk) use scrape_all.js instead.
 */

'use strict';

const path = require('path');
const { writeCsv, filterDealers } = require('./lib/common');
const autotrader = require('./sites/autotrader');

const CONFIG = {
  postcode: 'LS1',
  radiusMiles: 15,
  minCarsOnForecourt: 20,
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
  outputCsv: path.join(__dirname, 'output', 'ls1_15mi_independent_dealers.csv'),
};

async function main() {
  const scraper = autotrader.makeScraper();
  let raw = [];
  try {
    raw = await scraper.scrape(CONFIG.postcode, CONFIG.radiusMiles);
  } finally {
    await scraper.closeBrowser();
  }

  const filtered = filterDealers(raw, {
    minCars: CONFIG.minCarsOnForecourt,
    excludeGroups: CONFIG.excludeGroups,
  });

  writeCsv(filtered, CONFIG.outputCsv);
  console.log(`[scrape] done. ${raw.length} dealers found, ${filtered.length} after filtering. CSV: ${CONFIG.outputCsv}`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error('[scrape] fatal error:', err);
    process.exitCode = 1;
  });
}

module.exports = { CONFIG };
