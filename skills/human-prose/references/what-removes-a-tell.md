# What removes a tell, and what only moves it

Moved out of SKILL.md on 2026-10-27 with the text unchanged.

From `~/library/research/ai-prose-2026/opus/README.md` §2 (fetched 2026-10-27).

What the sources report working:

- **The writer's own material.** quiron's blind judges called a rewrite AI 12 times out of
  12 while every measured rate sat inside the human band, and only the writer's own facts,
  examples and earlier prose changed their verdict. Anthropic: "Positive examples of the
  communication style you want tend to be more effective than instructions about what not
  to do." Before editing style, gather what only this writer knows (a person, a price, a
  day, a failure) and build the sentence from it.
- **A pattern named and defined.** Anthropic's mannered-prose paragraph (§28) and Claude
  Style Patch both explain why a habit hurts, and both report that this works better than a
  word list.
- **Defaults applied with judgment.** Claude Style Patch, tuned on Opus 5.5, found that
  "hard bans turned into laws": after a ban on connectives that offered "so" as the plain
  word, Claude opened nearly every inference with "So".
- **A structural pass after the word pass.** humanizer-stack and slopbuster both run two
  passes, and the §4 ladder is the structural pass for pairs.
- **Measuring in both directions**, with a floor and a ceiling on each rate (quiron, Part 2
  §6 and §8).
- **Re-checking on long threads**, where compliance drifts (Claude Style Patch).

What only moves the tell: word bans (the jola.dev hook only changes what is displayed, and
an HN reader notes that "any word becomes a bad choice if you've used it 10 times"), a
"write like a human" brief (Opus 5 overshot; Wikipedia saw the dash replaced by uniform
commas; arXiv 2610.03110 found "sound more human" made output easier to detect), cutting
threes (pairs follow), swapping the dash for a colon (label lines follow), and style edits
on their own against a careful reader.
