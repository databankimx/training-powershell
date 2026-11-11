# 2. Getting Help

PowerShell ships with help for every command, and it's the best teacher you'll have. Most people don't read it, because the first screen can look like a legal document. This step shows you how to read it, and which parts to read first.

## The short version

`Get-Help` followed by a command name shows its help. Here's the help for `Clear-Host`, a command that clears the window.

~~~powershell
Get-Help Clear-Host
~~~

~~~text
Output:

NAME
    Clear-Host

SYNOPSIS
    Clears the display in the host program.

SYNTAX
    Clear-Host [<CommonParameters>]
~~~

The page has sections, and each one answers a question. `NAME` says what the command is called. `SYNOPSIS` is one sentence saying what it does. `SYNTAX` shows the shape of the command, with the parameters in brackets, and anything in square brackets is optional.

That's enough to use most commands. The other sections add detail when you need it.

## Seeing examples

The `SYNOPSIS` says what a command does. The examples show how people actually use it, and they're often the quickest way to learn. Add `-Examples`.

~~~powershell
Get-Help Get-ChildItem -Examples
~~~

~~~text
Output:

NAME
    Get-ChildItem

    -------------------------- EXAMPLE 1 --------------------------

    PS C:\>Get-ChildItem

    Directory: C:\

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        9/30/2025   4:12 PM                Program Files
...
~~~

Each example shows a line you can type, and then what it prints. The output in the example is only illustrative. Your computer's folders will differ, but the layout will be the same. Examples are the part of the help that most people use, so read them first.

> **Aside: the help that wasn't installed.**
> Some help pages are short when they first arrive, and the examples can be missing. `Update-Help` downloads the full pages. It needs an internet connection and it takes a minute, so it's a sensible thing to run once, but nothing in this tutorial depends on it. The `Clear-Host` page above is complete without it.

## Asking for one part

`-Parameter` shows the help for a single parameter, which is handy when a command has dozens of them.

~~~powershell
Get-Help Get-ChildItem -Parameter Filter
~~~

~~~text
Output:

-Filter <String>
    Specifies a filter to qualify the Path parameter...
~~~

The text is cut short here, and the full entry says what the parameter accepts and what it does. The question to ask of any parameter is what it expects as a value, and the help answers that in the first line.

## Getting the full page

`-Full` shows every section, including parameter detail and related commands. It's long, so use it when the short version doesn't answer your question, and scroll with care.

~~~powershell
Get-Help Get-ChildItem -Full
~~~

~~~text
Output:

NAME
    Get-ChildItem
...
~~~

## Getting the help as an object

Help is an object as well, so you can pick out one piece with a dot, as you did with `Get-Command` in the last step.

~~~powershell
(Get-Help Clear-Host).Name
~~~

~~~text
Output:

Clear-Host
~~~

~~~powershell
(Get-Help Clear-Host).Synopsis
~~~

~~~text
Output:

Clears the display in the host program.
~~~

This is the form scripts use. A script that needs to know what a command does can ask for the synopsis, and print it, without anyone reading the page.

## Try it

This exercise reads the name of a command from its help page, and prints it in a sentence. The check compares the sentence exactly.

Write one line in the starter file, below the comment. It should print:

~~~text
Help for: Clear-Host
~~~

Use `Write-Output`, with `(Get-Help Clear-Host).Name` inside `$(...)` in double quotes. Keep the words `Help for:` and the space after them exactly as shown.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Reading the whole `-Full` page to find one answer. Start with `-Examples`, or pick out a single property with a dot. Most questions need one line, not the whole page.

---
