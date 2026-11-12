# 3. Running from the Right Folder

Most of the quickstarts in this collection end with a command such as `npm start`, and most of them say which folder to run it from. That's not a formality. `npm start` looks for a file called `package.json` in the folder you're in, and if it isn't there, the command fails. The fix is almost always to move to the right folder first.

## Why the folder matters

A tutorial's root folder and its runner folder are different places. The root holds the README, the setup script, and the quickstart. The runner, in a folder called `lesson-runner`, holds the file that `npm` needs.

~~~powershell
cd C:\Development\training\training-markdown
npm start
~~~

~~~text
Output:

npm error code ENOENT
npm error path C:\Development\training\training-markdown\package.json
npm error errno -4058
npm error enoent Could not read package.json
~~~

The command failed because the root has no `package.json`. Move into the runner's folder, and the same command works.

~~~powershell
cd C:\Development\training\training-markdown\lesson-runner
npm start
~~~

The window opens, because `npm` finds the file it needs in the folder you're in.

## Checking where you are

Before running a command that depends on the folder, check where you are. `Get-Location` shows it, and `Split-Path -Leaf` keeps only the last part, which is often enough to confirm you're in the right place.

~~~powershell
Set-Location "C:\Development\training\training-markdown\lesson-runner"
Split-Path -Path (Get-Location).Path -Leaf
~~~

~~~text
Output:

lesson-runner
~~~

The last part of the path is the folder name, so `lesson-runner` tells you you're in the runner, not in the root.

## Relative and absolute again

The folder you need is easier to reach with a path from where you are, but a full path works from anywhere. Chapter 2 covered both. A quickstart that shows a full path is the safe choice, because it doesn't depend on where you started. A quickstart that says "run it from the runner's folder" depends on your following that instruction, and a check with `Get-Location` makes the instruction easy to follow.

> **Aside: the command that worked yesterday.**
> A command can fail in one window and work in another, because the windows are in different folders. If `npm start` worked yesterday and fails today, check the folder before you check anything else. The last command you ran may have moved you somewhere else.

## Try it

This exercise creates a `lesson-runner` folder in the practice folder, moves into it, and prints the folder name it ended up in. The check compares the line.

Write your lines in the starter file, below the comment:

1. A `New-Item` line that creates `C:\Development\ps-practice\lesson-runner`, using `-ItemType Directory`, `-Force`, and `-Path`, and ends with `| Out-Null`.
2. A `Set-Location` line that moves into that folder, using its full path.
3. A `Write-Output` line that prints `Working in: ` followed by the last part of the current path, using `Split-Path -Path (Get-Location).Path -Leaf` inside `$(...)`.

The expected output is `Working in: lesson-runner`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Leaving out `-Leaf`. Without it, `Split-Path` prints the whole path, which is correct but longer than the exercise expects. The check compares the folder name, so keep the switch.

---
