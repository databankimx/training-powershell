# 5. Summary: Running Programs

You can now start a program from a script, read the text it prints, store that text, and read the exit code it reports. You also know that PowerShell is a good way to connect programs and a poor way to write a large one, and what to reach for when a script outgrows itself.

## What you learned

- Programs are started by name, and they print text. PowerShell receives that text as strings, not objects.
- `cmd /c` runs a single command from `cmd`, which is on every Windows computer.
- `$LASTEXITCODE` holds the exit code of the last program. Zero means success, and anything else means something went wrong.
- Read `$LASTEXITCODE` straight after the program you're checking, because the next program overwrites it.
- An `if` on `$LASTEXITCODE` lets a script act on the result.
- `$found = cmd /c ...` stores a program's output in a variable. Several lines become a list.
- `2>&1` joins a program's error text to its normal output.
- Check the exit code as well as the output, because an empty result can mean either outcome.
- PowerShell suits glue work: connecting programs, moving files, and checking results.
- When a script passes about a hundred lines, or needs structure, tests, or a user interface, it's probably a program. Write it in .NET, usually C#, and call it from a short script if you need to.

## Try it

This exercise captures a program's output, runs a program that exits with a code, and prints both. Your script must:

1. Store the output of `cmd /c echo ready` in a variable called `$state`.
2. Run `cmd /c "exit 2"`.
3. Print `Output: ` followed by `$state`.
4. Print `Exit code: ` followed by `$LASTEXITCODE`.

The expected output is two lines: `Output: ready` and `Exit code: 2`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

## Quizzes

Three questions, one for each big idea in the chapter. Pick an answer, and read the explanation whichever way it goes.

```quiz
A program prints "Success" in its output, but its exit code is 1. Which should a script trust?
○ The printed word, because it's what the program actually says.
→ Not quite. Text can be misleading, and the exit code is the promise a program makes about its result.
○ Neither, because the two disagree and the script should stop without checking.
→ Stopping is reasonable, but the exit code is still the signal to follow. Checking it is the first step, not an abandonment.
◉ The exit code, because a non-zero number means the program reports a failure.
→ Right. The exit code is the reliable signal, and the printed text can change between versions.
```

```quiz
You run a program, then run a second program, then read $LASTEXITCODE. What does it hold?
○ The exit code of the first program, because it's kept for the whole script.
→ Not quite. The variable is refreshed by every program, so the first value is gone.
◉ The exit code of the second program, because the variable is refreshed each time.
→ Right. Read the variable straight after the program you're checking.
○ Nothing, because PowerShell clears it when a second program starts.
→ It isn't cleared. It's replaced by the newest program's exit code.
```

```quiz
A script has grown to about 300 lines, has many functions and shared data, and other people now depend on it. What is the best next step?
◉ Rebuild it as a .NET program, usually in C#, and keep a short script to run it if needed.
→ Right. A compiled program suits this size, and it can be tested, typed, and shared as an executable.
○ Add more functions, because PowerShell can handle any size of script.
→ Functions help, but the costs of a large PowerShell script keep growing. Structure and testing are the real limits.
○ Delete the script, because large scripts are always a mistake.
→ The script has done its job. The better step is to rebuild it as a program, not to throw it away.
```

---
