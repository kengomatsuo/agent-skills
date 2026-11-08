---
name: "youtube-visibility"
description: "Use before uploading, titling, describing or promoting any YouTube video or Short. Plans search words, title, thumbnail, chapters, captions, language and Short-to-video links from YouTube's own help pages, and audits live videos."
---

# YouTube visibility

> **Local notes.** If `~/.claude/skill-notes/youtube-visibility.md` exists, read it before starting.

Every rule below comes from YouTube's own pages (YouTube Help, the Official Blog, How
YouTube Works), each listed with its URL and fetch date in
[references/sources.md](references/sources.md). SEO blogs, vidIQ/TubeBuddy posts and
third-party skills state benchmarks nobody can check; do not import them. When a decision rests on a
rule, re-fetch its page: YouTube changes features and eligibility often.

## The order. No step is skipped

Copy this checklist into the plan file and tick items off:

```
- [ ] 1. Plan file written, naming youtube-visibility        -> <repo>/docs/youtube/<video>-<lang>.plan.md
- [ ] 2. Channel gates and channel setup checked             -> plan: "Channel"
- [ ] 3. Search words measured per language                  -> plan: "Search words"
- [ ] 4. Title, description, chapters, hashtags, tags        -> plan: "Metadata"
- [ ] 5. Thumbnail                                            -> plan: "Thumbnail"
- [ ] 6. Language: original language, captions, localizations -> plan: "Language"
- [ ] 7. Links between formats: Short link, end screen, playlist, pinned comment -> plan: "Links"
- [ ] 8. Audience (made for kids) and every upload field set explicitly
- [ ] 9. Uploaded, read back, measured at 48 hours and 28 days
```

## 1. Plan before upload

Load this skill and fill the checklist in a plan file **before** any upload. The plan names
`youtube-visibility`, the video file, its format (16:9 long-form, or a Short: square or
vertical, up to 3 minutes), its language, and the answer to every step below. An upload
script should refuse to run without it; the house `youtube.ts upload` requires
`--plan <file>` whose text contains `youtube-visibility`.

## 2. Channel gates and setup (once per channel, re-checked each upload)

- **Advanced features** gate most of what follows: the Related video link on Shorts,
  pinned comments, clickable links in long-form descriptions, chapters, A/B tests of title
  and thumbnail, multi-language audio. Check Studio > Settings > Channel > Feature
  eligibility. Phone verification gives intermediate features only; ID or video
  verification gives advanced features at once, otherwise channel history does over time.
- **Custom thumbnails** need a verified account.
- **Channel description and keywords** describe what the channel now publishes, in the
  words people search. Old personal text and keywords go.
- **Home tab**: a Channel trailer section (shown to non-subscribers until they watch it
  once) and a Spotlight section (returning subscribers); up to 12 sections; a section per
  product or playlist.
- **Audience default**: Settings > Channel > Advanced settings > Audience. An app promo is
  not made for kids. A per-video setting overrides the channel's.
- **Upload defaults** (Settings > Upload defaults) apply only to uploads through
  youtube.com/upload in a browser. API and mobile uploads ignore them, so an API upload
  sets every field itself (title, description, tags, category, language, audio language,
  privacy, made for kids, thumbnail).

## 3. Search words

Search ranks on relevance (title, tags, description and the video content against the
query), engagement and quality. Measure what people type before writing a word:

- YouTube's type-ahead per language and country (unofficial endpoint, shows what is
  typed, never volume): `curl -s "https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=LANG&gl=CC&q=STEM"`.
  Seed short stems in that language's own words for the problem (the symptom the viewer
  sees, not the product's vocabulary), then the English stems locals type.
- Sample the leaders by data, never by eye: `bun ~/Repositories/claude-house-rules/scripts/youtube-compete.ts out.json <lang> <short|any> "phrase" ...`
  lists the top 10 per phrase with views, length, tags, hashtags and the tags shared by
  the 20k+ view videos. Copy the leaders' title phrasing (task words such as "block pop
  ups safari iphone") and their shared tags; the video must answer the phrase better
  than they do.
- Keep two or three phrases per video. A phrase the video does not answer is dropped:
  a title that misleads loses viewers and then recommendations.

## 4. Metadata

- **Title**: accurate, short, the searched words first; branding and episode numbers at
  the end; few capitals and emoji. Choose searchable (says what it is) or intriguing
  (makes people curious) by where it will be found: search wants searchable; Shorts feed
  and Home can take intriguing. Long-form and its Short get different titles aimed at
  different phrases.
- **Description**: the first line restates the searched problem in plain words. Then
  chapters, then links, then hashtags.
- **Chapters** (long-form): timestamps in the description, first at 00:00, at least three,
  each at least 10 seconds. Name each chapter with words a viewer would search.
- **Hashtags**: in the title or description; up to three show above the title; over 60
  and all are ignored.
- **Tags** play a minimal role per YouTube, and in a sample of 48 top results tag count
  did not track views (a 632k-view Short had none). They cost nothing, so fill 10 to 15:
  the leaders' shared tags, the searched phrases, and misspellings of the product.
