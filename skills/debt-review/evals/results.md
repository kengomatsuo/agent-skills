# Evaluation results

| Date | Eval | Models | Result | Description version |
|---|---|---|---|---|
| 2026-10-06 | trigger: scenario 1 prompt | Haiku, Sonnet, Opus × 3 | 5 of 9 picked the skill | opened with "Use BEFORE merging a large change" |
| 2026-10-06 | trigger: scenario 1 prompt | Haiku, Sonnet, Opus × 3 | 9 of 9 | opens with "Use BEFORE cleaning up … spaghetti" |
| 2026-10-06 | trigger: scenario 2 prompt (PR review), read tools only | Haiku, Sonnet, Opus × 3 | 4 of 7 before; 9 of 9 after naming PR reviews and code-review's boundary | added "when reviewing a diff or PR for maintainability" |
| 2026-10-06 | trigger: scenario 3 prompt (resume job), read tools only, BOARD.md present | Haiku, Sonnet, Opus × 3 | 0 of 9 before; 8 of 9 after | added "continuing a job folder that holds a BOARD.md" and a pointer line in BOARD.md |
| 2026-10-06 | behaviour: scenario 2 in a real git fixture, Bash allowed | Haiku, Sonnet, Opus × 2 | skill used in 1 of 6; every run still flagged the history comment, the console.log and the swallowed error with file:line; none used the HIGH/MEDIUM/LOW tiers | open: models review a 23-line diff without loading a skill |
| 2026-10-06 | behaviour: scenario 1 on a private monorepo's 6,000-line data module, Bash allowed, 6 turns | Haiku, Sonnet, Opus × 2 | skill used in 4 of 6 (Opus 0 of 2); 3 runs wrote measure output into that repo | fixed: scripts now redirect any --out inside the repo to the temp folder |
