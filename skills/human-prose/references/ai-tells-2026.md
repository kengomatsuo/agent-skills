# AI tells added in 2026

Source: `~/library/research/ai-prose-2026/` (fetched 2026-10-27; every row names its saved file in `src/`). Wikipedia "Signs of AI writing" revid 1382015304 (2026-10-26); Graphite "AI Tells" (2026-09-16, 10,000 human and 90,000 AI articles, 9 models); tropes.fyi (49 tropes). Counts such as "12x" are Graphite's rate against human articles.

These supplement SKILL.md Part 1. Tells shift between model versions: Graphite finds 65% unique to one model family, and Wikipedia saw "delve" fall off in 2025. Treat a hit as a reason to look, not proof; readers without tools judge at about chance (Wikipedia, 2025 study).

## Framing

| Tell | Surface forms | Before | After |
|---|---|---|---|
| Corrective framing | rather than · not simply · does not establish · should not be confused with (Wikipedia mid-2026; Graphite: "not simply" 576x) | Stya is not simply a till but a way of running the shop. | Stya takes the order at the table and prints it in the kitchen the same second. |
| Simile frame | less like a X and more like a Y (Claude, Graphite: 105x) | Less like a tool and more like a partner. | Say what it does for the person. |
| Tradeoff avoidance | without sacrificing · without losing · without compromising · without requiring (Graphite: 6x to 70x) | Faster service without losing control of stock. | Service is faster; the stock count moves to close. |
| Importance flag | matters because · the distinction matters (Graphite: 357x; 0 in the human set for the second) | The hours matter because they shape the day. | Opening is 07:00 and the first order is keyed at 07:04. |
| Tie-back | restating the answer, looping to the question | So, to answer your question: yes. | Yes. |
| Belaboring | defending a point nobody challenged (tropes.fyi) | I don't mean any of that as cynicism about players. | Cut it. |
| Collaborative "we" | we, us, our in a note from one person to one person (tropes.fyi; Wikipedia) | This gives us a clearer picture. | Use "I" or "you". |

## Evaluation words

| Tell | Surface forms | Note |
|---|---|---|
| Rating adjectives | dependable (59x) · practical (26x) · meaningful (13x) · deliberate (26x) · steady (6x) · profound (25x) · clearer · multifaceted · quietly | Delete the word. If nothing is left, the sentence said nothing. Corroborated by Wikipedia's mid-2026 list (one of its cited sources is a third-party review). |
| Claude superlatives | single most · arguably the most · every single · is genuinely (Opus 5: 1,021 articles against 4 human) | State the ranking and the basis, or drop it. |
| Gemini intensifiers | incredibly · absolutely essential · furthermore · additionally · ultimately this · together these · this comprehensive guide | Cut the connector; keep the content. |
| Appeal to familiarity | a classic · famously · notoriously · as we all know | Name who knows it, or say nothing. |
| Promotional register | subtle positivity with no cost named; older models were blunt, newer ones are quiet (Wikipedia) | A ban on "best" no longer finds it; look for a benefit with no price. |
| "Where it actually lives" | where the complexity actually lives · where the money actually leaks | Give the answer, not its address. |
| Genre glitch | an ad-like sensory phrase inside informational text ("tart bursts of flavor" in a sentence about inflation; Rettberg) | A pricing paragraph with "the warm hum of a busy dining room" has the glitch. |

## Claudish words

Readers call the Claude voice "Claudish" (slhck, crediting Ethan Mollick; Hacker News 2026). The words below come from `~/library/research/ai-prose-2026/opus/README.md` T3, T4, T9 and T11 (fetched 2026-10-27), each with the saved file in that folder's `src/`. Treat several on one page as the mark, since any single word can be chance. Replace each with the literal word for what happened, and for the verbs make a person or a named screen the subject (SKILL.md Part 1 §25).

