# Sources for youtube-visibility

Every rule in SKILL.md, with the primary page it came from and the date it was fetched.
Re-fetch a page before relying on a limit; YouTube changes eligibility often.

## Contents

- Search and metadata
- Recommendations and signals
- Shorts
- Thumbnails and testing
- Links between videos
- Channel setup and gates
- Languages
- Audience
- API coverage
- Third-party skills checked

## Search and metadata

| Rule | Source | Fetched |
|---|---|---|
| Search ranks on relevance, engagement and quality; relevance is how well title, tags, description and content match the query | https://support.google.com/youtube/answer/16090438 | 2026-11-08 |
| Tags play a minimal role in discovery; titles, thumbnails and descriptions matter more | https://support.google.com/youtube/answer/146402 | 2026-11-08 |
| Chapters: description timestamps, first at 00:00, at least three, each at least 10 s | https://support.google.com/youtube/answer/9884579 | 2026-11-08 |
| Hashtags: title or description, up to three shown above the title, over 60 all ignored | https://support.google.com/youtube/answer/6390658 | 2026-11-08 |
| Titles: accurate, succinct, important words first, branding and episode numbers last, limit caps and emoji; searchable vs intriguing by where the video is found | https://support.google.com/youtube/answer/12340300 | 2026-11-08 |
| Type-ahead endpoint `suggestqueries.google.com/complete/search?ds=yt` | Unofficial, undocumented by YouTube; shows typed phrases, never volume. Tested live 2026-11-08 | 2026-11-08 |
| App Store campaign links (`pt`, `ct`) | https://developer.apple.com/help/app-store-connect/view-app-analytics/manage-campaigns/ | 2026-11-08 |

## Recommendations and signals

| Rule | Source | Fetched |
|---|---|---|
| Signals: clicks, watch time, survey responses ("valued watchtime" = 4 to 5 stars, predicted for non-responders), shares, likes, dislikes; weights personalized | https://blog.youtube/inside-youtube/on-youtubes-recommendation-system/ (Cristos Goodrow, 2021-09-15) | 2026-11-08 |
| Signals: watch, search history, subscriptions, likes, dislikes, "Not interested", "Don't recommend channel", satisfaction surveys; Home is personal, Up next keys on the current video, Shorts feed personalized | https://support.google.com/youtube/answer/16089387 | 2026-11-08 |
| Home mixes personalized picks, subscriptions and news; Up next uses the current video and history; channel reputation and quality considered | https://www.youtube.com/howyoutubeworks/product-features/recommendations/ | 2026-11-08 |
| Ranking uses average view duration and average percentage viewed; whether recommended viewers watch, ignore or press "Not interested"; likes and post-watch surveys; impressions drop when others' videos do better | https://support.google.com/youtube/answer/11914225 | 2026-11-08 |
| Relative watch time matters more for short videos, absolute for long; growth not correlated with time between uploads; do not change what works; unlisted-then-public does not matter | https://support.google.com/youtube/answer/141805 | 2026-11-08 |
| One weak video does not penalize the channel; new formats do not confuse the algorithm; a new channel needs a critical mass of content; no ideal length; changing title or thumbnail shifts performance | https://support.google.com/youtube/answer/16559651 | 2026-11-08 |
| Half of channels and videos have impressions CTR of 2% to 10%; lower on Home; under 100 views swings wider; do not check CTR right after upload; clickbait gives high CTR and low view duration | https://support.google.com/youtube/answer/7628154 | 2026-11-08 |

## Shorts

| Rule | Source | Fetched |
|---|---|---|
| A Short is square or vertical and up to three minutes | https://support.google.com/youtube/answer/15424877 | 2026-11-08 |
| Shorts signals: chose to view vs swiped, % who chose to view, average view duration, % viewed, likes, surveys; no minimum posting cadence; Shorts "can't hurt your Video performance" | https://support.google.com/youtube/answer/11914225?co=YOUTUBE._YTVideoType%3Dshorts | 2026-11-08 |
| Separate recommendation systems per format; no evidence Shorts hurt long-form | https://blog.youtube/creator-and-artist-stories/debunking-common-myths-about-youtube-shorts/ (YouTube Team, 2025-05-06) | 2026-11-08 |

## Thumbnails and testing

| Rule | Source | Fetched |
|---|---|---|
| Custom thumbnails need a verified account; 16:9 videos, 9:16 Shorts, at least 640 px wide | https://support.google.com/youtube/answer/72431 | 2026-11-08 |
| Thumbnails: as large as possible for phones, rule of thirds, readable font, uncluttered; make candidates during the shoot | https://support.google.com/youtube/answer/12340300 | 2026-11-08 |
| A/B test: up to 3 titles and/or thumbnails, desktop Studio, advanced features, no Shorts / scheduled lives / Premieres / made for kids / private; winner by watch time; up to 2 weeks; inconclusive keeps the first; editing stops the test | https://support.google.com/youtube/answer/16391400 | 2026-11-08 |

## Links between videos

