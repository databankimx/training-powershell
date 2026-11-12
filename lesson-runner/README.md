# Lesson runner (milestone 1)

The lesson runner for the AI-assisted coding course. This milestone shows the chapters, the steps, quizzes, spoiler examples, and the Next button. Code steps, Run, Check, and the source tabs come in later milestones. See `../RUNNER-DESIGN.md` for the full design.

## Requirements

- Windows 10 or 11
- Node.js 24 or later

## Running

From this folder:

```powershell
npm install
npm test
npm start
```

`npm test` runs the catalog, Markdown, and progress tests. It also checks every quiz in the course: each one must have exactly one correct choice.

## Layout

| Path | Purpose |
|---|---|
| `main.js` | The Electron main process. Finds the course, renders lessons, and saves progress. |
| `preload.js` | The only bridge to the page. It exposes a fixed list of functions, and nothing else. |
| `core/catalog.js` | Finds chapters and steps, and works out the order, including Next across chapters. |
| `core/markdown.js` | Renders lessons. Raw HTML is off. Handles the `quiz` and `spoiler` blocks. |
| `core/state.js` | Saves progress to the user data folder, never to the repository. |
| `renderer/` | The lesson page: `index.html` (layout and styles), `icons.js` (the glyphs), `logo.svg` (the brand mark), and `renderer.js` (behavior). |
| `test/` | Node's built-in test runner. |

## Notes

- The runner reads the course from the parent folder, `..`. It never writes into the course.
- Progress is saved in the user data folder as `progress.json`. Drafts are not saved.
- Keyboard: Ctrl+Right moves to the next step, and Ctrl+Left moves back. Ctrl with the mouse wheel changes the text size. Ctrl+Alt+Shift+Backspace clears saved progress: quiz answers, spoiler states, the last lesson, and visited steps.
- The menu bar is hidden. Links open in the browser, not in the runner.
- The window icon is `renderer/app.png`. Copy it from `training-typescript/lesson-runner/src/renderer/app.png`. The runner runs without it, with Electron's default icon.
- The pop-out window shows one lesson. Its Re-dock button closes it. Keeping the two windows in step is planned for a later milestone.
- The pop-out remembers its position and size in `window-state.json` (user data folder). If that position is no longer on a connected screen, it opens at the default place.
- Previous and Next buttons sit at the bottom of the lesson pane, on the left and right.
