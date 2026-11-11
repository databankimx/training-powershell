# 4. Summary: Errors

You can now read an error from its first line, find it in `$Error`, and catch it with `try` and `catch`. You know what `finally` is for, and you can choose how errors behave, for one command or for a whole script. Most of the scripts you'll read in this collection rely on at least one of these.

## What you learned

- The first line of an error names the command and says what went wrong. Read it first.
- `$Error` keeps a list of recent errors, with the newest at position 0.
- `$Error[0].Exception.Message` gives the plain sentence from an error.
- Non-terminating errors let a script carry on. Terminating errors stop it.
- `-ErrorAction Stop` makes an error catchable, and `SilentlyContinue` hides it.
- `try` runs the work, `catch` runs only if something failed, and `finally` always runs.
- Inside `catch`, `$_` is the error that was caught.
- Keep a `try` block small, so it only catches the failure you meant to handle.
- `-ErrorVariable` captures an error in a variable, without a `try` block.
- `$ErrorActionPreference` sets the default for every command in a script. A command's own `-ErrorAction` wins over it.
- Quiet errors are the ones that cause the most trouble later, so decide on purpose how each one should behave.

## Try it

This exercise puts the chapter together in a small function. Your script must:

1. Define a function called `Test-File`, with a `param` block that takes `[string]$Path`.
2. Inside the function, try `Get-Item -Path $Path -ErrorAction Stop | Out-Null`, and return the word `Found` after it. Pipe to `Out-Null` so the item isn't printed.
3. In the `catch` block, return the word `Missing`.
4. Store the result of `Test-File -Path "C:\Development\ps-practice\missing.txt"` in a variable called `$result`.
5. Print `missing.txt: ` followed by `$result`.
6. Print `Checks run: 1`.

The expected output is two lines: `missing.txt: Missing` and `Checks run: 1`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

## Quizzes

Three questions, one for each big idea in the chapter. Pick an answer, and read the explanation whichever way it goes.

```quiz
A command fails with a red error, and the script carries on to the next line. Which kind of error was it?
○ A terminating error, because the script should always stop on a failure.
→ Not quite. A terminating error stops the script. This one let it carry on.
◉ A non-terminating error, which the script can carry on past.
→ Right. Non-terminating errors are reported but don't stop the script.
○ A syntax error, because the command was typed wrongly.
→ A syntax error is caught before the script runs. This one happened while it ran.
```

```quiz
You want a catch block to see a failure from Get-Item. What should you add to the Get-Item line?
○ -ErrorAction SilentlyContinue
→ That hides the error, so the catch never sees it.
○ -ErrorAction Continue
→ That shows the error and carries on, so the error is not passed to catch.
◉ -ErrorAction Stop
→ Right. Stop makes the error terminating, so the try block hands it to catch.
```

```quiz
Inside a finally block, which statement is true?
◉ It runs whether or not an error happened, so it suits cleanup.
→ Right. That's why finally is the place for steps that must always happen.
○ It runs only when the try block succeeds.
→ Not quite. finally runs whether or not something went wrong.
○ It runs only when the catch block has caught an error.
→ Not quite. finally doesn't depend on catch. It runs in every case.
```

---
