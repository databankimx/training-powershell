# 3. Where the Checker Should Stop

The checker you've built is a good size for PowerShell. It's short, it runs once, and it connects things: it looks up commands, reports the results, and sets an exit code. That's glue work, and it's what PowerShell is for.

It won't stay that size if people use it. Chapter 10 gave a rule of thumb, and this step applies it to the checker, because a capstone that ends with no sense of its limits would teach the wrong lesson.

## How a checker grows

A checker starts with a few tools. Then someone asks it to check the version of each one, and to fail when a version is too old. Then it needs a configuration file that lists the tools and their minimum versions. Then it should write a report other systems can read, and then it should be tested, so a change to one check can't break another. Each request is reasonable, and each one adds a few lines.

Here's what that looks like by the time it's useful to other people.

- **Versions are compared.** A check has to read a version number from each tool, parse it, and compare it with a minimum. Those are small jobs, and together they're a fair amount of careful code.
- **Configuration is read.** The list of tools and their rules moves out of the script and into a file, which the script has to read, validate, and report on when it's wrong.
- **Results are tested.** The checks need tests that run without a real machine, and PowerShell makes that awkward for a script of this size.
- **Errors multiply.** Each new check adds new ways to fail, and each failure needs a clear message and the right exit code.

## The rule of thumb, applied

Chapter 10 said that a script past about a hundred lines, or one that needs structure, tests, or other people relying on it, is probably a program. A checker that has grown this far has all of those.

Here's the decision written as a check. The numbers are invented, but the logic is the same one you'd apply to your own script.

~~~powershell
$lines = 180
$functions = 4
if ($lines -gt 100 -or $functions -gt 6) {
    Write-Output "Move this checker to a .NET program"
} else {
    Write-Output "Keep this checker in PowerShell"
}
~~~

~~~text
Output:

Move this checker to a .NET program
~~~

The `-or` means the decision is yes when either test is true. Either the script is too long, or it has too many functions, and either one is enough.

## What the .NET version looks like

A .NET version of this checker is a console program, usually written in C#. The checks become methods with types, so a version number is a version, not a piece of text. Configuration is read into a typed object. Tests are ordinary tests, which run without a real machine. The finished program is published as a single executable, so a person who runs it doesn't need PowerShell installed or any settings changed.

The exit code stays the same. A .NET program sets its exit code the same way, so the script that calls it still reads `$LASTEXITCODE`. That's the useful part of the split: the program does the heavy work, and PowerShell keeps doing what it's good at, which is calling the program and acting on the result.

The C# course in this collection covers writing that program. When your checker needs the things in the list above, that's the next step.

> **Aside: the checker you didn't need to rewrite.**
> Most checkers never grow this far, and a small PowerShell checker that does its one job is a fine thing to keep. Move a checker to .NET when it needs one of the things in the list, and not before. Rewriting early costs time, and a working script is worth more than a tidy program nobody needed.

## Try it

This exercise applies the rule of thumb to the numbers above. The check compares the line the decision prints.

Write your script in the starter file, below the comment. It must:

1. Set `$lines` to `180`, and `$functions` to `4`.
2. Use an `if` with `$lines -gt 100 -or $functions -gt 6` as the test. When true, print `Move this checker to a .NET program`. When false, print `Keep this checker in PowerShell`.

The expected output is `Move this checker to a .NET program`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Writing `-and` instead of `-or`. With `-and`, both tests must be true, so 180 lines alone wouldn't be enough to say move, and the decision would come out as keep. Either test on its own is a reason to move.

---
