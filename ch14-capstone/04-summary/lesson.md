# 4. Summary: The Capstone

You've built the core of a checker: a function for each check, an ordered summary, a count of the passes, and a result that says whether everything passed. That's the shape of a useful tool, and every part of it came from a chapter you've already worked through.

## Your checker, on your own computer

The reader checks the core, but the real checker runs on your machine, against the tools the collection needs. Build it yourself with this list.

1. **One check function per tool.** `git`, `node`, `winget`, and `pwsh` each get a check that returns `ok` or `missing`, as in the exercises.
2. **A summary table, in a fixed order.** One line per tool, then a count of how many passed.
3. **An exit code.** Exit with `0` when everything passed, and `1` when anything failed, so other tools can act on the result.
4. **A header and help block.** A `#Requires -Version 7.0` line, a comment block with `.SYNOPSIS` and `.DESCRIPTION`, and a note of what the script does and what it doesn't change.
5. **Nothing installed or changed.** A checker only reports. If it needs to install something, it becomes a setup script, which is a different job with different rules.
6. **A note of where it should stop.** When the checker grows past the limits in the last step, write the next version as a .NET program.

## What you learned in the capstone

- Each check is a function, and it returns one word that the summary can print.
- An ordered list keeps a summary in the same order every time.
- `@( )` around a pipeline keeps a count a number, even when only one item or none matches.
- An exit code is how a script tells other tools the result.
- A checker only reports. It shouldn't change the machine it checks.
- A small script is the right tool for glue, and a growing one should become a program.

## Try it

This exercise finishes the summary of the core checker. The reader runs the script on its own, so your script must include the `Test-Tool` function, and then decide the result line. Your script must:

1. Define `Test-Tool`, with a `param` block that takes `[string]$Name`. Inside, store `Get-Command -Name $Name -ErrorAction SilentlyContinue` in `$found`, and return `ok` if `$found` has a value, and `missing` if it doesn't.
2. Create an ordered list called `$checks` with `cmd`, `where.exe`, and `collection-missing-tool`, each set to `Test-Tool` with its name.
3. Count the checks that did not return `ok`, using `@( )` around a pipeline, and store the count in `$failed`.
4. Print `Passed ` followed by the number of `ok` values, then ` of ` and the total, as in the last step.
5. Print `Result: failed` when `$failed` is greater than zero, and `Result: passed` when it's zero, using an `if` with an `else`.

The expected output is two lines: `Passed 2 of 3` and `Result: failed`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

## Quizzes

Three questions, one for each big idea in the capstone. Pick an answer, and read the explanation whichever way it goes.

```quiz
Why does the checker's exit code matter, when the summary already shows the result?
○ It doesn't. The summary is enough, and the exit code is only for show.
→ Not quite. The summary is for people, and the exit code is for other programs.
◉ Other tools and scripts read the exit code, so they can act on the result without reading text.
→ Right. The number is the result that a program can use, and the summary is the one people read.
○ The exit code is what prints the summary, so the script can't work without it.
→ The summary is printed by the output lines. The exit code is separate, and it's the number other tools read.
```

```quiz
A checker's check function returns the Get-Command result instead of ok or missing. What goes wrong?
◉ The summary prints a description where a word should be, and the count of ok values is wrong.
→ Right. Each check must return exactly one word, so the summary and the count line up.
○ Nothing. A description is just as good as the word, and the summary still works.
→ Not quite. The summary then prints a table row, and the count of ok values breaks.
○ The script stops, because a description can't be printed.
→ A description can be printed. The problem is that it isn't the word the summary and count expect.
```

```quiz
A checker has grown to 250 lines, and it now reads configuration files and writes a report others depend on. What is the right next step?
○ Keep adding checks to the same script, because PowerShell has no size limit.
→ PowerShell has no hard limit, but this checker has passed the point where a .NET program is the better tool.
○ Remove the summary, because a checker that large doesn't need one.
→ The summary is still useful to people reading the result. The problem is the size of the script, not the summary.
◉ Write the next version as a .NET program, and keep a short script to call it if needed.
→ Right. Configuration, reports, and tests suit a compiled program, and the exit code stays the same.
```

---
