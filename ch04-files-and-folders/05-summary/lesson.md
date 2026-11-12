# 5. Summary: Files and Folders

You can now make, read, list, copy, move, rename, and delete files and folders from a line of PowerShell. That covers most of what a script does with the disk, and it's the foundation for the scripts you'll write in Chapter 7.

## What you learned

- `Set-Content` writes text to a file, replacing what was there. `Add-Content` adds a line to the end.
- `Get-Content` reads a file back. An empty result means an empty file, not an error.
- `Test-Path` answers yes or no about a path, and scripts use it to decide what to do next.
- `Get-ChildItem` lists a folder. `-Filter` narrows it, `-Name` prints only the names, and `-Recurse` looks inside every folder below.
- `Sort-Object` makes the order predictable, because the order from `Get-ChildItem` isn't something to count on.
- `Copy-Item` makes a second copy, and the destination includes the new name. A folder needs `-Recurse`.
- `Move-Item` moves a file and leaves nothing behind.
- `Rename-Item` takes a name, not a path, and it keeps the file in its folder.
- `Remove-Item` deletes for good, with no Recycle Bin. Preview with `-WhatIf`, and read the paths first.
- Use full paths in scripts, because a relative path goes wherever the script is running.

## Try it

This exercise brings the chapter together in a small job. In the practice folder, your script must:

1. Create `report.txt` containing `Chapter 4 complete`.
2. Copy `report.txt` to `report-backup.txt`.
3. Remove `report.txt`.
4. Print the sentence `Report saved as report-backup.txt`.

The check confirms the sentence, that `report-backup.txt` holds `Chapter 4 complete`, and that `report.txt` has gone.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample and the files.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

## Quizzes

Three questions, one for each big idea in the chapter. Pick an answer, and read the explanation whichever way it goes.

```quiz
You want a file moved into a different folder, with its name unchanged. Which command does that?
○ Rename-Item, with the new folder in -NewName.
→ Not quite. -NewName takes a name only, so a folder in it is refused.
○ Copy-Item, followed by Remove-Item on the original.
→ That works, but it's two steps, and it's easy to forget the second one. Move-Item does it in one.
◉ Move-Item, with the full destination path, including the file name.
→ Right. Move-Item takes the destination path, and the file leaves its old folder.
```

```quiz
You're about to delete files with a wildcard in the path. What should you run first?
○ Remove-Item with -Confirm, so you can answer yes or no to each file.
→ -Confirm helps at the keyboard, but in a script nobody is there to answer. -WhatIf is the better first step.
◉ Remove-Item with -WhatIf, so the command lists what it would delete and deletes nothing.
→ Right. The preview shows every target, and you read the paths before you run the command for real.
○ Get-Content, so you can see what's in the file before you delete it.
→ Get-Content shows what a file holds, not which files a delete would match. That's the question to answer first.
```

```quiz
Which command lists the names of every file in the folder and every folder inside it, with no table?
◉ Get-ChildItem -Path "C:\Development\ps-practice" -Recurse -Name
→ Right. -Recurse goes into every folder below, and -Name gives the plain list of names.
○ Get-ChildItem -Path "C:\Development\ps-practice"
→ That lists only the top level, in a table, so it's not the one.
○ Get-ChildItem -Path "C:\Development\ps-practice" -Filter "*.txt"
→ That narrows the list to text files, and it only looks at the top level.
```

---
