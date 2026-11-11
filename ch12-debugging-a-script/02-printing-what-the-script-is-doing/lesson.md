# 2. Printing What the Script Is Doing

When a script gives the wrong answer, the fastest way to find out why is usually to look at the values it's working with. A line that prints a variable, placed at the right spot, shows you what the script believed at that moment. Most debugging is a matter of asking that question in the right places.

PowerShell has three ways to print, and they behave differently. Knowing which one to use keeps your debugging out of the way of the script's real output.

## Write-Output: the script's answer

`Write-Output` sends a value to the caller. It's the output you've used throughout the tutorial, and it's what a function returns. Anything written this way can be stored, piped, or passed on.

~~~powershell
function Get-Double {
    param([int]$Number)

    Write-Output ($Number * 2)
}

$result = Get-Double -Number 4
Write-Output "Result: $result"
~~~

~~~text
Output:

Result: 8
~~~

Because `Write-Output` is the answer, use it for the values the script produces, and nothing else.

## Write-Host: a note for the screen

`Write-Host` prints text straight to the screen. It doesn't go to the caller, so it can't be stored in a variable or piped onward. That makes it good for a note a person should see, and dangerous for anything the script needs to use later.

~~~powershell
function Get-Double {
    param([int]$Number)

    Write-Host "Doubling $Number"
    Write-Output ($Number * 2)
}

$result = Get-Double -Number 4
Write-Output "Result: $result"
~~~

~~~text
Output:

Doubling 4
Result: 8
~~~

The note reaches the screen, and the result still comes back as the function's output. The variable holds only the `8`. That's why `Write-Host` is the safer choice for a note: it can't leak into a value the script depends on.

## Write-Verbose: a note you ask for

`Write-Verbose` prints a message only when the caller asks for verbose output, with `-Verbose`. By default, it stays quiet, so a script can carry debugging messages without showing them to people who don't want them.

~~~powershell
function Get-Double {
    param([int]$Number)

    Write-Verbose "Doubling $Number"
    Write-Output ($Number * 2)
}

Get-Double -Number 4
Get-Double -Number 4 -Verbose
~~~

~~~text
Output:

8
VERBOSE: Doubling 4
8
~~~

The first call prints only the answer. The second, with `-Verbose`, also shows the message, marked `VERBOSE:`. This is the best option for debugging messages you may want to switch on later, because you don't need to remove them when you're finished.

> **Aside: the debugging line you forgot to remove.**
> A `Write-Host` left in a script after debugging is a common reason for a script that prints extra text and confuses whoever runs it. A `Write-Verbose` never has that problem, which is why it's usually the better choice for a message you might want again.

## Choosing the right one

Use `Write-Output` for the script's answer. Use `Write-Verbose` for debugging notes you may want to see again. Use `Write-Host` for a note a person must see, such as a progress message, and never for a value the script depends on.

## Try it

This exercise defines a function that writes a verbose note, then calls it. The reader runs without `-Verbose`, so the note stays hidden, and only the result appears. The check compares the line.

Write your script in the starter file, below the comment. It must:

1. Define a function called `Get-Triple` with a `param` block that takes `[int]$Number`.
2. Inside the function, write a verbose note with `Write-Verbose "Tripling $Number"`.
3. Inside the function, output `$Number * 3`.
4. Print `Result: ` followed by the result of `Get-Triple -Number 5`, using `$(...)` inside double quotes.

The expected output is `Result: 15`. The verbose note doesn't appear, because nothing asks for verbose output.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Replacing `Write-Verbose` with `Write-Host` to make the note appear. It then shows in the output and changes what the check sees. The note is supposed to stay hidden here.

---
