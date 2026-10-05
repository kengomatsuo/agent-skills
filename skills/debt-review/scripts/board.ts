#!/usr/bin/env bun
// Reads a debt-review BOARD.md: handoff, next card, problems.
// Usage: bun board.ts <path/to/BOARD.md> [--stale-hours=2]
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
if (!file) throw new Error("usage: bun board.ts <BOARD.md>");
const staleHours = Number(args.find((a) => a.startsWith("--stale-hours="))?.split("=")[1] ?? 2);

type Card = { id: string; line: string; column: string; claim?: string; claimedAt?: Date; commit?: string };

const sections = new Map<string, string[]>();
let current = "";
for (const line of readFileSync(file, "utf8").split("\n")) {
  const heading = line.match(/^## (\w+)/);
  if (heading) current = heading[1]!.toLowerCase();
  else if (current) sections.set(current, [...(sections.get(current) ?? []), line]);
}

const cards: Card[] = [];
for (const column of ["backlog", "ready", "doing", "review", "done"])
  for (const line of sections.get(column) ?? []) {
    const id = line.match(/^- \*\*(\w+)\*\*/)?.[1];
    if (!id) continue;
    const claim = line.match(/claim: (\S+) (\S+Z)/);
    cards.push({
      id,
      line,
      column,
      claim: claim?.[1],
      claimedAt: claim ? new Date(claim[2]!) : undefined,
      commit: line.match(/commit: ([0-9a-f]{7,40})/)?.[1],
    });
  }

const problems: string[] = [];
const commitExists = (sha: string) => Bun.spawnSync(["git", "cat-file", "-e", `${sha}^{commit}`]).exitCode === 0;
for (const card of cards) {
  if ((card.column === "done" || card.column === "review") && !card.commit)
    problems.push(`${card.id} is in ${card.column} with no commit`);
  if (card.commit && !commitExists(card.commit))
    problems.push(`${card.id} names commit ${card.commit}, which this clone does not have (pull?)`);
  if (card.column === "doing" && !card.claim) problems.push(`${card.id} is in doing with no claim`);
  if (card.claimedAt && Date.now() - card.claimedAt.getTime() > staleHours * 3_600_000)
    problems.push(`${card.id} claim by ${card.claim} is over ${staleHours}h old: stale, may be taken over`);
}
const perClaimant = new Map<string, string[]>();
for (const card of cards.filter((c) => c.column === "doing" && c.claim))
  perClaimant.set(card.claim!, [...(perClaimant.get(card.claim!) ?? []), card.id]);
for (const [who, ids] of perClaimant) if (ids.length > 1) problems.push(`${who} holds ${ids.join(", ")}: limit is one`);

console.log((sections.get("handoff") ?? []).join("\n").trim() || "(no Handoff block)");
const next = cards.find((c) => c.column === "ready");
console.log(`\nNext to pull: ${next ? next.line.slice(2) : "nothing in Ready"}`);
console.log(`Cards: ${["backlog", "ready", "doing", "review", "done"].map((c) => `${c} ${cards.filter((x) => x.column === c).length}`).join(", ")}`);
if (problems.length) {
  console.log(`\nProblems:\n${problems.map((p) => `- ${p}`).join("\n")}`);
  process.exit(1);
}