- **Links**: URLs in Shorts descriptions and Shorts comments are not clickable; in
  long-form descriptions they are clickable only with advanced features. Each App Store
  link is an App Store Connect campaign link, one `ct` per video and language:
  `https://apps.apple.com/app/apple-store/id<APP_ID>?pt=<PROVIDER_TOKEN>&mt=8&ct=<name>`
  (Apple: developer.apple.com/help/app-store-connect/view-app-analytics/manage-campaigns/).
  Name `ct` as `yt-<video>-<lang>` so downloads trace back to the video.

## 5. Thumbnail

- Long-form: custom 16:9, at least 640 px wide; Shorts: 9:16. Readable at phone size: one
  subject, large readable text if any, no clutter; it matches the title's promise.
- Make two or three candidates while producing the video; on long-form, run them in
  Studio's A/B test once the video has impressions (step 9).

## 6. Language

- Set the video's original language and audio language on every upload.
- Upload your own captions file in the spoken language (search reads them; auto captions
  are a fallback). Same-language captions also serve viewers watching muted.
- **One channel or one per language** (YouTube's three strategies): one channel pools
  subscribers and is easier to find, but mixes languages in feeds and posts; separate
  channels suit languages with different alphabets or search terms and cost upkeep each;
  a global channel plus local ones costs the most. A new, small channel takes one
  channel, and splits only when a language keeps its own upload schedule.
- Translated title and description (Studio Subtitles, or the API `localizations`) are
  shown to viewers in that language and searched in it. A localized title promises
  something in that language: give the video subtitles in it, or, when a separate cut in
  that language exists, link the two in each description and drop the localization that
  would show a foreign-audio video under a native title.
- A cut with burned-in text or voice in another language is its own upload, with its own
  search words, title written natively (the `blind-translation` and `human-prose`
  skills), captions, thumbnail text and campaign `ct`. Extra audio tracks on one video
  need advanced features and keep the same picture.

## 7. Links between formats

- **Short to long-form**: Studio > Content > the Short > Related video, pointing at the
  long video the Short promises (advanced features; the target is public or unlisted).
  It is the clickable link a Short has. End the Short with a spoken and on-screen pointer
  to it; the long video opens on what the Short promised within 5 to 10 seconds.
- **End screen** (long-form, at least 25 s): last 5 to 20 seconds, up to 4 elements
  (video, playlist, subscribe, channel). Leave those seconds free of other content in the
  edit. Studio only.
- **Cards**: up to 5, desktop viewers only; a video card to the related video.
- **Playlist** per product or topic, every video and its Short in it; a series playlist
  (verified account) marks videos meant to be watched together.
- **Pinned comment** (advanced features): the call to action and the link, pinned at the
  top on desktop.

## 8. Audience and upload fields

Not made for kids for anything aimed at adults: made-for-kids turns off end screens,
cards, comments, the notification bell, save to playlist and personalized ads. Set
`selfDeclaredMadeForKids`, category, `defaultLanguage`, `defaultAudioLanguage`, privacy
and thumbnail in the upload request itself.

## 9. After upload

- Read every field back through the API (title, description, language, localizations,
  captions, made for kids, privacy) and open the watch page to see chapters and links.
- Recommendations follow what viewers do: whether they click, watch (average view
  duration and percentage viewed), like, share, answer satisfaction surveys, or press
  "Not interested". Relative watch time weighs more for short videos.
- Do not judge click-through rate in the first days; videos under 100 views swing widely,
  and half of all videos sit between 2% and 10% depending on traffic source. Compare at
  48 hours and 28 days by traffic source (search, Shorts feed, browse, suggested,
  related video, external).
- A/B test title and thumbnail (long-form only, desktop Studio, advanced features, up to
  3 variants, winner by watch time, about two weeks). Editing the title or thumbnail
  stops a running test. Do not change a title or thumbnail that is working.
- A new channel grows from a body of videos on one topic at a pace it can keep; upload
  frequency itself does not drive growth, and Shorts do not hurt long-form performance.

## API or Studio

| Through the YouTube Data API | Studio only |
|---|---|
| upload, title, description, tags, category, languages, privacy, made for kids (`videos.insert`, `videos.update`) | Related video on a Short |
| custom thumbnail (`thumbnails.set`) | end screens, cards |
| captions (`captions.insert`) | pinning a comment |
| translated title and description (`localizations`) | A/B test of title and thumbnail |
| playlists and their items (`playlists`, `playlistItems`) | Spotlight and section order (sections via `channelSections` exist in the API) |
| channel description, keywords and trailer (`channels.update` with `brandingSettings`; `channel.unsubscribedTrailer` is the trailer; every omitted field is deleted) | upload defaults, audience default, feature eligibility and verification |
| top-level comment (`commentThreads.insert`) | multi-language audio tracks |

## Sources

Every rule with its URL and fetch date: [references/sources.md](references/sources.md).
Third-party YouTube skills checked and not used: see the last section of that file.
