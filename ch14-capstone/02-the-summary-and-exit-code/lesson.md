# 2. The Summary and the Exit Code

A checker's answer has two parts. The people reading it need a summary they can scan, and other tools need a number they can act on. This step builds both: a summary table, one line for each check, and an exit code that says whether everything passed.

## The summary table

Store the checks in an ordered list, so the summary prints in the same order every time. The name is the key, and the result of the check is the value.

~~~powershell
$checks = [ordered]@{
    "git"  = Test-Tool -Name "git"
    "node" = Test-Tool -Name "node"
}

foreach ($check in $checks.GetEnumerator()) {
    Write-Output "$($check.Key): $($check.Value)"
}
~~~

~~~text
Output:

git: ok
node: missing
~~~

The order is the one you wrote, not the order PowerShell happens to like. That matters for a summary that people read every week, because a table that moves around is harder to compare.

## Counting the passes

To count how many checks passed, pull out the values and keep only the ones that say `ok`. Then count what's left.

~~~powershell
$passed = @($checks.Values | Where-Object { $_ -eq "ok" }).Count
Write-Output "Passed $passed of $($checks.Count)"
~~~

~~~text
Output:

Passed 1 of 2
~~~

`@( )` makes sure the result is always a list, even when only one item or none passes, so `.Count` gives a number every time. This is a good habit whenever a pipeline might return nothing.

## The exit code

When the checker finishes, it should exit with a number. Zero means every check passed, and one means at least one failed. Other tools, and the people who run the checker from a script, rely on this number.

~~~powershell
$failed = @($checks.Values | Where-Object { $_ -ne "ok" }).Count
if ($failed -gt 0) {
    exit 1
}
exit 0
~~~

When this checker runs from a window, the window keeps the exit code, and you can read it with `$LASTEXITCODE`, as you learned in Chapter 10. A script that runs the checker can act on the result without reading the text at all.

The reader checks only the printed output, so this exercise asks for the summary. The exit code is still part of the real checker, and you should add it when you write the version for your own computer.

> **Aside: why the summary and the exit code both matter.**
> A person reads the summary, and a program reads the exit code. A checker that gives only one of those leaves out half of its audience. Build both from the same list of checks, so they can never disagree.

## Try it

This exercise builds the summary for three names, one of which is missing, and prints the count. The reader runs each script on its own, so the `Test-Tool` function has to be in your script too.

Write your script in the starter file, below the comment. It must:

1. Define `Test-Tool`, with a `param` block that takes `[string]$Name`. Inside, store `Get-Command -Name $Name -ErrorAction SilentlyContinue` in `$found`, and return `ok` if `$found` has a value, and `missing` if it doesn't.
2. Create an ordered list called `$checks` with three entries: `cmd` checked with `Test-Tool -Name 'cmd'`, `where.exe` checked with `Test-Tool -Name 'where.exe'`, and `collection-missing-tool` checked with `Test-Tool -Name 'collection-missing-tool'`.
3. Print each entry as key, colon, space, and value, using a `foreach` loop over `$checks.GetEnumerator()`.
4. Print `Passed ` followed by the number of `ok` values, then ` of ` and the total number of checks. Use `@( )` around the pipeline that counts the `ok` values.

The expected output is four lines: `cmd: ok`, `where.exe: ok`, `collection-missing-tool: missing`, and `Passed 2 of 3`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Counting the passes with `$checks.Values | Where-Object { $_ -eq "ok" }` and no `@( )`. With a single result, `.Count` may not be a number, and the sentence prints the wrong count. Wrap the pipeline in `@( )` as the lesson shows.

---
