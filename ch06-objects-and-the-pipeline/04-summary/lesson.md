# 4. Summary: Objects and the Pipeline

You can now see a command's result as objects, pick out the properties you need, and filter, sort, and select along a pipeline. You can also do something to each object with `ForEach-Object`. Those are the skills behind most of the scripts you'll read and write, and the next chapter depends on them directly.

## What you learned

- A command returns objects. The table on screen is only a way of showing them.
- `Select-Object` picks out properties, and `-First`, `-Last`, and `-Skip` pick out objects.
- `Format-List` shows one object's properties one per line, which is easier to read when a table is too wide.
- `-File` keeps only files, and leaves folders out of the list.
- A variable can hold a list of objects, and `.Count` tells you how many there are.
- Square brackets pick an item by position, and the first item is at position 0.
- `Get-Member` shows what an object's properties and methods are.
- `Where-Object` keeps only the objects that pass a test. Inside braces, `$_` is the current object.
- Comparison operators such as `-eq`, `-gt`, and `-like` make the tests, and `-and` and `-or` combine them.
- `Sort-Object` puts objects in order, and `-Descending` reverses it. Sort before you select.
- `ForEach-Object` runs its braces once for each object, and whatever the braces produce goes to the output.
- Read a pipeline from left to right, and check the output after each step.

## Try it

This exercise combines the chapter in a short report. Your script must:

1. Create `apple.txt`, `banana.txt`, and `cherry.log` in the practice folder, each with a word as its text.
2. Store the files in a variable called `$files`, using `Get-ChildItem` with `-Path` and `-File`.
3. Print `Files: ` followed by the count.
4. Print `First: ` followed by the name of the file that comes first when the names are sorted, using a pipeline.
5. Print `Last: ` followed by the name of the file that comes last when the names are sorted, using a pipeline.

The expected output is three lines: `Files: 3`, `First: apple.txt`, and `Last: cherry.log`. The check also confirms that all three files exist.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample and the files.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

## Quizzes

Three questions, one for each big idea in the chapter. Pick an answer, and read the explanation whichever way it goes.

```quiz
A command's output looks like a table on screen. What is the command actually handing back?
○ A block of formatted text, which PowerShell then splits into columns.
→ Not quite. Text is what other shells hand back. PowerShell hands back objects.
◉ Objects, one for each item, and the table is only how PowerShell shows them.
→ Right. The objects hold every property, and the table is a presentation choice.
○ A table, stored as a file in a temporary folder until you read it.
→ Not quite. No file is involved. The result is kept in memory as objects.
```

```quiz
You want the first two files when the names are sorted in reverse. Which order is correct?
○ Select-Object -First 2, then Sort-Object Name -Descending.
→ That takes the first two the folder listed, and sorts only those. Sort first.
○ ForEach-Object first, then Sort-Object, then Select-Object -First 2.
→ ForEach-Object turns each file into text, and the sorting then has nothing useful to sort. Put it last.
◉ Sort-Object Name -Descending, then Select-Object -First 2.
→ Right. Sorting first means the two you keep are the two you wanted.
```

```quiz
Inside the braces of Where-Object, what does $_ stand for?
◉ The object currently being tested, one at a time.
→ Right. Each object arrives in turn, and $_ is that object.
○ The name of the command, so you can refer to Where-Object again.
→ Not quite. $_ isn't the command. It's the object being tested.
○ The whole list of objects, all at once.
→ Where-Object looks at one object at a time. $_ is that single object.
```

---
