// Raw tool output never lands inside the repo.
import { tmpdir } from "node:os";
import { basename, join, resolve, sep } from "node:path";

/** Resolves `--out`, redirecting a path inside the git tree to the temp folder. */
export function outsideRepo(requested: string | undefined, kind: string): string {
  const top = Bun.spawnSync(["git", "rev-parse", "--show-toplevel"]).stdout.toString().trim();
  const fallback = join(tmpdir(), "debt-review", basename(top || process.cwd()), kind);
  if (!requested) return fallback;
  const out = resolve(requested);
  if (!top || !(out + sep).startsWith(top + sep)) return out;
  console.error(`--out ${requested} is inside the repo; writing to ${fallback} instead`);
  return fallback;
}
