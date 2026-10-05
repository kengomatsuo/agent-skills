#!/usr/bin/env bun
// Checks skill folders against Anthropic's skill authoring rules.
// Source: platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
// Usage: bun skill-lint.ts <skills-dir-or-skill-dir>... ; exit 1 on any error.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, dirname, resolve } from "node:path";

type Finding = { level: "error" | "warn"; file: string; msg: string };
const findings: Finding[] = [];
const err = (file: string, msg: string) => findings.push({ level: "error", file, msg });
const warn = (file: string, msg: string) => findings.push({ level: "warn", file, msg });

function skillDirs(arg: string): string[] {
  if (existsSync(join(arg, "SKILL.md"))) return [arg];
  return readdirSync(arg)
    .map((d) => join(arg, d))
    .filter((d) => statSync(d).isDirectory() && existsSync(join(d, "SKILL.md")));
}

function walkMd(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".") || e.name === "node_modules") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walkMd(p));
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

// Relative .md links that resolve inside the skill folder.
function localLinks(file: string, root: string): string[] {
  const text = readFileSync(file, "utf8");
  const links = new Set<string>();
  for (const m of text.matchAll(/\]\(([^)#\s]+\.md)(#[^)]*)?\)|`([\w./-]+\.md)`/g)) {
    const target = m[1] ?? m[3];
    if (!target || /^[a-z]+:/.test(target) || target.startsWith("~") || target.startsWith("/")) continue;
    // Authors write paths relative to the file or to the skill root
    for (const base of [dirname(file), root]) {
      const abs = resolve(base, target);
      if (abs.startsWith(root + "/") && existsSync(abs)) { links.add(abs); break; }
    }
  }
  return [...links];
}

// Real YAML parse: an unquoted ": " in a description breaks the whole frontmatter
function frontmatter(text: string): Record<string, string> | null {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  try {
    const fm = Bun.YAML.parse(m[1]) as Record<string, unknown>;
    return Object.fromEntries(Object.entries(fm ?? {}).map(([k, v]) => [k, String(v ?? "")]));
  } catch {
    return null;
  }
}

function lintSkill(dir: string) {
  const root = resolve(dir);
  const skillMd = join(root, "SKILL.md");
  const rel = (p: string) => relative(process.cwd(), p);
  const text = readFileSync(skillMd, "utf8");
  const parsed = frontmatter(text);
  if (parsed === null) err(rel(skillMd), "frontmatter is not valid YAML (quote values that contain \": \")");
  const fm = parsed ?? {};
  const body = text.replace(/^---\n[\s\S]*?\n---\n?/, "");

  // Frontmatter rules
  if (!fm.name) err(rel(skillMd), "frontmatter has no name");
  else {
    if (!/^[a-z0-9-]{1,64}$/.test(fm.name)) err(rel(skillMd), `name "${fm.name}" is not lowercase-hyphen, max 64`);
    if (/anthropic|claude/.test(fm.name)) err(rel(skillMd), `name "${fm.name}" uses a reserved word`);
  }
  const desc = fm.description ?? "";
  if (!desc) err(rel(skillMd), "frontmatter has no description");
  if (desc.length > 1024) err(rel(skillMd), `description is ${desc.length} chars, max 1024`);
  if (/\b(I can|I will|I'll|I help|you can use|lets you)\b/i.test(desc))
    err(rel(skillMd), "description is not third person (I can / you can use)");
  if (/<[a-z][^>]*>/i.test(desc)) err(rel(skillMd), "description contains an XML tag");

  // Size: body under 500 lines
  const bodyLines = body.split("\n").length;
  if (bodyLines > 500) err(rel(skillMd), `body is ${bodyLines} lines, max 500; move detail to reference files`);

  // Reference files: TOC over 100 lines, one level deep
  const direct = new Set(localLinks(skillMd, root));
  // A folder linked from SKILL.md (`research/sources/`) makes every file in it direct
  const dirs = [...readFileSync(skillMd, "utf8").matchAll(/[`(]([\w./-]+\/)[`)]/g)]
    .map((m) => resolve(root, m[1]))
    .filter((d) => d.startsWith(root + "/") && existsSync(d) && statSync(d).isDirectory());
  const isDirect = (t: string) => direct.has(t) || dirs.some((d) => t.startsWith(d + "/"));
  for (const f of walkMd(root)) {
    if (f === skillMd) continue;
    const lines = readFileSync(f, "utf8").split("\n");
    if (lines.length > 100) {
      const head = lines.slice(0, 30).join("\n");
      if (!/^#{1,3}\s*(Contents|Table of contents)\b/im.test(head))
        err(rel(f), `${lines.length} lines with no "## Contents" list in the first 30 lines`);
    }
    for (const target of localLinks(f, root)) {
      if (target !== skillMd && !isDirect(target))
        err(rel(f), `links ${relative(root, target)}, which SKILL.md does not link directly (nested reference)`);
    }
  }

  // Shouting in the body (warn): emphasis stops carrying information when frequent
  const caps = body.match(/\b(MUST|NEVER|ALWAYS|CRITICAL|IMPORTANT)\b/g)?.length ?? 0;
  if (caps > 8) warn(rel(skillMd), `${caps} capitalised MUST/NEVER/ALWAYS/CRITICAL/IMPORTANT in the body`);
}

const args = process.argv.slice(2);
if (!args.length) { console.error("usage: bun skill-lint.ts <skills-dir>..."); process.exit(2); }
for (const a of args) for (const d of skillDirs(a)) lintSkill(d);
for (const f of findings) console.log(`${f.level.padEnd(5)} ${f.file}: ${f.msg}`);
const errors = findings.filter((f) => f.level === "error").length;
console.log(`${errors} errors, ${findings.length - errors} warnings`);
process.exit(errors ? 1 : 0);
