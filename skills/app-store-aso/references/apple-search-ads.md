# Apple Search Ads

Read this when planning, auditing or tuning paid placement in the App Store. Everything here that costs money or changes a live campaign is shown to the owner first, as a table of the change, the budget and the reason, and applied only after a yes. Never paste an API key or token into chat; the owner sets those in the tool.

## Contents
- What sets the channel apart
- Placements
- Account structure
- Match types and the weekly loop
- Keywords and negatives
- Bids
- Custom product page routing
- Metrics
- Weekly and scaling checklists
- Audit output
- Sources and unsourced figures

## What sets the channel apart

- The person is already searching the store, so intent is the highest of any paid channel.
- The ad looks like an organic result, marked only by an "Ad" badge.
- Targeting is by keyword. There is no demographic or interest audience.
- Install and tap data come from Apple directly (Apple registered with AdAttributionKit in April 2025).
- Two products (<https://ads.apple.com/app-store/help/apple-ads-basic/0001-compare-apple-ads-solutions>, checked 2026-11-07): **Basic** charges per install at a maximum you set, up to $10,000 a month per app, search results only; **Advanced** charges per tap, all placements, keywords and bidding. No minimum spend is stated. A paid app may advertise.
- New accounts get a one-time $100 credit once an app is on sale (<https://ads.apple.com/app-store/help/billing/0032-apple-ads-promo-credit>).
- "Installs" include redownloads within 30 days of a tap. A paid app earns nothing from a redownload and still pays for it.
- Break-even before VAT: CPI = proceeds per sale; CPT = proceeds x tap-to-install rate. Use the app's own product-page conversion as the floor for that rate; published medians (AppTweak 2025: US Utilities CPT $1.23, conversion 63%) come mostly from free apps.
- A paid app converting a few percent of page views cannot pay benchmark CPTs: fix the page and the ratings first. Apple does not say ad installs lift organic rank.

## Placements

| Placement | Where it shows | Use |
|---|---|---|
| Search results | At the top of search results (Apple announced more slots further down in 2026) | Capturing a typed intent; start here, it is the most measurable and controllable |
| Search tab | Top of the Search tab before anything is typed | Reach and brand |
| Today tab | App Store home | Brand moments, high visibility |
| Product pages | The bottom of other apps' product pages; no choice of which pages | Reach |

## Account structure

One set per app, one campaign per intent so budgets, bids and data stay apart:

- Brand: the app name, common misspellings, the developer name.
- Competitor: the five to ten apps people compare this one to.
- Category: generic terms and long-tail phrases.
- Discovery: Search Match on, no keywords.
- Search tab: optional, no keywords.

Separate campaigns stop generic spend eating the brand budget, give each intent its own bid, and let one segment pause without touching the rest.

## Match types and the weekly loop

| Type | Behaviour | Use |
|---|---|---|
| Exact | Only the keyword itself | Proven, valuable terms |
| Broad | Variations and related terms | Finding new terms |
| Search Match | Apple matches the app to searches on its own | The discovery campaign only |

The loop: run Search Match and broad in discovery, read the search terms report each week, move terms that convert into an exact-match campaign at a higher bid, and add the useless ones as negatives.

## Keywords and negatives

Seed the campaigns from the research in the main skill (what people type per storefront, per `hints.py` and `rank.py`), not from a guess. Competitor terms convert worse than brand terms, so bid lower and watch the install rate.

Negatives prevent waste:
- competitor names the campaign should not win,
- irrelevant terms Search Match surfaced,
- terms with many impressions and no taps.

## Bids

The source gave this rule: target CPT = target CPI x historical tap-to-install rate.

| Signal | Action |
|---|---|
| Impression share under 50% | Raise the bid |
| High tap rate, low install rate | Fix the product page or paywall, not the bid |
| Low tap rate | Creative does not match the keyword's intent |
| High install rate, spend not growing | Raise bid or budget cap |
| CPT rising, install rate flat | Lower the bid or pause the keyword |

Automated bidding toward a target CPA or ROAS is for later: only after manual bidding set a CPT baseline and the ad group gets a budget that allows at least five conversions a day for two weeks (<https://ads.apple.com/app-store/best-practices/maximize-conversions>).

## Custom product page routing

Link a custom product page to an ad group so the screenshots match the search: a "yoga app" ad group shows yoga frames, a "sleep sounds" group shows sleep frames, a competitor group shows a comparison page. The source claims tap and install rates both rise by 15 to 30 percent; treat that as unmeasured until the app's own numbers show it.

Path: App Store Connect, Custom Product Pages, create the page; then in the ads console choose it on the ad group. Build the pages with `references/screenshots.md`.

## Metrics

| Metric | Formula | Source's rule of thumb |
|---|---|---|
| TTR | taps / impressions | over 5% strong, under 3% look at the creative |
| CVR | installs / taps | over 50% good, under 30% look at the product page |
| CPT | spend / taps | depends on category |
| CPI | spend / installs | compare with lifetime value |
| ROAS | revenue / spend | over 100% pays back; aim for 150% |

## Weekly and scaling checklists

Weekly:
```
- [ ] Search terms report read; converting terms moved to exact
- [ ] New negatives added
- [ ] Impression share checked per keyword
- [ ] Keywords with 100+ taps and no installs paused
- [ ] Ad groups under 3% TTR given a new custom product page
- [ ] No campaign hits its daily cap early in the day
- [ ] CVR compared across brand, competitor and category
```

Before raising budget:
```
- [ ] CVR over 30% on the main campaigns
- [ ] CPI under 3 times the target
- [ ] Bidding manual and stable
- [ ] Negative list kept up
- [ ] Two or more custom product pages tested
```

Every budget or bid change goes to the owner first, listed as old value, new value and the number that justifies it.

## Audit output

Report per app: which of the five campaigns exist; impressions, taps with TTR, installs with CVR, CPI and spend for the period; the top issues with a fix each; the priority actions with the expected effect and its reason.

## Sources and unsourced figures

Rewritten in own words from the third-party `apple-search-ads` skill (no author, repo or licence in the files; copied 2026-09-10). Every number above (starting bids of a few dollars, the thresholds, the 15 to 30 percent, the 50 conversions) came from that skill with no citation. On 2026-11-07 Apple's Ads pages were fetched: placements, campaign split, match types, ad variations and bid moves are confirmed; the product-page conquesting row and the 50-conversions rule were wrong and are corrected above; the CTR and conversion thresholds, the impression-share rule and the 15 to 30 percent uplift remain unsourced. Fetch it before relying on a threshold or on a placement name, since Apple renames and changes these. The source's starting-bid table is dropped because a bid depends on storefront and category, and `rank.py` crowding data is a better guide.
