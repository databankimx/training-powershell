# 3. Headers and Comments

A script is read far more often than it's written, and the reader is often you, six months later, with no memory of why a line exists. Comments and a short header are how you leave a note for that person. They cost almost nothing, and they save the most time when you come back to a script cold.

## Comments

A comment starts with `#`, and PowerShell ignores everything from there to the end of the line. Use comments to say why a line is there, not to repeat what the command does.

~~~powershell
# Keep the practice folder tidy before the report is written.
Get-ChildItem -Path "C:\Development\ps-practice" -File -Name
~~~

~~~text
Output:

(the names of the files in the folder, if any)
~~~

The first line is a comment, so it prints nothing. The second line prints the file names, and the comment is there for the next person to read.

A comment that says `# list files` above a line that lists files adds nothing. A comment that says what the script is trying to achieve adds a great deal.

For a longer note, use a block comment, which starts with `<#` and ends with `#>`.

~~~powershell
<#
  This script lists the files in the practice folder.
  It makes no changes, so it's safe to run at any time.
#>
Get-ChildItem -Path "C:\Development\ps-practice" -File -Name
~~~

~~~text
Output:

(the names of the files in the folder, if any)
~~~

Block comments are good for the header of a script, where a few sentences describe the whole thing.

## Requiring a version

A script that needs a particular version of PowerShell can say so, with a `#Requires` line at the top. If the script runs in an older version, PowerShell stops and tells you why, instead of failing somewhere in the middle.

~~~powershell
#Requires -Version 7.0
Write-Output "This needs PowerShell 7"
~~~

~~~text
Output:

This needs PowerShell 7
~~~

Run this in PowerShell 5.1 and you'd get a clear message about the version, before any of the lines ran. That's much kinder than a confusing error halfway through, and it's why every script in this collection that depends on PowerShell 7 says so at the top.

## A help block

A block comment at the top of a script, written in a particular form, becomes the script's help. `Get-Help` can then show it, the same way it shows the help for a built-in command.

~~~powershell
<#
.SYNOPSIS
Lists the files in the practice folder.

.DESCRIPTION
Shows the name of each file in C:\Development\ps-practice. Makes no changes.

.EXAMPLE
.\list-files.ps1
#>
Get-ChildItem -Path "C:\Development\ps-practice" -File -Name
~~~

Save that as `list-files.ps1`, and run `Get-Help .\list-files.ps1` to read its help. The words `.SYNOPSIS`, `.DESCRIPTION`, and `.EXAMPLE` are the labels `Get-Help` looks for, and they must start the line.

~~~powershell
Get-Help .\list-files.ps1
~~~

~~~text
Output:

NAME
    C:\Development\ps-practice\list-files.ps1

SYNOPSIS
    Lists the files in the practice folder.
...
~~~

A script with a help block is one you can hand to someone else. They can ask for its help without opening the file, and the answer is the one you wrote.

> **Aside: the comment that lied.**
> A comment that describes what a line used to do is worse than no comment at all, because it sends the reader the wrong way with confidence. When you change a line, change its comment too. Most stale comments come from a change that was right, followed by a comment that was left behind.

## Try it

This exercise writes a script with a header and a `#Requires` line, then runs it. The check compares the output.

Write your lines in the starter file, below the comment. Your script must have:

1. A `#Requires -Version 7.0` line at the top.
2. A block comment, with `.SYNOPSIS` and a sentence after it, saying what the script is for.
3. A `Write-Output` line that prints `Ready`.

The expected output is one line: `Ready`. The check compares that line, and the comments don't print anything, so they can't change the result.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Putting the `#Requires` line after other commands, where it's easy to miss. Put it at the very top of the file, before anything else runs.

---
