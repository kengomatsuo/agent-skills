// Generated, vendored and built files are never debt findings.
import { existsSync, readFileSync } from "node:fs";

const GENERATED_PATH = /(\.gen\.|\.d\.m?ts$|database\.types|node_modules\/|(^|\/)dist[^/]*\/|\.lock$|lock\.json$|\.min\.)/;
const GENERATED_HEADER = /@generated|do not edit|auto-?generated|database dump/i;

export function isGenerated(file: string): boolean {
  if (GENERATED_PATH.test(file)) return true;
  if (!existsSync(file)) return false;
  const head = readFileSync(file, "utf8").slice(0, 600);
  return GENERATED_HEADER.test(head);
}
