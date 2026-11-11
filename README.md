# PowerShell Basics

PowerShell is the shell that runs the setup scripts and most of the commands in this collection. It's also the easiest way to automate Windows, once you know a few ideas that the other shells don't share. This tutorial teaches those ideas from the first keystroke, for readers who have never opened a terminal, and it builds up to a checker script that you can keep and reuse.

## Quick start

The tutorial is at [databankimx/training-powershell](https://github.com/databankimx/training-powershell). Run the setup script once from the tutorial's folder, then start the reader:

```pwsh
powershell -NoProfile -ExecutionPolicy Bypass -File .\setup.ps1
cd lesson-runner
npm start
```

The script installs what's missing, including Git, PowerShell 7, and Node.js, and it clones the repository if you run it from elsewhere. [QUICKSTART.md](QUICKSTART.md) has the details, including how the reader works, where your progress is saved, and how to fix common problems.

## What you need

- Windows 10 or 11
- Git, for cloning the repository. The setup script installs it if it's missing.
- PowerShell 7. The setup script installs it, and the tutorial teaches it instead of the older Windows PowerShell 5.1.
- Node.js 24 or later, for the reader. The setup script installs it if it's missing.
- The Visual Studio Build Tools with the C++ workload, the fallback if Electron's download fails. The setup script installs them if they're missing. They need an Administrator PowerShell.

No prior experience with a terminal is assumed.

## The chapters

Work through them in order. Each chapter has a short introduction, a few steps, and a summary with three quizzes. Most steps end with an exercise: you type a script in the Source pane, and the check compares its output, and any files it creates in the practice folder, with the expected result.

0. **Introduction.** What a terminal and a shell are, why PowerShell matters, and how the tutorial works. No exercise.
1. **Setting up your terminal.** Installing PowerShell 7, making it the default in Windows Terminal, and creating the practice folder.
2. **The terminal.** Reading the prompt, absolute and relative paths, and moving around.
3. **Commands and help.** What a command is, reading `Get-Help`, and finding a command with `Get-Command`.
4. **Files and folders.** Creating, reading, listing, copying, moving, renaming, and safely deleting files.
5. **Variables and strings.** Storing values, quoting and interpolation, and building text.
6. **Objects and the pipeline.** Working with objects, filtering with `Where-Object`, and sorting, selecting, and repeating.
7. **Scripts.** Saving and running a script, calling one script from another, and headers and comments.
8. **Parameters and functions.** Parameters with defaults, functions, switches, and checks on values.
9. **Errors.** Reading an error, catching it with `try` and `catch`, and choosing how errors behave.
10. **Running programs.** Starting programs from a script, reading exit codes, capturing output, and where PowerShell should stop.
11. **Environment, PATH, and profiles.** Environment variables, the PATH, and the profile that runs when a window opens.
12. **Debugging a script.** Strict mode, printing values, and finding and fixing a bug.
13. **Working with this collection.** Reading setup scripts, understanding their messages, and running commands from the right folder.
14. **Capstone.** A checker script for the collection's tools, built from the chapters before it.
15. **Appendix.** A cheat sheet, a glossary, and what to do when a window won't behave.

The capstone ends with a point that matters beyond this tutorial. A PowerShell script is the right tool for connecting programs, and a script that grows into a large program belongs in .NET. Chapters 10 and 14 explain where that line is.

## The reader

The reader is a window, built on the same runner as the Markdown tutorial. Each lesson shows its examples in source, and then the output, and most lessons end with an exercise.

- **Run** (F5) runs your script in PowerShell 7. The output appears below the editor.
- **Check** (Ctrl+F5) compares the output with the expected result. On a step that checks files, Check first empties the practice folder, then runs your script, so the check only sees what your script makes.
- **Run keeps your files.** Run does not empty the practice folder, so you can experiment, and look at what your script made with `Get-ChildItem`.
- **Show solution (spoiler)** shows one correct answer, read-only, after you've tried.
- **Reset** puts back the starter text of an exercise.
- After a check or run of a step that checks files, the output lists the text files in the practice folder, with a button for each one that opens it in your default editor.

Exercises use the practice folder, `C:\Development\ps-practice`. You can use another folder, and the lesson's commands will then point to yours. Anything you want to keep from the practice folder should be copied somewhere else before you press Check.

## Conventions used in this tutorial

The lessons follow a few rules that make documents easier to review:

- Use hyphens, not em dashes.
- Use plain text symbols, not emojis.
- End each lesson with a horizontal rule.

These are good habits in any document, not only in this tutorial.

## Folder layout

- `setup.ps1` prepares the reader and checks the tools it needs.
- `QUICKSTART.md` explains setup and the reader.
- `ch00-introduction\` through `ch14-capstone\` hold the chapters. Each chapter has a `lesson.md`, and its steps are folders with a `lesson.json`, a `lesson.md`, and, for exercises, a `starter.ps1`, a `sample.txt` with the expected output, a `solution.ps1`, and an `expected-files.json` when the exercise checks files.
- `ch15-appendix\` holds the appendix.
- `lesson-runner\` is the reader: a desktop window built with Electron.
- `resources\` holds the design notes for this tutorial, and it isn't published.

---

*PowerShell Basics is a standalone tutorial. The other tutorials in this collection assume the setup it describes.*
