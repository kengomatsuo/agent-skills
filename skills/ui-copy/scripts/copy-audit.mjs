#!/usr/bin/env node
// Lists UI strings that break the ui-copy rules. Paths are files or directories.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const LIMIT = Number(process.env.COPY_LIMIT ?? 90);
const EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".swift", ".json"]);
const SKIP_DIR = /^(node_modules|dist|build|\.git|coverage|ios|android|Pods)$/;

// A string is CODE, not copy, when it looks like classes, a path, a token or an id.
const CODE = [
  /^[a-z0-9-]+(\s+[a-z0-9:\[\]\/.%_-]+)+$/i, // tailwind-ish class lists
  /^[MLCZmlcz]\s*[\d.]/,                      // svg path data
  /^https?:\/\//, /^\//, /^\.\//,
  /^[A-Za-z0-9_-]+$/,                          // single token
  /^[\d\s.,:%+-]+$/,
  /[{}<>]\s*$/,
];
const SQL = /\b(SELECT|INSERT INTO|UPDATE|DELETE FROM|CREATE TABLE|ALTER TABLE|WHERE|JOIN)\b/;
const isCode = (s) =>
  CODE.some((r) => r.test(s)) ||
  SQL.test(s) ||
  /[a-z]-\[|:\w+-\w+|--[a-z]+-/.test(s) ||
  /\$\{|\bconsole\.|\bimport\b|=>|\(\)|\w+\(\w*\)/.test(s);

const RULES = [
  { id: "too-long", test: (s) => s.length > LIMIT, why: `over ${LIMIT} characters` },
  { id: "two-sentences", test: (s) => (s.match(/[.!?]\s+[A-ZÀ-ÖØ-Þ]/g) ?? []).length >= 1 && s.length > 60, why: "more than one sentence" },
  { id: "explains-itself", test: (s) => /^(Note|Catatan|Tip|Info)[:,]/i.test(s), why: "starts by announcing itself" },
  { id: "addresses-reader", test: (s) => /\b(you can|anda (bisa|dapat)|kamu bisa|simply|just |cukup )\b/i.test(s), why: "instructs the reader instead of naming the state" },
  { id: "em-dash", test: (s) => /[—·]/.test(s), why: "em-dash or middot in user copy" },
  { id: "narrates-history", test: (s) => /\b(previously|before .* existed|sebelum(nya)? .* ada|used to)\b/i.test(s), why: "explains the system's own history" },
];

function* strings(file) {
  const src = readFileSync(file, "utf8");
  const lines = src.split("\n");
  const at = (i) => src.slice(0, i).split("\n").length;
  const inComment = (n) => /^\s*(\/\/|\*|\/\*)/.test(lines[n - 1] ?? "");
  const quoted = /(['"`])((?:\\.|(?!\1)[^\\\r\n]){20,400})\1/g;
  let m;
  while ((m = quoted.exec(src))) {
    const line = at(m.index);
    if (!inComment(line)) yield { text: m[2], line };
  }
  // JSX text nodes: >Some sentence< between tags.
  const jsx = />\s*([A-Za-z][^<>{}]{19,400}?)\s*</g;
  while ((m = jsx.exec(src))) {
    const line = at(m.index);
    if (!inComment(line)) yield { text: m[1].replace(/\s+/g, " "), line };
  }
}

function* walk(p) {
  const st = statSync(p);
  if (st.isFile()) { if (EXT.has(extname(p))) yield p; return; }
  for (const e of readdirSync(p)) {
    if (SKIP_DIR.test(e)) continue;
    yield* walk(join(p, e));
  }
}

// Prose has words, few symbols, and no statement punctuation.
function isProse(s) {
  if (/[;=|{}<>_]|&&|\/\/|\?\./.test(s)) return false;
  if ((s.match(/["'`]/g) ?? []).length > 1) return false;
  const words = s.trim().split(/\s+/);
  if (words.length < 4) return false;
  const alpha = (s.match(/[A-Za-zÀ-ÿ]/g) ?? []).length;
  if (alpha / s.length < 0.7) return false;
  const lower = words.filter((w) => /^[a-zà-ÿ]/.test(w)).length;
  return lower / words.length > 0.4;
}

const targets = process.argv.slice(2);
if (!targets.length) { console.error("usage: copy-audit.mjs <file-or-dir>..."); process.exit(2); }

let found = 0;
for (const t of targets) for (const file of walk(t)) {
  for (const { text, line } of strings(file)) {
    if (isCode(text) || !isProse(text)) continue;
    const broken = RULES.filter((r) => r.test(text));
    if (!broken.length) continue;
    found++;
    console.log(`${file}:${line}  [${broken.map((b) => b.id).join(",")}]\n    ${text.slice(0, 160)}`);
  }
}
console.log(`\n${found} string${found === 1 ? "" : "s"} to rewrite.`);
process.exit(found ? 1 : 0);
