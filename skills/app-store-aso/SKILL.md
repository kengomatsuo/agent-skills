---
name: "app-store-aso"
description: "Use when an app's App Store listing needs to be found: writing or rewriting the name, subtitle, keyword field, promo text, screenshots captions, custom product pages or release notes for one or many storefronts, before a release, when an app ranks for nothing, or when the store copy was written without research. Measures what people actually type and how crowded each query is per country, reads competitors' real listings, follows Apple's indexing rules and practitioners' tactics, then has every non-English line written blind. Trigger phrases: ASO, app store optimization, keywords, nobody finds the app, rank higher, subtitle, keyword field, store listing, custom product page, localise the listing."
---

# App Store optimization

> **Local notes.** If `~/.claude/skill-notes/app-store-aso.md` exists, read it before starting.

Store copy written without research ranks for nothing. A first pass on one app found
that it appeared only for words that existed nowhere but in its own keyword field, in
201 live searches across 41 storefronts: the listing held slogans and words nobody types.
Every claim below about Apple or about ranking is a starting hypothesis; fetch the
current source in the session before acting on it, and cite it.

## The order. No step is skipped

| # | Step | Output |
|---|---|---|
| 1 | **Apple's rules**, fetched live | `docs/aso/sources.md` |
| 2 | **Practitioner tactics** | `docs/aso/research.md` |
| 3 | **Measure** what people type and how crowded it is, per storefront | `docs/aso/data/` |
| 4 | **Competitors'** real listings | `docs/aso/research.md` |
| 5 | **Propose** per locale | `docs/aso/proposal.json`, `keywords.md` |
| 6 | **Write blind** every non-English visible line | per-locale drafts |
| 7 | **Screenshots and pages** | sets per device per locale, custom product pages |
| 8 | **Ship and read back**; re-measure at 48 hours and 3 to 4 weeks | read-back, `data/` reruns |

"Don't ask questions" never skips research. A name change, a rating prompt and custom
product pages are the owner's decisions: propose them with the evidence, then build.

## 1. Apple's rules (fetch each time)

- Search inputs: <https://developer.apple.com/app-store/search/> and App Store Connect's
  platform version information. Name, subtitle, keyword field and primary category, plus
  downloads and ratings. Promo text and description are not search inputs.
- Keyword field: 100 bytes (count UTF-8 bytes, not characters), commas, no spaces needed,
  no words already in the name or subtitle, no competitor trademarks, no category names.
  Guideline 2.3.7 for what metadata may claim.
- Which extra languages each country lists:
  <https://developer.apple.com/help/app-store-connect/reference/app-store-localizations>.
  English (U.K.) is listed in nearly every storefront, so en-GB is usually the most
  valuable locale an app owns. Whether listed locales are also *searched* is a vendor
  claim (AppTweak, MobileAction), not Apple's; say so.
- Custom product pages, product page optimization, in-app events, ratings
  (<https://developer.apple.com/app-store/ratings-and-reviews/>): read the current limits.

## 2. Practitioner tactics

Fetch current guides from Appfigures, AppTweak, Sensor Tower, MobileAction,
SplitMetrics, Phiture and indie developers who published results; Reddit if reachable.
Record where they disagree. Points they agreed on in 2026, to re-check:

- The name carries the most weight; words earlier in it rank better. Brand first, then a
  descriptor: "Brand - Descriptor". Hyphen and colon index the same; pick one house style.
- Name and subtitle words combine into phrases; keep them on one theme.
- Phrases form inside one locale's fields, so a term split across locales does not make
  a phrase.
- Screenshot caption text may be read for ranking (Appfigures, June 2025); treat it as a
  free reinforcement, never the only home of a keyword.
- Change keywords once, then wait: ranks move in 12 to 48 hours and settle over weeks.

## 3. Measure

`scripts/hints.py seeds.json hints.json`: Apple's type-ahead per storefront. It shows what
people type and in what order, not volume. Seed each country with short stems in its own
language and script, plus the English stems locals use.

`scripts/rank.py APP_ID queries.json ranks.json`: the live App Store search per country.
For each query: result count (crowding; Apple caps near 250), the app's rank, the top 15
with rating counts. A query returning few apps is open; one returning 250 led by apps with
tens of thousands of ratings is closed to a new app. Keep both files and rerun later.

Store ids are in `scripts/storefronts.py`; add one only after checking it live.

## 4. Competitors

Read the real name, subtitle, first screenshots and preview of the 10 to 20 apps a person
would see beside this one, in the major storefronts (apps.apple.com through fetch, or a
real browser for pages that render with JavaScript). Note which typed terms they hold in
their names: a typed term no leader holds in its name is an opportunity.

## 5. Propose

`docs/aso/proposal.json`, per locale: `name`, `subtitle` (meaning plus `mustContain` terms
for non-English), `keywords` (final list, at most 100 bytes), `promo`, `why` (the
measurement behind it), `storefronts` it serves. Rules:

- Only words people type. Drop words with no type-ahead and no results.
- Do not claim what the app is not (a pop-up blocker is not a general ad blocker).
- English variants that a country indexes together get complementary keyword sets, never
  copies.
- A must-contain term that does not fit the subtitle goes into that locale's keyword field,
  pushing out the lowest-value words (platform names first). Use the inflected form people
  type (Russian genitive "всплывающих окон", not the nominative).

## 6. Write blind

Every non-English visible line (subtitle, promo, captions, release notes) is composed by a
native writer subagent who sees only the meaning, the must-contain terms and that
language's existing store copy, never an English line. Use the `blind-translation` and
`human-prose` skills. Then a second native pass on any subtitle that reads as a keyword
list. Check every length with code: name and subtitle 30 characters, promo 170, keywords
100 bytes.

## 7. Screenshots and custom product pages

- Five frames per device, Mac matching iPhone. Caption 1 holds the search words in large
  type; frame 1 shows the product working. One frame in dark mode. One theme per frame.
- Render every locale, right to left where needed, with fonts for every script; validate
  sizes and look at a contact sheet of every locale.
- A preview video autoplays muted in search: open on the product working and put the
  search words on screen early (the `product-video` skill makes it).
- Custom product pages: one per clear search intent the research found, each with its own
  screenshots, promo and deep link, in every locale.
- A rating prompt (SwiftUI `requestReview`) after a real moment of value, never at launch
  or from a button, once per version.

## 8. Ship and read back

Upload to the editable version only, never the version on sale, and never submit for
review: that is the owner's call. Read every field back from App Store Connect (names and
subtitles live on the app-info record, keywords and promo on the version). Rerun
`rank.py` at 48 hours and at 3 to 4 weeks into new files and compare.
