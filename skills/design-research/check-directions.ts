#!/usr/bin/env bun
// Usage: bun check-directions.ts <research-folder>
// Reads <research-folder>/directions.md: a markdown table whose first column is a page
// and whose other columns are directions. Every cell names the saved file(s) the page
// learned from (paths relative to the research folder, in backticks) or says "original".
// Exit 1 lists every cited file that is missing or empty and every cell that says neither;
// two directions citing the same file set for one page are printed as a note.
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2];
if (!root) {
  console.error("usage: bun check-directions.ts <research-folder>");
  process.exit(2);
}
const file = join(root, "directions.md");
if (!existsSync(file)) {
  console.error(`missing ${file}: write the page-by-direction source table first`);
  process.exit(1);
}
const lines = (await Bun.file(file).text()).split("\n").filter((l) => l.trim().startsWith("|"));
const cells = (l: string) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
const [head, , ...rows] = lines;
if (!head || !rows.length) {
  console.error("directions.md has no table rows");
  process.exit(1);
}
const dirs = cells(head).slice(1);
const problems: string[] = [];
for (const row of rows) {
  const [page, ...cols] = cells(row);
  const seen = new Map<string, string>();
  dirs.forEach((dir, i) => {
    const cell = cols[i] ?? "";
    const paths = [...cell.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    if (!paths.length) return void (/\boriginal\b/i.test(cell) || problems.push(`${page} / ${dir}: names no saved file and does not say original`));
    for (const p of paths) {
      const full = join(root, p);
      if (!existsSync(full) || statSync(full).size === 0) problems.push(`${page} / ${dir}: ${p} is missing or empty`);
    }
    const key = [...paths].sort().join(",");
    if (seen.has(key)) console.log(`note: ${page}: ${dir} cites the same source as ${seen.get(key)}; check they are not one layout`);
    else seen.set(key, dir);
  });
}
if (problems.length) {
  console.error(problems.join("\n"));
  console.error(`\n${problems.length} gap(s): save the missing files, or mark the cell original.`);
  process.exit(1);
}
console.log(`ok: ${rows.length} pages x ${dirs.length} directions, every cited file on disk`);
