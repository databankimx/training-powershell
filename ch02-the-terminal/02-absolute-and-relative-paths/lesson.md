# 2. Absolute and Relative Paths

A path is the address of a file or folder. Every file on your computer has one, and it's the thing you type whenever you want PowerShell to find something. There are two ways to write a path, and mixing them up is the source of more confusion in this tutorial than almost anything else.

## Absolute paths

An absolute path starts from the top of the drive. On Windows, that means it starts with a drive letter, such as `C:`, and then the folders in order, separated by backslashes.

~~~text
C:\Development\ps-practice\notes.txt
~~~

Read it from the left. `C:` is the drive, the first `\` leads into `Development`, the next leads into `ps-practice`, and the file is `notes.txt`. Wherever you are, that path means the same file.

An absolute path is the safe choice in a script. It doesn't matter where the script was started from, and it always points to the same place. You used absolute paths all through Chapter 4, and that's why.

## Relative paths

A relative path starts from wherever you are right now. It doesn't have a drive letter, and it doesn't start with a backslash.

If you're in `C:\Development\ps-practice`, this path points to the same file as the example above.

~~~text
notes.txt
~~~

Nothing else is needed, because the computer already knows the starting folder. Move somewhere else, and the same relative path points to a different file, which is the whole point of having one, and the whole reason it can go wrong.

## The two special names

Two shorthand names come up in relative paths, and you'll see them everywhere.

- `.` means the current folder.
- `..` means the folder above the current one.

~~~text
.\notes.txt
~~~

That's the same as `notes.txt`, with the current folder named out loud. It's useful in scripts that show where they're looking.

~~~text
..\notes.txt
~~~

That's the file called `notes.txt` one folder up. If you're in `C:\Development\ps-practice\reports`, then `..\notes.txt` points to `C:\Development\ps-practice\notes.txt`.

## Which kind to use

Use an absolute path when a script must always find the same thing, and when the script might be started from anywhere. Use a relative path when you're typing at the prompt and you're already in the right place, because it's shorter. A relative path inside a script is the reason a file ends up somewhere you didn't expect, so when you write one, make sure the folder it starts from is the one you intend.

> **Aside: the file in the wrong place.**
> A relative path in a script depends on where the script is running, which isn't always where you'd expect. The Chapter 4 exercises were built with this in mind. A file written with a bare name goes into the script's own working folder, and the check doesn't look there. The fix is an absolute path, which is why every exercise in Chapter 4 used one.

## Seeing a path for yourself

Two commands help you check a path before you use it. `Resolve-Path` turns a relative path into the full absolute one, so you can see where it really points.

~~~powershell
Set-Location "C:\Development\ps-practice"
Resolve-Path "..\ps-practice"
~~~

~~~text
Output:

Path
----
C:\Development\ps-practice
~~~

`Test-Path` tells you whether the path exists, which you met in Chapter 4.

~~~powershell
Test-Path "..\ps-practice"
~~~

~~~text
Output:

True
~~~

If `Resolve-Path` gives you a different folder than you meant, the relative path is the problem, not the command.

## Try it

This exercise uses a relative path on purpose, and the check tests the route. Your script must:

1. Create a folder called `reports` inside `C:\Development\ps-practice`, using an absolute path.
2. Move into `reports` with `Set-Location`, using the full path to that folder.
3. Write a file called `summary.txt` in the current folder, using only the name, not a path, with the text `Summary written`.
4. Print the sentence `Summary written in reports`.

The check confirms the sentence, and that `reports\summary.txt` holds the text `Summary written`. Notice that step 3 is the only one where a bare name is safe, because step 2 has already moved the script into the right folder.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample and the file.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Writing the file with a bare name before you move into the folder. The file lands in the folder you started from, the check looks in `reports`, and it's missing. Move first, then write.

---
