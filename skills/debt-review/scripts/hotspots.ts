#!/usr/bin/env bun
// Ranks files by commits × lines: where debt costs most.
// Usage: bun hotspots.ts [--since=6.months] [--top=30] [--json] [path...]
import { existsSync, readFileSync } from "node:fs";
import { isGenerated } from "./generated.ts";

const args = process.argv.slice(2);
const flag = (name: string, fallback: string) =>
  args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;
const since = flag("since", "6.months");
const top = Number(flag("top", "30"));
const asJson = args.includes("--json");
const paths = args.filter((a) => !a.startsWith("--"));

const SOURCE = /\.(ts|tsx|js|jsx|mjs|cjs|swift|kt|py|go|rs|rb|sql|vue|svelte|astro)$/;

const log = Bun.spawnSync(
  ["git", "log", `--since=${since}`, "--no-merges", "--format=", "--name-only", "--", ...paths],
  { stdout: "pipe" },
);
if (log.exitCode !== 0) throw new Error("git log failed: run inside a git repository");

const commits = new Map<string, number>();
for (const file of log.stdout.toString().split("\n")) {
  if (!file || !SOURCE.test(file)) continue;
  commits.set(file, (commits.get(file) ?? 0) + 1);
}

type Row = { file: string; commits: number; lines: number; score: number };
const rows: Row[] = [];
for (const [file, count] of commits) {
  if (!existsSync(file) || isGenerated(file)) continue; // deleted or generated
  const lines = readFileSync(file, "utf8").split("\n").length;
  rows.push({ file, commits: count, lines, score: count * lines });
}
rows.sort((a, b) => b.score - a.score);
const shown = rows.slice(0, top);

if (asJson) {
  console.log(JSON.stringify({ since, files: rows.length, hotspots: shown }, null, 2));
} else {
  console.log(`Hotspots since ${since} (commits × lines), ${rows.length} files changed\n`);
  console.log("score\tcommits\tlines\tfile");
  for (const r of shown) console.log(`${r.score}\t${r.commits}\t${r.lines}\t${r.file}`);
}
