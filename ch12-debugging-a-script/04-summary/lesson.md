# 4. Summary: Debugging a Script

You can now turn on strict mode so typos become visible, use the three kinds of output to see what a script is doing, and find a bug by printing values until the gap shows. You also know that the first line of an error and its line number are where to start.

## What you learned

- A misspelled variable is silent by default, because PowerShell treats an undefined name as empty.
- `Set-StrictMode -Version Latest` makes an undefined variable an error, which names the variable and the line.
- Strict mode errors can be caught with `try` and `catch`, like other errors.
- `Write-Output` sends the script's answer to the caller, and it's what a function returns.
- `Write-Host` prints a note to the screen only, and never into a value the script uses.
- `Write-Verbose` prints a note only when the caller asks for verbose output with `-Verbose`.
- To find a logic bug, say what you expect, print the values, and find the line where they go wrong.
- `$total = $price` in a loop replaces a total. `$total += $price` adds to it.
- Hard-coding an answer passes a check and fixes nothing. Fix the logic, so the function works for any input.
- A line that reads right is often the one that's wrong, so check the values before you trust a line.

## Try it

This exercise has a typo, and strict mode will report it. The starter file turns on strict mode, sets `$total` to `10`, and prints the total with a misspelled name. Fix the typo, so the output is correct.

Edit the starter file, and change only the misspelled name in the output line. Your script must print:

~~~text
Total: 10
~~~

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried. The error text names the variable, so read it before you look at the answer.

## Quizzes

Three questions, one for each big idea in the chapter. Pick an answer, and read the explanation whichever way it goes.

```quiz
Without strict mode, a script prints "Total:" with nothing after it, and no error appears. What is the most likely cause?
○ The total was calculated as zero, so there was nothing to print.
→ Possibly, but a silent empty value is more often a misspelled variable name.
◉ A variable name is misspelled, so PowerShell reads an empty variable with no error.
→ Right. An undefined variable is empty by default, which is why strict mode helps.
○ The output is being sent to a file instead of the screen.
→ Output goes to the screen unless it's redirected. A misspelled name is the more likely cause.
```

```quiz
You want a debugging note that shows only when someone runs the script with -Verbose. Which command writes it?
○ Write-Host, because it always reaches the screen.
→ Write-Host always shows, so it can't stay hidden until asked for.
○ Write-Output, because it's the command for any message.
→ Write-Output sends values to the caller, and it shows whenever the result is printed.
◉ Write-Verbose, because it prints only when -Verbose is given.
→ Right. The note stays hidden by default and appears when someone asks for it.
```

```quiz
A loop adds up prices, but the total equals only the last price. Which change fixes it?
◉ Change $total = $price to $total += $price, so each price is added to the total.
→ Right. The assignment replaced the total each time. The += adds to it.
○ Change the loop to run one time fewer, so the last price is left out.
→ That removes a price rather than adding them. The total would still be wrong.
○ Replace the total with the number 10, so the answer is always right.
→ That passes this one check, but it's a hard-coded answer and the bug remains for any other list.
```

---
