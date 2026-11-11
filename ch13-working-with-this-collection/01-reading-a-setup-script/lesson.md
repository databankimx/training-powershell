# 1. Reading a Setup Script

Each tutorial in this collection starts with a setup script, usually called `setup.ps1`. It's the first thing you run, and it's the first real script most learners read. This step walks through its parts, so you can tell what each one is for before you run it.

## The parts of a setup script

A setup script is laid out in the same order every time, and that order is a good thing to learn. The examples below are short extracts from the pattern, not the full scripts.

The script starts with a header comment, which says what the script does and how to run it. That's the block from Chapter 7, and it's what `Get-Help` would show.

~~~powershell
# setup.ps1
#
# Prepares the tutorial. Run it from anywhere:
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\setup.ps1
~~~

Next comes a `param` block. Most setup scripts take one switch, `-SkipInstall`, which checks everything without installing anything.

~~~powershell
param(
    [switch]$SkipInstall
)
~~~

Then comes a set of small helper functions. They keep the steps short, and they keep the messages the same everywhere. The most important one is the function that stops the script when something is wrong.

~~~powershell
function Stop-Setup([string]$message) {
    Write-Host ""
    Write-Host "SETUP STOPPED: $message" -ForegroundColor Red
    Write-Host "Fix the problem above, then run this script again. Steps already done are skipped."
    exit 1
}
~~~

`Stop-Setup` prints a message in red, tells you what to do next, and exits with code 1. The `exit 1` matters, because it tells anything that ran the script that it failed. The phrase "Steps already done are skipped" is a promise: the script is safe to run again.

Last comes the sequence of numbered steps. Each one prints its heading, checks something, and either moves on or calls `Stop-Setup`.

~~~powershell
Write-Host "== 1. Node.js =="
$nodeExe = Find-Program 'node' $nodeCandidates
if (-not $nodeExe) {
    Stop-Setup "Node.js isn't installed."
}
~~~

## Why the pattern is worth knowing

Every script in the collection follows this order, so once you've read one, the others are quicker to follow. Look for the header, the switch, the helpers, and then the numbered steps. When something fails, the steps tell you which part of the setup stopped, and the message tells you what to do.

> **Aside: the script that only looks long.**
> A setup script can run to several hundred lines, and most of that is checks and messages. Read the helper functions first, then read the numbered steps. The long middle becomes a list of checks, each with a clear message if it fails.

## Try it

This exercise rebuilds the stop helper from the pattern above, and calls it with a message. The check compares the output.

Write your script in the starter file, below the comment. It must:

1. Define a function called `Stop-Setup` that takes `[string]$message`.
2. Inside the function, print `SETUP STOPPED: ` followed by `$message`, using `Write-Output`.
3. Call `Stop-Setup -message "Git is missing"`.

The expected output is `SETUP STOPPED: Git is missing`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Calling the function without the parameter name, or putting the message inside the function body as text. The call should read `Stop-Setup -message "Git is missing"`, and the function should print `$message`, not the word itself.

---
