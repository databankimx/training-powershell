# 1. Setting Up Your Terminal

This chapter gets your terminal ready for the rest of the tutorial. It takes about twenty minutes, most of it waiting for an installer to finish. You'll install the right version of PowerShell, make Windows Terminal open it by default, and set up a folder to practice in. None of it is hard, but all of it matters, because every later exercise assumes these three things are in place.

## Two PowerShells, one name

Windows has two programs that people call PowerShell. Both are shells, both run scripts, and both will confuse you if you don't know which one you're using.

- **Windows PowerShell 5.1.** It came with Windows, and you'll see it in old tutorials and old scripts. Its command is `powershell`. It's stable, and it's not going anywhere, but Microsoft no longer adds features to it.
- **PowerShell 7.** It's newer, it runs on Windows, macOS, and Linux, and it gets the new features. Its command is `pwsh`, which is short for PowerShell, and it doesn't replace the older one. The two sit side by side on the same computer.

This tutorial teaches PowerShell 7, and the collection's setup scripts use it. The older one will still open if you type `powershell`, and that's fine, but it's the wrong tool for the rest of this course.

The easiest way to tell them apart is to ask. Type this, and read what comes back.

~~~powershell
$PSVersionTable.PSVersion
~~~

~~~text
Output:

Major  Minor  Patch  PreReleaseLabel BuildLabel
-----  -----  -----  --------------- ----------
7      6      9
~~~

The number under `Major` is what matters. A 7 means you're in PowerShell 7. A 5 means you're in Windows PowerShell, which is the older one, and you need to open PowerShell 7 instead. The minor and patch numbers will be whatever version you installed, so don't worry if yours differ from the example.

You may also see this command, which shows the edition.

~~~powershell
$PSVersionTable.PSEdition
~~~

~~~text
Output:

Core
~~~

`Core` means PowerShell 7. `Desktop` means Windows PowerShell 5.1. Read the edition if the version number is unclear. Both are ways of asking the same question.

> **Aside: why the two names are a trap.**
> The command you type is `powershell` for the old one and `pwsh` for the new one. People type `powershell`, get the old shell, and then wonder why a script that worked in a tutorial fails for them. It's a naming mistake, not a learning mistake, and it catches experienced people too. The version check above is the cure.

## Installing PowerShell 7

The setup script installs PowerShell 7 for you, using winget. If you want to do it yourself, or you want to know what the script did, this is the command.

~~~powershell
winget install --id Microsoft.PowerShell --exact
~~~

~~~text
Output:

Found PowerShell [Microsoft.PowerShell] Version 7.6.9
This application is licensed to you by its owner.
Downloading https://github.com/PowerShell/PowerShell/releases/download/...
Successfully installed
~~~

Winget is the Windows package manager. It downloads a program from a trusted source, checks it, and installs it. The `--id` names the program, and `--exact` tells winget to match that name exactly, rather than guessing. Without `--exact`, winget may find a similar name and install the wrong thing, which is the sort of surprise nobody enjoys.

If winget says a program is already installed, that's good news. Running the command again does no harm.

Once it finishes, open a new PowerShell window, because the one you're in won't know about the new program yet. Then type the version check again. You should see a 7.

> **Aside: why a new window.**
> A program installed in one window isn't always visible in windows that were already open. The shell reads the list of places to look for programs when it starts, and a window opened before the install has the old list. Closing it and opening a new one is the simplest fix, and you'll meet the same problem again in Chapter 11.

## Running the version check in a script

Typing the check by hand is useful once. A script can do it for you, and it's the first thing you'll write in this tutorial. Scripts are text files that contain commands, and you run them by giving PowerShell the file's path. You'll learn all of that properly in Chapter 7, so don't worry about the details yet.

This exercise asks you to write one line that prints the major version. Here's the line you'll type, so you can see what a finished version looks like in practice.

~~~powershell
Write-Output "PowerShell major version: $($PSVersionTable.PSVersion.Major)"
~~~

~~~text
Output:

PowerShell major version: 7
~~~

Two things in that line are new. `Write-Output` prints whatever comes after it. The text in double quotes is a string, and the `$(...)` part is replaced by the value inside the brackets. You'll meet both properly in Chapter 5. For now, notice that the output is the sentence, with the 7 filled in.

## Try it

The starter file has a comment, which is a line PowerShell ignores. Write your line below the comment, so that running the script prints the sentence above, with your own major version. If you're in PowerShell 7, your result will say 7.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample. The check looks at the words and the number, so the spacing and the capital letters have to match.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Writing the line in single quotes. Single quotes print the dollar sign and the brackets as they are, and the number never appears. Double quotes are what make the value appear. The hint says so, and so does Chapter 5.

---
