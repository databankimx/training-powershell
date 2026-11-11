# 1. Storing Values

You store a value in a variable with an equals sign. The name goes on the left, the value goes on the right, and the dollar sign sits in front of the name.

~~~powershell
$name = "Ada"
~~~

~~~text
Output:

(nothing)
~~~

That line made a box called `name` and put the text `Ada` in it. It printed nothing, because an assignment doesn't report back. To see what's in the box, use the name with its dollar sign.

~~~powershell
$name = "Ada"
$name
~~~

~~~text
Output:

Ada
~~~

Typing `$name` on its own prints the value. PowerShell looks in the box and shows you what's there, which is the most useful thing a variable can do.

## Using a variable in a command

A variable can stand in for any value a command expects. Put it where the value would go, and the command uses what's in the box.

~~~powershell
$folder = "C:\Development\ps-practice"
Get-ChildItem -Path $folder -Name
~~~

~~~text
Output:

(the names of the files in the practice folder, if any)
~~~

If the practice folder is empty, the output is empty too, as you learned in Chapter 4. The variable doesn't change what the command does. It changes what the command is given.

This is the main reason to use variables in a script. Put the folder in one place, and change it there when it moves. Every command that uses `$folder` follows the change.

## Changing a variable

You can put a new value in a box at any time. The old value is replaced, and the box keeps its name.

~~~powershell
$count = 1
$count
$count = 5
$count
~~~

~~~text
Output:

1
5
~~~

The second assignment doesn't add to the first. It replaces it. If you want the new value to build on the old one, use the old one in the sum.

~~~powershell
$count = 1
$count = $count + 1
$count
~~~

~~~text
Output:

2
~~~

`$count + 1` reads the box, adds one, and puts the answer back in the box. That pattern, using a variable on both sides of the equals sign, is how counters and running totals are made.

> **Aside: the variable that wasn't there.**
> If you use a variable before you've put anything in it, PowerShell doesn't complain. It gives you nothing, which looks like an empty line. The mistake is silent, which makes it hard to find. If an output line is unexpectedly blank, check the variable's name for a typo. A misspelled name makes a new, empty box, and PowerShell is perfectly happy to do that.

## Naming variables

Names can use letters, numbers, and underscores, and they're not case sensitive. `$Name` and `$name` are the same box, which surprises people the first time. Pick names that say what they hold, such as `$folder`, `$count`, and `$fileName`, and keep to one style so you can read your own scripts later.

Avoid names that are already used by PowerShell itself. You'll mostly notice this when something behaves oddly, and a clear name is the cheapest protection.

## Try it

This exercise stores a name in a variable, and uses it in a greeting. The check compares the sentence exactly.

Write two lines in the starter file, below the comment:

1. A line that puts the text `Ada` into a variable called `$name`.
2. A `Write-Output` line that prints `Hello, Ada`, using the variable rather than typing the name again.

The expected output is `Hello, Ada`. The point of the exercise is the second line. It should read the variable, so that if the name changed, the greeting would change with it.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Typing `name` without the dollar sign in the greeting. PowerShell prints the word `name`, not the value in the box, and the output reads `Hello, name`. The dollar sign is what makes it a variable.

---
