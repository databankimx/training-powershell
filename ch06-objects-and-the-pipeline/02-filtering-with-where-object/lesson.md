# 2. Filtering with Where-Object

Filtering means keeping the objects that pass a test and dropping the rest. `Where-Object` does that job in the pipeline. It looks at each object in turn, asks your question, and passes along only the ones that answer yes.

Once you can filter, you can ask questions like "which files are text files?" or "which files are bigger than this?" and get the answer without reading a list.

## The examples in this step

The examples use the same three files as the last step. Make them with these lines, which you may already have from before.

~~~powershell
Set-Content -Path "C:\Development\ps-practice\apple.txt" -Value "apple"
Set-Content -Path "C:\Development\ps-practice\banana.txt" -Value "banana"
Set-Content -Path "C:\Development\ps-practice\cherry.log" -Value "cherry"
~~~

~~~text
Output:

(nothing)
~~~

## A test in braces

The full form of `Where-Object` takes a test in curly braces. Inside the braces, `$_` stands for the object currently being tested. Each object arrives in turn, and `$_` is that object.

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -File | Where-Object { $_.Extension -eq ".txt" } | Select-Object Name
~~~

~~~text
Output:

Name
----
apple.txt
banana.txt
~~~

Read the test as "keep the object when its extension equals .txt". `-eq` is the equals test for values. The `.log` file doesn't pass, so it's dropped before `Select-Object` sees it.

## Other tests

`-eq` is one of several comparison operators. Each one has a dash, and each one reads as a word.

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -File | Where-Object { $_.Length -gt 7 } | Select-Object Name, Length
~~~

~~~text
Output:

Name       Length
----       ------
banana.txt      8
cherry.log      8
~~~

`-gt` means "greater than". The other common ones are `-lt` for less than, `-ne` for not equal, `-ge` and `-le` for greater or equal and less or equal.

Test a pattern with `-like`, where a star means "anything", as it does in `-Filter`.

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -File | Where-Object { $_.Name -like "*an*" } | Select-Object Name
~~~

~~~text
Output:

Name
----
banana.txt
~~~

That keeps names with "an" anywhere in them. The `-like` test is simple and reliable. For more complicated patterns, `-match` takes a regular expression, which you'll meet later.

## The short form

For a simple test, PowerShell accepts a shorter form, with no braces and no `$_`. It's easier to read, and it works for one comparison at a time.

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -File | Where-Object Extension -eq ".log" | Select-Object Name
~~~

~~~text
Output:

Name
----
cherry.log
~~~

The short form reads almost like a sentence. Use it when the test is one comparison. Switch to braces as soon as you need two tests, or anything more than a single property check.

## Two tests together

`-and` needs both tests to pass, and `-or` needs at least one. Put the test in braces, with the operator between the two comparisons.

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -File | Where-Object { $_.Extension -eq ".txt" -and $_.Length -gt 7 } | Select-Object Name
~~~

~~~text
Output:

Name
----
banana.txt
~~~

`apple.txt` is a text file, but it's only 7 bytes, which isn't greater than 7, so it fails the second test. Both tests have to pass, and that's what `-and` means.

> **Aside: the test that looked right.**
> A filter can return the wrong objects with no error at all, because the test says what it says, and not what you meant. When a filter's output surprises you, run the test on its own first. Use `Get-ChildItem` with no filter, and check the lengths and names by eye. Most filtering mistakes show up in one of those two places.

## Try it

This exercise makes three files, then counts the text files among them and prints the count. The check compares the sentence, and confirms the files.

Write your lines in the starter file, below the comment:

1. Three `Set-Content` lines that create `apple.txt`, `banana.txt`, and `cherry.log` in the practice folder, each with a word as its text.
2. A line that lists the files in the practice folder with `-File`, and keeps only those whose `Extension` is `.txt`, using `Where-Object` with braces and `$_`.
3. A `Write-Output` line that prints `Text files: ` followed by the count of the result, using `$(...)` inside double quotes.

The expected output is `Text files: 2`. The check also confirms that all three files exist.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample and the files.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Writing `$Extension` instead of `$_.Extension` inside the braces. The variable `$Extension` doesn't exist, so the test compares nothing with `.txt` and keeps nothing. The `$_` is the object, and `.Extension` is the property on it.

---
