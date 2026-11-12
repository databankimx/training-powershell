# 4. Summary: Variables and Strings

You can now store a value in a variable, read it back, and use it in a sentence. You know which quotes to use and why, and you can ask a string for its length or its upper-case form. Those are the building blocks of almost every script, and you'll use them in each chapter from here on.

## What you learned

- A variable is a named box, written with a dollar sign in front. `=` puts a value in it.
- Typing a variable's name on its own prints its value, and a variable without a dollar sign is just a word.
- Reassigning replaces the old value. `$count = $count + 1` builds on it.
- Single quotes keep text exactly as written, dollar signs and all.
- Double quotes replace variables with their values, so the sentence follows the variable.
- `$(...)` puts the result of an expression into a double-quoted string, which is how you reach a property.
- A quote of one kind can sit inside the other kind, a single quote is doubled inside single quotes, and a backtick escapes a double quote inside double quotes.
- Quote any path with a space in it.
- Properties are read without brackets, and methods need brackets, even when they take nothing.
- `Replace`, `Trim`, `ToLower`, and `ToUpper` change text, and `-replace` matches a pattern.
- A here-string holds several lines. `@"` and `"@` work like double quotes, and `@'` and `'@` take the text as written.

## Try it

This exercise puts the chapter together in one small report. Write three lines in the starter file, below the comment:

1. A `Write-Output` line that prints `Folder: ` followed by the value of `$folder`, where `$folder` is `C:\Development\ps-practice`. Store the path in `$folder` first.
2. A `Write-Output` line that prints `Characters: ` followed by the length of `$folder`.
3. A `Write-Output` line that prints `Upper: ` followed by `$folder` in upper case.

The expected output is three lines: `Folder: C:\Development\ps-practice`, `Characters: 26`, and `Upper: C:\DEVELOPMENT\PS-PRACTICE`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

## Quizzes

Three questions, one for each big idea in the chapter. Pick an answer, and read the explanation whichever way it goes.

```quiz
You write "Cost: $5" with double quotes, and the output shows "Cost: " with nothing after it. What happened?
○ The output was cut short, because double quotes can hold only a few characters.
→ Not quite. The length isn't the problem. Look at what the dollar sign is doing.
◉ PowerShell read $5 as a variable, found nothing in it, and printed nothing in its place.
→ Right. A dollar sign inside double quotes starts a variable name. Single quotes keep it literal.
○ Double quotes can't hold numbers, so the number was dropped.
→ Double quotes can hold numbers. The problem is the dollar sign in front of this one.
```

```quiz
You want to print the length of a string inside a sentence. Which line does that?
○ "The length is $folder.Length"
→ That prints the path followed by the text .Length. A property needs $(...) inside double quotes.
○ "The length is ($folder.Length)"
→ Parentheses alone don't make PowerShell evaluate the property. Use the dollar sign and brackets.
◉ "The length is $($folder.Length)"
→ Right. The $(...) runs the expression first, and then puts the result in the sentence.
```

```quiz
Why does $folder.ToUpper without brackets not change the text?
◉ ToUpper is a method, and a method runs only when you write its brackets.
→ Right. Without the brackets, PowerShell shows you the method's details and does nothing else.
○ ToUpper only works on strings that are already upper case.
→ Not quite. The method works on any string. It just needs to be called.
○ Variables can't be changed in place, so the upper-case copy is thrown away.
→ Variables can be changed. This one wasn't asked to run, which is the real reason.
```

---
