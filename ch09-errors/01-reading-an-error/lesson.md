# 1. Reading an Error

Here's the error you get when you ask for a file that isn't there. It's a good one to learn from, because it's typical.

~~~powershell
Get-Item "C:\Development\ps-practice\missing.txt"
~~~

~~~text
Output:

Get-Item : Cannot find path 'C:\Development\ps-practice\missing.txt' because it does not exist.
At line:1 char:1
+ Get-Item "C:\Development\ps-practice\missing.txt"
+ ~~~~~~~~
    + CategoryInfo          : ObjectNotFound: (C:\Development...issing.txt:String) [Get-Item], ItemNotFoundException
    + FullyQualifiedErrorId : PathNotFound,Microsoft.PowerShell.Commands.GetItemCommand
~~~

That's a lot of text, and most of it is useful once you know where to look. Read it in this order.

- **The first line** names the command that failed, `Get-Item`, and says what went wrong, in plain words. Start here. It answers most questions on its own.
- **The `At line` lines** show where the error happened. `line:1 char:1` is the line and the column, and the caret marks the part of the command that failed.
- **The `CategoryInfo` line** says what kind of error it was, such as `ObjectNotFound`. The category is useful for a script that wants to handle some errors differently from others.
- **The `FullyQualifiedErrorId` line** is a short code for the error. Scripts can match on it, and it's the most precise description you'll get.

The first line is the one to read before anything else. The rest is for when the first line isn't enough.

## Where errors are kept

PowerShell records each error it meets in a list called `$Error`. The newest error is at position 0, so `$Error[0]` is the most recent.

~~~powershell
Get-Item "C:\Development\ps-practice\missing.txt" -ErrorAction SilentlyContinue
$Error.Count
~~~

~~~text
Output:

1
~~~

`-ErrorAction SilentlyContinue` hides the red text for that command, but the error is still recorded. The script keeps going, and the count shows that something failed.

~~~powershell
$Error[0].Exception.Message
~~~

~~~text
Output:

Cannot find path 'C:\Development\ps-practice\missing.txt' because it does not exist.
~~~

`.Exception.Message` pulls out the plain sentence from the first line of the error. A script can print that sentence, or store it for a log.

## Two kinds of error

Some errors let the script carry on, and some stop it. PowerShell calls these non-terminating and terminating errors. The `Get-Item` error above is non-terminating: the command failed, but the script went on to the next line. Most cmdlet errors are like that.

A terminating error stops the script at once. The next steps show you how to tell PowerShell which kind you want, and what to do when one happens.

> **Aside: the error that looked like success.**
> A non-terminating error doesn't stop the script, so the script can finish, print its last line, and look as though everything went fine. Check `$Error.Count`, or read the errors in the output, before you trust a script that seems to have worked. Quiet failures are the ones that cause the most trouble later.

## Try it

This exercise triggers an error quietly, then prints how many errors PowerShell recorded. The check compares the sentence.

Write your lines in the starter file, below the comment:

1. A line that clears the list of errors, using `$Error.Clear()`.
2. A `Get-Item` line for `C:\Development\ps-practice\missing.txt`, with `-ErrorAction SilentlyContinue`.
3. A `Write-Output` line that prints `Errors recorded: ` followed by `$Error.Count`, using `$(...)` inside double quotes.

The expected output is `Errors recorded: 1`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Reading only the last line of the error, or the red text in the middle of it, and missing the first line. The first line names the command and the problem. Start there.

---
