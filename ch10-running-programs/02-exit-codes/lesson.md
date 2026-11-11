# 2. Exit Codes

When a program finishes, it reports a number called its exit code. By convention, `0` means it succeeded, and any other number means something went wrong. The number is how a program tells a script the result, when it doesn't want to rely on the text it printed.

Exit codes are the most reliable way to check a program's work. Text can change between versions, and a program can print something cheerful while failing. The number is what the program promises.

## Finding the exit code

PowerShell keeps the exit code of the last program it ran in a variable called `$LASTEXITCODE`.

~~~powershell
cmd /c "exit 0"
Write-Output "Exit code: $LASTEXITCODE"
~~~

~~~text
Output:

Exit code: 0
~~~

`exit 0` tells `cmd` to finish with the code zero, which is success, and `$LASTEXITCODE` then holds that zero. The variable is refreshed after every program, so read it straight after the program you want to check.

~~~powershell
cmd /c "exit 3"
Write-Output "Exit code: $LASTEXITCODE"
~~~

~~~text
Output:

Exit code: 3
~~~

A program that fails reports a non-zero number, and this program chose three. The number means whatever the program's authors decided, so the documentation for each tool is the place to look up what each code means.

## Acting on the exit code

A script usually does something different depending on the result, and an `if` line on `$LASTEXITCODE` is the simplest way to do it.

~~~powershell
cmd /c "exit 3"
if ($LASTEXITCODE -eq 0) {
    Write-Output "Step passed"
} else {
    Write-Output "Step failed with code $LASTEXITCODE"
}
~~~

~~~text
Output:

Step failed with code 3
~~~

The `-eq` test compares the code with zero. If they match, the step passed. Anything else is a failure, and the message says which code it was.

> **Aside: the zero that wasn't success.**
> Some programs exit with zero even when they've failed, usually because they were written before exit codes were taken seriously. For those, the text of the output is the only other clue. Check the documentation for a tool before you rely on its exit code, and when a tool's codes don't make sense, test it on a failure you can cause on purpose.

## Try it

This exercise runs a program that exits with a code, reads the code, and prints it. The check compares the sentence.

Write two lines in the starter file, below the comment:

1. A `cmd /c` line that runs `exit 3`, with the command in double quotes, as in the examples.
2. A `Write-Output` line that prints `Exit code: ` followed by `$LASTEXITCODE`, using `$(...)` or a variable in double quotes.

The expected output is `Exit code: 3`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Running a second program before reading `$LASTEXITCODE`, which overwrites it. Read the variable on the line straight after the program you're checking, and nowhere else.

---
