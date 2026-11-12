# 1. The Check Function

Every check in the capstone is a function with the same shape. It takes the name of one tool, asks PowerShell whether that tool can be found, and returns a single word: `ok` or `missing`. One function per check keeps each piece small, and the words it returns are what the summary prints later.

## Asking whether a tool exists

`Get-Command` finds commands by name, and it finds programs on the `PATH` as well as PowerShell's own commands. That's the question a check needs answered. If `Get-Command` finds nothing, it reports an error, and `-ErrorAction SilentlyContinue` keeps that error out of the way, as you saw in Chapter 9.

~~~powershell
Get-Command -Name "cmd" -ErrorAction SilentlyContinue
~~~

~~~text
Output:

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Application     cmd.exe                                            10.0...    C:\Windows\system32\cmd.exe
~~~

When the tool is there, `Get-Command` returns a description of it. When it isn't, it returns nothing at all, as in the next example.

~~~powershell
Get-Command -Name "collection-missing-tool" -ErrorAction SilentlyContinue
~~~

~~~text
Output:

(nothing)
~~~

The check doesn't need the description. It only needs to know whether there is one, and an empty result is the answer `missing`.

## Writing the check

Here's a check for one tool. It takes a name, asks `Get-Command`, and returns the word that matches the answer.

~~~powershell
function Test-Tool {
    param([string]$Name)

    $found = Get-Command -Name $Name -ErrorAction SilentlyContinue
    if ($found) {
        "ok"
    } else {
        "missing"
    }
}
~~~

~~~powershell
Write-Output "cmd: $(Test-Tool -Name 'cmd')"
Write-Output "collection-missing-tool: $(Test-Tool -Name 'collection-missing-tool')"
~~~

~~~text
Output:

cmd: ok
collection-missing-tool: missing
~~~

The `if ($found)` test is true when there's something in the variable, and false when it's empty. That's the same idea as the switch test in Chapter 8, applied to a value that might be nothing.

> **Aside: the tool that exists but doesn't work.**
> `Get-Command` finds a program if the file is on the `PATH`, but it doesn't check that the program runs. A broken installation can pass this check. A stronger checker would also run the tool with `--version` and look at its exit code, which Chapter 10 covered. This checker stays with the simpler test, because it's the one that works on every machine.

## Try it

This exercise writes the check function, then uses it on two names. The check compares both lines.

Write your script in the starter file, below the comment. It must:

1. Define a function called `Test-Tool` with a `param` block that takes `[string]$Name`.
2. Inside the function, store `Get-Command -Name $Name -ErrorAction SilentlyContinue` in `$found`, then return `ok` if `$found` has a value, and `missing` if it doesn't. Use an `if` with an `else`.
3. Print `cmd: ` followed by `Test-Tool -Name 'cmd'`.
4. Print `collection-missing-tool: ` followed by `Test-Tool -Name 'collection-missing-tool'`.

The expected output is two lines: `cmd: ok` and `collection-missing-tool: missing`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Returning the description from `Get-Command` instead of the word. The function then prints a table row instead of `ok`, and the summary won't line up. Return only the two words.

---
