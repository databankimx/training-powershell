# 1. Letting the Shell Catch Mistakes

The most common bug in a script is a typo, and the most dangerous typo is one that produces no error at all. A variable is named `$total` in one place and `$totl` in another, and PowerShell is happy to treat `$totl` as a new, empty variable. The line runs, the output looks plausible, and the mistake sits there until something downstream goes wrong.

Strict mode is the cure. It tells PowerShell to refuse to use a variable that hasn't been set, which turns a silent typo into an error you can see.

## A typo with no strict mode

Here's a script with a typo. The total is calculated correctly, but the output line asks for the misspelled name.

~~~powershell
$total = 10
Write-Output "Total: $totl"
~~~

~~~text
Output:

Total:
~~~

The output has the word `Total:` and nothing after it. No error appears, because `$totl` doesn't exist, and PowerShell treats a missing variable as empty. This is the quiet kind of bug, and it can hide for a long time.

## The same typo with strict mode

`Set-StrictMode` changes that. With strict mode on, a reference to an undefined variable is an error, and the error names the variable.

~~~powershell
Set-StrictMode -Version Latest
$total = 10
Write-Output "Total: $totl"
~~~

~~~text
Output:

The variable '$totl' cannot be retrieved because it has not been set.
At line:3 char:23
+ Write-Output "Total: $totl"
+                       ~~~~~
~~~

The error gives the name of the variable, the line it's on, and the place on the line. That's everything you need to fix the typo. `-Version Latest` asks for the strictest checks the current PowerShell offers, and it's the setting to use in new scripts.

## Strict mode in a try block

Strict mode errors can be caught like any other, so a script can report the mistake and carry on, or stop. Here's a check that makes the typo visible without crashing the window.

~~~powershell
Set-StrictMode -Version Latest
$total = 10
try {
    Write-Output "Total: $totl"
} catch {
    Write-Output "Caught a typo in the output line"
}
~~~

~~~text
Output:

Caught a typo in the output line
~~~

In a finished script, you'd normally want the error to stop the run so the typo gets fixed. The `try` version is useful when you're testing a piece of a script and want to see the failure without losing the rest of your session.

> **Aside: the strictness that protects you from yourself.**
> Strict mode also catches other mistakes, such as reading a property that doesn't exist on an object, or using a variable before it's given a value. Turn it on at the top of every script you write, and most of those mistakes stop being silent. It's one line, and it has no cost when the script is correct.

## Try it

This exercise turns on strict mode, sets a variable, and prints a line with a misspelled name inside a `try` block. The check compares the message.

Write your script in the starter file, below the comment. It must:

1. Turn on strict mode with `Set-StrictMode -Version Latest`.
2. Set `$name` to `"Ada"`.
3. In a `try` block, print `Hello, ` followed by `$nmae`, which is misspelled on purpose.
4. In the `catch` block, print `Caught a typo`.

The expected output is `Caught a typo`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Leaving out `Set-StrictMode`. Without it, `$nmae` is simply empty, the `try` block completes, and nothing is caught. Put the strict mode line first.

---
