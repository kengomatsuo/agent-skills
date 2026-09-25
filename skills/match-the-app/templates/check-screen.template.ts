#!/usr/bin/env bun
// Archetype-blueprint hook. Copy to <repo>/.claude/hooks/check-screen.ts and fill in
// SCREEN_GLOB, archetypeOf, REF, CHECKLIST and CHECKS for this repo. Three modes:
//
//   pre   PreToolUse  Write|Edit — inject the archetype's blueprint. NEVER blocks.
//   post  PostToolUse Write|Edit — re-read the file, block (exit 2) on greppable breaks.
//   bash  PreToolUse  Bash       — block a shell command that would author a screen file.
//
// The bash mode is not optional: a heredoc, `sed -i` or a python write never matches the
// Write|Edit matcher, so pre and post are both silently skipped and the blueprint is
// never applied.
import { readFileSync } from "node:fs";

// ── configure ────────────────────────────────────────────────────────────────
const SCREEN_GLOB = /\/src\/screens\/.*\.tsx$/;

type Archetype = "list" | "detail" | "form" | "select" | "sheet" | "settings" | "generic";

// The FILE NAME is the archetype. Keep these patterns and the repo's naming convention
// identical — that is what lets this resolve with no index to keep in sync.
function archetypeOf(p: string): Archetype {
  const base = p.split("/").pop() ?? "";
  if (/\/src\/screens\/settings\//.test(p)) return "settings";
  if (/List\.tsx$/.test(base)) return "list";
  if (/Details\.tsx$/.test(base)) return "detail";
  if (/^Select/.test(base)) return "select";
  if (/Sheet(Body)?\.tsx$/.test(base)) return "sheet";
  if (/^(Create|Edit)/.test(base) || /Form\.tsx$/.test(base)) return "form";
  return "generic";
}

// Two references where the archetype has a simple and a complex form.
const REF: Record<Archetype, string> = {
  list: "src/screens/…/ThingsList.tsx (simple) or …/SearchableList.tsx (search+paged)",
  detail: "src/screens/…/ThingDetails.tsx (thing) or …/PersonDetails.tsx (person-shaped)",
  form: "src/screens/…/ThingForm.tsx",
  select: "src/screens/…/SelectThing.tsx",
  sheet: "src/screens/…/ThingSheet.tsx",
  settings: "src/screens/settings/Settings.tsx",
  generic: "the matching screen in the archetype index",
};

// One line each. This is injected into context before the write, so it must be short.
const CHECKLIST: Record<Archetype, string> = {
  list: "Non-scrolling shell hosting the list component as a DIRECT child. Pass the hook's data/status/error straight through. ONE item component renders both the loaded row and its skeleton.",
  detail: "ONE screen container for the whole life. Pick the layout by what the record IS: a thing uses cards; a person uses the profile shape.",
  form: "Card-grouped fields, one per line. Submit disabled until valid. Never mint primary keys on the client.",
  select: "Hosts the list exactly like a list screen. On select, write the store and go back.",
  sheet: "A route presented as a sheet, dismissed by the router. Never the raw platform modal.",
  settings: "Menu container → card → item. A multi-section settings page is a bare noun, not a *List.",
  generic: "Follow the shared shell rules: one screen container, tokens not magic numbers, skeletons not spinners.",
};

// GREPPABLE, HIGH-CONFIDENCE ONLY. A judgement call belongs in the skill, not here —
// and say so in a comment where you leave one out, or somebody will add it later.
const CHECKS: Partial<Record<Archetype | "all", (src: string) => string[]>> = {
  all: (src) =>
    /<Modal[\s/>]/.test(src) ? ["uses the raw platform <Modal> — forbidden in screens."] : [],
  list: (src) => {
    const out: string[] = [];
    const hosts = /<SelectableList[\s/>]/.test(src); // match JSX usage, not a substring
    if (!hosts) out.push("does not host the list component (it is .map()-ing rows or using a raw FlatList).");
    if (!/scrolls=\{\s*false\s*\}/.test(src)) out.push("its screen container is missing scrolls={false}.");
    if (hosts && !/renderSkeleton[=\s]/.test(src)) out.push("passes no renderSkeleton — one item component must render the row AND its skeleton.");
    return out;
  },
  // Deliberately NOT checked: which detail layout a record deserves. That is a judgement
  // call; the pre-injection and the match-the-app skill carry the fork.
};
// ── end configure ────────────────────────────────────────────────────────────

const mode = (["pre", "post", "bash"].includes(process.argv[2] ?? "") ? process.argv[2] : "pre") as
  | "pre" | "post" | "bash";

let input: any = {};
try { input = JSON.parse(readFileSync(0, "utf8")); } catch { process.exit(0); }

const filePath: string = input?.tool_input?.file_path ?? "";
const isScreen = (p: string) => SCREEN_GLOB.test(p);

if (mode === "bash") {
  const cmd: string = input?.tool_input?.command ?? "";
  const writesAScreen =
    /(^|\s)(cat|tee|sed\s+-i|python3?|perl|printf)\b[^\n]*src\/screens\/[^\n]*\.tsx/.test(cmd) ||
    />\s*[^\s]*src\/screens\/[^\s]*\.tsx/.test(cmd);
  if (!writesAScreen) process.exit(0);
  process.stderr.write(
    "BLOCKED — this shell command would author a screen file, which skips the blueprint " +
      "injection and the invariant checks entirely. Use Write or Edit so the hooks run.\n",
  );
  process.exit(2);
}

if (!isScreen(filePath)) process.exit(0);
const a = archetypeOf(filePath);

if (mode === "pre") {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "defer",
      additionalContext:
        `Screen archetype: ${a}. Open the match-the-app skill and copy ${REF[a]}. ` +
        `Blueprint: ${CHECKLIST[a]}`,
    },
  }));
  process.exit(0);
}

let src = "";
try { src = readFileSync(filePath, "utf8"); } catch { process.exit(0); }
const problems = [...(CHECKS.all?.(src) ?? []), ...(CHECKS[a]?.(src) ?? [])];
if (!problems.length) process.exit(0);

process.stderr.write(
  `BLOCKED — ${filePath.split("/").pop()} violates the ${a}-screen blueprint:\n` +
    problems.map((p) => `  - ${p}`).join("\n") +
    `\n\nOpen match-the-app and copy ${REF[a]}. Blueprint: ${CHECKLIST[a]}\n` +
    `Fix this file now before continuing.`,
);
process.exit(2);
