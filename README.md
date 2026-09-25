# agent-skills

Eight skills for Claude that make it look before it builds and check before it changes.
Each works on its own; they name each other where one hands off to the next.

| Skill | Use it when |
|---|---|
| `design-research` | a screen is new or being redesigned: agents collect GitHub code, gallery and Mobbin screenshots, then you mock from them |
| `backend-research` | a backend feature is new: agents collect competitors' schemas, APIs, bug history and specs before any migration |
| `prior-art` | a plan proposes building something mature projects already solved: use, copy or build, decided and written down |
| `blast-radius` | you are about to delete, rename or change a signature: list everything it can break first |
| `blind-audit` | a subsystem needs checking end to end: assertions come from its promise, before reading its code |
| `refactor` | working code is hard to read or duplicated: reshape it without changing behaviour |
| `match-the-app` | you are adding a screen to an existing app: read its sibling pages first |
| `screen-review` | you changed UI: run the app, screenshot it, check it before calling it done |

## Install

### Claude Code

```bash
claude plugin marketplace add https://github.com/kengomatsuo/agent-skills.git
```

Then install the ones you want, for example:

```bash
claude plugin install design-research@kengomatsuo-skills
```

The full HTTPS URL matters: the `kengomatsuo/agent-skills` shorthand clones over SSH and
fails without a GitHub SSH key.

### Claude app (claude.ai, desktop, mobile)

1. Download a skill's ZIP from the [latest release](https://github.com/kengomatsuo/agent-skills/releases/latest).
   Do not unzip it.
2. Turn on **Code execution and file creation** in
   [Settings > Capabilities](https://claude.ai/settings/capabilities).
3. In [Customize > Skills](https://claude.ai/customize/skills), click **+**, then
   **Create skill**, then **Upload a skill**, and choose the ZIP.

The research skills run parallel agents and save screenshots with Playwright, so they
work best in Claude Code. `design-research/shot.ts` uses Playwright from the current
project or from `PLAYWRIGHT=<path>`.

To rebuild the ZIPs: `bash scripts/package.sh`.

## Licence

MIT.
