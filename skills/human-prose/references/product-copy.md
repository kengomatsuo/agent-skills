# Software and product copy

Rules for the text inside software. Landing pages and other selling copy follow `marketing-copy.md`.

**Error messages.** Say what happened, then what to do. No "Oops!", no "Something went
wrong", no apologies.

- Avoid: "Oops! Something went wrong. Please try again."
- Write: "Couldn't save the file. The folder is read-only. Choose a different folder."

**Buttons and labels.** Name what happens when it is pressed, usually a verb and its object:
"Save draft", "Read the setup guide".

**Empty states.** Say what goes here and how to add the first one. Skip the illustration
caption that says "Nothing here yet!"

**Commit messages.** Follow the repo's own convention (the house one is the `house-commit`
skill). Say what changed and why.

**Docs and READMEs.** Open with what the thing does and who it is for. Cut "In this
guide, we will explore", "Let's dive in", and the closing "Conclusion" section that
restates the intro.

**Code comments.** Explain why the code is the way it is. The what is already on screen.

**Release notes.** One line per change, in the user's vocabulary, not the codebase's.

**Localised UI copy.** A translated string keeps the source language's rhythm into a
UI that is read in fragments, which is where translationese is most obvious. Write each
locale's string from the meaning, not from the English. Never concatenate translated
fragments: word order moves. Where the project's own design rules bind, they
win on structure; this file governs voice.
