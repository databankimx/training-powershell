# 4. Summary: Commands and Help

You can now read a command's name and see its parts, ask PowerShell for its help, and search for a command you can't name. Those three skills mean you can find out what almost any command does, without needing to remember it.

## What you learned

- A command is a verb, a dash, and a noun. The verb tells you the kind of action, so `Get` reads and `Remove` deletes.
- Parameters start with a dash and take a value. A switch starts with a dash and takes none.
- `(Get-Command Name).Verb` and `.Noun` pick out the two halves of a command's name.
- `Get-Help` shows a command's help. `NAME`, `SYNOPSIS`, and `SYNTAX` answer most questions.
- `-Examples` shows how the command is used, and it's usually the quickest way to learn one.
- `-Parameter` shows one parameter's help, and `-Full` shows the whole page.
- `(Get-Help Name).Synopsis` pulls out one piece of help, for use in a script.
- `Get-Command -Verb` and `-Noun` search by the two halves of a name, and a star matches a part of one.
- `Get-Member` lists what an object's properties and methods are, which you'll use more in Chapter 6.

## Try it

This exercise puts the three skills together. Write three lines in the starter file, below the comment:

1. A `Write-Output` line that prints `Verb: ` followed by the verb of `Remove-Item`, using `(Get-Command Remove-Item).Verb`.
2. A `Write-Output` line that prints `Help for: ` followed by the name from `(Get-Help Clear-Host).Name`.
3. A `Write-Output` line that prints `Found: ` followed by the name of the command you find with `Get-Command -Verb Set -Noun Content`.

The expected output is three lines: `Verb: Remove`, `Help for: Clear-Host`, and `Found: Set-Content`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

## Quizzes

Three questions, one for each big idea in the chapter. Pick an answer, and read the explanation whichever way it goes.

```quiz
Which command is safe to run as often as you like, because its verb promises it changes nothing?
○ Remove-Item, because it only reports what it would delete.
→ Not quite. Remove deletes things, so it's the opposite of safe. Its verb is the warning.
◉ Get-ChildItem, because Get commands only read.
→ Right. A Get command fetches information and changes nothing, so it's a good first step.
○ Set-Content, because it writes a file without asking.
→ Set writes and changes things, so it's not the safe one. Set-Content can overwrite a file.
```

```quiz
You want to know what the -Filter parameter of Get-ChildItem expects, without reading the whole help page. Which command gives you just that?
○ Get-Command Get-ChildItem
→ That finds the command, but it doesn't describe a parameter.
○ Get-Help Get-ChildItem -Full
→ That works, but it shows the whole page. Use -Parameter for one parameter.
◉ Get-Help Get-ChildItem -Parameter Filter
→ Right. -Parameter shows just the one entry you asked about.
```

```quiz
You remember that a command has "Child" in its noun, but not the rest of its name. Which search finds it?
◉ Get-Command -Noun "Child*"
→ Right. The star matches any noun that starts with Child, so you find ChildItem.
○ Get-Command -Noun Child
→ That's close, but it only matches the exact noun Child. Use a star to match anything that starts with it.
○ Get-Help -Noun "Child*"
→ Get-Help reads a command's help page, and it doesn't search by noun. Use Get-Command.
```

---
