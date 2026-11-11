# 2. Calling One Script from Another

A script that does one job is easy to test. A script that calls several small ones is easy to change, because each piece does one thing and can be replaced without touching the rest. This step shows you how one script calls another, how the results come back, and how a script finds the files that belong to it.

## A helper script

Say you have a small script that builds a greeting.

~~~powershell
Write-Output "Hi from helper"
~~~

Save that as `helper.ps1`. The script on its own does nothing special. The value comes from another script that uses it.

## Calling it with the call operator

The call operator, `&`, runs the script at the path that follows it.

~~~powershell
& "C:\Development\ps-practice\helper.ps1"
~~~

~~~text
Output:

Hi from helper
~~~

The helper printed its line, and the calling script shows it as the result. Put the call in a variable, and the helper's output is stored there instead of being shown.

~~~powershell
$message = & "C:\Development\ps-practice\helper.ps1"
Write-Output "Helper said: $message"
~~~

~~~text
Output:

Helper said: Hi from helper
~~~

That's the pattern you'll use most. The helper produces a value, and the caller decides what to do with it. The helper doesn't need to know who's listening.

> **Aside: the call that printed too much.**
> A script's output goes to the caller, and everything the script writes goes with it, including output you didn't mean to keep. If a variable holds more than one line, or a line you didn't expect, the helper is usually printing something on the side. Look for a stray command in the helper, and remove it or send it to the screen with `Write-Host`, which doesn't join the output.

## Finding files next to the script

A script often needs a file that sits beside it, such as a list of names or a settings file. `$PSScriptRoot` is the folder that holds the script that's running. It's the way a script finds its own neighbours, wherever it was started from.

~~~powershell
Write-Output "This script lives in $PSScriptRoot"
~~~

~~~text
Output:

This script lives in C:\Development\ps-practice
~~~

`$PSScriptRoot` is only filled in when the script is run from a file. In a window you're typing into, it's empty, because there's no script file behind the line. That's why the examples in this step, which you type in a window, don't show it working.

To build a path to a file beside the script, use `Join-Path`, which joins a folder and a file name with the right kind of slash.

~~~powershell
Join-Path $PSScriptRoot "helper.ps1"
~~~

~~~text
Output:

C:\Development\ps-practice\helper.ps1
~~~

That output assumes the line was in a script saved in the practice folder. The path is built from wherever the script really lives, so it still works when the folder moves.

## Calling a script with a relative path

A relative path works with the call operator, as long as you're in the right folder when you run it.

~~~powershell
Set-Location "C:\Development\ps-practice"
& ".\helper.ps1"
~~~

~~~text
Output:

Hi from helper
~~~

Before you rely on a relative path in a script, check where the script will be run from. A full path, or one built from `$PSScriptRoot`, avoids that question entirely, and that's why the exercise below uses a full path.

## Try it

This exercise writes a helper script, calls it, and prints what it returned. The check compares the sentence, and confirms the helper file.

Write your lines in the starter file, below the comment:

1. A `Set-Content` line that writes a helper script called `helper.ps1` into `C:\Development\ps-practice`. Its only line is `Write-Output "Hi from helper"`. Use single quotes around that line, so the double quotes inside it are kept.
2. A line that calls the helper with `&`, using its full path, and stores the result in a variable called `$result`.
3. A `Write-Output` line that prints `Child says: ` followed by `$result`.

The expected output is `Child says: Hi from helper`. The check also confirms that `helper.ps1` exists, with the text the helper prints.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample and the file.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Writing the helper's text in double quotes, so PowerShell reads the inner double quotes as the end of the text. Wrap the whole helper line in single quotes, and the double quotes inside survive.

---
