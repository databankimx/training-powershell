# 3. Moving Around

Moving around the terminal is the skill you'll use most in this tutorial, and the one that saves the most time once it's automatic. Most of it comes down to four ideas: changing folder, going back up, listing what's here, and letting the shell finish what you start typing.

## Changing folder with cd

`cd` changes your current location. It's short for "change directory", and it's the command most people learn first. In PowerShell, `Set-Location` does the same job, and `cd` is an alias for it, so both work.

~~~powershell
cd "C:\Development\ps-practice"
pwd
~~~

~~~text
Output:

Path
----
C:\Development\ps-practice
~~~

The prompt changes to match, so you can always see where you are. Quotation marks around the path are good practice, because a path with a space in it needs them. You'll meet that rule properly in Chapter 5.

## Going back up with cd ..

Two dots mean "the folder above". Use them to step out of the folder you're in.

~~~powershell
cd ..
pwd
~~~

~~~text
Output:

Path
----
C:\Development
~~~

Each `cd ..` climbs one level. Repeat it to go further up, and `cd \` goes straight to the top of the drive.

~~~powershell
cd \
pwd
~~~

~~~text
Output:

Path
----
C:\
~~~

`cd -` goes back to the folder you were in before. It's a handy way to hop between two places without typing either path twice.

## Listing what's here

You already know `Get-ChildItem`. In a terminal, you'll more often type one of its shorter names, which all do the same job.

~~~powershell
ls
~~~

~~~text
Output:

    Directory: C:\

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        11/10/2026   9:00 AM                Development
d-----        11/10/2026   9:00 AM                Users
~~~

`ls` and `dir` are both short names for `Get-ChildItem`. They exist because people typed them for decades, and PowerShell kept them so the habit still works. In a script, use `Get-ChildItem`, because it says what it does. At the prompt, use whichever you like.

Your folders will differ from the example, but the table is the same shape.

## Letting the shell finish for you

Type the first few letters of a name, then press Tab. PowerShell completes the name if it's the only match. If there are several, press Tab again to cycle through them.

~~~text
PS C:\> cd Dev
~~~

After pressing Tab, the line reads:

~~~text
PS C:\> cd Development
~~~

Tab completion saves typing and avoids spelling mistakes, and it's the single most useful thing to learn in this chapter. Get into the habit of starting a path and pressing Tab before you type the rest.

## Your command history

PowerShell remembers the commands you've run. The Up arrow brings back the last one, and Up again goes further back. Down goes forward. Once you find the command you want, press Enter to run it, or edit it first.

For a longer search, press Ctrl+R and start typing a few letters from the command you want. PowerShell searches the history for a match, and Ctrl+R again moves to an older one.

~~~text
(reverse-i-search)`ps-prac': Set-Location "C:\Development\ps-practice"
~~~

That's the search at work, with the match shown in the prompt line. Press Enter to run the match, or Escape to leave the search.

> **Aside: clearing the screen.**
> `Clear-Host` clears the window, and `cls` is its short name. Clearing doesn't change anything else, so use it whenever the screen is cluttered. It won't delete your history, so the Up arrow still works afterwards.

## Try it

This exercise moves into the practice folder, then back out, and reports where it ended up. The check looks at the sentence.

Write your lines in the starter file, below the comment:

1. A `Set-Location` line that moves to `C:\Development\ps-practice`.
2. A `Set-Location` line that moves up one folder, using `..`.
3. A `Write-Output` line that prints `Back in: ` followed by the path from `Get-Location`, using `(Get-Location).Path` inside `$(...)`.

The expected output is `Back in: C:\Development`. The check doesn't look at files, so nothing needs to be in the practice folder.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Forgetting that `..` is relative to where you are. If you're already in `C:\Development`, `..` takes you to `C:\`, not to the practice folder's parent. Go back and check the first line of your script.

---
