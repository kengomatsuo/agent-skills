# board-view

A Claude Code mod that shows a project's kanban board in a pane. On top: the board's title, its done/total figure and a progress bar. Below: a picker with one segment per section (Backlog, Ready, Doing, Review, Done) and its count, and the lanes themselves, side by side, each card showing its title over two lines, who holds it, its commit, how many notes it has and its id. Open on a card shows all of it: the full title, every field and every note.

It reads the board file and parses it inside the mod, so it never calls the model and spends no tokens. It never writes the file.

## Install

In a terminal session:

```bash
claude plugin marketplace add https://github.com/kengomatsuo/agent-skills.git
```

```bash
claude plugin install board-view@kengomatsuo-skills
```

In the Desktop app, where `/plugin` does not run: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `https://github.com/kengomatsuo/agent-skills.git`, then add `board-view`.

## Opening it

- **On its own**: when a session starts in a project that has a board, the pane opens beside the conversation. A narrow window holds a pane it was not asked for; `/kanban` places it. Turn this off with the `openOnStart` option in `/config`.
- **`/kanban`** shows the pane, or hides it when it is open. The command answers with nothing, so it adds no reply to the conversation.

A narrow pane shows as many lanes as fit. Drag the lanes sideways, use the arrow keys after a click on them, or click a segment in the picker to jump to that section. A mod's pane only scrolls up and down, so the lanes are a region of their own that reads the drag.

The pane checks the file every 4 seconds while it is open and redraws when it changed.

## The board file

The mod reads the newest `docs/plans/**/BOARD.md` under the git root of the session's folder. A project with several boards gets a button for each above the lanes; a project with none shows "No board in this project".

```markdown
# Release 2.0: board

## Backlog
- **API-12** Rate-limit the export endpoint · source: incident 2026-10-02

## Ready

## Doing (limit 1 per session)
- **UI-7** Empty state for the search page · claim: fixer 2026-10-20T09:00:00Z

## Review
- **DB-3** Index orders by customer · commit: 3b6785f · check: 41 tests pass · the migration ran on staging

## Done
```

- A `## ` heading is a section; its words before any `(` are the name, and what sits in the brackets shows beside it. A `## Handoff` section is skipped.
- A card is one line: `- **ID** title`, then any number of ` · ` parts. A part written `name: value` (one lowercase word before the colon) is a field; any other part is a note.
- `claim` shows who holds the card, a 7-character `commit` shows on the card face, and the notes are counted.
- Review and Done count as done in the figure.

## Where it runs

Any project, on macOS, Linux, WSL and Windows: the mod uses only Claude Code's own file reads. In a Claude Code cloud session, add the marketplace and the plugin to the project's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "kengomatsuo-skills": {
      "source": { "source": "git", "url": "https://github.com/kengomatsuo/agent-skills.git" }
    }
  },
  "enabledPlugins": { "board-view@kengomatsuo-skills": true }
}
```

## Checks

```bash
claude plugin validate mods/board-view
```

```bash
claude plugin test mods/board-view
```

MIT, as the rest of this repository.
