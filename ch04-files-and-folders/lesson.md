# 4. Files and Folders

Most of what you'll do with a computer involves files and folders, and PowerShell is a perfectly good way to do it. You can make them, copy them, rename them, read them, and delete them, all from a line you type. Some of those jobs are quicker than clicking, and a few of them are only possible in a script, so this chapter is worth your time.

Be warned that the commands in this chapter change things. They make files, overwrite them, and delete them. Nothing here is dangerous if you use the practice folder, and every example in this chapter does. The exercises will check what your script left behind, so you'll see the results for yourself.

## What you'll do

1. **Create a file.** Make a file with `Set-Content`, and read it back with `Get-Content`.
2. **Look inside a folder.** List what's there, filter it, and check whether a path exists.
3. **Copy, move, and rename.** Change where files live, and what they're called.
4. **Delete safely.** Remove things without regretting it, using `-WhatIf` and a careful habit.
5. **Summary.** Put the chapter's commands together, and try the quizzes.

## The rule for this chapter

Use the full path every time. Write `C:\Development\ps-practice\notes.txt`, not just `notes.txt`.

The reason is that a script runs from its own working folder, which is not your practice folder. A name without a path goes into that working folder, and the exercise checks the practice folder. Your file would be created, and the check would say it's missing. It's a fair trap, and I've fallen into it myself more than once, usually at the end of a long day.

You'll see the full path in every example. Read it as your own path if you've chosen a different practice folder.

---
