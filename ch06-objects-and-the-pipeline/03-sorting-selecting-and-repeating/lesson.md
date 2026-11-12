# 3. Sorting, Selecting, and Repeating

Three pipeline commands finish most of the jobs people do with lists. `Sort-Object` puts things in order. `Select-Object` takes a few of them. `ForEach-Object` does something to each one in turn. Put them together, and you can answer a question like "what are the three largest files, and what do I do with each one?" in a single line.

## The examples in this step

The examples use the three files from the last two steps. Make them with these lines, which you may already have.

~~~powershell
Set-Content -Path "C:\Development\ps-practice\apple.txt" -Value "apple"
Set-Content -Path "C:\Development\ps-practice\banana.txt" -Value "banana"
Set-Content -Path "C:\Development\ps-practice\cherry.log" -Value "cherry"
~~~

~~~text
Output:

(nothing)
~~~

## Sorting

`Sort-Object` puts objects in order by a property. Name the property, and it sorts ascending by default.

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -File | Sort-Object Name | Select-Object Name
~~~

~~~text
Output:

Name
----
apple.txt
banana.txt
cherry.log
~~~

Add `-Descending` to reverse the order.

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -File | Sort-Object Name -Descending | Select-Object Name
~~~

~~~text
Output:

Name
----
cherry.log
banana.txt
apple.txt
~~~

Sorting by size works the same way, with `Length` in place of `Name`.

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -File | Sort-Object Length -Descending | Select-Object Name, Length
~~~

~~~text
Output:

Name       Length
----       ------
banana.txt      8
cherry.log      8
apple.txt       7
~~~

Two files have the same length, so their order between themselves depends on the sort. A sort on one property doesn't promise an order for ties. If the order between equal items matters, sort on a second property as well.

## Selecting some of them

`Select-Object` can take a few objects from the start or the end of a list, or skip some first.

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -File | Sort-Object Name | Select-Object -First 2 | Select-Object Name
~~~

~~~text
Output:

Name
----
apple.txt
banana.txt
~~~

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -File | Sort-Object Name | Select-Object -Last 1 | Select-Object Name
~~~

~~~text
Output:

Name
----
cherry.log
~~~

`-First` and `-Last` count from the front and the back. `-Skip` goes the other way, and skips a number before the rest are taken. A pipeline can have several `Select-Object` commands, and each one works on what the last one passed along.

## Doing something to each one

`ForEach-Object` takes each object in turn, and runs the braces for it. Inside the braces, `$_` is the current object, as it was with `Where-Object`.

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -File | ForEach-Object { "File: $($_.Name)" }
~~~

~~~text
Output:

File: apple.txt
File: banana.txt
File: cherry.log
~~~

Each object becomes one line of text. The braces run once per file, and whatever they produce goes to the output.

## Putting the pipeline together

A pipeline reads left to right, and each command passes its results to the next. Here's one that sorts the files, takes the first two, and prints a line for each.

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -File | Sort-Object Name -Descending | Select-Object -First 2 | ForEach-Object { "File: $($_.Name)" }
~~~

~~~text
Output:

File: cherry.log
File: banana.txt
~~~

That's three commands, and each one does one job. Read it as a sentence: take the files, sort them in reverse, keep two, and print each name. Building a line like this one step at a time, and checking the output after each step, is the best way to get a complicated pipeline right.

> **Aside: when a pipeline runs slowly.**
> A pipeline handles each object as it arrives, which is usually fast. Some commands, such as `Sort-Object`, have to wait for every object before they can decide the order, so they hold everything until the end. For a folder with a few files, that's invisible. For a folder with a hundred thousand, it's worth knowing.

## Try it

This exercise makes three files, sorts them in reverse, keeps the first two, and prints a line for each one. The check compares all the lines, and confirms the files.

Write your lines in the starter file, below the comment:

1. Three `Set-Content` lines that create `apple.txt`, `banana.txt`, and `cherry.log` in the practice folder, each with a word as its text.
2. One pipeline line that gets the files with `-File`, sorts them by `Name` in descending order, keeps the first two with `-First 2`, and prints each one with `ForEach-Object` as `File: ` followed by its name.

The expected output is two lines: `File: cherry.log` and `File: banana.txt`. The check also confirms that all three files exist.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample and the files.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Putting `-First 2` before `Sort-Object`. The first two files are then the first two the folder listed, not the first two in reverse order. Sort first, then select.

---
