# 2. Looking Inside a Folder

A folder is only useful if you can see what's in it. In File Explorer you'd open it and look. In PowerShell you ask a question, and the answer comes back as a list. That sounds like more work, and for a single folder it probably is. The payoff comes when the folder has four hundred files, and you want the three that matter.

This step shows you how to list a folder, narrow the list down, and print only the names, which is what most scripts end up needing.

## Setting up the examples

The examples in this step assume the practice folder holds three files. If you're trying them on their own, run these three lines first. The exercise makes the same files itself, so you don't need them for the exercise.

~~~powershell
Set-Content -Path "C:\Development\ps-practice\apple.txt" -Value "apple"
Set-Content -Path "C:\Development\ps-practice\banana.txt" -Value "banana"
Set-Content -Path "C:\Development\ps-practice\cherry.log" -Value "cherry"
~~~

~~~text
Output:

(nothing)
~~~

If you run `Get-ChildItem` on an empty folder, it prints nothing at all. That isn't an error, and your setup isn't broken. The folder is just empty, and PowerShell has nothing to show you. Every example that follows assumes the three files are there, so if an example shows output and you get none, run the setup lines above first.

## Listing a folder with Get-ChildItem

`Get-ChildItem` lists what's inside a folder. The short name is `gci`, and `ls` works too, but you'll see `Get-ChildItem` in scripts, and it's clearer.

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice"
~~~

~~~text
Output:

    Directory: C:\Development\ps-practice

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----        11/10/2026   9:20 AM             18 apple.txt
-a----        11/10/2026   9:20 AM             19 banana.txt
-a----        11/10/2026   9:21 AM             17 cherry.log
~~~

Each line is one file. `Mode` shows its attributes, where `-a----` means an ordinary file, and `d` at the start would mean a folder. `Length` is the size in bytes. `Name` is the name, which is the bit you'll usually want.

Your dates and sizes will differ from the example, and that's fine. The shape is what matters.

## Filtering by name

If the folder holds many things, you can ask for only the ones with a matching name. `-Filter` takes a pattern, where `*` means "anything".

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -Filter "*.txt"
~~~

~~~text
Output:

    Directory: C:\Development\ps-practice

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----        11/10/2026   9:20 AM             18 apple.txt
-a----        11/10/2026   9:20 AM             19 banana.txt
~~~

`*.txt` means "any name that ends in .txt". The `cherry.log` file is gone, because it doesn't match. Other useful patterns are `notes*` for anything starting with notes, and `*2026*` for anything with 2026 in its name.

A filter is quicker than a list you then search through, and it's easier to get right, because the computer does the matching.

> **Aside: the star is not a wildcard in every command.**
> In `-Filter`, a star means any text. Other commands use different rules, and some use `-Include` or `-Exclude` for the same job. If a pattern seems to do nothing, check the help for that command with `Get-Help`, which you learned about in Chapter 3. The help for `Get-ChildItem` is long, but the examples at the bottom are worth reading.

## Printing just the names

The table is useful for a person. A script often wants only the names, so it can do something with each one. The `-Name` switch gives you that, and each name comes back as plain text.

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -Filter "*.txt" -Name
~~~

~~~text
Output:

apple.txt
banana.txt
~~~

A switch is a parameter that doesn't take a value. You say `-Name`, and it's on. No `$true`, no `1`, no argument at all. You'll write your own switches in Chapter 8.

## Sorting the names

The order you get from `Get-ChildItem` isn't something to rely on. Windows usually lists names in alphabetical order, but "usually" is doing a lot of work in that sentence. To be sure, pipe the names through `Sort-Object`, which you'll meet properly in Chapter 6.

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -Filter "*.txt" -Name | Sort-Object
~~~

~~~text
Output:

apple.txt
banana.txt
~~~

The `|` takes the names from one command and passes them to the next. Read it from left to right: find the text files, give their names, and sort them.

## Checking that a path exists

You met `Test-Path` in Chapter 4, step 1. It's worth coming back to, because it pairs well with `Get-ChildItem`. A script can check that a folder exists before it looks inside.

~~~powershell
Test-Path -Path "C:\Development\ps-practice"
~~~

~~~text
Output:

True
~~~

If the folder is missing, `Get-ChildItem` fails with an error. Checking first gives you a clearer message, and the script can decide what to do about it.

## Looking inside the folders inside a folder

`Get-ChildItem` only looks at the folder you name. To go through every folder below it, add `-Recurse`.

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -Recurse -Name
~~~

~~~text
Output:

apple.txt
banana.txt
cherry.log
reports
reports\summary.txt
~~~

The `reports` line is a folder, and `reports\summary.txt` is a file inside it. The backslash shows the path from the top. Use `-Recurse` when you want everything, and leave it off when you only want the top level, because a large folder tree can take a while to list.

## Try it

This exercise creates three files, then prints the names of the text files in the folder, sorted.

Write your lines in the starter file, below the comment:

1. Three `Set-Content` lines that create `apple.txt`, `banana.txt`, and `cherry.log` in `C:\Development\ps-practice`. Give each one a word as its text, such as `apple`, `banana`, and `cherry`.
2. One `Get-ChildItem` line that lists the names of the `.txt` files in the practice folder, using `-Filter`, `-Name`, and a pipe to `Sort-Object`.

Your script's output should be exactly two lines: `apple.txt` and `banana.txt`. The check also confirms that all three files exist, because the practice folder is emptied before the check starts.

Press Run (F5) to see your output. Run keeps the files where they are, so you can experiment freely. Press Check (Ctrl+F5) to compare your output with the sample and the files. Check always starts from an empty practice folder, so it only sees what your script makes.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Listing the folder before the files exist. The practice folder is empty when a check starts, so a listing that runs before your script makes the files finds nothing and prints nothing. Create the files first, then list them.

---
