import { test, expect } from "bun:test";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const audit = (text) => {
  const dir = mkdtempSync(join(tmpdir(), "copy-audit-"));
  writeFileSync(join(dir, "s.tsx"), `const x = ${JSON.stringify(text)};\n`);
  const r = Bun.spawnSync(["bun", join(import.meta.dir, "copy-audit.mjs"), dir]);
  return { code: r.exitCode, out: r.stdout.toString() };
};

test("flags who and when comma-joined", () => {
  for (const s of ["Difoto Rina, 24/10/2026 09.12", "Pak Hendra, pemilik, 20/10/2026 08.15"]) {
    const r = audit(s);
    expect(r.code).toBe(1);
    expect(r.out).toContain("comma-metadata");
  }
});

test("does not flag an amount", () => {
  expect(audit("Rp 1.250.000").code).toBe(0);
});
