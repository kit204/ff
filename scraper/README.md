# Multi-Site Car Dealer Scraper (LS1, 15 miles)

Scrapes dealer-search pages on AutoTrader, CarGurus UK, AA Cars, and
Motors.co.uk, filters to dealers with 20+ cars on the forecourt, excludes
named franchise groups, and writes CSVs.

## ⚠️ Known limitation: not run against live data yet

This container's outbound network is forced through a proxy that returns a
policy-level `403`/tunnel-failure on the CONNECT to all four target sites
(confirmed via `curl`, `WebFetch`, and the proxy's own status log — see
`/root/.ccr/README.md`). That block applies to **every** tool in this
environment, including a Playwright-driven browser, since they all share the
same egress path. As a result:

- **No CSV of real dealer data has been produced from any of the four
  sites.** `node scrape_all.js` runs cleanly end-to-end (retries, falls back
  to Playwright, gives up gracefully per site, writes empty CSVs) — it just
  can't reach any of the sites from here.
- The parsing/filtering/CSV pipeline **is verified** — see
  `test/test_parsing.js`, which runs the same code (`lib/common.js`) against
  a local mock HTML fixture and passes.
- Search-URL patterns and CSS selectors have **different confidence levels
  per site** — check the top-of-file comment in each `sites/*.js` before
  trusting output:
  - `sites/autotrader.js` — **medium confidence**. URL shape matches what
    the task specified; params/selectors are a reasonable guess.
  - `sites/cargurus.js`, `sites/aacars.js`, `sites/motors.js` — **low
    confidence / unverified**. I don't have a confirmed URL pattern for a
    postcode+radius dealer-directory search on any of these three sites
    (CarGurus/AA Cars are primarily car-listing search, not dealer
    directories, and I have no confirmed knowledge of a Motors.co.uk
    equivalent to AutoTrader's `/car-dealers/search`). These are
    placeholders you must confirm/fix against the live site before relying
    on them.

## How to actually collect data

Run this from an environment with normal internet access (not this
sandbox):

```bash
cd scraper
npm install
node scrape_all.js                              # all 4 sites
node scrape_all.js --sites autotrader,motors     # just some
```

For each site that returns 0 dealers:
1. Open the site in a real browser and find its actual dealer-search-by-location
   URL/query params (or dealer directory, if listings-only).
2. Update `buildSearchUrl()` in the corresponding `sites/<name>.js`.
3. Inspect a dealer card's markup and update `cardSelectors` /
   `linkSelector` in that same file.
4. Re-run.

## What it does

1. For each site, requests search-results pages, paging until no new dealers
   are found (`maxPages` safety cap: 50 per site).
2. Tries a plain `fetch()` first; if a page is blocked (403/429) or looks
   bot-gated, switches to a headless Playwright browser for the rest of that
   site's run.
3. Extracts, per dealer card: name, town, postcode, phone, and
   cars-on-forecourt count, using CSS selectors with a regex-over-text
   fallback so minor markup changes don't break extraction outright.
4. Rate-limits: 2.5-5s randomised delay between requests per site,
   exponential backoff retry (up to 4 attempts) on 403/429/5xx.
5. Filters to `carsOnForecourt >= 20` and drops any dealer whose name
   matches (case-insensitive substring) one of: JCT600, Vertu, Evans
   Halshaw, Stoneacre, D.M. Keith, Cars2, RRG, Arnold Clark, Big Motoring
   World.
6. Writes, per site, `output/<site>_ls1_15mi.csv` and `output/raw_<site>.json`
   (unfiltered, for auditing what got excluded and why), plus a combined
   `output/all_sites_ls1_15mi.csv` with a `source` column.

## Files

- `lib/common.js` — shared fetch/retry/Playwright-fallback engine, generic
  dealer-card parsing (name/town/postcode/phone/car-count regex heuristics),
  filtering, CSV writer. Used by every site module.
- `sites/autotrader.js`, `sites/cargurus.js`, `sites/aacars.js`,
  `sites/motors.js` — per-site URL builder + CSS selectors.
- `scrape_all.js` — orchestrator; run this for multi-site scraping.
- `scrape_autotrader_dealers.js` — AutoTrader-only convenience entry point
  (equivalent to `scrape_all.js --sites autotrader`).
- `test/mock_search_page.html` + `test/test_parsing.js` — offline test of the
  parsing/filtering/CSV pipeline against a fixture, no network required. Run
  with `node test/test_parsing.js`.
- `output/` — generated CSVs + raw JSON land here (gitignored).

## Configuration

Edit the `CONFIG` object at the top of `scrape_all.js` (or
`scrape_autotrader_dealers.js`) to change postcode, radius, minimum car
count, or the excluded-group list.
