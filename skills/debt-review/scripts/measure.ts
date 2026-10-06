#!/usr/bin/env bun
// Measures debt once; lenses read the saved report.
// Usage: bun measure.ts --out=<dir> [--since=6.months] [--top=20] [--baseline=<summary.json>] [path...]
// --baseline exits 1 when any count grew: the ratchet.
// Needs git and bun. knip, jscpd and eslint run through bunx when the project fits.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { isGenerated } from "./generated.ts";

const args = process.argv.slice(2);
const flag = (name: string, fallback: string) =>
  args.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=") ?? fallback;
const out = resolve(flag("out", join(process.env.TMPDIR ?? "/tmp", "debt-review", String(Date.now()))));
const since = flag("since", "6.months");
const top = Number(flag("top", "20"));
const scope = args.filter((a) => !a.startsWith("--"));
const here = import.meta.dir;
mkdirSync(out, { recursive: true });

const run = (cmd: string[], timeoutMs = 600_000) => {
  const r = Bun.spawnSync(cmd, { stdout: "pipe", stderr: "pipe", timeout: timeoutMs });
  return { code: r.exitCode, stdout: r.stdout.toString(), stderr: r.stderr.toString() };
};
const tracked = new Set(run(["git", "ls-files"]).stdout.split("\n").filter(Boolean));
const inScope = (file: string) =>
  tracked.has(file) && !isGenerated(file) && (scope.length === 0 || scope.some((p) => file.startsWith(p.replace(/^\.\//, ""))));
const report: string[] = [`# Debt measurement`, ``, `Scope: ${scope.join(", ") || "whole repo"}. Raw JSON beside this file.`, ``];
const notes: string[] = [];
const summary: Record<string, number> = {};
const baseline = flag("baseline", "");

// 1. Hotspots: commits × lines
const hot = run(["bun", join(here, "hotspots.ts"), `--since=${since}`, `--top=${top}`, "--json", ...scope]);
const hotspots: { file: string; commits: number; lines: number; score: number }[] =
  hot.code === 0 ? JSON.parse(hot.stdout).hotspots : [];
writeFileSync(join(out, "hotspots.json"), hot.stdout);
report.push(`## Hotspots since ${since} (commits × lines)`, ``, `| # | file | commits | lines |`, `|---|---|---|---|`);
hotspots.forEach((h, i) => report.push(`| ${i + 1} | ${h.file} | ${h.commits} | ${h.lines} |`));
report.push(``);

const isJsProject = existsSync("package.json");

// 2. knip: unused files, exports, dependencies, cycles
if (isJsProject) {
  const k = run(["bunx", "knip@6", "--reporter", "json", "--no-exit-code", "--no-progress"]);
  writeFileSync(join(out, "knip.json"), k.stdout);
  const loadErrors = k.stderr.split("\n").filter((l) => l.startsWith("ERROR: Error loading"));
  if (loadErrors.length)
    notes.push(`knip could not load ${loadErrors.length} config file(s); entries they declare are missing, so "unused" there is unreliable:\n${loadErrors.slice(0, 5).map((l) => `  - ${l.slice(7)}`).join("\n")}`);
  try {
    const issues: Record<string, unknown>[] = JSON.parse(k.stdout).issues ?? [];
    const kinds = ["files", "exports", "types", "dependencies", "devDependencies", "duplicates"] as const;
    const counts: Record<string, number> = {};
    const rows: string[] = [];
    for (const issue of issues) {
      const file = String(issue.file);
      const manifestInScope = file.endsWith("package.json") && (scope.length === 0 || scope.some((p) => file.startsWith(p.replace(/^\.\//, ""))));
      if (!manifestInScope && !inScope(file)) continue;
      for (const kind of kinds) {
        const list = issue[kind];
        const n = Array.isArray(list) ? list.length : 0;
        if (!n) continue;
        counts[kind] = (counts[kind] ?? 0) + n;
        summary[`unused ${kind}`] = counts[kind];
        const names = (list as { name: string }[]).map((x) => x.name).slice(0, 6).join(", ");
        if (rows.length < 60) rows.push(`| ${kind} | ${file} | ${kind === "files" ? "" : names} |`);
      }
    }
    const c = run(["bunx", "knip@6", "--cycles", "--reporter", "json", "--no-exit-code", "--no-progress"]);
    writeFileSync(join(out, "knip-cycles.json"), c.stdout);
    type Hop = { name: string; line: number };
    const loops = new Set<string>();
    for (const issue of JSON.parse(c.stdout || "{}").issues ?? [])
      for (const loop of (issue.cycles ?? []) as Hop[][])
        if (loop.some((h) => inScope(h.name))) loops.add(loop.map((h) => `${h.name}:${h.line}`).join(" → "));
    counts.cycles = loops.size;
    summary.cycles = loops.size;
    report.push(`## Import cycles (knip)`, ``, `${loops.size} cycles.`, ``, ...[...loops].slice(0, 30).map((l) => `- ${l}`), ``);
    report.push(`## Unused code (knip)`, ``, Object.entries(counts).map(([k2, v]) => `${k2}: ${v}`).join(", ") || "none", ``);
    if (rows.length) report.push(`| kind | file | names |`, `|---|---|---|`, ...rows, ``);
  } catch {
    notes.push(`knip produced no JSON: ${k.stderr.split("\n").slice(-3).join(" ")}`);
  }
}

// 3. jscpd: copy-paste clones
{
  const targets = scope.length ? scope : ["."];
  const j = run([
    "bunx", "jscpd@5", ...targets, "--min-tokens", "50", "--min-lines", "5",
    "--reporters", "json", "--output", join(out, "jscpd"),
    "--ignore", "**/node_modules/**,**/dist/**,**/dist-*/**,**/*.gen.ts,**/*.d.ts,**/database.types.ts,**/*.lock,**/*.json,**/*.md,**/*.sql,**/*.svg,**/*.html,docs/**",
  ]);
  const file = join(out, "jscpd", "jscpd-report.json");
  if (existsSync(file)) {
    const data = JSON.parse(readFileSync(file, "utf8"));
    type Clone = { lines: number; firstFile: { name: string; start: number }; secondFile: { name: string; start: number } };
    const clones: Clone[] = (data.duplicates ?? []).filter((d: Clone) => inScope(d.firstFile.name) && inScope(d.secondFile.name));
    clones.sort((a, b) => b.lines - a.lines);
    summary["cloned lines"] = clones.reduce((n, c) => n + c.lines, 0);
    report.push(`## Clones (jscpd, ≥50 tokens and ≥5 lines)`, ``,
      `${clones.length} clones in tracked, hand-written files, ${clones.reduce((n, c) => n + c.lines, 0)} cloned lines.`, ``,
      `| lines | first | second |`, `|---|---|---|`,
      ...clones.slice(0, 40).map((c) => `| ${c.lines} | ${c.firstFile.name}:${c.firstFile.start} | ${c.secondFile.name}:${c.secondFile.start} |`), ``);
  } else notes.push(`jscpd wrote no report: ${(j.stderr || j.stdout).split("\n").slice(-3).join(" ")}`);
}

// 4. ESLint complexity on the scope, or on the top hotspots
const hasEslint = isJsProject && ["eslint.config.js", "eslint.config.mjs", "eslint.config.ts", "eslint.config.cjs"].some(existsSync);
if (hasEslint) {
  const lintable = /\.(ts|tsx|js|jsx|mjs)$/;
  const files = (scope.length ? scope : hotspots.map((h) => h.file)).filter((f) => !/\.\w+$/.test(f) || lintable.test(f));
  const rules: Record<string, unknown[]> = {
    complexity: ["warn", 20],
    "max-depth": ["warn", 4],
    "max-params": ["warn", 4],
    "max-lines-per-function": ["warn", { max: 50, skipBlankLines: true, skipComments: true }],
  };
  const e = run(["bunx", "eslint", "-f", "json", "--no-warn-ignored", ...Object.entries(rules).flatMap(([r, v]) => ["--rule", JSON.stringify({ [r]: v })]), ...files]);
  writeFileSync(join(out, "eslint.json"), e.stdout);
  try {
    const results: { filePath: string; messages: { ruleId: string; line: number; message: string }[] }[] = JSON.parse(e.stdout);
    const root = process.cwd() + "/";
    const hits = results.flatMap((r) =>
      r.messages.filter((m) => m.ruleId in rules).map((m) => ({ file: r.filePath.replace(root, ""), ...m })));
    const byRule: Record<string, number> = {};
    for (const h of hits) byRule[h.ruleId] = (byRule[h.ruleId] ?? 0) + 1;
    for (const [rule, n] of Object.entries(byRule)) summary[rule] = n;
    report.push(`## Over the limits (ESLint, ${files.length} files)`, ``,
      Object.entries(byRule).map(([r, n]) => `${r}: ${n}`).join(", ") || "none", ``,
      `| rule | where | message |`, `|---|---|---|`,
      ...hits.slice(0, 80).map((h) => `| ${h.ruleId} | ${h.file}:${h.line} | ${h.message.replace(/\|/g, "/")} |`), ``);
  } catch {
    notes.push(`eslint produced no JSON: ${e.stderr.split("\n").slice(0, 3).join(" ")}`);
  }
} else if (!isJsProject) {
  const hasJs = [...tracked].some((f) => /\.(ts|tsx|js|jsx|mjs)$/.test(f));
  notes.push(hasJs
    ? "No package.json or ESLint config: knip and the complexity limits were skipped."
    : "No JS/TS: run lizard for per-function complexity (`pipx run lizard -C 15 -w .`).");
}

if (notes.length) report.push(`## Measurement notes`, ``, ...notes.map((n) => `- ${n}`), ``);
writeFileSync(join(out, "summary.json"), JSON.stringify(summary, null, 2));
let grew: string[] = [];
if (baseline) {
  const before: Record<string, number> = JSON.parse(readFileSync(baseline, "utf8"));
  grew = Object.entries(summary).filter(([k, v]) => v > (before[k] ?? 0)).map(([k, v]) => `${k}: ${before[k] ?? 0} → ${v}`);
  report.push(`## Against the baseline`, ``, grew.length ? grew.map((g) => `- grew: ${g}`).join("\n") : "Nothing grew.", ``);
}
writeFileSync(join(out, "report.md"), report.join("\n"));
console.log(`report: ${join(out, "report.md")}`);
if (grew.length) {
  console.log(`debt grew:\n${grew.join("\n")}`);
  process.exit(1);
}
