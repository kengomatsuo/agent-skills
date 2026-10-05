---
name: unslop
description: Remove AI writing patterns from prose using either audit-only detection or a two-pass rewrite flow (diagnosis then reconstruction). Use this skill when editing, reviewing, or rewriting AI-generated content to make it sound human. Triggers on requests to "humanize", "de-slop", "fix AI text", "make it sound human", "remove AI patterns", or when reviewing text that contains obvious AI tells like "Here's the thing:", "Let that sink in", or "In today's fast-paced landscape". Also use when the user pastes text and says it "sounds like ChatGPT", "sounds robotic", "needs to sound more natural", or asks you to "clean up" drafted content before publishing.
license: MIT
user-invocable: true
argument-hint: "[teach · cleanup · rewrite · mimic] [input]"
metadata:
  author: claytonkim
  version: "2.3.0"
---

# Unslop

## Contents

- Routing
- Interface
- Output Format
- Reference Files

> **Bundled copy.** Only the files under Reference Files are included; the original's command files, presets, scripts and evals are not.

Humanize AI-generated prose. Audit first. Rewrite only when the user asks for a rewrite.

For every audit or rewrite, read [references/unslop-core-contract.md](references/unslop-core-contract.md).
It is the single behavior contract. Command files define routing and mechanics;
presets supply optional voice, but neither can override the core contract.

## Routing

This bundled copy has no command files. Audit is the default, and a rewrite happens only on
request, both under `references/unslop-core-contract.md`. For voice work ("does this sound like
me", "keep pushing until it sounds like me", the A/B game), read `references/unslop-mimic.md`
and `references/unslop-calibrate.md`. For strict scoring, read `references/unslop-rubric.md`.

## Interface

| Argument | Description | Default |
|----------|-------------|---------|
| `--preset` | Voice style: `crisp`, `warm`, `expert`, `story` | `crisp` |
| `--strict` | Fail if rubric score < 32/40 | false |
| `--report` | Flag AI patterns without changing the text (cleanup) | false |
| Input | Text to transform (argument, file path, or stdin) | required |

The preset files are not bundled; take the style from the table below.

| Preset | Style | Best For |
|--------|-------|----------|
| `crisp` | Short, direct, no fluff | Technical writing, documentation |
| `warm` | Friendly, conversational | Emails, blog posts |
| `expert` | Authoritative, confident | Thought leadership, articles |
| `story` | Narrative flow, show don't tell | Case studies, personal posts |

Rewrite, preservation, register, and validation behavior lives only in
`references/unslop-core-contract.md`; do not recreate or override those rules here.

## Output Format

For a quick rewrite, return the cleaned text only. For audit-only (cleanup
`--report`):

```markdown
## Issues Found

- [Quoted issue, category, severity, why it reads as AI]

## Assessment

- [Which issues are clear problems]
- [Which issues are judgment calls or context-dependent]
```

For strict or requested analysis:

```markdown
## Transformed Text

[The humanized version]

## Validation

- Constraints: [X]/[Y] preserved
- AI patterns: [N] remaining (was [M])
- Structure: [pass/fail]
- Readability: Grade [X], sentence variance [Y]
- Change: [X]% from original
- Score: [X]/40
```

## Reference Files

| File | When to Read |
|------|-------------|
| `references/unslop-pipeline.md` | Orchestrated tiered execution for multi-agent harnesses. |
| `references/unslop-taboo-phrases.md` | Authoritative phrase catalog and scanner categories. |
| `references/unslop-fact-preservation.md` | Constraint preservation rules. |
| `references/unslop-rewrite-examples.md` | Executable before/after examples. |
| `references/unslop-{mimic,calibrate}.md` | Voice matching and the A/B calibration game. |
| `references/unslop-{rubric,edit-library}.md` | Strict scoring and worked edits. |

