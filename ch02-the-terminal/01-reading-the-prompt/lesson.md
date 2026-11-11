# 1. Reading the Prompt

Every terminal window starts with a line of text, followed by a blinking cursor. That line is the prompt, and it's the terminal's way of saying "I'm ready, and here's where I am." Most people ignore it until they're lost, and then they wish they'd read it sooner.

## What the prompt says

A PowerShell 7 prompt usually looks something like this:

~~~text
PS C:\Users\jane>
~~~

Read it from left to right. `PS` means PowerShell, so you know which shell you're in. `C:\Users\jane` is the folder you're in right now, which PowerShell calls the current location. The `>` is the sign that the shell is waiting for you.

The prompt shows your own user name, and it may look different if someone has customized it. The parts that matter are the same: the shell's name, and the folder you're in.

Here's a prompt in the practice folder, for example.

~~~text
PS C:\Development\ps-practice>
~~~

That's the folder the exercises use, so the prompt tells you where your commands will land. Check it before you type anything you'd be sorry to see land in the wrong place.

## Finding out where you are

The prompt shows the location, but you can also ask for it directly. `Get-Location` prints the current location, and `pwd` is its short name, which you'll see often.

~~~powershell
Get-Location
~~~

~~~text
Output:

Path
----
C:\Users\jane
~~~

~~~powershell
pwd
~~~

~~~text
Output:

Path
----
C:\Users\jane
~~~

The two commands do the same job, and the output is the same. `pwd` is quicker to type, and `Get-Location` is clearer in a script. Use whichever you'll remember.

The output is a table with one column, which is the path. If you want the path alone, without the header, ask for the `Path` property directly.

~~~powershell
(Get-Location).Path
~~~

~~~text
Output:

C:\Users\jane
~~~

The brackets run `Get-Location` first, and the `.Path` after them picks out the one piece you want. You'll use this pattern a lot. Chapter 6 explains properties properly.

> **Aside: why the prompt isn't always the truth.**
> The prompt shows the location of the window it's in. A script that changes folders doesn't change the prompt of the window you're typing in, because the script works in its own space. If your commands and the prompt seem to disagree, check the window you're in, and check whether a script ran in it.

## Try it

This exercise moves to the practice folder, then prints where it is. The output tells the check you really got there.

Write your lines in the starter file, below the comment:

1. A `Set-Location` line that moves to `C:\Development\ps-practice`. Its short name is `cd`, but use `Set-Location` here, so the line says what it does.
2. A `Write-Output` line that prints `Now in: ` followed by the path from `Get-Location`, using `(Get-Location).Path` inside `$(...)`.

The expected output is `Now in: C:\Development\ps-practice`. The check doesn't look at files, so the practice folder doesn't need anything in it.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Reading the prompt in a window that was open before you changed anything. The prompt is correct for that window, but a new window may start somewhere else. Open a fresh window if the prompt and the lesson disagree.

---
