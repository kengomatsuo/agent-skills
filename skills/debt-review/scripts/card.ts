#!/usr/bin/env bun
// Moved to the house board skill, which every board-making skill shares.
// `bun card.ts move <BOARD.md> <ID> <column> [--commit sha] [--note text]` still works and runs
// `board.ts --board <BOARD.md> move <ID> <column> ...` (2026-10-15: this mover's id pattern
// rejected dashed ids such as HR-T14b, so coordinators edited boards by hand).
import { homedir } from "node:os";
import { join } from "node:path";

const [cmd, file, ...rest] = process.argv.slice(2);
if (cmd !== "move" || !file) throw new Error("usage: bun card.ts move <BOARD.md> <ID> <column> [--commit sha] [--note text]");
const board = join(homedir(), ".claude/skills/board/scripts/board.ts");
const run = Bun.spawnSync(["bun", board, "--board", file, "move", ...rest], { stdout: "inherit", stderr: "inherit" });
process.exit(run.exitCode ?? 1);
