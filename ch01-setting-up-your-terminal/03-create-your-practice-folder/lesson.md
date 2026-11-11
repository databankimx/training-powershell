# 3. Creating Your Practice Folder

Every exercise in this tutorial works in a practice folder. It's a place where scripts can create and change files without touching anything you care about, and it keeps the exercises tidy. You'll be able to see exactly what each one did, and you'll be able to delete the whole thing when you're finished.

The lessons use this folder:

~~~text
C:\Development\ps-practice
~~~

That's the only path you need to remember for now. It's the one the commands in the lessons point to, and the reader creates it for you when an exercise needs it.

## You can use any folder

If you'd prefer a different folder, go ahead. Put it somewhere you can find again, such as under your Documents folder, and remember where it is. Then, whenever a lesson shows `C:\Development\ps-practice`, read it as your own path instead.

The one thing to avoid is a folder that's shared with other people, or one that holds files you need. A practice folder is for experiments. If a script goes wrong in a folder with your tax returns in it, nobody will be impressed.

Some examples use a path with spaces in it, so you'll see quotation marks around paths. Your own path can have spaces too, as long as the quotation marks are there. Chapter 5 explains why.

## Making the folder by hand

You can create the folder with File Explorer. Right-click in the place you want it, choose New, then Folder, and name it `ps-practice`. That works fine.

PowerShell can do the same job, and it's worth seeing the command once, because the exercise below uses it.

~~~powershell
New-Item -ItemType Directory -Path "C:\Development\ps-practice"
~~~

~~~text
Output:

    Directory: C:\Development

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        11/10/2026   9:14 AM                ps-practice
~~~

`New-Item` makes something new. `-ItemType Directory` says the something is a folder. `-Path` says where. The output is a small table describing what was made, and the date will match your computer, not the example.

If the folder already exists, that command fails with an error, which is annoying if you're just checking. The `-Force` switch tells `New-Item` to carry on quietly when the folder is already there.

~~~powershell
New-Item -ItemType Directory -Force -Path "C:\Development\ps-practice"
~~~

~~~text
Output:

    Directory: C:\Development

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        11/10/2026   9:14 AM                ps-practice
~~~

> **Aside: the table nobody asked for.**
> By default, PowerShell prints the object a command makes, which is why you see the table. The exercise below throws that table away with `| Out-Null`. The pipe and the word after it are new, and you'll meet both properly in Chapter 6. For now, read `| Out-Null` as "don't show me that". It's a useful habit for a script that makes things, because a script's output is what a check compares, and nobody wants a table in the middle of a sentence.

## Checking that it worked

You can look in File Explorer, or you can ask PowerShell. The `Test-Path` command answers yes or no about a path, and you'll use it a lot in later chapters.

~~~powershell
Test-Path "C:\Development\ps-practice"
~~~

~~~text
Output:

True
~~~

`True` means the path exists. `False` means it doesn't. Notice the answer is a word that PowerShell understands, not a sentence you'd type yourself. Chapter 4 covers that style in full.

## Try it

This exercise creates the practice folder, then prints a sentence to say it's ready. Write two lines in the starter file, below the comment:

1. A `New-Item` line that creates `C:\Development\ps-practice`, using `-ItemType Directory`, `-Force`, and `-Path`, and ends with `| Out-Null`.
2. A `Write-Output` line that prints the words `Practice folder ready`, exactly as written.

The check compares the printed sentence, and it doesn't look at the folder. Still, make the folder, because the next lessons depend on it being there.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Leaving out `-Force` and running the exercise twice. The second run fails because the folder already exists, and the error message is accurate, but it isn't very friendly. Add `-Force` and it stops complaining.

---
