# AutoTrader Dealer Scraper (LS1, 15 miles)

Scrapes `autotrader.co.uk/car-dealers/search`, filters to dealers with 20+
cars on the forecourt, excludes named franchise groups, and writes a CSV.

## ⚠️ Known limitation: not run against live data yet

This container's outbound network is forced through a proxy that returns a
policy-level `403` on the CONNECT to `www.autotrader.co.uk` (confirmed via
`curl`, `WebFetch`, and the proxy's own status log — see
`/root/.ccr/README.md`). That block applies to **every** tool in this
environment, including a Playwright-driven browser, since they all share the
same egress path. As a result:

- The scraper **has not been run against the real AutoTrader site**, and no
  CSV of real dealer data has been produced.
- The parsing logic (name/town/postcode/phone/car-count extraction,
  franchise-group exclusion, 20+ car filter, CSV writer) **is verified** —
  see `test/test_parsing.js`, which runs the same code against a local mock
  HTML fixture and passes.
- The CSS selectors in `SELECTORS` (top of `scrape_autotrader_dealers.js`)
  are best-effort guesses, not confirmed against the live DOM. Re-check them
  before trusting output from a real run.

To actually collect data, run this from an environment with normal internet
access (not this sandbox), then re-check `SELECTORS` against what you see:

```bash
cd scraper
npm install
node scrape_autotrader_dealers.js
```

If `node scrape_autotrader_dealers.js` produces zero dealers, open
`https://www.autotrader.co.uk/car-dealers/search?postcode=LS1&radius=15` in a
real browser, inspect a dealer card's markup, and update `SELECTORS.dealerCard`
/ `SELECTORS.dealerLink` in `scrape_autotrader_dealers.js` to match.

## What it does

1. Requests each results page for postcode `LS1`, radius `15` miles, paging
   until no new dealers are found (`maxPages` safety cap: 50).
2. Tries a plain `fetch()` first; if a page is blocked (403/429) or looks
   bot-gated, switches to a headless Playwright browser for the rest of the
   run.
3. Extracts, per dealer card: name, town, postcode, phone, and cars-on-forecourt
   count, using CSS selectors with a regex-over-text fallback so minor markup
   changes don't break extraction outright.
4. Rate-limits: 2.5-5s randomised delay between requests, exponential backoff
   retry (up to 4 attempts) on 403/429/5xx.
5. Filters to `carsOnForecourt >= 20` and drops any dealer whose name matches
   (case-insensitive substring) one of: JCT600, Vertu, Evans Halshaw,
   Stoneacre, D.M. Keith, Cars2, RRG, Arnold Clark, Big Motoring World.
6. Writes `output/ls1_15mi_independent_dealers.csv` with columns
   `dealer_name,town,postcode,phone,cars_on_forecourt`, plus a
   `output/raw_dealers.json` dump of every dealer seen before filtering (for
   auditing what got excluded and why).

## Files

- `scrape_autotrader_dealers.js` — the scraper.
- `test/mock_search_page.html` + `test/test_parsing.js` — offline test of the
  parsing/filtering/CSV pipeline against a fixture, no network required. Run
  with `node test/test_parsing.js`.
- `output/` — generated CSV + raw JSON land here (gitignored).

## Configuration

Edit the `CONFIG` object at the top of `scrape_autotrader_dealers.js` to
change postcode, radius, minimum car count, or the excluded-group list.
