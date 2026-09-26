#!/usr/bin/env bun
// Every source in a notes.md table must exist on disk.
// Usage: bun check-notes.ts <research-folder> [--screens screens.md --min 5]
// With --screens, rows are tallied per screen ID (S01...) found in a "screen"
// column, and every listed screen under --min saved references is printed.
// A row passes when its file column names a non-empty file (relative to that
// notes.md), or when the row says "gated" with the reason. Exits 1 otherwise,
// so an agent cannot report a source it only looked at.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const args = process.argv.slice(2);
const flag = (k: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const root = resolve(args.find((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--")) ?? ".");
const screensFile = flag("--screens");
const min = Number(flag("--min") ?? 5);
const perScreen = new Map<string, number>();
const notes: string[] = [];
const walk = (dir: string) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name === "notes.md") notes.push(p);
  }
};
walk(root);

let missing = 0, ok = 0, gated = 0;
for (const file of notes) {
  const lines = readFileSync(file, "utf8").split("\n");
  const header = lines.find((l) => /^\|\s*#\s*\|/.test(l))?.split("|").map((c) => c.trim().toLowerCase()) ?? [];
  const screenCol = header.indexOf("screen");
  const rows = lines.filter((l) => /^\|\s*\d+\s*\|/.test(l));
  for (const row of rows) {
    const cells = row.split("|").map((c) => c.trim());
    const fileCell = cells[3] ?? "";
    if (/gated/i.test(row)) { gated++; continue; }
    const paths = [...fileCell.matchAll(/`([^`]+)`|([\w./-]+\.(?:png|jpe?g|webp|gif|svg|pdf|txt|html?|csv|tsx?|jsx?|css|md|json|sql|prisma|py|rb|php|java|kt|vue|ya?ml))/gi)]
      .map((m) => (m[1] ?? m[2]).replace(/\.\.\.$/, ""));
    const found = paths.some((p) => {
      const candidates = [join(dirname(file), p), join(root, p)];
      return candidates.some((c) => { try { return statSync(c).size > 0; } catch { return false; } });
    });
    if (found) {
      ok++;
      if (screenCol > 0) for (const id of new Set((cells[screenCol] ?? "").match(/S\d{2}/g) ?? [])) perScreen.set(id, (perScreen.get(id) ?? 0) + 1);
    }
    else { missing++; console.log(`MISSING  ${file.replace(root + "/", "")}  row ${cells[1]}: ${fileCell || "(no file named)"}`); }
  }
}
console.log(`${ok} on disk, ${gated} gated, ${missing} missing across ${notes.length} notes files`);
let thin = 0;
if (screensFile) {
  const ids = [...new Set(readFileSync(screensFile, "utf8").match(/^\|\s*(S\d{2})\s*\|/gm)?.map((m) => m.match(/S\d{2}/)![0]) ?? [])];
  for (const id of ids) {
    const n = perScreen.get(id) ?? 0;
    if (n < min) { thin++; console.log(`THIN     ${id}: ${n} of ${min} references`); }
  }
  console.log(`${ids.length - thin} of ${ids.length} screens have ${min}+ saved references`);
}
process.exit(missing ? 1 : thin ? 2 : 0);
