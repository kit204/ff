#!/usr/bin/env node
/**
 * Runs the dealer scraper across multiple sites (AutoTrader, CarGurus,
 * AA Cars, Motors.co.uk) for one postcode/radius, filters each site's
 * results, and writes a combined CSV plus per-site CSVs.
 *
 * Usage:
 *   node scrape_all.js [--sites autotrader,cargurus,aacars,motors]
 *
 * See README.md for the network-access caveat and per-site confidence
 * notes (sites/*.js) before trusting any output.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { writeCsv, filterDealers } = require('./lib/common');

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
  outputDir: path.join(__dirname, 'output'),
};

const SITE_MODULES = {
  autotrader: require('./sites/autotrader'),
  cargurus: require('./sites/cargurus'),
  aacars: require('./sites/aacars'),
  motors: require('./sites/motors'),
};

function parseArgs() {
  const args = process.argv.slice(2);
  const sitesArg = args.find((a) => a.startsWith('--sites'));
  let sites = Object.keys(SITE_MODULES);
  if (sitesArg) {
    const value = sitesArg.includes('=') ? sitesArg.split('=')[1] : args[args.indexOf(sitesArg) + 1];
    sites = value.split(',').map((s) => s.trim());
  }
  return { sites };
}

async function main() {
  const { sites } = parseArgs();
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });

  const combined = [];
  const summary = [];

  for (const siteName of sites) {
    const mod = SITE_MODULES[siteName];
    if (!mod) {
      console.error(`Unknown site "${siteName}"; skipping. Known: ${Object.keys(SITE_MODULES).join(', ')}`);
      continue;
    }

    const scraper = mod.makeScraper();
    let raw = [];
    try {
      raw = await scraper.scrape(CONFIG.postcode, CONFIG.radiusMiles);
    } catch (err) {
      console.error(`[${siteName}] fatal error: ${err.message}`);
    } finally {
      await scraper.closeBrowser();
    }

    fs.writeFileSync(
      path.join(CONFIG.outputDir, `raw_${siteName}.json`),
      JSON.stringify(raw, null, 2),
      'utf8'
    );

    const filtered = filterDealers(raw, {
      minCars: CONFIG.minCarsOnForecourt,
      excludeGroups: CONFIG.excludeGroups,
    });
    filtered.forEach((d) => (d.source = siteName));

    writeCsv(filtered, path.join(CONFIG.outputDir, `${siteName}_ls1_15mi.csv`), 'source');

    combined.push(...filtered);
    summary.push({ site: siteName, found: raw.length, afterFilter: filtered.length });
    console.log(`[${siteName}] ${raw.length} found, ${filtered.length} after filtering.`);
  }

  writeCsv(combined, path.join(CONFIG.outputDir, 'all_sites_ls1_15mi.csv'), 'source');

  console.log('\n--- Summary ---');
  for (const s of summary) {
    console.log(`${s.site}: ${s.found} found -> ${s.afterFilter} after filtering`);
  }
  console.log(`Combined CSV: ${path.join(CONFIG.outputDir, 'all_sites_ls1_15mi.csv')}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exitCode = 1;
});
