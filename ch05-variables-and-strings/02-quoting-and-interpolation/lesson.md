# 2. Quoting and Interpolation

Quotation marks tell PowerShell where a piece of text starts and stops. That sounds simple, and it is, until you need the text to contain a quotation mark, a dollar sign, or a value from a variable. Then the question is which kind of quote to use, and the answer depends on what you want the text to do.

There are two kinds of quotes. Single quotes take the text exactly as it's written. Double quotes look inside the text for dollar signs, and replace any variable they find with its value. That replacing is called interpolation, and it's the reason the two kinds exist.

## Single quotes take the text as written

Anything inside single quotes is literal. A dollar sign is a dollar sign, and nothing inside is replaced.

~~~powershell
'Price: $9'
~~~

~~~text
Output:

Price: $9
~~~

~~~powershell
'$name is a variable name'
~~~

~~~text
Output:

$name is a variable name
~~~

The second example doesn't read `$name`, even though the name exists as a variable in this session. Single quotes leave it alone, and that's exactly what you want when you're writing text that contains dollar signs and shouldn't be changed.

## Double quotes replace variables

Double quotes look for `$` and replace the variable name that follows with its value.

~~~powershell
$name = "Ada"
"Hello, $name"
~~~

~~~text
Output:

Hello, Ada
~~~

Now the sentence contains the value, not the word. Change `$name`, and the sentence changes with it, which is the whole reason to use double quotes for anything that varies.

Here's the same idea with a path, which is where it's most useful in this tutorial.

~~~powershell
$folder = "C:\Development\ps-practice"
"Exercises are in $folder"
~~~

~~~text
Output:

Exercises are in C:\Development\ps-practice
~~~

## Reading a property inside a string

A value often has a property you want, such as the length of a string. Double quotes can't reach into a property on their own, so use `$(...)` to run an expression and put its result in the text.

~~~powershell
$folder = "C:\Development\ps-practice"
"That path has $($folder.Length) characters"
~~~

~~~text
Output:

That path has 26 characters
~~~

Without the brackets, `$folder.Length` would print the folder's text followed by the word `.Length`. The `$(...)` tells PowerShell to work out the expression first, and then put the answer in the sentence. You'll use it constantly from now on.

> **Aside: the dot that didn't count.**
> `"$folder.Length"` prints the path with `.Length` on the end, because PowerShell only reads `$folder` as the variable and leaves the rest as plain text. It's a common surprise, and the cure is always the same: wrap the whole expression in `$(...)`.

## Putting a quote inside a quote

Sooner or later the text will need a quotation mark of its own. The easiest way is to use the other kind of quote around the outside.

~~~powershell
'She said "hello" to the printer'
~~~

~~~text
Output:

She said "hello" to the printer
~~~

~~~powershell
"It's a fine day"
~~~

~~~text
Output:

It's a fine day
~~~

Inside single quotes, a single quote has to be doubled, so two single quotes stand for one.

~~~powershell
'It''s a fine day'
~~~

~~~text
Output:

It's a fine day
~~~

Inside double quotes, the way to get a double quote is a backtick, which is the key above the Tab key on most keyboards. It's the escape character in PowerShell, and it tells the next character to be taken literally.

~~~powershell
"She said `"hello`" to the printer"
~~~

~~~text
Output:

She said "hello" to the printer
~~~

Use whichever form is clearer for the text you're writing. Single quotes with a doubled apostrophe read well, and the backtick form is useful when you also need a dollar sign to stay literal inside double quotes.

## Paths with spaces

A path with a space in it needs quotes, or PowerShell reads the words after the space as separate arguments.

~~~powershell
$folder = "C:\My Documents\notes"
Get-Item -Path $folder
~~~

Without the quotes around `C:\My Documents\notes`, the command would see `C:\My` and `Documents\notes` as two things, and it would complain about both. Quote every path with a space in it, and quote every path you're not sure about. It costs nothing, and it prevents a whole class of confusing errors.

## Choosing a quote

A short rule covers most cases. Use single quotes when the text is fixed and shouldn't change. Use double quotes when you want a variable or an expression inside the text. Use `$(...)` when the value you want is a property or the result of a command, and not just a variable.

## Try it

This exercise prints a price with a literal dollar sign in it. The check compares the sentence exactly, so the dollar sign has to survive.

Write one line in the starter file, below the comment. It should print:

~~~text
Price: $9
~~~

Use `Write-Output` with the text in single quotes. A dollar sign inside double quotes would try to read a variable, and there isn't one called `$9`, so the output would lose the dollar sign. Single quotes keep it.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Using double quotes around text with a dollar sign in it, such as `"Price: $9"`. PowerShell reads `$9` as a variable, which is empty, and the output loses the number. Single quotes are the fix.

---
