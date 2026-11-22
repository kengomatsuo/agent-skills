---
name: ui-copy
description: "Decides which on-screen text may exist and deletes the rest; audits a repo's strings. Use before writing any UI string or when the UI is wordy."
user-invocable: true
---

# UI copy — the screen is not a conversation

> **Local notes.** If `~/.claude/skill-notes/ui-copy.md` exists, read it before starting. It
> holds this user's own folders, project rules and examples, and where it disagrees with
> this file, it wins.

Read `ui-patterns` only when the screen has motion, states or tokens in question; the project's own tokens win over it.

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

## A dense working screen shows no sentences

**On dense working screens (back office, ERP, a till), data, labels and controls carry the screen, and a sentence that narrates the data or explains how to use the screen is cut; a screen whose job is to welcome, teach or delight may speak. A not-found or empty state on a working screen is a heading plus facts, and who, role and when are never comma-joined.**

- ✗ "BU SARI belum pernah membeli A120. Terakhir ia membeli barang lain pada 03/10/2026." ✓ heading "Belum pernah dibeli" with rows Pelanggan, Barang, Pembelian terakhir.
- ✗ "Bisa juga dari pencarian: ketik retur pak budi di Ctrl K, yang dibaca sebagai Retur Pelanggan PAK BUDI. Atau dari nota yang dibuka, lewat Retur barang." ✓ delete it; the control carries its label and a shortcut shows as a hint on it.
- ✗ "Difoto Dewi, 24/10/2026 09.12" and "Pak Agus, pemilik, 20/10/2026 08.15" ✓ avatar, name, quiet role, timestamp in its own column.

Layout of the fixed forms: `ui-patterns` references/empty-and-error-states.md ("No sentences on a working screen") and references/layout.md ("Numbers, identifiers and metadata"). The audit lists `sentence-shaped` and `comma-metadata` strings; on a screen that may speak, a `sentence-shaped` hit is a line to reread.

## The audit — run it before you claim a screen is done

```bash
bun ${CLAUDE_SKILL_DIR}/scripts/copy-audit.mjs src/
```

It flags eight patterns and exits non-zero when any string is left.

It is a grep, so it produces false positives on prose-shaped constants. Read each hit;
never bulk-rewrite from the report. The loop: run it, rewrite or delete each real hit,
run it again, and finish when it exits 0 or every remaining hit is a named false positive.

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

### 5. An error names WHAT HAPPENED. "Something went wrong" is not an error message.

> ✗ `An unexpected error occurred on this page. You can try reloading or go back to the
> home screen.`
> ✓ `The page could not load.` — the Reload and Home buttons are already on screen.

Where the cause is known, name it: `No connection.` `The shift is already
closed.` Where it is genuinely unknown, say so in four words and show the fingerprint.

### 6. A sentence that explains a control exists is a layout bug.

`You can…`, `Anda bisa…`, `Simply…`, `Cukup…`, `Just…`: make the control visible and cut the
sentence. If the user may do a thing, a control does it. "You" stays where the product is
speaking to its user.

## Length

A string is as short as it can be and still say the one thing its reader needs; the audit
lists long strings to reread, and the count is a prompt, not a limit.

**Helper text under a field carries a constraint the user cannot guess and would fail on:**
a format, a minimum, a limit. `A username uses lowercase letters, digits, dots, underscores
or hyphens.` is legitimate. Text narrating what a field does is not.

## Before you ship a screen

Read every string aloud as the user, not the builder, and delete every sentence whose only
reader knows the code.

**Non-English strings are composed in that language.** A translated sentence keeps English
clause order and lands as foreign. This applies to the rewrite too: shortening an
Indonesian string by translating a short English one produces a worse string, not a
shorter one.
