#!/usr/bin/env bun
// Draws the current module structure as Mermaid.
// Usage: bun model.ts --out=<dir> [--focus=<path>] <root-dir>...
// Writes packages.mmd (one box per package) and, with --focus,
// focus.mmd (files in that path and their neighbours).
// Cycles come from measure.ts (knip --cycles).
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { outsideRepo } from "./out-dir.ts";

const args = process.argv.slice(2);
const flag = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");
const out = outsideRepo(flag("out"), "model");
const focus = flag("focus");
const roots = args.filter((a) => !a.startsWith("--"));
if (!roots.length) throw new Error("name at least one root folder, e.g. packages apps");
mkdirSync(out, { recursive: true });

// depcruise reads .ts only with typescript installed beside it
const tools = join(homedir(), ".cache", "debt-review-tools");
const depcruise = join(tools, "node_modules", ".bin", "depcruise");
if (!existsSync(depcruise)) {
  mkdirSync(tools, { recursive: true });
  writeFileSync(join(tools, "package.json"), '{"name":"debt-review-tools","private":true}');
  const add = Bun.spawnSync(["bun", "add", "-E", "dependency-cruiser@18", "typescript@5.9"], { cwd: tools });
  if (add.exitCode !== 0) throw new Error(`could not install dependency-cruiser: ${add.stderr}`);
}

const cruise = (extra: string[]) => {
  const only = `^(${roots.map((r) => r.replace(/\/$/, "")).join("|")})/`;
  const r = Bun.spawnSync([depcruise, ...roots, "--no-config", "--include-only", only, "--exclude", "(node_modules|/dist/|\\.test\\.|/test/)", ...extra], {
    stdout: "pipe",
    stderr: "pipe",
  });
  if (r.exitCode !== 0 && !r.stdout.length) throw new Error(r.stderr.toString());
  return r.stdout.toString();
};

const top = roots.map((r) => r.replace(/\/$/, "")).join("|");
writeFileSync(join(out, "packages.mmd"), cruise(["--collapse", `^(${top})/[^/]+`, "-T", "mermaid"]));
console.log(join(out, "packages.mmd"));

if (focus) {
  writeFileSync(join(out, "focus.mmd"), cruise(["--focus", `^${focus}`, "--focus-depth", "1", "-T", "mermaid"]));
  console.log(join(out, "focus.mmd"));
}
