# 4. Where to Stop

PowerShell is an excellent tool, and it's easy to start using it for everything. A script that runs a few programs, moves some files, and prints a report is exactly what it's for. The trouble starts when the script keeps growing, and nobody notices when it stops being a script and becomes a program. That's the point this step is about, and it's one of the most important judgments in this tutorial.

## Where PowerShell is the right tool

PowerShell is at its best for work that connects things together: calling programs, moving files, reading their output, checking exit codes, and running the same steps on a schedule or on several machines. It's sometimes called glue, because it holds other tools together, and most of the setup scripts in this collection are exactly that.

If a job is a sequence of commands, with a few decisions along the way, PowerShell is a good choice. Keep it short, keep it readable, and let it do the connecting.

## Where PowerShell starts to hurt

A script that grows past a certain size begins to show the costs of its design. Each one is manageable on its own, and together they make the script hard to trust.

- **Errors appear while the script runs.** PowerShell doesn't check types or names before it starts, so a misspelled variable or a wrong type shows up only when that line executes, which might be after the script has changed things.
- **Testing is awkward.** Writing automated tests for a large script takes more effort than the script itself, so most long scripts go untested.
- **Structure is limited.** Functions are easy, but larger designs with many types, shared data, and clear boundaries are hard to express and harder to read.
- **Speed suffers on heavy work.** Loops over large amounts of data are slow compared with a compiled program.
- **Sharing is fragile.** Other people need PowerShell and the right execution settings to run the script, and a version difference can break it.

## The rule of thumb

Here's a rough line to draw. When a script passes about a hundred lines, needs more than a handful of functions, needs data structures of its own, must be tested, has a user interface, or will be used by people who aren't you, it's probably a program, and should be written as one.

That line isn't a rule of the language. It's a judgment about cost. The longer the script, the more it costs to keep working, and the more a compiled program is worth.

## What to use instead

For a program that has grown past the line, the recommendation is a .NET program, usually written in C#. It's compiled, so many mistakes are caught before it runs. It can be tested like any other code, it runs quickly, and it can be published as a single executable file that anyone can run without installing PowerShell or changing any settings.

A PowerShell script can still be useful alongside a program. Let the program do the heavy work, and keep a short script around to run it, check its result, and connect it to the rest of the environment. That split plays to each tool's strengths.

The C# course in this collection covers writing such a program, and it's the next step once a script has outgrown itself.

> **Aside: the script that became a program.**
> Most programs of this kind started as a quick script that worked, and nobody decided to build a program. They just kept adding to it. The best time to make the move is before the script is trusted by others, while it's still small enough to rewrite comfortably.

## Try it

This exercise applies the rule of thumb to a made-up script. The check compares the line that a decision produces.

Write your script in the starter file, below the comment. It must:

1. Store `250` in a variable called `$lines`, which is the length of the script you're deciding about.
2. Use an `if` with `$lines -gt 100` as the test. When true, print `Consider a .NET program`. When false, print `PowerShell is fine`.

The expected output is `Consider a .NET program`, because 250 is greater than 100.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Writing `$lines > 100` instead of `$lines -gt 100`. In PowerShell, `>` is not a comparison, and the comparison operators all start with a dash. Use `-gt` for greater than.

---
