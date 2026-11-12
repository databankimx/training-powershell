# 1. Running a Program

A program is anything you start by name. PowerShell finds it on the `PATH`, which is the list of folders Windows searches for programs, runs it, and shows you what it prints. You can type the name directly, and the output appears as though PowerShell had printed it.

## Starting a program by name

The simplest case is a program whose name PowerShell can find. `where.exe` is one of those, and it's on every Windows computer. It reports where a program lives.

~~~powershell
where.exe cmd
~~~

~~~text
Output:

C:\Windows\System32\cmd.exe
~~~

The output is the program's own text, printed as it arrived. PowerShell didn't rewrite it, and it didn't try to turn it into an object. That's the first difference between a program and a PowerShell command, and it matters a great deal.

## Programs print text

Commands in PowerShell hand back objects, as you learned in Chapter 6. Programs don't. They print lines of text, and PowerShell receives those lines as plain strings.

~~~powershell
cmd /c echo Hello from a program
~~~

~~~text
Output:

Hello from a program
~~~

`cmd /c` runs the command that follows and then exits. Everything after `/c` is passed to `cmd`, which prints the words. You can see the same line whether you type it in a window or run it from a script.

## Using the output as text

Because a program's output is text, you can work with it using the string skills from Chapter 5, and the pipeline from Chapter 6, once you know its lines.

~~~powershell
cmd /c echo one two three | Measure-Object
~~~

~~~text
Output:

Count    : 1
~~~

The count is 1, because the program printed one line. Once the output is in the pipeline, PowerShell's tools can work on it, one line at a time. The program only supplies the text, and PowerShell decides what to do with it.

> **Aside: why a program's name can fail.**
> If you type the name of a program that isn't installed, PowerShell says it can't find a command with that name. The usual causes are a typo, a program that isn't on the `PATH`, or a window opened before the program was installed. Chapter 11 explains the `PATH` in detail, and the fix is the same one you used in Chapter 1: open a new window.

## Try it

This exercise runs a program, and shows what it prints. The check compares the line.

Write one line in the starter file, below the comment. It must run `cmd /c echo Ready from cmd`, so the output is:

~~~text
Ready from cmd
~~~

Type the command directly, without `Write-Output`. The program prints the text itself, and the check compares what appears.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Putting the words in quotation marks, such as `cmd /c echo "Ready from cmd"`. The quotation marks are passed through to `cmd` and printed with the text, so the output no longer matches. Leave them out for this exercise.

---
