# 3. Building Text

Strings do more than hold words. They know how long they are, they can change case, and they can be joined to other strings. You'll use these things every time a script needs to make a message, a file name, or a line for a report, so it's worth knowing them well.

## Properties and methods

A string is an object, and objects have properties and methods. A property is a value the object holds, and you read it without brackets. A method is an action the object can perform, and you call it with brackets, even when it takes no input.

~~~powershell
$folder = "C:\Development\ps-practice"
$folder.Length
~~~

~~~text
Output:

26
~~~

`Length` is a property, so there are no brackets. It holds the number of characters in the string.

~~~powershell
$folder.ToUpper()
~~~

~~~text
Output:

C:\DEVELOPMENT\PS-PRACTICE
~~~

`ToUpper` is a method, and the brackets are what make it run. Without them, PowerShell shows you the method's details instead of doing the work.

> **Aside: the method that forgot its brackets.**
> `$folder.ToUpper` with no brackets doesn't convert anything. It prints a description of the method, which looks like a mistake and is one. Every method needs its brackets, even when it takes nothing, and that's one of the first things to check when a method seems to do nothing.

## More methods you'll meet

Strings have many methods. These are the ones that come up most often.

~~~powershell
$folder = "C:\Development\ps-practice"
$folder.ToLower()
~~~

~~~text
Output:

c:\development\ps-practice
~~~

~~~powershell
$folder.Replace("ps-practice", "ps-archive")
~~~

~~~text
Output:

C:\Development\ps-archive
~~~

~~~powershell
"  spaced out  ".Trim()
~~~

~~~text
Output:

spaced out
~~~

`Replace` swaps every match of the first text for the second. `Trim` removes spaces from both ends, which is useful when text came from somewhere that added some. `ToLower` and `ToUpper` change case, and only the case.

## Joining strings with plus

The plus sign joins two strings into one. It works on text just as it does on numbers, and it's useful when the pieces are short and you want to keep the line tidy.

~~~powershell
"Hello, " + "Ada"
~~~

~~~text
Output:

Hello, Ada
~~~

Double quotes with `$(...)` usually do the same job more clearly, so prefer them for anything with a variable in it.

~~~powershell
$name = "Ada"
"Hello, $name"
~~~

~~~text
Output:

Hello, Ada
~~~

## Replacing text with -replace

`-replace` is an operator, not a method, and it takes a pattern rather than plain text. For a plain swap, `Replace` is simpler. Use `-replace` when you need the pattern to match more than one exact string.

~~~powershell
"report-2025.txt" -replace "2025", "2026"
~~~

~~~text
Output:

report-2026.txt
~~~

Patterns are a big subject, and they come later. For now, the plain `Replace` method and the simple `-replace` example cover most of what you'll need.

## Several lines at once

Sometimes a message runs over several lines. A here-string holds text across lines without any quote marks on each line. It starts with `@"` and ends with `"@`, and the closing marker has to be at the very start of its own line.

~~~powershell
$message = @"
Practice folder
$folder
"@
$message
~~~

~~~text
Output:

Practice folder
C:\Development\ps-practice
~~~

A here-string works like double quotes, so variables are replaced inside it. Use `@'` and `'@` instead when you want the text taken exactly as written.

## Try it

This exercise builds two lines of text from a folder name. The check compares both lines exactly.

Write three lines in the starter file, below the comment:

1. A line that puts `C:\Development\ps-practice` into a variable called `$folder`.
2. A `Write-Output` line that prints `Length: ` followed by the length of `$folder`.
3. A `Write-Output` line that prints `Upper: ` followed by `$folder` converted to upper case.

The expected output is two lines: `Length: 26` and `Upper: C:\DEVELOPMENT\PS-PRACTICE`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Forgetting the brackets on `ToUpper()`, which prints the method's details instead of the upper-case text. Use `$(...)` inside the string, with the brackets in place.

---
