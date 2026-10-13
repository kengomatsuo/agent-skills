#!/usr/bin/env bun
// The one way a card changes column on a debt-review BOARD.md.
// Usage:
//   bun card.ts move <BOARD.md> <ID> <backlog|ready|doing|review|done> [--commit <sha>[,<sha>]] [--note "<text>"]
//   bun card.ts migrate <BOARD.md>   moves every card marked " · done ...: <sha>" in place into ## Done
// A card is one "- **ID** ..." line; it is taken out of whatever column it sits in and written
// once under the target heading. Done needs a commit. (2026-10-13: cards were marked " · done"
// in place by hand and by agents, so a done card sat in Backlog and every count disagreed.)
import { readFileSync, writeFileSync } from "node:fs";

const COLUMNS = ["backlog", "ready", "doing", "review", "done"] as const;
type Column = (typeof COLUMNS)[number];
const cardId = (line: string) => line.match(/^- \*\*(\w+)\*\*/)?.[1];
/* " · done 2026-10-12: abc1234, def5678" or " · done 2026-10-12, already true: ..." */
const INLINE_DONE = /\s·\s(?:done\b[^·]*)$/;

const [cmd, file, ...rest] = process.argv.slice(2);
if (!cmd || !file) throw new Error("usage: bun card.ts move|migrate <BOARD.md> ...");
const flag = (name: string) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? rest[i + 1] : undefined;
};

const lines = readFileSync(file, "utf8").split("\n");
const columnOf = (heading: string) => COLUMNS.find((c) => heading.toLowerCase().startsWith(`## ${c}`));

/** Takes every line of the card out of the board and returns the first one. */
function take(id: string): string | undefined {
  let first: string | undefined;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (cardId(lines[i]!) !== id) continue;
    /* a card written twice keeps its fullest line */
    if (!first || lines[i]!.length > first.length) first = lines[i];
    lines.splice(i, 1);
  }
  return first;
}

/** Writes a card line as the last card under a column's heading. */
function put(column: Column, line: string) {
  const start = lines.findIndex((l) => columnOf(l) === column);
  if (start < 0) throw new Error(`${file} has no "## ${column[0]!.toUpperCase()}${column.slice(1)}" heading`);
  let at = start + 1;
  for (let i = start + 1; i < lines.length && !lines[i]!.startsWith("## "); i++) if (cardId(lines[i]!)) at = i + 1;
  lines.splice(at, 0, line);
}

/** The commits named on a line: a "commit: sha" field first, then shas after an inline "done". */
const shasOf = (line: string) =>
  [...new Set([...(line.match(/commit: ([0-9a-f]{7,40})/g) ?? []).map((m) => m.slice(8)), ...(line.match(INLINE_DONE)?.[0].match(/\b[0-9a-f]{9,40}\b/g) ?? [])])];

function move(id: string, column: Column, commits: string[], note?: string) {
  const old = take(id);
  if (!old) throw new Error(`${id} is not on ${file}`);
  const shas = [...new Set([...shasOf(old), ...commits])];
  if (column === "done" && shas.length === 0) throw new Error(`${id}: Done needs --commit <sha>`);
  /* what an inline "done" said besides its date and commits stays on the card */
  const said = (old.match(INLINE_DONE)?.[0] ?? "")
    .replace(/^\s·\sdone\s*(\d{4}-\d{2}-\d{2})?[:,]?\s*/, "")
    .replace(/\b[0-9a-f]{9,40}\b/g, "")
    .replace(/^[\s,;:]+|[\s,;:]+$/g, "")
    .replace(/\s*,\s*,/g, ",");
  let line = old.replace(INLINE_DONE, "").replace(/\s·\scommit: [0-9a-f,\s]+$/, "").replace(/\s·\sclaim: \S+ \S+Z/, "");
  if (said) line += ` · ${said}`;
  if (note) line += ` · ${note}`;
  if (shas.length && (column === "done" || column === "review")) line += ` · commit: ${shas.join(", ")}`;
  put(column, line);
}

if (cmd === "move") {
  const [id, column] = rest;
  if (!id || !COLUMNS.includes(column as Column)) throw new Error("usage: bun card.ts move <BOARD.md> <ID> <column> [--commit sha] [--note text]");
  move(id, column as Column, (flag("commit") ?? "").split(",").filter(Boolean), flag("note"));
} else if (cmd === "migrate") {
  let moved = 0;
  for (const line of [...lines]) {
    const id = cardId(line);
    if (!id || !INLINE_DONE.test(line)) continue;
    const here = lines.indexOf(line);
    let heading = "";
    for (let i = here; i >= 0; i--) if (lines[i]!.startsWith("## ")) { heading = lines[i]!; break; }
    if (columnOf(heading) === "done") continue;
    if (shasOf(line).length === 0) { console.log(`left in place, names no commit: ${id}`); continue; }
    move(id, "done", []);
    moved++;
  }
  /* a Done card that names its commit only in free text gets the field */
  let fielded = 0;
  let col: Column | undefined;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i]!;
    if (l.startsWith("## ")) col = columnOf(l);
    if (col !== "done" || !cardId(l) || /commit: /.test(l)) continue;
    const sha = l.match(/\b(?=[0-9a-f]*[a-f])(?=[0-9a-f]*\d)[0-9a-f]{9,40}\b/)?.[0];
    if (!sha) { console.log(`no commit named on Done card ${cardId(l)}`); continue; }
    lines[i] = `${l} · commit: ${sha}`;
    fielded++;
  }
  console.log(`${file}: ${moved} card(s) moved to Done, ${fielded} given a commit field`);
} else throw new Error(`unknown command ${cmd}`);

writeFileSync(file, lines.join("\n"));