| Rule | Source | Fetched |
|---|---|---|
| Related video on a Short: Studio > Content > Short > Related video; advanced features; target public or unlisted, own channel; shown as a clickable link under the handle | https://support.google.com/youtube/answer/14075157 | 2026-11-08 |
| Match the Short's intent; spoken and visual pointer in the last 5 s; the long video delivers the promise in its first 5 to 10 s, no intro graphics | https://blog.youtube/creator-and-artist-stories/youtube-related-videos-traffic-guide/ (Julia Lee Harter, 2026-07-14) | 2026-11-08 |
| Clickable: long-form descriptions and comments (advanced features), Related video link in Shorts, end screens. Not clickable: URLs in Shorts descriptions and comments | https://support.google.com/youtube/answer/13748639 | 2026-11-08 |
| End screens: video at least 25 s, last 5 to 20 s, up to 4 elements on 16:9; not on made for kids; external links need YPP | https://support.google.com/youtube/answer/6388789 | 2026-11-08 |
| Cards: up to 5; computer viewers only; not on made for kids; link cards need YPP | https://support.google.com/youtube/answer/6140493 | 2026-11-08 |
| Pinned comments: advanced features (up to 24 h to appear), top of watch page on desktop, one pin replaces another | https://support.google.com/youtube/answer/6000964 | 2026-11-08 |
| Series playlist: verified account, own videos, one series per video; videos may be presented and recommended together | https://support.google.com/youtube/answer/6084043 | 2026-11-08 |

## Channel setup and gates

| Rule | Source | Fetched |
|---|---|---|
| Advanced features list (A/B testing, Related video on Shorts, pinning comments, clickable description links, chapters, multi-language); phone verification gives intermediate only; ID or video verification unlocks advanced at once | https://support.google.com/youtube/answer/9890437 | 2026-11-08 |
| Channel trailer (non-subscribers, not shown again once watched), Spotlight (returning subscribers), up to 12 sections | https://support.google.com/youtube/answer/3219384 | 2026-11-08 |
| Upload defaults apply only to youtube.com/upload in a browser; mobile and editor uploads ignore them | https://support.google.com/youtube/answer/2660027 | 2026-11-08 |

## Languages

| Rule | Source | Fetched |
|---|---|---|
| One channel / separate per language / global plus local: pros and cons; specify each channel's language or country; cross-promote | https://support.google.com/youtube/answer/6070467 | 2026-11-08 |
| Translated titles and descriptions show in search for speakers of that language and are shown "in the right language, to the right viewers" | https://support.google.com/youtube/answer/4792576 | 2026-11-08 |
| Steps to add translated title and description; a video needs its language set first | https://support.google.com/youtube/answer/6289575 | 2026-11-08 |
| A viewer's preferred languages pick titles, descriptions and audio; the setting does not change search results or recommendations | https://support.google.com/youtube/answer/13339776 | 2026-11-08 |
| Multi-language audio needs advanced features and keeps the same picture | https://support.google.com/youtube/answer/13338784 | 2026-11-08 |

## Audience

| Rule | Source | Fetched |
|---|---|---|
| What counts as made for kids; family-friendly is not made for kids | https://support.google.com/youtube/answer/9528076 | 2026-11-08 |
| Made for kids turns off end screens, cards, comments, notification bell, save to playlist, personalized ads and more; channel default in Settings > Channel > Advanced; per-video overrides | https://support.google.com/youtube/answer/9527654 | 2026-11-08 |

## API coverage

| Rule | Source | Fetched |
|---|---|---|
| Methods: videos insert/update, thumbnails.set, captions insert, playlists and playlistItems insert, channels.update (brandingSettings, invideoPromotion only), channelSections, commentThreads.insert; no method for pinning, end screens, cards or the Shorts related video | https://developers.google.com/youtube/v3/docs | 2026-11-08 |

## Third-party skills checked

Searched 2026-11-08: the claude.ai skills directory (no results), skills.sh
(`/api/search?q=youtube`, `q=youtube seo`), GitHub code search for `SKILL.md` with
"youtube seo", "youtube algorithm", "youtube growth", "youtube shorts", "youtube thumbnail",
and anthropics/skills (no YouTube skill). None is installed or copied.

| Skill | Finding |
|---|---|
| kostja94/marketing-skills `youtube-seo` (skills.sh 3.7k installs) | Unsourced statistics ("156% longer view durations", "90% of best-performing videos use custom thumbnails"); no YouTube page cited |
| AgriciDaniel/claude-youtube | Large suite; its algorithm guide cites Focus Digital, Retention Rabbit and vidIQ benchmarks, no YouTube page |
| deeployCO/youtube-seo-skills | Retention thresholds ("Bad: under 35%, algorithm suppresses distribution") with no source |
| alirezarezvani/claude-skills `video-content-strategist`, coreyhaines31/marketingskills `social` | General content strategy; no YouTube source for platform claims |
| TheCraigHewitt/skills `youtube/channel-strategy`, komunite/kalfa `youtube-seo`, adityaarsharma/youtube-marketing-skills, nicepkg/ai-workflow `youtube-seo-optimizer` | No URLs at all |
| akillness/jeo-skills `youtube-growth-playbook-2026` | The only one that grades claims as official or unverified and lists YouTube Help URLs; its URL list was used as a reading list, every page re-fetched here |

## Competitor sample (2026-11-08)

`youtube-compete.ts` on "safari keeps opening new tabs", "stop safari redirects iphone", "block pop ups safari iphone" (en) and "cara menghilangkan iklan di safari iphone", "cara blokir iklan safari" (id): 48 videos. Median tags 11 on 10k+ view videos, 7 below; 5 of 25 10k+ videos had no tags; median hashtags 3 in both groups. Top Shorts run 10 to 35 s and title the task ("Block Pop Ups on Safari iPhone", "How to block ads on your iPhone"). Shared tags on 20k+ videos: iphone, apple, iphone tips, safari, iphone safari settings, iphone tips and tricks, block ads on iphone, block pop ups safari iphone.
