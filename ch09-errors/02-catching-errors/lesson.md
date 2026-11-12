# 2. Catching Errors

A `try` block lets a script attempt some work and decide what to do if it fails. The `catch` block runs only when something goes wrong, and `finally` runs in both cases. Together they turn an error from a dead end into a message the script can act on.

## A try and catch

Here's the simplest form. The `try` block contains the work, and the `catch` block contains what to do if it fails.

~~~powershell
try {
    Get-Item "C:\Development\ps-practice\missing.txt" -ErrorAction Stop
    Write-Output "File found"
} catch {
    Write-Output "File not found"
}
~~~

~~~text
Output:

File not found
~~~

The `-ErrorAction Stop` is the important part. Without it, the `Get-Item` error is non-terminating, so the `catch` block wouldn't run, and the script would move on to `Write-Output "File found"` as if nothing had happened. `Stop` turns the error into one that the `catch` can see.

When the file exists, the `try` block runs to the end and the `catch` block is skipped.

~~~powershell
try {
    Get-Item "C:\Development\ps-practice" -ErrorAction Stop
    Write-Output "Folder found"
} catch {
    Write-Output "Folder not found"
}
~~~

~~~text
Output:

    Directory: C:\Development

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        11/10/2026   9:00 AM                ps-practice
Folder found
~~~

The table is the output of `Get-Item`, which runs normally, and the `Folder found` line follows it.

## Reading the error inside catch

Inside the `catch` block, `$_` holds the error. It's the same `$_` you met with `Where-Object`, but this time it refers to the error that was caught. Its message is a good thing to show, or to write to a log.

~~~powershell
try {
    Get-Item "C:\Development\ps-practice\missing.txt" -ErrorAction Stop
} catch {
    Write-Output "Problem: $($_.Exception.Message)"
}
~~~

~~~text
Output:

Problem: Cannot find path 'C:\Development\ps-practice\missing.txt' because it does not exist.
~~~

The message is the same sentence you saw in the last step, now handled by the script rather than shown in red.

## Running finally in every case

`finally` runs after the `try` and `catch`, whether or not an error happened. It's the place for cleanup, such as closing a file or removing a temporary folder, so it happens even when the work goes wrong.

~~~powershell
try {
    Get-Item "C:\Development\ps-practice\missing.txt" -ErrorAction Stop
} catch {
    Write-Output "Could not find the file"
} finally {
    Write-Output "Done checking"
}
~~~

~~~text
Output:

Could not find the file
Done checking
~~~

`finally` runs both times, so it's the right place for a line that must always happen.

## Catching only what you meant to catch

A `catch` block catches every error inside its `try`, so keep the `try` small. Put only the risky line inside it, and leave the rest of the script outside. A large `try` can hide a problem that has nothing to do with the work you were checking.

> **Aside: the catch that hid the bug.**
> A `catch` that prints a friendly message and carries on can make a real bug disappear. The script looks fine, and the problem shows up three steps later, far from its cause. When you write a catch, decide whether it should recover, or report and stop. Quietly swallowing an error is the one choice that's hard to undo.

## Try it

This exercise attempts to find a missing file, catches the failure, and always prints a final line. The check compares both lines.

Write your script in the starter file, below the comment. It must:

1. Start a `try` block containing `Get-Item "C:\Development\ps-practice\missing.txt" -ErrorAction Stop`.
2. Inside the `try`, after the `Get-Item` line, write `Write-Output "File found"`.
3. Add a `catch` block that prints `Could not find the file`.
4. Add a `finally` block that prints `Check finished`.

The expected output is two lines: `Could not find the file` and `Check finished`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Leaving out `-ErrorAction Stop`. Without it, the error is non-terminating and the `catch` never runs, so the script prints `File found` and skips the message you wanted.

---
