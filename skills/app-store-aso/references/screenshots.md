# App Store screenshots

Read this when building, localising, resizing or uploading the screenshot panels, and when a custom product page needs its own set. The method is prose; there is no renderer script (decision at the end).

## Contents
- Canvas sizes and file rules
- The method
- Copy rules
- Captures
- Fonts and scripts per locale
- Localising the panels
- Check the set
- Upload
- Optional generated stickers
- Decision on the upstream renderer
- Sources

## Canvas sizes and file rules

From the upstream `hypershots` size table, verified by its author in July 2026. Fetch Apple's current screenshot specifications page before relying on it, and update this table from that page.

| Slot | Pixels (w x h) | Note |
|---|---|---|
| iPhone 6.9 inch | 1290 x 2796 | The only required iPhone size; Apple scales it down for smaller phones |
| iPhone 6.9 inch, alternate | 1320 x 2868 | Also accepted for the same slot |
| iPhone 6.5 inch | 1284 x 2778 | Older slot, still accepted; 1242 x 2688 is also accepted |
| iPad 13 inch | 2064 x 2752 | Needed only if the app ships on iPad; 2048 x 2732 is also accepted |

App Store Connect's older "6.7 inch" label is the same slot as 6.9 inch.

File rules, same source:
- At most 8 MB per screenshot.
- PNG or JPG.
- No alpha channel; a PNG with transparency is rejected at upload. Flatten onto white.
- Colour profile untagged or sRGB.
- At most 10 per device size per localisation.
- Only about the first three portrait frames show on the product page before "Show All", and a preview video, if any, comes before them. Frames 1 to 3 carry the install decision.

Not sourced: Mac screenshot sizes, Apple Watch and Vision sizes, landscape sizes and the Google Play sizes. Fetch them if the app needs them.

## The method

Render the panels from HTML and CSS in a headless browser, so type, device frame, canvas size and every locale come out exact and repeatable. Generate pictures only where HTML cannot (stickers, below).

1. Brief. Mine the code, paywall and onboarding strings and the current listing for the real features. Draft one feature per panel in ranked order, panel 1 the emotional hook, and get the owner's yes on the order. Use the keyword research in `SKILL.md` for caption 1.
2. Theme. Take colours and type from the app's real brand, sampled from the captures and the icon. A set in default type looks like a template.
3. One page per panel at the profile's size in CSS pixels (the pixel sizes above divided by 3 for iPhone, by 2 for iPad), with a copy block above a device frame that holds the capture. Set the page size from variables so one set re-renders at each near-aspect iPhone size; an iPad set is authored again on its own because its aspect is about 0.75.
4. Fit the copy: shrink the headline until it and the lines under it clear the top of the device with a margin. When it reaches a floor and still overlaps, rewrite the copy; do not lower the floor.
5. Screenshot each page at the exact pixel size with the browser's headless mode and device scale factor 3 (iPhone) or 2 (iPad), a white default background and the sRGB profile forced. Run the renders one at a time. The page must not depend on time, randomness or animation.
6. Look at every rendered image yourself after the last edit. A size check cannot see a clipped sticker, a stretched capture or a double status bar.
7. Check the set (below), then upload.

Narrative order that worked in the upstream example: hook, core value, trust or data source, share or delight, bonus.

## Copy rules

- The headline states what the person gets; the sub states how.
- Headlines run two lines with the break placed by hand; subs run one line. A third line or a one-word second line reads as broken at store size. Fix it by rewording.
- No marketing copy under 15 CSS pixels. Search shows panels at about one sixth size, so smaller copy is noise. Use fewer words at a legible size.
- Headline weight 700 or more. Beyond about 50 px at weight 900 a two-word line wraps on a 430 px panel.
- No eyebrow line by default. If one earns its place, plain small text with a hairline, never a filled pill or gradient.
- Bridge the gap between a short sub and the device with a sticker or a lifted piece of the UI that overlaps the device's top edge, or tighten where the device starts (0.28 to 0.36 of the panel height, one value for the whole set).
- At most one tilted device in a set, never on a panel whose in-screen text must be read.
- Frame 1 shows the product working and caption 1 holds the search words (main skill, step 7).

## Captures

Apple's review guideline 2.3.3 requires screenshots to show the app in use. Use real captures. A frame built by hand in HTML is a stand-in: mark it, replace it before upload, and never invent features or data the app does not show. A camera or AR app needs captures from a real device because the simulator camera is a black feed.

Simulator capture recipe (from upstream; run `xcrun simctl list devices booted` for the id):
```
xcrun simctl status_bar <udid> override --time "9:41" --batteryState charged --batteryLevel 100 --wifiBars 3 --cellularBars 4 --operatorName ""
xcrun simctl ui <udid> appearance light      # or dark
xcrun simctl io <udid> screenshot capture-1.png
xcrun simctl status_bar <udid> clear         # at the very end
```
- Set the override once at the start. An override cleared midway gives mixed times and batteries in one set; read 9:41 off every capture.
- The simulator keeps its last appearance; set it each time, and match the theme.
- A real capture already contains its status bar and Dynamic Island. Adding a drawn one gives a double island. Draw them only on hand-built screens.
- A capture should have an aspect of about 0.460 (for example 1206 x 2622). Crop from the top so a taller capture loses its bottom rows and is never stretched.
- A held drag has no API. Take a burst of screenshots in a loop while a slowed gesture runs, then pick the frame. A gesture commits on release, so undo whatever it changed in real data.
- For a real device: a hardware screenshot, or QuickTime's iPhone movie recording (it shows a clean 9:41 bar) and `ffmpeg` to pull one frame.
- For many screens across devices, locales and appearances, a UI-test capture tool such as fastlane snapshot does the capture and the panels are built around its output.

