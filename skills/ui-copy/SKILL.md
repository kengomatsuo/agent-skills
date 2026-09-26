---
name: ui-copy
description: Use BEFORE writing or editing ANY string a user reads inside an app — labels, buttons, empty states, errors, toasts, settings rows, placeholders, onboarding, tooltips — in any language. Decides what text is ALLOWED TO EXIST on a screen, and deletes the rest. Also use to audit a repo's existing strings with scripts/copy-audit.mjs, or when the user says the UI is verbose, chatty, over-explained, or reads like a conversation between the agent and the developer.
when_to_use: "Trigger phrases: too wordy, chatty, verbose, over-explained, the empty state says too much, rewrite this label, what should the button say, the error message is useless."
user-invocable: true
---

# UI copy — the screen is not a conversation

> **Local notes.** If `~/.claude/skill-notes/ui-copy.md` exists, read it before starting. It
> holds this user's own folders, project rules and examples, and where it disagrees with
> this file, it wins.

**THE APP IS NOT TALKING TO THE DEVELOPER.** Verbose text that explains the build makes
an app read like a conversation between the agent and the developer. An agent that just built a feature knows why the feature is
odd, and puts that knowledge on the screen. The user did not ask. Every sentence that
exists to reassure the builder is deleted before it ships.

Three skills compose on a UI string, and they do not overlap:

| Skill | Question it answers |
|---|---|
| `ui-copy` (this) | Is this text allowed to exist at all, and how much of it? |
| the project's design rules | What must the string structurally obey (punctuation, emoji, states never fail silently)? |
| `human-prose` | How does the sentence sound in its own language? |

Run this one FIRST. Text you delete needs no voice.

## The audit — run it before you claim a screen is done

```bash
bun <skill-dir>/scripts/copy-audit.mjs src/
```

It flags six patterns and exits non-zero when any string is left. On its first run across
five production apps it found between 5 and 113 strings each to rewrite.

It is a grep, so it produces false positives on prose-shaped constants. Read each hit;
never bulk-rewrite from the report.

## The rules, each with the string that paid for it

### 1. A string NAMES A STATE. It never teaches.

An empty state carries what is missing and the one action. The system's own history is
never on screen.

> ✗ `No recipe yet. Without a recipe, this product is drawn from arrivals of the same
> material, the way every product behaved before recipes existed.`
> ✓ `No recipe yet.` + the button `Add recipe`

The second sentence is a changelog entry. The user never knew
there was a time before recipes.

### 2. One sentence. A second sentence must be the WAY OUT of a block.

The only sentence that earns its place beside the first is the one that says how to
proceed, or names a consequence the user cannot see.

> ✓ `A production run has already drawn from this arrival, so its sorting can no longer
> be changed. Cancel the run to reopen it.`

(Kept — the block, then the exit.)

### 3. A settings row's label IS the setting. It does not describe its own mechanism.

> ✗ `Ask Automatically prompts {{method}} as soon as the lock overlay appears. Turn it
> off to unlock by tapping the {{method}} button instead.`
> ✓ label `Ask automatically`, helper `Off: unlock with the {{method}} button.`

A toggle has two states; say the other one, not the timeline.

### 4. No marketing inside the app.

Copy that sells the product belongs on the landing page. A signed-in user already bought.

> ✗ `Join the movement. Track your impact, manage your collections, and become part of a
> global community turning waste into sustainable solutions.`

(Also a rule-of-three, which `human-prose` bans outright.)

### 5. An error names WHAT HAPPENED. "Something went wrong" is not an error message.

> ✗ `An unexpected error occurred on this page. You can try reloading or go back to the
> home screen.`
> ✓ `The page could not load.` — the Reload and Home buttons are already on screen.

Where the cause is known, name it: `No connection.` `The shift is already
closed.` Where it is genuinely unknown, say so in four words and show the fingerprint.

### 6. Never address the reader. The button is the affordance.

`You can…`, `Anda bisa…`, `Simply…`, `Cukup…`, `Just…` — all deleted. If the user may do
a thing, a control does it. A sentence explaining that a control exists means the control
is not visible enough, and that is a layout bug, not a copy problem.

## Budgets

| Element | Ceiling |
|---|---|
| Button | 3 words, a verb first |
| Label, column header, tab | 2 words |
| Empty state line | 10 words |
| Error | 10 words, plus the way out if there is one |
| Toast | 6 words |
| Helper text under a field | usually zero — see below |
| Tooltip | 6 words, and never on a labelled control |

**Helper text is guilty until proven innocent.** It is allowed only for a constraint the
user cannot guess and would fail on: a format, a minimum, a limit. `A username uses
lowercase letters, digits, dots, underscores or hyphens.` is legitimate. Anything
narrating what a field does is not.

## Before you ship a screen

1. Read every string on it aloud as if you were the user, not the builder.
2. Delete every sentence whose only reader is someone who knows the code.
3. Run `copy-audit.mjs` on the files you touched.
4. Then check the project's design rules, then run `human-prose` on what survived.

**Non-English strings are composed in that language.** A translated sentence keeps English
clause order and lands as foreign. This applies to the rewrite too: shortening an
Indonesian string by translating a short English one produces a worse string, not a
shorter one.
