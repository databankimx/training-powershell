# 4. Deleting Safely

Deleting is the one thing in this chapter that can't be undone with a click. Files you delete in File Explorer go to the Recycle Bin, where you can get them back. `Remove-Item` doesn't do that. It removes the file, and the file is gone. Some people find that thrilling, and most of them have a sad story about it.

This step is about deleting carefully. You'll look before you delete, preview the change, and take the smallest step that does the job. None of that is hard, and all of it is worth doing every time.

## The examples in this step

The examples assume three files in the practice folder. Make them with these lines, which you've seen before.

~~~powershell
Set-Content -Path "C:\Development\ps-practice\old1.txt" -Value "old"
Set-Content -Path "C:\Development\ps-practice\old2.txt" -Value "old"
Set-Content -Path "C:\Development\ps-practice\keep.txt" -Value "keep"
~~~

~~~text
Output:

(nothing)
~~~

## Deleting a file with Remove-Item

`Remove-Item` deletes what you name. Here it is with one file.

~~~powershell
Remove-Item -Path "C:\Development\ps-practice\old1.txt"
~~~

~~~text
Output:

(nothing)
~~~

Check what's left.

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -Name
~~~

~~~text
Output:

keep.txt
old2.txt
~~~

`old1.txt` is gone, and it didn't go anywhere. There's no Recycle Bin in the way, and no undo. If you want the file back, you need a copy somewhere else, which is why Chapter 4, step 3 showed you how to make one.

## Previewing with -WhatIf

Most destructive commands in PowerShell accept `-WhatIf`. It tells the command to describe what it would do, and then not do it. Think of it as a dry run.

~~~powershell
Remove-Item -Path "C:\Development\ps-practice\old2.txt" -WhatIf
~~~

~~~text
Output:

What if: Performing the operation "Remove File" on target "C:\Development\ps-practice\old2.txt".
~~~

The file is still there. Run `Get-ChildItem` if you want to be sure. A preview that changes things isn't a preview.

Make a habit of adding `-WhatIf` to a delete before you run it for real. You'll read the output, and if the target is wrong, you'll see it before anything happens. It's the cheapest insurance in the whole chapter.

> **Aside: why a preview is the first step, not the last.**
> A preview tells you what the command would target. It doesn't tell you whether the target is what you meant. Those are different questions, and only the first is answered by `-WhatIf`. Look at the path in the output, every time, and ask whether you'd be sorry to lose that file.

## Confirming each delete with -Confirm

`-Confirm` asks before each deletion. You'll see a prompt, and you type `y` for yes or `n` for no.

~~~powershell
Remove-Item -Path "C:\Development\ps-practice\old2.txt" -Confirm
~~~

~~~text
Output:

Confirm
Are you sure you want to perform this action?
Performing the operation "Remove File" on target "C:\Development\ps-practice\old2.txt".
[Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "Y"):
~~~

`-Confirm` is useful when you're at the keyboard and running something by hand. It's no help in a script that runs unattended, because nobody is there to answer. In a script, `-WhatIf` and careful paths do more of the work.

## Wildcards, and why they need respect

A star in a path means "anything". It's what lets you delete `old*.txt` in one go. It's also what turns a small mistake into a large one, so read the path before you press Enter.

~~~powershell
Remove-Item -Path "C:\Development\ps-practice\old*.txt" -WhatIf
~~~

~~~text
Output:

What if: Performing the operation "Remove File" on target "C:\Development\ps-practice\old2.txt".
~~~

That preview matches one file, which is what you wanted. Now imagine the star in the wrong place, or the path with no folder in it, in a folder you didn't mean to clear. The same line would match a great deal more, and `-WhatIf` would show you all of it before anything was lost.

> **Aside: the star that ate the folder.**
> Every experienced person has a version of this story. A star, a folder in the wrong place, and a delete that ran a moment too quickly. The fix is the same every time: preview first, read the paths, and keep the path specific. Nobody has ever been sorry for checking.

## Deleting a folder

A folder can hold files, so `Remove-Item` on a folder needs `-Recurse`, which says to delete what's inside as well. Without it, PowerShell refuses, because it doesn't want to delete a folder full of things by accident.

~~~powershell
Remove-Item -Path "C:\Development\ps-practice\archive" -Recurse -WhatIf
~~~

~~~text
Output:

What if: Performing the operation "Remove Directory" on target "C:\Development\ps-practice\archive".
What if: Performing the operation "Remove File" on target "C:\Development\ps-practice\archive\copy.txt".
~~~

The preview lists the folder and everything in it. Read the whole list before you run the command without `-WhatIf`. A folder that looked small in File Explorer can hold a great deal more than you remember.

## A safer habit

Here's the routine this step recommends, in order. It takes a few seconds, and it's the difference between a tidy practice folder and a sad one.

1. Look at what's there with `Get-ChildItem`.
2. Preview the delete with `-WhatIf`, and read the target paths.
3. Narrow the path if the preview matches more than you meant.
4. Run the delete for real, once the preview says what you intended.
5. Check the result with `Get-ChildItem` again.

## Try it

This exercise makes three files, deletes the two that start with `old`, and keeps the third. The check looks for the result, not for the command you used.

Write your lines in the starter file, below the comment:

1. Three `Set-Content` lines that create `old1.txt`, `old2.txt`, and `keep.txt` in `C:\Development\ps-practice`, each with a word of text.
2. One `Remove-Item` line that deletes every file in the practice folder whose name starts with `old`, using a wildcard in the path.
3. One `Write-Output` line that prints `Old files removed`.

The check looks at the sentence, and at the files. `keep.txt` must still be there with the word `keep` in it. `old1.txt` and `old2.txt` must be gone.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample and the files.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried. Try the `-WhatIf` preview first, though. The exercise is a good place to practise the habit.

> **Common mistake.** Using a path that matches more than the old files. The `keep.txt` file doesn't start with `old`, so a correct wildcard leaves it alone. If it disappears, the pattern is wrong, and `-WhatIf` would have shown you that before the delete.

---
