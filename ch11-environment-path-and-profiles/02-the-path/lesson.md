# 2. The PATH

The `PATH` is the most important environment variable on Windows. It's a list of folders, separated by semicolons, and Windows searches them in order whenever you type the name of a program. When you type `git` or `node`, that's how Windows finds the program. If the folder holding it isn't on the `PATH`, the name isn't found, and you get the "not recognized" error from Chapter 1.

## Reading the PATH

Each entry in `$env:Path` is one folder. Split the list at the semicolons to see them one per line.

~~~powershell
$env:Path -split ';'
~~~

~~~text
Output:

C:\Program Files\PowerShell\7
C:\Windows\system32
C:\Windows
C:\Program Files\Git\cmd
~~~

Your list will be longer and different. The order matters, because Windows uses the first folder that holds a program with the name you typed. Two folders can hold a program with the same name, and the earlier one wins.

## Two copies of the PATH

Windows keeps two lists. The machine PATH applies to every account on the computer, and the user PATH applies to your account. When a window opens, the two are joined into one list, and that joined list is what `$env:Path` holds.

Installers update one of these lists when they put a program on the computer. An installer may add a folder to the user PATH, or to the machine PATH if it was installed for everyone. A window that opened before the install still holds the old joined list, and it can't see the new folder.

That's the reason for the advice you've had since Chapter 1: open a new window after an install. The new window reads the saved lists again, and the new folder is there.

> **Aside: the PATH that was fixed by a reboot.**
> When a program can't be found after an install, the usual cure is a new window. If the problem survives that, a restart of Windows makes sure every program starts with the current lists. A restart is a blunt tool, so try a new window first.

## Changing the PATH for this session

You can add a folder to the PATH for the current session. The change applies to this window and to programs it starts, and it's gone when the window closes.

~~~powershell
$env:Path = "C:\Development\ps-practice;" + $env:Path
$env:Path -split ';' | Select-Object -First 1
~~~

~~~text
Output:

C:\Development\ps-practice
~~~

The folder is first on the list, so Windows searches it before the others. The `+` joins the new folder and the old list, with the semicolon between them.

## Checking whether a folder is on the PATH

To check whether a folder is on the list, split the PATH and look for the folder with `-contains`.

~~~powershell
$env:Path -split ';' -contains "C:\Development\ps-practice"
~~~

~~~text
Output:

True
~~~

`-contains` checks a list for one value, and it answers `True` or `False`. It's the same yes-or-no style you met with `Test-Path`, applied to the list of folders.

## Try it

This exercise adds the practice folder to the PATH for the current session, then checks that it's there. The check compares the line, and nothing is saved.

Write two lines in the starter file, below the comment:

1. A line that puts `C:\Development\ps-practice;` in front of the existing `$env:Path`. Use `$env:Path = "C:\Development\ps-practice;" + $env:Path`.
2. A `Write-Output` line that prints `On PATH: ` followed by the result of `$env:Path -split ';' -contains "C:\Development\ps-practice"`, using `$(...)` inside double quotes.

The expected output is `On PATH: True`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Setting `$env:Path` to just the new folder, without adding the old list. The session then has only one folder on its PATH, and every program that isn't in that folder stops being found. Always add to the existing value with `+`.

---
