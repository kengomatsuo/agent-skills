#!/usr/bin/env bun
// Moved to the house board skill, which every board-making skill shares.
// `bun card.ts move <BOARD.md> <ID> <column> [--commit sha] [--note text]` still works and runs
// `board.ts --board <BOARD.md> move <ID> <column> ...`, the one mover, which takes dashed ids
// such as HR-T14b.
import { homedir } from "node:os";
import { join } from "node:path";

const [cmd, file, ...rest] = process.argv.slice(2);
if (cmd !== "move" || !file) throw new Error("usage: bun card.ts move <BOARD.md> <ID> <column> [--commit sha] [--note text]");
const board = join(homedir(), ".claude/skills/board/scripts/board.ts");
const run = Bun.spawnSync(["bun", board, "--board", file, "move", ...rest], { stdout: "inherit", stderr: "inherit" });
process.exit(run.exitCode ?? 1);
