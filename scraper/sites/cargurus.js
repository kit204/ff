'use strict';

const { SiteScraper } = require('../lib/common');

const BASE_URL = 'https://www.cargurus.co.uk';

// Confidence: LOW / UNVERIFIED. I do not have a confirmed URL pattern for a
// CarGurus UK dealer-locator search (CarGurus's primary UX is car listings
// with a dealer filter, not a dedicated "search dealers near postcode" page
// the way AutoTrader has). This is a best guess based on general knowledge
// of CarGurus's URL conventions and MUST be confirmed/corrected by opening
// https://www.cargurus.co.uk in a browser, finding the actual dealer search
// or "dealer reviews near me" flow, and updating buildSearchUrl + selectors
// to match before trusting any output from this module.
function buildSearchUrl(postcode, radiusMiles, pageNum) {
  const params = new URLSearchParams({
    zip: postcode,
    distance: String(radiusMiles),
    page: String(pageNum),
  });
  return `${BASE_URL}/Cars/dealerLocator.action?${params.toString()}`;
}

function makeScraper(overrides = {}) {
  return new SiteScraper({
    name: 'cargurus',
    baseUrl: BASE_URL,
    buildSearchUrl,
    cardSelectors: [
      '[data-testid*="dealer"]',
      '[class*="dealerCard" i]',
      'article',
    ],
    linkSelector: 'a[href*="/Dealers/"], a[href*="dealerReviews"]',
    hasNextPage: () => false, // UNVERIFIED — no confirmed pagination signal
    ...overrides,
  });
}

module.exports = { buildSearchUrl, makeScraper, BASE_URL };
