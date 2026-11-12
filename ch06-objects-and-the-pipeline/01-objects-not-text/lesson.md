# 1. Objects, Not Text

When you run `Get-ChildItem`, the table you see on screen is a presentation. It isn't the thing the command hands back. What comes back is a set of objects, one for each file, and each object holds the file's name, size, date, and more. The table is just PowerShell's way of showing them to you.

That difference matters. Text is something you have to read and pick through. Objects are something you can ask questions of, and the answers come back exactly as you asked.

## The examples in this step

The examples assume three files in the practice folder. Make them with these lines.

~~~powershell
Set-Content -Path "C:\Development\ps-practice\apple.txt" -Value "apple"
Set-Content -Path "C:\Development\ps-practice\banana.txt" -Value "banana"
Set-Content -Path "C:\Development\ps-practice\cherry.log" -Value "cherry"
~~~

~~~text
Output:

(nothing)
~~~

## Picking out properties with Select-Object

`Select-Object` keeps the properties you name, and drops the rest. It's the way to say "show me only these".

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -File | Select-Object Name, Length
~~~

~~~text
Output:

Name       Length
----       ------
apple.txt       7
banana.txt      8
cherry.log      8
~~~

The table has two columns, because you asked for two properties. The lengths depend on the text in each file, so your numbers may differ from these. The shape is what matters.

`-File` keeps only files, and leaves out any folders. You'll use it whenever you want files and nothing else.

## Showing properties as a list

A table is compact, but it can't show every property on a long object. `Format-List` prints each property on its own line, which is easier to read when you have only one or two objects.

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -File | Select-Object -First 1 | Format-List Name, Length
~~~

~~~text
Output:

Name   : apple.txt
Length : 7
~~~

`-First 1` takes only the first object, and `Format-List` prints it vertically. Both are useful when a table is too wide to read.

## Using an object in a variable

The pipeline isn't the only way to work with objects. Store the result in a variable, and you can count it, index into it, or read a property from one of its members.

~~~powershell
$files = Get-ChildItem -Path "C:\Development\ps-practice" -File
$files.Count
~~~

~~~text
Output:

3
~~~

`Count` is a property of the list, and it tells you how many objects are in it.

~~~powershell
$files[0].Name
~~~

~~~text
Output:

apple.txt
~~~

The square brackets pick an item by its position. The first item is at position 0, not 1. That's a quirk you'll meet in most programming languages, and it's worth getting used to early.

## Seeing what an object holds

When you're not sure what properties an object has, ask it. `Get-Member` lists them, which you met in Chapter 3.

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -File | Select-Object -First 1 | Get-Member -MemberType Property
~~~

~~~text
Output:

   TypeName: System.IO.FileInfo

Name                      MemberType Definition
----                      ---------- ----------
Attributes                Property   System.IO.FileAttributes Attributes {get;set;}
CreationTime              Property   datetime CreationTime {get;set;}
Length                    Property   long Length {get;}
Name                      Property   string Name {get;}
...
~~~

The list is long, and the `...` stands for the rest. Most of it you won't need yet. The ones to remember are `Name`, `Length`, and `Extension`, because they're the ones most scripts use.

> **Aside: the table is a costume.**
> PowerShell chooses a table or a list to display an object, and it's a presentation decision, not part of the object. The object is the same either way. If the table isn't showing the property you need, that doesn't mean the object lacks it. Ask for it with `Select-Object`, or look at all of its properties with `Get-Member`.

## Try it

This exercise makes three files, then counts the files in the practice folder and prints the result. The check compares the sentence, and confirms the files.

Write your lines in the starter file, below the comment:

1. Three `Set-Content` lines that create `apple.txt`, `banana.txt`, and `cherry.log` in the practice folder, each with a word as its text.
2. A line that stores the files in a variable called `$files`, using `Get-ChildItem` with `-Path` and `-File`.
3. A `Write-Output` line that prints `Files: ` followed by `$files.Count`, using `$(...)` inside double quotes.

The expected output is `Files: 3`. The check also confirms that all three files exist.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample and the files.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Counting before making the files, or leaving out `-File`. A folder appears in the list too, if there is one, and the count would include it. The `-File` switch keeps only files, so the count is the number you expect.

---
