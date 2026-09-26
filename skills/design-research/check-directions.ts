#!/usr/bin/env bun
// Usage: bun check-directions.ts <research-folder>
// Reads <research-folder>/directions.md: a markdown table whose first column is a page
// and whose other columns are directions. Every cell must name at least one saved file
// (a path relative to the research folder, in backticks) that exists and is not empty,
// and no two directions may cite the same file set for one page. Exit 1 lists every gap.
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
    if (!paths.length) return void problems.push(`${page} / ${dir}: no source file cited`);
    for (const p of paths) {
      const full = join(root, p);
      if (!existsSync(full) || statSync(full).size === 0) problems.push(`${page} / ${dir}: ${p} is missing or empty`);
    }
    const key = [...paths].sort().join(",");
    if (seen.has(key)) problems.push(`${page}: ${dir} cites the same source as ${seen.get(key)}, so they are one layout`);
    else seen.set(key, dir);
  });
}
if (problems.length) {
  console.error(problems.join("\n"));
  console.error(`\n${problems.length} gap(s): capture the missing sources before building.`);
  process.exit(1);
}
console.log(`ok: ${rows.length} pages x ${dirs.length} directions, every cell sourced`);
