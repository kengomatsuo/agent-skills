# ASO audit

Read this when asked for a health check of a live listing or why an app does not rank. It scores the listing, then hands each weak area to the part of the skill that fixes it. The audit changes nothing; fixes go through the normal order in `SKILL.md`.

## Contents
- Inputs
- Scoring
- Factors and weights
- Report
- Hand-offs
- Sources

## Inputs

Ask for the app id, the storefront (default US) and the platform. Pull the live listing yourself (name, subtitle, screenshots, ratings, description) and run `rank.py` for the app's current ranks and the competitors' listings. A listing the owner pastes is a fallback. Apple-only checks below are marked iOS.

## Scoring

Score each factor 0 to 10, multiply by its weight, and sum to a score out of 100. Bands for a factor: 9 to 10 nothing to gain, 7 to 8 room to improve, 4 to 6 a clear gap, 0 to 3 missing or wrong. Say what evidence gave each score.

## Factors and weights

| Factor | Weight | Look for |
|---|---|---|
| Name | 20 | Main keyword present, close to the 30 characters, brand not wasting space, reads naturally, differs from competitors |
| Subtitle (iOS) | 15 | Second-tier keywords not in the name, no repeats, states a benefit, close to 30 characters |
| Keyword field (iOS) | 15 | No repeats of name or subtitle, no spaces after commas, near 100 bytes, every word relevant, no brand, category or "app" words |
| Description | 5 iOS, 15 Android | Hook in the first lines, benefits over features, readable layout, a call to action. On iOS it is not a search input |
| Screenshots | 15 | All slots used, strongest three first, readable benefit captions, one design language, localised, current device frames |
| Preview video | 5 | Exists, hook in the first seconds, works muted |
| Ratings and reviews | 15 | Average, count for the category, 30-day trend, developer replies, a prompt at a good moment |
| Icon | 5 | Distinct in a results list, clear when small, fits the category, no text |
| Keyword ranks | 10 | Top-10 positions for target terms, coverage, trend, gaps against competitors |
| Conversion signals | 5 | Promo text in use, useful release notes, in-app events, custom product pages |

The source's checks that conflict with the main skill lose to it: the keyword field is counted in UTF-8 bytes, not characters, and "singular forms only" is a vendor claim to re-check against Apple's current rules before it is scored. Ranks come from `rank.py` per storefront, not from a single country.

## Report

- The score card: overall score and the ten factor scores.
- Quick wins: three to five changes doable today.
- This week: three to five changes with more work.
- This month: three to five strategic changes.
- A comparison table against the top three competitors on the same factors.

Name changes, rating prompts and custom product pages are the owner's decisions: list them as proposals with the evidence.

## Hand-offs

| Weak factor | Go to |
|---|---|
| Name, subtitle, keyword field, ranks | `SKILL.md` steps 3 to 6 |
| Screenshots, captions, custom product pages | `references/screenshots.md` |
| Paid reach for a keyword that will not rank organically | `references/apple-search-ads.md` |
| Non-English copy that reads translated | `blind-translation` |

## Sources

Rewritten in own words from the third-party `aso-audit` skill (no author, repo or licence in the file; copied 2026-09-10). Its factor list and weights are kept as one scoring proposal, not as Apple fact. It named an Appeeky API for data; that is dropped and replaced by the scripts here. The weights and the bands are unverified conventions.
