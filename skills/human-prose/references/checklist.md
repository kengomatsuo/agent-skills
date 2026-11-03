# Part 4: revision checklist

Recovered verbatim on 2026-11-03 from SKILL.md at ea7a3d3^ (the commit that moved this text out of SKILL.md did not write the file).

## Part 4 — Revision checklist

Run this over any draft before shipping. Fix every hit by restructuring, then run the list again on
the rewritten text, and ship only when a pass finds nothing. Items marked [L] need the target language's
own forms from Part 1 or `references/language-surface-forms.md`.

- [ ] [L] Search the antithesis forms. English `not just`, `it's not`, `isn't about`;
      Japanese `ではなく`, `ではありません`, `というより`; Indonesian `bukan`, `melainkan`;
      Korean `아니라`; Chinese `不是……而是`, `与其说`; Spanish `sino`. Rewrite every hit.
- [ ] Count three-item lists. Keep each one whose content has three things, and rewrite
      the rest as the sentence they stand for, never as a pair (§2).
- [ ] [EN] Pair scan (§4). Read each pair of adjacent sentences aloud, run the §4 greps,
      and take every hit down the ladder from step 1.
- [ ] [EN] Colon-label scan (§24). `grep -nE '^[^:]{2,40}: [a-z]'` and
      `grep -nE '\b(honest|key|real|short|best) [a-z]+: '`. Rewrite each hit as the sentence.
- [ ] [EN] Human-verb scan (§25).
      `grep -nwE 'refuses|refused|holds|carries|owes|owed|bites|survives|earns|outranks|decides|lands|wedge[sd]?'`
      and give each hit a person or a named screen as its subject.
- [ ] [EN] Search the Claudish words in `references/ai-tells-2026.md`, the fragment
      openers (§27) and the metaphor props (§28).
- [ ] Measure sentence-length spread. If every sentence is within a few words of every
      other, vary them. If a run of very short ones is doing drama, join them.
- [ ] [L] Apply the dash rule FOR THIS LANGUAGE (Part 1 §5). Strip in English. Thin out,
      do not strip, in Chinese.
- [ ] [L] Search that language's inflated-vocabulary list.
- [ ] [L] Check connector density: 首先/其次/总之, 그리고/하지만/따라서, first/next/finally.
      Delete the ones the logic did not need.
- [ ] [L] Check register consistency to the last sentence, and that no three consecutive
      sentences share an ending form.
- [ ] Check paragraph lengths. If they are all the same, vary them.
- [ ] Check headings: does every one have a subtitle or gloss under it? Cut them.
- [ ] Find claims of the form "research shows" with no research. Cite or own them.
- [ ] Search `No ` and `Not ` at the start of consecutive sentences (§13). One negated
      list is a tic; write what the thing is instead.
- [ ] [EN] Search `serves as`, `boasts`, `features`, `functions as`, `stands as`. Most
      want to be `is`.
- [ ] [EN] Search `, highlighting`, `, underscoring`, `, ensuring`, `, reflecting`,
      `, contributing`. Delete the tail or promote it to a real sentence.
- [ ] Search the significance words: `testament`, `pivotal`, `crucial`, `vital`,
      `indelible`, `tapestry`, `vibrant`, `nestled`, `groundbreaking`.
- [ ] Search the 2026 frames (§20 to §23): `rather than`, `not simply`, `does not establish`,
      `less like`, `matters because`, `without sacrificing|losing|compromising`, `single most`,
      `genuinely`; an adjective like `dependable` or `practical` with no figure beside it; a
      count announced before a list; an evidence paragraph ahead of its point.
- [ ] Search headings for a Wh- opener ("Where the market is stuck", "What we do differently").
- [ ] Ask of every claim: could a rival's page say it word for word? Name the person, the
      price, the day, or the failure, or cut the line.
- [ ] Check for sections that exist only because the shape expects them, and for a
      Conclusion that restates the intro.
- [ ] Check formatting: a bold lead-in on every bullet, title case everywhere, emoji as
      structure, a rule between every section. Keep only what a reader needs.
- [ ] For pasted text: search `oaicite`, `contentReference`, `[cite:`, `grok_card`, `【`,
      and `utm_source=`. Verify every citation resolves.
- [ ] Does the last line restate the piece or sign off (§12, §30)? Delete the last
      paragraph and see whether anything is lost.
- [ ] On a revised page, search `revised`, `retracted`, `no longer`, `now`, `changed`
      (§29). A new reader needs only what is true.
- [ ] Check that no fix made another tell. A three cut to a pair, a dash turned into a
      colon label and staccato turned into uniform length are the usual swaps.
- [ ] Read it aloud. Anywhere it sounds like a speech, flatten it.
- [ ] For any non-English draft: would a native reader say this was translated? If the
      words are native but the clause order is English, rewrite from the meaning.

---

