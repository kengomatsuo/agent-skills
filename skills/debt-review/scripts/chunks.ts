#!/usr/bin/env bun
// Cuts one big file into non-overlapping line ranges for parallel readers.
// Ranges end just before a top-level declaration, so no function is split between two readers.
// The file is only READ; this never splits a source file.
// Usage: bun chunks.ts <file> [--size=1500] [--json]
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const flag = (name: string, fallback: string) =>
  args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;
const file = args.find((a) => !a.startsWith("--"));
if (!file) throw new Error("usage: bun chunks.ts <file> [--size=1500] [--json]");
const size = Number(flag("size", "1500"));
const asJson = args.includes("--json");

const lines = readFileSync(file, "utf8").split("\n");
const total = lines.length;

// A top-level declaration starts at column 0 (no indent) with one of these.
const DECLARATION =
  /^(export\s+)?(default\s+)?(async\s+)?(function\*?|class|abstract\s+class|const|let|var|type|interface|enum|namespace|declare)\b|^(create|alter|drop)\s+(or\s+replace\s+)?(function|table|policy|trigger|view|index)\b/i;

/** Line numbers (1-based) where a declaration starts, with the name when one is easy to read. */
const starts: { line: number; name: string }[] = [];
for (let i = 0; i < total; i++) {
  const text = lines[i] ?? "";
  if (!DECLARATION.test(text)) continue;
  const name = /\b(?:function\*?|class|const|let|var|type|interface|enum|namespace)\s+([A-Za-z_$][\w$]*)/.exec(text)?.[1] ?? text.slice(0, 40);
  // A leading comment block belongs to the declaration below it.
  let start = i;
  while (start > 0 && /^\s*(\/\/|\/\*|\*|--)/.test(lines[start - 1] ?? "")) start--;
  starts.push({ line: start + 1, name });
}

type Chunk = { chunk: number; from: number; to: number; lines: number; first: string; last: string; declarations: number };
const chunks: Chunk[] = [];
let from = 1;
let firstName = "(header: imports and setup)";
let count = 0;
const flush = (to: number, lastName: string) => {
  if (to < from) return;
  chunks.push({ chunk: chunks.length + 1, from, to, lines: to - from + 1, first: firstName, last: lastName, declarations: count });
};
let lastName = firstName;
for (const s of starts) {
  if (s.line > from && s.line - from >= size) {
    flush(s.line - 1, lastName);
    from = s.line;
    firstName = s.name;
    count = 0;
  }
  lastName = s.name;
  count++;
}
flush(total, lastName);

if (asJson) {
  console.log(JSON.stringify({ file, total, size, declarations: starts.length, chunks }, null, 2));
} else {
  console.log(`${file}: ${total} lines, ${starts.length} top-level declarations, target ${size} lines per chunk\n`);
  console.log("chunk\tfrom\tto\tlines\tdecls\tfirst .. last");
  for (const c of chunks) console.log(`${c.chunk}\t${c.from}\t${c.to}\t${c.lines}\t${c.declarations}\t${c.first} .. ${c.last}`);
  const oversize = chunks.filter((c) => c.lines > size * 1.5);
  if (oversize.length) console.log(`\n${oversize.length} chunk(s) over 1.5x the target: a very long declaration, or a run the pattern does not recognise. Split it by hand at a blank line between declarations, or give it a reader of its own.`);
  if (starts.length === 0) console.log("\nNo top-level declarations found at column 0. The file may be indented or in another language; cut by hand.");
}
