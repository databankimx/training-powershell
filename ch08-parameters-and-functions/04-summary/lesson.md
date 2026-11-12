# 4. Summary: Parameters and Functions

You can now give a script input with a `param` block, set defaults, and pass values by name. You can write a function, call it, and use what it returns. You also know how switches work, and how checks stop bad input before a script does any work.

## What you learned

- A `param` block at the top of a script declares the values it expects.
- A parameter with `= value` after it has a default, which is used when no value is passed.
- Pass values by name, such as `-Name "Ada"`, which is clearer than relying on order.
- A `[switch]` parameter is on when it's present, and it takes no value.
- `[Parameter(Mandatory)]` makes PowerShell ask for a value that's missing.
- `[ValidateSet]` and similar attributes refuse bad values before the script runs.
- `function` names a piece of work. Its `param` block declares the input.
- A function returns whatever it writes, so no `return` keyword is needed.
- Call a function with its name and parameters, and use the result in a variable or in `$(...)`.
- Keep a function's output clean, and assign anything you don't want to `$null`.

## Try it

This exercise puts the chapter together in a small function. Your script must:

1. Define a function called `Get-Total`, with a `param` block that takes `[int]$Price` and `[int]$Count`, where `$Count` defaults to `1`.
2. Inside the function, return `$Price * $Count`.
3. Print `Total: ` followed by the result of `Get-Total -Price 4 -Count 3`.
4. Print `One: ` followed by the result of `Get-Total -Price 4`, which uses the default count.

The expected output is two lines: `Total: 12` and `One: 4`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

## Quizzes

Three questions, one for each big idea in the chapter. Pick an answer, and read the explanation whichever way it goes.

```quiz
A script has a parameter declared as [string]$Folder = "C:\Development\ps-practice". The caller passes no value. What is $Folder inside the script?
◉ C:\Development\ps-practice, because the default is used when no value is passed.
→ Right. A default is the value a parameter takes when nobody supplies one.
○ An empty string, because a parameter starts empty and is filled only when passed.
→ Not quite. Declaring a default gives the parameter a value even when nothing is passed.
○ An error, because every parameter must be passed.
→ Only parameters marked Mandatory must be passed. Parameters with defaults are optional.
```

```quiz
A function called Get-Square has the line $Number * $Number and no return keyword. Calling Get-Square -Number 4 prints what?
○ Nothing, because a function needs return to produce output.
→ Not quite. The function returns whatever it writes, so the calculation is the output.
○ The text "$Number * $Number", because the line is printed as written.
→ The line is an expression, and PowerShell evaluates it. The text isn't printed as written.
◉ 16, because the last value the function writes is its output.
→ Right. The calculation runs, and its result is what the caller receives.
```

```quiz
A parameter is declared as [switch]$Verbose. Which call turns it on?
○ .\run.ps1 -Verbose $true
→ A switch takes no value, so the $true is read as a separate argument, not as the switch's setting.
◉ .\run.ps1 -Verbose
→ Right. A switch is on when it's present, and it takes no value.
○ .\run.ps1 -Verbose "on"
→ Giving a switch a value is not how switches work. Write -Verbose on its own.
```

---
