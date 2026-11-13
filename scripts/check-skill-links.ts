// Fails on a dead relative markdown link in any SKILL.md under skills/. Run on demand:
//   bun scripts/check-skill-links.ts
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..", "skills");
const files: string[] = [];
const walk = (d: string) => {
  for (const n of readdirSync(d)) {
    if (n === "node_modules" || n === ".git") continue;
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p);
    else if (n === "SKILL.md") files.push(p);
  }
};
walk(root);

let dead = 0;
for (const f of files) {
  let fence = false;
  readFileSync(f, "utf8").split("\n").forEach((line, i) => {
    if (line.trimStart().startsWith("```")) fence = !fence;
    if (fence) return;
    for (const m of line.replace(/`[^`]*`/g, "").matchAll(/\]\(([^)\s]+)\)/g)) {
      const t = m[1].split("#")[0];
      if (!t || /^[a-z]+:/i.test(t) || t.includes("${") || t.startsWith("/")) continue;
      if (!existsSync(resolve(dirname(f), decodeURIComponent(t)))) {
        console.log(`${f.replace(root + "/", "")}:${i + 1}: dead link ${m[1]}`);
        dead++;
      }
    }
  });
}
console.log(`${files.length} SKILL.md checked, ${dead} dead link(s)`);
process.exit(dead ? 1 : 0);
