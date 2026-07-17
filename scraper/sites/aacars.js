'use strict';

const { SiteScraper } = require('../lib/common');

const BASE_URL = 'https://www.aacars.co.uk';

// Confidence: LOW / UNVERIFIED. AA Cars is primarily a used-car listing
// search (theaa.com/cars), and I don't have a confirmed URL for a
// dealer-directory search by postcode+radius. This is a best guess and
// MUST be confirmed against the live site before trusting output.
function buildSearchUrl(postcode, radiusMiles, pageNum) {
  const params = new URLSearchParams({
    postcode,
    radius: String(radiusMiles),
    page: String(pageNum),
  });
  return `${BASE_URL}/dealers/search?${params.toString()}`;
}

function makeScraper(overrides = {}) {
  return new SiteScraper({
    name: 'aacars',
    baseUrl: BASE_URL,
    buildSearchUrl,
    cardSelectors: [
      '[data-testid*="dealer"]',
      '[class*="dealer-card" i]',
      'article',
    ],
    linkSelector: 'a[href*="/dealers/"]',
    hasNextPage: () => false, // UNVERIFIED — no confirmed pagination signal
    ...overrides,
  });
}

module.exports = { buildSearchUrl, makeScraper, BASE_URL };
