'use strict';

const { SiteScraper } = require('../lib/common');

const BASE_URL = 'https://www.motors.co.uk';

// Confidence: LOW / UNVERIFIED. Motors.co.uk has a dealer directory but I
// don't have a confirmed URL pattern for postcode+radius dealer search from
// here. Best guess only — MUST be confirmed against the live site before
// trusting output.
function buildSearchUrl(postcode, radiusMiles, pageNum) {
  const params = new URLSearchParams({
    postcode,
    distance: String(radiusMiles),
    page: String(pageNum),
  });
  return `${BASE_URL}/dealers/search?${params.toString()}`;
}

function makeScraper(overrides = {}) {
  return new SiteScraper({
    name: 'motors',
    baseUrl: BASE_URL,
    buildSearchUrl,
    cardSelectors: [
      '[data-testid*="dealer"]',
      '[class*="dealer-card" i]',
      'article',
    ],
    linkSelector: 'a[href*="/dealers/"]',
    hasNextPage: (html) => /rel=["']next["']|next-page/i.test(html),
    ...overrides,
  });
}

module.exports = { buildSearchUrl, makeScraper, BASE_URL };
