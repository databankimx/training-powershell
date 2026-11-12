# 4. Summary: Scripts

You can now save commands as a `.ps1` file, run it by its path, and call one script from another. You know what the execution policy is for, why `.\` matters, and how a script finds the files beside it. You also know how to leave notes for the next reader, and how to ask for the help a script carries.

## What you learned

- A script is commands in a text file, saved with a `.ps1` ending.
- Run a script with `.\name.ps1` from its folder, or with a full path and the call operator `&` from anywhere.
- `.\` is needed in front of a script's name, because a bare name looks for a command.
- `Get-ExecutionPolicy` shows the policy. `-ExecutionPolicy Bypass` runs one script without changing it.
- The `&` call operator runs a script, and it returns whatever the script writes.
- A variable can capture a script's output. Anything a helper writes goes to its caller.
- `$PSScriptRoot` is the folder that holds the running script, and `Join-Path` builds a path from it.
- A full path or a path from `$PSScriptRoot` avoids depending on where the script was started.
- `#` starts a comment, and `<# #>` makes a block comment. Comments say why, not what.
- `#Requires -Version 7.0` stops the script early, with a clear message, on the wrong version.
- A block comment with `.SYNOPSIS` and `.DESCRIPTION` becomes the script's help, which `Get-Help` shows.

## Try it

This exercise writes a small script, calls it, and prints what it returned. Your script must:

1. Write a helper called `greet.ps1` into `C:\Development\ps-practice`. Its only line is `Write-Output "Hello from greet"`, wrapped in single quotes.
2. Call the helper with `&`, using its full path, and store the result in `$message`.
3. Print `Greeting: ` followed by `$message`.

The expected output is `Greeting: Hello from greet`. The check also confirms that `greet.ps1` exists, with the text the helper prints.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample and the file.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

## Quizzes

Three questions, one for each big idea in the chapter. Pick an answer, and read the explanation whichever way it goes.

```quiz
You type report.ps1 in the folder that holds it, and PowerShell says it can't find the command. What should you type instead?
○ report
→ That's the name without its ending, which PowerShell doesn't look for.
◉ .\report.ps1
→ Right. The .\ tells PowerShell to run the file in this folder, and not look for a command of that name.
○ report.ps1 --run
→ There's no --run switch for scripts. The path with .\ in front is enough.
```

```quiz
Why does a helper's Write-Output line appear as the result when the caller stores the call in a variable?
◉ Anything a script writes goes back to its caller, so storing the call keeps that output.
→ Right. The call returns what the helper writes, and the variable holds it.
○ The helper writes its output to a file, and the caller reads the file.
→ Not quite. No file is involved. The output goes straight back to whoever called the script.
○ Variables can only hold text that a command typed by hand.
→ Variables can hold any value a command returns, including the output of a script.
```

```quiz
A script needs a file that sits in the same folder as the script itself. What is the reliable way to build its path?
○ Write the path in full with the drive letter, and never change it.
→ That works on one computer, and fails the moment the folder moves. Build it from the script's own location.
○ Use a relative path, such as .\settings.txt, and hope the script runs from the right folder.
→ That depends on where the script was started from, which is the risk a relative path carries.
◉ Join $PSScriptRoot with the file name using Join-Path.
→ Right. $PSScriptRoot is the folder that holds the running script, so the path is correct wherever the script was started from.
```

---
