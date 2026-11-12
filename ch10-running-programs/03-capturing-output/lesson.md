# 3. Capturing Output

Printing a program's output is fine when you only want to see it. A script usually wants to use it: to read a version, to pick out a name, or to check that a line says what it should. Storing the output in a variable does that, and the rest of the chapter depends on it.

## Storing the output

Put the program in a variable assignment, and its output goes into the variable instead of onto the screen.

~~~powershell
$found = cmd /c echo found
Write-Output "Captured: $found"
~~~

~~~text
Output:

Captured: found
~~~

The program printed `found`, and the assignment took it. Nothing reached the screen until the `Write-Output` line used the variable.

## Output with more than one line

A program that prints several lines gives you several values. PowerShell stores them as a list, which you can count, index, and loop through.

~~~powershell
$lines = cmd /c "echo first && echo second"
Write-Output "Lines: $($lines.Count)"
Write-Output "Second line: $($lines[1])"
~~~

~~~text
Output:

Lines: 2
Second line: second
~~~

The `&&` in the `cmd` command means "and then", so both `echo` commands run. You'll see the list and its positions again when you work with files in later chapters.

## Errors go somewhere else

Programs send their normal output to one place and their error messages to another. PowerShell shows the second kind in red, and it doesn't put them in a variable by default. To include the error text with the normal output, add `2>&1`, which joins the two streams.

~~~powershell
$all = cmd /c "echo normal text && echo problem text 1>&2" 2>&1
Write-Output "Got $($all.Count) lines"
~~~

~~~text
Output:

Got 2 lines
~~~

The `1>&2` sends the second `echo` to the error stream, and `2>&1` brings it back into the output. Without `2>&1`, the error line would appear on the screen in red, and it wouldn't be in `$all`. A script that needs to check for errors should capture both streams, and then look at the text.

> **Aside: the output that looked empty.**
> A program can print nothing and still succeed, and a variable holding nothing is just empty. Check the exit code as well as the output, because an empty result from a program that failed looks identical to one that succeeded. The exit code tells you which it was.

## Try it

This exercise stores a program's output, then prints it in a sentence. The check compares the line.

Write two lines in the starter file, below the comment:

1. A line that stores the output of `cmd /c echo found` in a variable called `$found`.
2. A `Write-Output` line that prints `Captured: ` followed by `$found`.

The expected output is `Captured: found`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Writing `Write-Output cmd /c echo found` without a variable. The program runs, prints straight to the screen, and nothing is stored. Put `$found =` in front of the program.

---