| Word | Evidence | Source |
|---|---|---|
| load-bearing | 41 Hacker News comments in the Claude threads; one says Deepseek picked up "a strong Claudish accent ... throwing around 'honest' and 'load-bearing'" | `hn-comments.txt`; `louisabraham-load-bearing-page.txt`; `jola-stop-load-bearing.txt` |
| honest · honestly · "the honest X" · "Honestly?" | 14 HN comments; Claude Style Patch: "Don't say 'honestly' / 'Honestly?', 'the honest x:' or 'load-bearing', ever." | `hn-comments.txt`; `gh-andrewroxby-claude-style-patch-STYLE.md` |
| genuinely | in 50% of Claude Sonnet posts against 1% of human ones (quiron); the Opus 4.8 system prompt said "Claude avoids using 'genuinely', 'honestly', or 'actually'." and the 5.5 prompt dropped the line | `gh-ilien-dev-quiron-word-choice.md`; `anthropic-system-prompt-opus-4-8.md` line 105 |
| actually | in 64% of Opus posts against 24% of human ones (quiron); same system-prompt line | as above |
| plainly · quietly | 31x and 28.5x in the load-bearing corpus's 2026 pull-request cluster | `louisabraham-load-bearing-lead-cluster.txt` |
| precisely | a depth signal in slhck and the load-bearing list | `slhck-claudish.txt` |
| seam · wedge · dodge | slhck's examples ("can't wedge the deep-link") | `slhck-claudish.txt` |
| lands · earns · earns its keep | the corpus cluster (earns, pays); Anthropic's mannered-prose example "this point earns its keep" | `louisabraham-load-bearing-lead-cluster.txt`; `anthropic-prompting-fable-5-1.md` |
| rests · holds · carries · owed · bites · survived · refused · outranks | top words of the same cluster, which "represented 41% of all human-attributed pull requests last month" | `louisabraham-load-bearing-lead-cluster.txt` |
| lever · ladder · rung · backstop · tripwire · teeth · knob · dial · floor · ceiling | the mannered props in the load-bearing list (SKILL.md Part 1 §28) | `louisabraham-load-bearing-page.txt` |
| the real issue underneath · at a more fundamental level · the single most important | depth signals | `slhck-claudish.txt`; Claude Style Patch |

A ban on these words alone moves the tell to the next word (SKILL.md "What removes a tell, and what only moves it").

## Structure

| Tell | Surface forms | Note |
|---|---|---|
| Premise stacking | the evidence paragraph before the point | Lead with the point. |
| Preamble and counting | Two constraints shape the design · Four reasons why this will work · Five things we wish to discuss | Open with the first item. |
| Wh- headings | Where the market is stuck today · What we do differently · What it's worth to you | Name the topic: "Pricing", "Hours". |
| Never-ending conclusion | clause after clause with no landing | End on one point. |
| Comma-clipped tail | "above the content, and save." · "asked forty times, mentoring." | Finish the sentence or start a new one. |
| Self-echo | a word from earlier paid off again as if planned | Vary or drop. |
| Synonym cycling | the dashboard, the interface, the portal, the analytics hub | One noun, one name (SKILL.md Part 2 §3). |
| Narrator states the moral | every thread resolved; the lesson spelled out (StoryScope arXiv 2604.03136: 93.2% macro-F1 detection from narrative features alone; the 77% against 52% moral figures come from a secondary summary, unverified) | End an option on its fact. |
| Uniform length and vocabulary | sentence lengths vary less; wider vocabulary within one article (Graphite) | A text that never repeats a noun reads as AI. |

The quotable last line, the coined metaphor and the reasoning leak are SKILL.md Part 1 §30, §28 and §29, with the other Claude tells of 2026 in §24 to §27.

## Process

What removes a tell and what only moves it is in SKILL.md under that title.

1. Humans write what only they could know: a person, a price, a day, a failure. StationX: "No real failure, no real name, no actual Tuesday."
2. Test each line with "why did you write this?" (Wikipedia, signs of human writing). The answer should be something seen or counted at the till.
3. Ask whether a rival's page could say the line word for word.
4. Human texts have first person, direct address, small anecdotes, casual qualifiers, plain "is" and "has", and "the first" or "the only" where true (Graphite; Wikipedia). The floor on flat register is SKILL.md Part 2 §6.
5. Use the reader's own words, quoted, before any paraphrase. The 3x headline result in Microcopy Secrets is an unverified anecdote.

## Decision sheets for an owner

One claim per line, each ending in something he can see or count. Every benefit has its cost beside it. Name each thing once. No question-shaped heading, no announced count, no closing line that restates. A reviewer who did not write the sheet greps it against this file before it goes out.

## Indonesian

Evidence is popular articles, not corpus research; none measures 2026 Indonesian model output. Rows marked UNSURE need a native reviewer.

| Tell | Source |
|---|---|
| Template openers: "Pernahkah Anda bertanya-tanya...", "Di era digital saat ini..." | Jawapos |
| Unnamed authority: "para ahli sepakat", "penelitian menunjukkan" with no name | Jawapos |
| Always formal and positive, "tanpa keraguan"; no small everyday story | Jawapos |
| Grammar, ejaan and punctuation too perfect; no particle, no clipped sentence | Mojok #1 |
| Tries hard to be neutral; ends an explanation with advice (saran) | Mojok #2 |
| The main idea of a paragraph returns in the next with different words | Mojok #3 |
| Sophisticated diction; every sentence subject-predicate-object; basic terms over-defined | Mojok #4, Eraspace |
| "Kaku banget, kayak brosur rumah sakit"; generic until given tone, goal and a real situation | Buildwithangga |
| "mari kita" · "pada intinya" · "perlu dicatat bahwa" as stock openers | UNSURE; from a search tool's remark, not a saved source |
| Particles (sih, kok, deh, nih) and kamu or aku as the counterpart of English first person | UNSURE; plausible, unconfirmed |

Fix: give a real situation and a named audience, edit each sentence, vary length, do not paste raw output. The owner reads the Indonesian himself.
