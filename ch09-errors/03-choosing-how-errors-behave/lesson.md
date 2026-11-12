# 3. Choosing How Errors Behave

Every command has a default for what happens when it fails, and you can change that default for one command or for a whole script. Deciding how errors behave is one of the most important choices in a script, because it decides whether a failure is loud, quiet, or fatal. This step shows you the settings and how far each one reaches.

## The -ErrorAction parameter

Most commands accept `-ErrorAction`, which says what to do with an error from that command alone. The common values are these.

- `Continue` shows the error and carries on. This is the usual default for cmdlets.
- `SilentlyContinue` hides the error from the screen and carries on. The error is still recorded in `$Error`.
- `Stop` turns the error into a terminating one, so a `try` block can catch it.
- `Inquire` asks you what to do each time, which is useful at the keyboard and no help in a script.

~~~powershell
Get-Item "C:\Development\ps-practice\missing.txt" -ErrorAction SilentlyContinue
Write-Output "Carried on after the quiet error"
~~~

~~~text
Output:

Carried on after the quiet error
~~~

The error doesn't appear, the script continues, and the setting applies to that one command only.

## Capturing an error in a variable

`-ErrorVariable` names a variable that receives the error. It lets a script check whether something failed, without a `try` block and without showing the error.

~~~powershell
Get-Item "C:\Development\ps-practice\missing.txt" -ErrorAction SilentlyContinue -ErrorVariable problem
if ($problem) {
    Write-Output "The check failed: $($problem[0].Exception.Message)"
}
~~~

~~~text
Output:

The check failed: Cannot find path 'C:\Development\ps-practice\missing.txt' because it does not exist.
~~~

`$problem` holds the error, and the `if` line tests whether there is one. `problem` is the name you choose, and the square brackets pick the first error from the list. This is a tidy pattern when a failure is expected and you want to handle it without a `try` block.

## The script-wide default

`$ErrorActionPreference` is a variable that sets the default for every command in the script. Set it near the top, and every command follows it, unless a command says otherwise with its own `-ErrorAction`.

~~~powershell
$ErrorActionPreference = "Stop"

try {
    Get-Item "C:\Development\ps-practice\missing.txt"
    Write-Output "This line is not reached"
} catch {
    Write-Output "Stopped at the first error"
}
~~~

~~~text
Output:

Stopped at the first error
~~~

Notice that the `Get-Item` line has no `-ErrorAction` of its own. The preference made it a terminating error, and the `catch` block caught it. This is the setting most good scripts set first, because it makes every failure loud, and it makes the script stop where the failure happened, not three lines later.

## Which setting wins

A command's own `-ErrorAction` beats the script-wide preference. The preference covers everything the command doesn't say for itself.

~~~powershell
$ErrorActionPreference = "Stop"
Get-Item "C:\Development\ps-practice\missing.txt" -ErrorAction Continue
Write-Output "The script carried on"
~~~

~~~text
Output:

Get-Item : Cannot find path 'C:\Development\ps-practice\missing.txt' because it does not exist.
The script carried on
~~~

The error shows, because the command asked for `Continue`, and the script goes on because that error isn't terminating. The preference is only a default, and the command's own choice is more specific, so it wins.

> **Aside: the default that followed the script around.**
> `$ErrorActionPreference` set in one script affects only that script's run, but it can affect every command after it inside the same window. If you set it in a window and then wonder why a later command behaves strangely, check the window's preference with `$ErrorActionPreference` on its own line, and set it back to `Continue` if needed.

## Try it

This exercise sets the script-wide preference, then catches the first failure and prints a line. The check compares the sentence.

Write your script in the starter file, below the comment. It must:

1. Set `$ErrorActionPreference` to `"Stop"`.
2. Start a `try` block with `Get-Item "C:\Development\ps-practice\missing.txt"` inside it, with no `-ErrorAction` on that line.
3. Add a `catch` block that prints `Stopped at the first error`.

The expected output is one line: `Stopped at the first error`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Adding `-ErrorAction SilentlyContinue` to the `Get-Item` line because it looks like it might help. It turns the error quiet, so the `catch` never runs. The exercise wants the preference to do the work, and no `-ErrorAction` on that line.

---
