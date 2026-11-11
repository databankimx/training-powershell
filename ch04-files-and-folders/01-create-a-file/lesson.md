# 1. Creating a File

A file is the simplest thing you can make, and it's where most of the work ends up. Notes, configuration, logs, and the scripts in this tutorial are all files. This step shows you how to make one from a line of PowerShell and read it back.

## Making a file with Set-Content

`Set-Content` writes text into a file. If the file doesn't exist, it makes one. If it does exist, it replaces what was there. That second part is the one to watch, so keep it in mind.

~~~powershell
Set-Content -Path "C:\Development\ps-practice\notes.txt" -Value "Practice notes"
~~~

~~~text
Output:

(nothing)
~~~

That's right: no output. `Set-Content` does its job quietly, and it doesn't report back unless something goes wrong. Silence is a good sign with most commands. Don't mistake it for a failure.

`-Path` says where the file goes. `-Value` says what goes in it. The text is in double quotes, and that's the same rule you saw in Chapter 1.

## Reading the file back with Get-Content

`Get-Content` reads a file and prints its lines. It's the counterpart to `Set-Content`, and it's how you check what a file holds.

~~~powershell
Get-Content -Path "C:\Development\ps-practice\notes.txt"
~~~

~~~text
Output:

Practice notes
~~~

The output is the text you wrote, with nothing added. If the output is empty, the file is empty. If you get an error that says the file doesn't exist, the path is probably wrong, and the next step is about to help you find out why.

## Adding to a file without replacing it

`Set-Content` replaces the whole file. To add a line to the end, use `Add-Content`.

~~~powershell
Add-Content -Path "C:\Development\ps-practice\notes.txt" -Value "A second line"
Get-Content -Path "C:\Development\ps-practice\notes.txt"
~~~

~~~text
Output:

Practice notes
A second line
~~~

Two lines, one command each. `Add-Content` added the second line, and the first line stayed where it was. Run `Set-Content` again instead, and you'd lose the first line without any warning. The difference between the two is the sort of thing that's obvious once someone points it out, and invisible until then.

> **Aside: the file that wasn't there.**
> `Set-Content` will happily create a file in a folder that exists, but it won't create the folder for you. If the folder is missing, you get an error that says the path can't be found. The fix is to make the folder first, which you did in Chapter 1. Chapter 4, step 2 covers folders in full, so for now, check that the folder is there before you write the file.

## Checking what's there with Test-Path

`Test-Path` answers a yes or no question about a path. It's handy before you read or write, because it lets a script decide what to do next.

~~~powershell
Test-Path "C:\Development\ps-practice\notes.txt"
~~~

~~~text
Output:

True
~~~

~~~powershell
Test-Path "C:\Development\ps-practice\missing.txt"
~~~

~~~text
Output:

False
~~~

`True` and `False` are the only answers. They're words PowerShell understands, which is why a script can use them directly. You'll use `Test-Path` again in Chapter 7, when a script starts making decisions.

## A note on file endings

A file has a name, and the part after the last dot is its extension. `notes.txt` is a plain text file, `setup.ps1` is a PowerShell script, and `report.csv` is a spreadsheet that a program can read. PowerShell doesn't care what the extension is when it writes text, but other programs do. Pick the one that matches what the file holds, so the next person knows what they're looking at.

## Try it

This exercise creates a file called `notes.txt` in the practice folder, containing the words `Practice notes`, and then prints a sentence to say it's done.

Write your two lines in the starter file, below the comment:

1. A `Set-Content` line that writes `Practice notes` into `C:\Development\ps-practice\notes.txt`, using `-Path` and `-Value`, with the full path.
2. A `Write-Output` line that prints `Notes file ready`, exactly as written.

The check looks at two things. It reads the sentence the script prints, and it reads the file itself. The file must exist, and it must say `Practice notes`. The practice folder is emptied before the check starts, so the file has to come from your script, not from an earlier attempt.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample and the file.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Writing `notes.txt` without the folder in front. The file is created somewhere else, the check can't find it in the practice folder, and the message says the file is missing. Put the full path in both lines, and it works.

---
