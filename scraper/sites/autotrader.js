'use strict';

const { SiteScraper } = require('../lib/common');

const BASE_URL = 'https://www.autotrader.co.uk';

// Confidence: MEDIUM. Matches the URL pattern the task specified
// (autotrader.co.uk/car-dealers/search); page/postcode/radius param names
// are a reasonable guess but not confirmed against the live site from here.
function buildSearchUrl(postcode, radiusMiles, pageNum) {
  const params = new URLSearchParams({
    postcode,
    radius: String(radiusMiles),
    page: String(pageNum),
  });
  return `${BASE_URL}/car-dealers/search?${params.toString()}`;
}

function makeScraper(overrides = {}) {
  return new SiteScraper({
    name: 'autotrader',
    baseUrl: BASE_URL,
    buildSearchUrl,
    // Best-guess container for a single dealer result card.
    cardSelectors: [
      '[data-testid*="dealer"]',
      'article',
      'li.search-page__result',
    ],
    linkSelector: 'a[href*="/car-dealers/details"], a[href*="/dealers/"]',
    hasNextPage: (html) => /rel=["']next["']|next-page|"hasNextPage":true/i.test(html),
    ...overrides,
  });
}

module.exports = { buildSearchUrl, makeScraper, BASE_URL };