## Fonts and scripts per locale

Ship fonts as local files with `@font-face` and `font-display: block`. A remote font import races the browser's load budget and its metrics drift. Include the licence file of each font next to it (the fonts upstream used, Inter Tight and IBM Plex Mono, are SIL OFL 1.1).

Upstream's vendored fonts cover Latin and Latin Extended only: Western and Central European languages, Turkish, Polish, Czech, Romanian, Hungarian, and Vietnamese only in part. Cyrillic, Greek, Arabic, Hebrew, CJK, Thai and the Indic scripts fall back glyph by glyph to a system font and mix faces inside a word. Do not ship such a locale until a font for its script is local. Arabic and Hebrew also need right-to-left direction. Check the rendered image of every script.

To mirror the brand, read the app's declared fonts (Info.plist `UIAppFonts`, the Tailwind font family, `next/font` imports, `expo-font` calls). If the face is not freely redistributable (SF Pro, a licensed foundry font), do not copy it; choose a close open one. The upstream menu pairs: Fraunces with Inter for editorial and food, Playfair Display with Source Sans 3 for premium, Nunito or Baloo 2 for playful, Archivo for sport, DM Serif Display with DM Sans for calm, Inter Tight for utility.

## Localising the panels

Every translatable node carries a stable key, such as `p1.headline`. The strings for a locale are written blind per `blind-translation` (see `SKILL.md`, step 6), never translated from the English panel, and keep the app name and product-specific names as they are. A script then copies each panel and replaces each keyed node's text, failing if a key is missing, if a key is unused, or if the node holds markup other than a line break. Fit then re-shrinks the headline for the longer language; read the image for bad breaks and orphan words. In-frame captures stay in the source language unless a per-locale capture is swapped in. Render a whole set, all locales, on one machine, since font rendering differs slightly between systems.

## Check the set

Run these as code on the rendered files before upload:
- exact pixel size for the slot,
- no alpha channel,
- profile untagged or sRGB,
- file size under 8 MB,
- no more than 10 frames per size and locale.

Then make a contact sheet of every locale (ImageMagick `montage` works) and look at it, including a copy at one sixth scale.

## Upload

Show the owner the contact sheet and wait for approval before uploading. Upload to the editable version only, never the version on sale, and never submit for review (main skill, step 8).

With fastlane deliver:
- Put files in `fastlane/screenshots/<App Store locale>/` and name them with a zero-padded prefix (`01-panel.png`); deliver orders by filename, so `panel-10` otherwise sorts before `panel-2`.
- The folder names are App Store locales, not short codes: `en-US` (also `en-GB`, `en-AU`, `en-CA` as separate listings), `es-ES` or `es-MX`, `fr-FR` or `fr-CA`, `de-DE`, `pt-BR` or `pt-PT`, `zh-Hans` or `zh-Hant`; `it`, `ja`, `ko`, `tr` take no region. A wrong folder name is skipped without an error.
- Options the upstream lane used: skip the binary, overwrite screenshots, do not submit for review, no automatic release, force (no interactive preview).
- An app's first version can crash deliver's review-information step with "No data" after the text metadata has landed; upload screenshots alone first.
- A flaky upload that deliver retried once created a duplicate frame, which pushes ten frames to eleven and blocks submission. Count the frames per size and locale in App Store Connect afterwards and delete the duplicate by hand.
- Authentication uses the owner's App Store Connect API key from the environment or a gitignored file; never print it or paste it in chat. The `asc-cli-house` skill sets the limits for the `asc` tool.

Each frame goes to its slot by pixel size, not by name. A second explicit rendition (6.5 inch) needs its own render and a size prefix in the filename.

## Optional generated stickers

Cut-out stickers (a glossy die-cut object on a flat loud background, then the background removed) and a whole-set style grade came from upstream through the `genmedia` tool, which needs an fal.ai key and costs money per image. Both are optional and off by default. If the owner wants them, show the prompt, the model and the number of images first, and wait for a yes. A graded image is regenerated by the model, so paste the original copy and device region back on top through a feathered mask and run the size check on the result. Without generation, use emoji, a lifted piece of the app's UI, or a plain badge.

## Decision on the upstream renderer

The upstream scripts (render, validate, scaffold, translate-inject, make-review, grade) are kept out of `scripts/`. The licence allows it (MIT). The reasons:
- They run on bash, perl and Node, plus Chrome. Rewriting them to run with bun is a port of about 50 KB that this skill cannot test against a real app here.
- They depend on a fixed panel contract (markers, a measuring script and about 20 KB of stylesheet and fonts) that must be adopted whole.
- The expensive failures are caught by the prose rules and the five checks above, which are a few lines of ImageMagick or `sips`.
- The house `product-video` skill already owns a tested bun-based render pipeline for the preview video.

If screenshot work becomes frequent, write a small bun script that renders one HTML file per panel through a headless Chrome at the sizes above and runs the five checks, and add it to `scripts/` then.

## Sources

- Upstream: `hypershots` by HyperSocial Incorporated (https://hypershots.dev, repo hypersocialinc/agent-skills), copied 2026-09-10, no commit hash in the copy. Licence MIT, copyright 2026 HyperSocial Incorporated. Its fonts are SIL OFL 1.1.
- Rewritten in own words; the facts (sizes, file rules, locale folders, capture commands, fastlane notes) are the upstream's, with its July 2026 verification date, and are not independently confirmed here.
- Dropped: the gallery submission flow (posts to a third party), the Google Play roadmap numbers (upstream marked them unimplemented), the example set, the OpenAI agent file and the 400 KB of vendored fonts.
