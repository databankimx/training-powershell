# 3. Switches and Checks

Some parameters are on or off, and some should only accept certain values. A switch covers the first case, and a few attributes in front of a parameter cover the second. Together they let a script refuse bad input early, with a clear message, rather than failing partway through.

## Switches

A switch is a parameter with no value. You met one in Chapter 4, with `-Name` on `Get-ChildItem`. A script can declare its own, with the type `[switch]`.

~~~powershell
param(
    [string]$Text,
    [switch]$Upper
)

if ($Upper) {
    $Text.ToUpper()
} else {
    $Text
}
~~~

Save that as `label.ps1`, and run it two ways.

~~~powershell
.\label.ps1 -Text "ready"
~~~

~~~text
Output:

ready
~~~

~~~powershell
.\label.ps1 -Text "ready" -Upper
~~~

~~~text
Output:

READY
~~~

Inside the script, `$Upper` is true when the switch is given, and false when it isn't. The `if` line checks that, and runs the first block when it's true and the second when it's false. You'll see `if` more in the chapters ahead, so for now the rule is simple: a switch is on when it's present.

## Mandatory parameters

Some parameters can't sensibly have a default. A file to read, or a name to delete, has to come from the caller. Mark such a parameter as mandatory, and PowerShell asks for the value if it's missing.

~~~powershell
param(
    [Parameter(Mandatory)]
    [string]$Path
)

Write-Output "Reading $Path"
~~~

~~~powershell
.\read.ps1
~~~

~~~text
Output:

Supply values for the following parameters:
Path:
~~~

The output shows PowerShell asking for `Path` before the script can run. Type a value, and the script continues. This is the answer to the question from the first step: a mandatory parameter can't be silently empty.

The exact prompt text can differ between versions, but the idea is the same. The script waits for the value, and nothing runs until it has one.

## Limiting the values

`ValidateSet` lists the only values a parameter will accept. Anything else is refused before the script's lines run.

~~~powershell
param(
    [Parameter(Mandatory)]
    [ValidateSet("Small", "Medium", "Large")]
    [string]$Size
)

Write-Output "Size chosen: $Size"
~~~

~~~powershell
.\order.ps1 -Size "Huge"
~~~

~~~text
Output:

(an error saying "Huge" is not in the list of valid values, and the script doesn't run)
~~~

The check happens before any line of the script runs, so a bad value can't cause a half-finished job. `ValidateSet` is one of several checks PowerShell offers. `ValidateRange` limits a number, and `ValidatePattern` matches text against a pattern.

> **Aside: why the check comes first.**
> A script that fails halfway through can leave things changed and nothing finished. Checks at the top of the `param` block fail before any work starts, which is why they're worth the few extra words. Put the rules where the values come in, and the rest of the script can trust what it receives.

## Try it

This exercise defines a function with a switch, calls it twice, and prints both results. The check compares the two lines.

Write your script in the starter file, below the comment. It must:

1. Define a function called `Format-Label` with a `param` block that has `[string]$Text` and `[switch]$Upper`.
2. Inside the function, return `$Text.ToUpper()` when `$Upper` is on, and `$Text` otherwise. Use an `if` with an `else` for this.
3. Write `Write-Output (Format-Label -Text "ready")`, which prints the text unchanged.
4. Write `Write-Output (Format-Label -Text "ready" -Upper)`, which prints the text in capitals.

The expected output is two lines: `ready` and `READY`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Giving a switch a value, such as `-Upper "yes"`. A switch takes no value. The `"yes"` is read as an extra argument, and the switch is either left off or the call fails. Write `-Upper` on its own.

---
