# Shared browser: own tab per agent, read-only in the user's logged-in browser

Recovered verbatim on 2026-11-03 from SKILL.md at d460a46^.

Parallel agents share one browser window: each opens its own tab (`tabs_create_mcp`),
batches navigate and read in one call, and never closes a tab it did not open. They share
the scratch folder too: each works in its own subfolder and deletes only files it created.

**That browser is the user's own, logged in to their real accounts, so research in it is
read-only.** Every brief that sends an agent to Claude in Chrome says so in words:
navigate, scroll, read and screenshot only; never click add to cart, buy, wishlist,
follow, chat, claim a voucher, or anything that changes an account, cart or order; the
flow behind such a button comes from the site's help centre. An agent that changed
something undoes it and reports exactly what it did, and the coordinator checks the
account page itself before telling the user it is clean.
