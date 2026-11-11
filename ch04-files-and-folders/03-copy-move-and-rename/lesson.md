# 3. Copying, Moving, and Renaming

Sooner or later you'll want a file somewhere else, or with a different name. You could drag it in File Explorer, and for one file that's perfectly sensible. In a script, though, you want a line that does the same thing every time, and that's what these commands are for.

Three commands do most of the work: `Copy-Item` makes a second copy, `Move-Item` moves a file and leaves nothing behind, and `Rename-Item` changes a name. They look alike, and they behave quite differently, so this step takes each one slowly.

## Copying with Copy-Item

`Copy-Item` takes a file and makes a second one. The original stays where it was.

First, make a file to copy. You know how to do this from the last step.

~~~powershell
Set-Content -Path "C:\Development\ps-practice\draft.txt" -Value "First draft"
~~~

~~~text
Output:

(nothing)
~~~

Now copy it.

~~~powershell
Copy-Item -Path "C:\Development\ps-practice\draft.txt" -Destination "C:\Development\ps-practice\copy.txt"
~~~

~~~text
Output:

(nothing)
~~~

Two files now exist. Check with `Get-ChildItem`, using the `-Name` switch so the output is short.

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -Name
~~~

~~~text
Output:

copy.txt
draft.txt
~~~

`-Path` says what to copy, and `-Destination` says where the new copy goes. The destination includes the new file's name, so `copy.txt` is the name of the copy, not a folder. If you give a folder as the destination instead, the copy keeps its original name inside that folder, which is the other common way to use it.

> **Aside: the folder that isn't there.**
> If the destination folder doesn't exist, `Copy-Item` fails and says so. It won't make the folder for you. Make the folder first with `New-Item`, the way you did in Chapter 1, and then copy into it. A script that's going to copy things should make its folders at the top, so the rest of it can assume they're there.

## Moving with Move-Item

`Move-Item` moves a file. The file ends up in the new place, and the old place is empty.

~~~powershell
New-Item -ItemType Directory -Force -Path "C:\Development\ps-practice\archive" | Out-Null
Move-Item -Path "C:\Development\ps-practice\copy.txt" -Destination "C:\Development\ps-practice\archive\copy.txt"
Get-ChildItem -Path "C:\Development\ps-practice" -Recurse -Name
~~~

~~~text
Output:

archive
archive\copy.txt
draft.txt
~~~

The file `copy.txt` is now inside the `archive` folder, and it's gone from the top level. `Move-Item` doesn't leave a copy behind, which is the whole point of it and the reason to be careful with it. If you move a file to the wrong place, the only way back is to move it again.

`-Recurse` earns its place here. Without it, you wouldn't see inside `archive`, and you'd wonder where the file went.

## Renaming with Rename-Item

`Rename-Item` changes a file's name, and it stays in the same folder. It's the one with the trap, so read this part carefully.

~~~powershell
Rename-Item -Path "C:\Development\ps-practice\draft.txt" -NewName "final.txt"
Get-ChildItem -Path "C:\Development\ps-practice" -Name
~~~

~~~text
Output:

archive
final.txt
~~~

`-NewName` takes a name, not a path. The file stays in its folder, and only its name changes. That's the whole rule.

The trap is giving `-NewName` a full path, as if it were a destination. Here's what happens when you try it.

~~~powershell
Rename-Item -Path "C:\Development\ps-practice\final.txt" -NewName "C:\Development\ps-practice\archive\final.txt"
~~~

~~~text
Output:

(an error about the new name, and the file keeps its old name)
~~~

PowerShell refuses, because a new name can't contain a folder. The file doesn't move, and it isn't renamed either, so nothing has changed. If you want a file somewhere else, use `Move-Item`. If you want a new name in the same place, use `Rename-Item`. Most of the confusion between the two comes from reaching for the wrong one.

> **Aside: why the command names don't help.**
> `Move-Item` and `Rename-Item` sound like they do the same job, and in a sense they do. Both change where a file's name points. The difference is whether the folder changes too. It's a small distinction, and it's one of the places where PowerShell's names are more precise than they look at first glance.

## Copying a whole folder

`Copy-Item` can copy a folder, but the folder's contents need `-Recurse` as well, or PowerShell copies the empty folder and leaves the files behind.

~~~powershell
Copy-Item -Path "C:\Development\ps-practice\archive" -Destination "C:\Development\ps-practice\archive-backup" -Recurse
Get-ChildItem -Path "C:\Development\ps-practice" -Recurse -Name
~~~

~~~text
Output:

archive
archive\copy.txt
archive-backup
archive-backup\copy.txt
final.txt
~~~

The copy has its own `copy.txt`, and the original is untouched. Copying a folder with its contents is one of those things that's easy to get half right, so when in doubt, check the result with `Get-ChildItem -Recurse`.

## Try it

This exercise sets up a small chain of changes and checks the result. In the practice folder, your script must:

1. Create a folder called `archive`.
2. Create a file called `draft.txt` containing `First draft`.
3. Copy `draft.txt` to `copy.txt`.
4. Move `copy.txt` into `archive`, so the file ends up at `archive\copy.txt`.
5. Rename `draft.txt` to `final.txt`, in the same folder.
6. Print the sentence `Copy, move, and rename done`.

Write one line for each step, in the starter file, below the comment. Use the full path in every command, as the rule for this chapter says.

The check looks at two things. The sentence must match exactly, and the files must be there: `archive\copy.txt` and `final.txt`, both containing `First draft`. The practice folder is emptied before the check starts, so every file has to come from your script.

Press Run (F5) to see your output. Run keeps the files, so you can look at them with `Get-ChildItem` afterwards. Press Check (Ctrl+F5) to compare your output and files with the expected result.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Giving `Rename-Item` a full path for `-NewName`. It refuses, because a new name can't include a folder. Use the file name alone, and use `Move-Item` if the file needs to change folders.

---
