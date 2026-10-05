# Machine markup and citation damage

Split out of `SKILL.md` Part 1 §19. Read it when reviewing text that was pasted from a model.

Residue like this proves that text came out of a model and was never read
before it was pasted:

| Source | Residue |
|---|---|
| ChatGPT | `contentReference`, `oaicite` tags |
| Gemini | `[cite: 1]`, `[span_1]` |
| Grok | `grok_card` tags |
| DeepSeek | stray lenticular brackets 【】, dagger symbols |

Alongside them, check citations: invalid DOIs and ISBNs, book references with no page
number, `utm_source=` left in URLs, and links that resolve to nothing. Strip the markup
and verify every citation before the text ships. A fabricated reference in correct
format is worse than no reference (the borrowed-authority tell, Part 1 §11 of `SKILL.md`).
