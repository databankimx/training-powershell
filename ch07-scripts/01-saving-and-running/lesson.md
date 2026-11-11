# 1. Saving and Running a Script

A script is nothing more than commands in a text file. Write the lines in any editor, save the file with a `.ps1` ending, and PowerShell can run the whole file in one go. That's the step that makes the work reusable, because you only have to get the lines right once.

## A first script

Here's a small script. It has three lines, one command on each.

~~~powershell
Write-Output "Script started"
Get-ChildItem -Path "C:\Development\ps-practice" -File -Name
Write-Output "Script finished"
~~~

Save it as `report.ps1`. The name matters less than the ending. `.ps1` is what tells Windows and PowerShell that the file is a script, and it's the one you'll see on every script in this collection.

Save the file somewhere you can find it. Your practice folder is a good place, and you can create the file with a command, which you'll do in the exercise.

## Running a script by its path

Run a script by giving PowerShell its path. From the folder that holds the script, a path starting with `.\` means "the file here".

~~~powershell
.\report.ps1
~~~

~~~text
Output:

Script started
(the names of the files in the folder, if any)
Script finished
~~~

The `.\` matters. Type `report.ps1` on its own, and PowerShell looks for a command with that name, and not for a file in the folder you're in. That's a deliberate safety feature, because it stops a file in the current folder from running by accident when you typed the name of a real command.

A full path works from anywhere.

~~~powershell
& "C:\Development\ps-practice\report.ps1"
~~~

~~~text
Output:

Script started
(the names of the files in the folder, if any)
Script finished
~~~

The `&` is the call operator. It says "run whatever this path points to". You'll use it more in the next step, when one script calls another.

## The execution policy

Windows has a setting that decides which scripts PowerShell will run. It's called the execution policy, and it's there to slow down scripts you didn't write, such as ones downloaded from the internet.

Check the setting with `Get-ExecutionPolicy`.

~~~powershell
Get-ExecutionPolicy
~~~

~~~text
Output:

RemoteSigned
~~~

Your answer may be different, and that's normal. The common values are `Restricted`, which stops all scripts, `RemoteSigned`, which runs local scripts and checks downloaded ones, and `Bypass`, which runs everything with no checks.

If your policy is `Restricted`, scripts won't run at all, and the error says so. You can change the policy for your user account with `Set-ExecutionPolicy`, but that's a setting you should understand before you change it.

## Running one script without changing the policy

When you need to run a single script and don't want to change anything, tell PowerShell to bypass the policy for that one run.

~~~powershell
powershell -NoProfile -ExecutionPolicy Bypass -File ".\report.ps1"
~~~

~~~text
Output:

Script started
(the names of the files in the folder, if any)
Script finished
~~~

That's the command the setup scripts use, and the reader uses it to run your exercises. The setting applies to this run only, and nothing on the computer is changed afterwards. Use it when you're running a script you trust, and understand what it does first.

> **Aside: the script that wouldn't run.**
> A script that works on one computer and fails on another is very often an execution policy problem. The error mentions "running scripts is disabled" or a similar phrase. Check `Get-ExecutionPolicy`, and if it says `Restricted`, the bypass form above is the quickest way to get going.

## Try it

This exercise writes a small script, runs it, and checks its output. The check compares the two lines the script prints.

Write your lines in the starter file, below the comment. Your script must print two lines, in this order:

1. `Script started`
2. `Script finished`

The reader runs your script with the bypass form of the command, so the policy won't stop it. The exercise is about the script itself: two `Write-Output` lines, one after the other.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Forgetting one of the lines, or changing the capital letters or spacing in one of the sentences. The check compares the text exactly, so `Script Started` with a capital S doesn't match.

---
