# Markdown Runner Design

This document describes the Markdown mode of the lesson runner, used by the Markdown Basics tutorial. It is a design for review, not a record of what has been built. The course runner in the AI-assisted coding course is the base, and this copy is its own, so changes here don't affect the course.

## Purpose

The learner writes Markdown in one pane and sees it rendered in the other, then checks the result against a sample. The lessons walk them through exercises, and the learner practices live.

## Layout

- **Source pane.** Raw Markdown in an editor, the same editor the code steps use. It starts with the step's starter text, and the learner edits it freely.
- **Output pane.** The rendered result, produced by the same Markdown renderer the lessons use, with raw HTML turned off. So what the learner sees is what a lesson shows.
- **Lesson pane.** The lesson text, as now.

The Source and Output panes replace the code panes for a Markdown step. Language tabs are not shown, because there is one source language.

## Buttons and shortcuts

- **Run (F5).** Re-renders the Output pane from the current source. Nothing runs on the computer. A Markdown step has no program to execute.
- **Check (Ctrl+F5).** Compares the learner's rendered output with the step's sample. See the next section.
- **Reset.** Puts back the starter text. The same as for code steps.
- **Show solution (spoiler).** Opens the step's sample solution behind the same gate as code steps. The sample is read-only.
- **Live preview.** Off by default. When on, the Output pane re-renders as the learner types. This is a setting, not a step requirement, because a learner who reads the rendered output only after a deliberate Run learns the habit of checking.

## How Check decides

Check compares what a reader would see, not how the source is written. Two sources that render the same count as a match. So a list with `-` and a list with `*` match, and so do extra blank lines and spaces. Different output does not match: `*italic*` and `**bold**` show different things, so they don't match each other.

1. Render the learner's source, and render the step's sample source, with the same renderer and settings.
2. Normalize both HTML strings: collapse runs of whitespace between tags, and remove whitespace at the start and end of each line.
3. Compare the normalized strings.

On a mismatch, the runner shows the step's hint, if it has one, above the learner's own rendered output. It does not show the sample's rendering, because the sample is behind the solution gate, and a failed check must not reveal it. The first point of difference is not shown.

A step with no sample (free practice) gets no Check result. The lesson's text says so.

## The step file format

A Markdown step uses `lesson.json` with `"runtime": "markdown"`, and adds these files to its folder:

- `starter.md`: the text in the Source pane when the step opens. Optional. If missing, the pane starts empty.
- `sample.md`: the source whose rendered output the learner must match. Optional. Without it, Check is off.
- `solution.md`: the sample solution, shown behind the spoiler gate. Optional.

`lesson.json` also takes an optional `"hint"` string, shown after a failed Check. A hint names the rule, not the answer.

Existing Markdown lessons in `ch01-markdown-basics` have no sample, so they remain free practice with Run and Check off. The first exercises that need Check add a `sample.md`.

## Progress

Progress is saved as it is for code steps: the step is marked visited, and the solution gate is recorded. The learner's Source text is not saved between sessions, except through Reset's starter. A learner who wants to keep their work saves it in their practice folder, as the lessons ask.

## Security and privacy

- Raw HTML in Markdown is off. The renderer escapes it, so a lesson or a learner's text can't run a script in the page.
- Links open in the learner's browser, as they do now. A link can't navigate the runner window.
- No Markdown step starts a program or reads a file. The Check function only renders and compares strings in the main process, and it writes nothing to disk.

## What changes in the copied code

These changes are for the Markdown copy only. The course runner is not touched.

- `core/markdown.js`: a function that renders a source string to normalized HTML, for Check.
- `main.js`: a Markdown branch in `check:run`, and `starter` and `sample` handling in `lesson:open`. The `runtime` field decides the branch.
- `renderer/`: the Source and Output panes for Markdown steps, a Live preview setting, and the mismatch view.
- `test/`: tests for the normalization (equal renderings match, different ones don't), the sample lookup, and the rule that raw HTML is escaped.

## Open questions for review

1. Should Check accept any rendering that matches, or should a step require specific structure, such as a table with three rows? The design uses rendering only. A structural rule can be added as a hint if learners get stuck.
2. Should the Output pane be on by default for every Markdown step, or should the step decide?
3. Is the spoiler gate the right way to reveal samples in a course with no code, or should the sample be shown after a failed Check only?

---

*The design is reviewed before it is built. Once approved, the build follows this document.*
