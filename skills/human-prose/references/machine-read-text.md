# Text a machine reads

Read this when an agent, a program or a translation pipeline parses the text and no human is there to resolve a doubtful reading: tool descriptions, error strings, inter-agent instructions, system prompts, status lines. The rest of human-prose targets the human reader's ear. This file targets the parser, which cannot ask what you meant.

The rules come from ASD-STE100 (Simplified Technical English), a standard the aerospace industry wrote so a mechanic cannot misread an instruction. Only the sentence-shape rules are kept here. The standard's approved-word dictionary is not reproduced. Skip this file for voice-led copy (marketing, essays, UI tone).

## Rules Claude does not apply by default

1. **One word, one thing.** Name an object or action once and reuse the word. "Check", "verify" and "confirm" for the same step read as three steps.
2. **One instruction per sentence.** "Open the file and read line 3, then compare it" becomes three sentences.
3. **Length.** At most 20 words for an instruction, 25 for a description, 6 sentences for a paragraph with one topic.
4. **Verb, not nominalisation.** "Inspect the filter", not "perform an inspection of the filter".
5. **No phrasal verbs.** "Remove", not "take off". "Start", not "spin up". The parts do not predict the meaning, and parsers misread them.
6. **Simple tenses.** Simple present, past and future, imperative, infinitive. Exception: keep a compound form when it carries information, such as "has completed" (still true now) or "may have failed" (a hedge).
7. **Active voice** in procedures. Passive only when the actor is unknown or irrelevant.
8. **No semicolons.** Write two sentences.
9. **Noun stacks of at most 3 words.** "The handler that sets task-queue priority", not "agent task queue priority handler".
10. **Keep every article and verb.** Dropped words ("Files not backed up are lost") leave two readings.
11. **Open a safety or blocking condition with the command or the condition.**
12. **Use a list** for 3 or more steps or conditions.

## Two limits on the rewrite

- **Keep the hedge.** "May have failed" stays "may have failed". A shorter sentence that turns a suspicion into a fact has changed the claim, and the length cap tempts exactly that. When the tense rule and the hedge conflict, the hedge wins.
- **Add no fact.** Do not supply a cause, a frequency or a mechanism the source left out. A step you add because the original implied it gets flagged to the caller, never passed off as a rewrite.

If the text already complies, return it unchanged. If it has nothing to say, say that instead of polishing it.

## Output

Return the rewritten text alone. After it, one line `Kept as-is: <phrase> (<precision that shortening would lose>)` when you kept a longer phrasing on purpose. Show a rule-by-rule table only when asked.

## Pairs

**Tool description.**
Before: This tool will attempt to synchronize state across the various backends that have been configured, and if a conflict is detected it may resolve it automatically depending on the strategy that has been set, or otherwise it will surface the conflict for manual review.
After: The tool tries to synchronize state across the configured backends. If it finds a conflict, it reads the configured strategy. If the strategy allows automatic resolution, the tool may resolve the conflict. If the tool does not resolve the conflict, it reports the conflict for manual review.

The last sentence branches on whether the conflict was resolved, which is what "or otherwise" meant.

**Error message.**
Before: An error may have occurred while processing your request due to a possible mismatch in the expected data format, which could be caused by an outdated client version.
After: Your request may have failed. The cause may be a data format that does not match what the server expects. An outdated client can cause this mismatch. Check your client version.

Writing "The request failed" here would assert what the system only suspects.

**Inter-agent instruction.**
Before: Once the upstream job has completed and assuming no errors were raised, the downstream agent should proceed to consume the output artifact, though it is worth noting that partial artifacts are sometimes produced under timeout conditions.
After: Wait for the upstream job to finish with no errors. Then read the output artifact. Warning: a timeout can produce a partial artifact.

"Should proceed to consume" became the imperative "read". Do that in instructions, never in descriptions.

**Word drift.**
Before: Verify the system. Check the connections. Confirm receipt.
After: Check the system. Check the connections. Check that the server received the request.
