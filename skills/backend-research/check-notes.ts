#!/usr/bin/env bun
// Every source in a notes.md table must exist on disk.
// Usage: bun check-notes.ts <research-folder>
// A row passes when its file column names a non-empty file (relative to that
// notes.md), or when the row says "gated" with the reason. Exits 1 otherwise,
// so an agent cannot report a source it only looked at.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? ".");
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
  const rows = readFileSync(file, "utf8").split("\n").filter((l) => /^\|\s*\d+\s*\|/.test(l));
  for (const row of rows) {
    const cells = row.split("|").map((c) => c.trim());
    const fileCell = cells[3] ?? "";
    if (/gated/i.test(row)) { gated++; continue; }
    const paths = [...fileCell.matchAll(/`([^`]+)`|([\w./-]+\.(?:png|jpe?g|webp|gif|svg|tsx?|jsx?|css|md|json|sql|prisma|py|rb|php|ya?ml))/gi)]
      .map((m) => (m[1] ?? m[2]).replace(/\.\.\.$/, ""));
    const found = paths.some((p) => {
      const candidates = [join(dirname(file), p), join(root, p)];
      return candidates.some((c) => { try { return statSync(c).size > 0; } catch { return false; } });
    });
    if (found) ok++;
    else { missing++; console.log(`MISSING  ${file.replace(root + "/", "")}  row ${cells[1]}: ${fileCell || "(no file named)"}`); }
  }
}
console.log(`${ok} on disk, ${gated} gated, ${missing} missing across ${notes.length} notes files`);
process.exit(missing ? 1 : 0);
