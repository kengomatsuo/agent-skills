#!/usr/bin/env bun
// Side-by-side sheet of one page in every direction, to catch builds that share a layout.
// Usage: bun review-grid.ts <shots-folder> <dir1,dir2,...> <page> [page...]
// Reads <shots-folder>/<dir>-<page>-1280.png for each direction and writes
// <shots-folder>/review-<page>.png. Open every sheet: two columns with the same
// structure (same sections, same order, same controls) are one layout, whatever the colours.
//
// Playwright comes from PLAYWRIGHT=<path to playwright's index.js>, or from the current
// project's node_modules (playwright or @playwright/test).
import { existsSync } from "node:fs";

const [folder, dirList, ...pages] = process.argv.slice(2);
if (!folder || !dirList || !pages.length) {
  console.error("usage: bun review-grid.ts <shots-folder> <dir1,dir2,...> <page> [page...]");
  process.exit(2);
}
const candidates = [
  process.env.PLAYWRIGHT,
  `${process.cwd()}/node_modules/playwright/index.js`,
  `${process.cwd()}/node_modules/@playwright/test/index.js`,
].filter((p): p is string => !!p && existsSync(p));
if (!candidates.length) {
  console.error("No Playwright found: set PLAYWRIGHT=/path/to/node_modules/playwright/index.js");
  process.exit(1);
}
const { chromium } = await import(candidates[0]);
const dirs = dirList.split(",");
const missing: string[] = [];
const browser = await chromium.launch();
for (const page of pages) {
  const cells = dirs.map((d, i) => {
    const file = `${folder}/${d}-${page}-1280.png`;
    if (!existsSync(file)) missing.push(file);
    return `<figure style="margin:0"><figcaption>${i + 1}. ${d}</figcaption><img src="file://${file}" style="width:100%;border:1px solid #ccc"></figure>`;
  });
  const html = `<html><body style="margin:0;padding:16px;font:14px system-ui"><h2 style="margin:0 0 8px">${page}</h2><div style="display:grid;grid-template-columns:repeat(${dirs.length},1fr);gap:10px">${cells.join("")}</div></body></html>`;
  // setContent blocks file:// images, so the sheet is written and navigated to
  const htmlPath = `${folder}/review-${page}.html`;
  await Bun.write(htmlPath, html);
  const tab = await (await browser.newContext({ viewport: { width: 600 * dirs.length, height: 900 } })).newPage();
  await tab.goto(`file://${htmlPath}`);
  await tab.waitForLoadState("networkidle");
  await tab.screenshot({ path: `${folder}/review-${page}.png`, fullPage: true });
}
await browser.close();
if (missing.length) {
  console.error(`missing shots:\n${missing.join("\n")}`);
  process.exit(1);
}
console.log(`ok: ${pages.length} sheet(s) in ${folder}`);
