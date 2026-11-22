# Measuring a live app, and the levers beyond keywords

Facts checked 2026-11-07 against the URLs given. Re-fetch Apple's page before relying on a limit.

## Measure first

1. Sign in once: `asc web auth login --apple-id <owner's Apple ID>` (the owner types the password and code). The API key alone is refused for analytics and sales unless it carries the Sales role.
2. Daily metrics for the whole life of the app:
   `asc web analytics metrics --app APP_ID --start YYYY-MM-DD --end YYYY-MM-DD --measures units,redownloads,pageViewUnique,impressionsTotalUnique,proceeds,sales,conversionRate --output json`
3. Paying users and proceeds by territory for each period: `asc web analytics sales --app APP_ID --start .. --end ..` (`payingUsers`, `revenueByTerritory`).
4. Page views by source (search, browse, app referrer, web referrer): `asc web analytics sources --app APP_ID --start .. --end ..`. A spike from App Referrer is another app linking in (often a "paid app gone free" list), not search.
5. Split the timeline into periods at each price change and each listing change, then compare per day: impressions, page views, downloads, impression to page view, page view to download, proceeds.
6. Rerun `rank.py` on the baseline's `queries.json` into a new dated file and compare with `scripts/compare-ranks.py OLD NEW APP_ID`. Run one `rank.py` at a time; parallel runs get the IP a 403.

Price history is not in the API (the price schedule shows current and future prices only). A price period read from analytics is an inference: show proceeds per paying user per day, say it is inferred, and confirm the dates with the owner. Under about 30 sales a period, say the numbers cannot separate the price effect from noise.

## Country pricing

- One base price; Apple equalizes the other 174 storefronts and re-adjusts periodically. A manual storefront price stops Apple's adjustment there. Temporary price changes last up to a year and revert by themselves. <https://developer.apple.com/help/app-store-connect/manage-app-pricing/set-a-price/>, <https://developer.apple.com/help/app-store-connect/manage-app-pricing/schedule-price-changes-for-apps>
- Equalized prices in low-income storefronts run two to four times a purchasing-power price (World Bank PPP factor against the local App Store price). The published results for lowering them are subscription apps (RevenueCat); no paid-upfront data was found.
- Decide from where page views come from: lower a storefront's price only where the app gets page views and does not convert, and record the date to measure against.

## Product page, events, featuring

- Custom product pages: up to 70; since October 2025 each can take its own keywords and replace the default page in search for them. <https://developer.apple.com/news/?id=gf6mgrs6>
- Product page optimization: up to 3 treatments of icon, screenshots or preview, up to 90 days; the tool says whether traffic suffices. <https://developer.apple.com/app-store/product-page-optimization/>
- In-app events: up to 10 live, 31 days each, promotable 14 days ahead; a major update counts, a price promotion does not. Event cards show in search to people who have the app. <https://developer.apple.com/app-store/in-app-events/>
- Featuring: nominate in App Store Connect at least 2 weeks ahead (up to 3 months for wider consideration); editors read design, localization, accessibility and the product page, ratings included. <https://developer.apple.com/app-store/getting-featured/>

## Ratings and codes

- The system review prompt shows at most 3 times in 365 days; ask after a completed task. The summary rating can be reset per storefront with a release; with few ratings, do not. <https://developer.apple.com/app-store/ratings-and-reviews/>
- Promo codes: 100 per version for a paid app's download, valid 4 weeks; people who redeem one cannot rate or review. Offer codes cover in-app purchases only. <https://developer.apple.com/help/app-store-connect/offer-promo-codes/request-and-manage-promo-codes/>
- A paid app with no ratings converts poorly whatever the keywords do. Ratings come before ads and before keyword work.
