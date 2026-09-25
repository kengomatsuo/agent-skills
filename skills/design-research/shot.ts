#!/usr/bin/env bun
// Viewport screenshot of one URL with headless Chromium.
// Usage: bun shot.ts <url> <out.png> [width=1440] [height=900] [css-selector]
// With a selector, only that element is captured.
//
// Playwright comes from PLAYWRIGHT=<path to playwright's index.js>, or from the current
// project's node_modules (playwright or @playwright/test).
import { existsSync } from "node:fs";

const candidates = [
  process.env.PLAYWRIGHT,
  `${process.cwd()}/node_modules/playwright/index.js`,
  `${process.cwd()}/node_modules/@playwright/test/index.js`,
].filter((p): p is string => !!p && existsSync(p));
if (!candidates.length) {
  console.error("No Playwright found. In any folder: bun add -d playwright && bunx playwright install chromium,\nthen run from there or set PLAYWRIGHT=/path/to/node_modules/playwright/index.js");
  process.exit(1);
}
const { chromium } = await import(candidates[0]);

const [url, out, w = "1440", h = "900", selector] = process.argv.slice(2);
if (!url || !out) {
  console.error("Usage: bun shot.ts <url> <out.png> [width] [height] [selector]");
  process.exit(1);
}
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 }).catch(() => {});
await page.waitForTimeout(1500);
if (selector) await page.locator(selector).first().screenshot({ path: out });
else await page.screenshot({ path: out });
console.log(await page.title());
await browser.close();
