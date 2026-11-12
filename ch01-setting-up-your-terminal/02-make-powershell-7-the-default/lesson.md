# 2. Making PowerShell 7 the Default

Right now, if you open Windows Terminal and get a window, it may open Windows PowerShell 5.1 by default. That's a sensible choice for Windows, and a confusing one for this tutorial. You'd have to remember to pick the other option every time, and you'd forget. Everyone forgets. This step makes the choice once, so Windows Terminal opens PowerShell 7 every time after that.

## Terminal, shell, and profile

Windows Terminal is the window. It can host several shells, and each shell it can open is called a profile. One profile is the default, which is what opens when you press the new-window button. You're changing the default profile, not the shell itself, and that's a small distinction with a big effect on what you see.

Here's a quick way to check what you're currently getting. Open a new Windows Terminal window, and type the version check from the last step.

~~~powershell
$PSVersionTable.PSVersion.Major
~~~

~~~text
Output:

5
~~~

A 5 means the default is still Windows PowerShell. A 7 means you're done, and you can skip the next section.

## Setting the default

Windows Terminal's menus change between versions, so the names below may not match yours exactly. The steps stay the same, and you'll find the setting if you look for the word "Default".

1. Open Windows Terminal.
2. Open the settings. You can press Ctrl+comma, or use the small down arrow beside the tabs and choose Settings.
3. In the left-hand list, choose Startup.
4. Find the setting called Default profile, and open its drop-down list.
5. Choose PowerShell. Check that the name matches PowerShell 7, not Windows PowerShell. The profile for PowerShell 7 is usually named just PowerShell, and the old one is named Windows PowerShell.
6. Save the settings. Windows Terminal saves them as soon as you leave the page, so there's no Save button to find.

Close the window and open a new one. Then check the version again.

~~~powershell
$PSVersionTable.PSVersion.Major
~~~

~~~text
Output:

7
~~~

If you still see a 5, the drop-down probably picked the wrong profile. Go back to step 5 and read the names carefully. Windows Terminal can show two entries that look almost identical, and the wrong one is an easy click.

> **Aside: the settings file.**
> The settings page is a convenience. Windows Terminal stores the same choice in a settings file, and you can edit that file by hand if you ever need to. You won't need to in this tutorial, so the menus are enough. Chapter 11 explains why a change may not show up until you open a new window.

## Why a default matters

It might seem like a small thing. You'll open a terminal many times a day, and each time the default decides which shell you're in. If the default is the older shell, every script you run from that window runs in the older shell. Some of them will work. Some won't, and the error won't always tell you the shell was the problem.

Set it once, and you don't have to think about it again.

## Try it

This exercise checks that your PowerShell is the one this tutorial expects. Write a line that prints the edition. For PowerShell 7, the edition is `Core`, and it's in the same table as the version.

Your line should print exactly this:

~~~text
Edition: Core
~~~

Use `$PSVersionTable.PSEdition` for the value, and put it inside double quotes, with the word `Edition:` in front. Write it below the comment in the starter file.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Checking the version and forgetting to check the window. You can have PowerShell 7 open in one window and Windows PowerShell in another, because a window that opened before you changed the default is still the old one. Open a fresh window before you run the check.

---
