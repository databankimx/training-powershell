# 2. Functions

A function is a named piece of work. You write the steps once, give them a name, and then call the name whenever you need the work done. It's the way to stop a script from repeating itself, and the way to make each part of a script easy to read on its own.

## Writing a function

Here's a function that doubles a number. It takes one input, does one calculation, and gives the result back.

~~~powershell
function Get-Doubled {
    param([int]$Number)

    $Number * 2
}
~~~

The word `function` starts the definition, followed by the name. The name follows the same verb and noun pattern as the commands you already know, which is why `Get-Doubled` reads so naturally. Inside the braces, a `param` block declares the input, and the lines after it do the work.

The function doesn't print anything yet. It only defines the work, and nothing happens until it's called.

## Calling a function

Call a function by typing its name, with its parameters after it.

~~~powershell
Get-Doubled -Number 21
~~~

~~~text
Output:

42
~~~

The function ran `$Number * 2` with 21 in place of `$Number`, and the answer came back as output. That's the whole mechanism. A function takes input, does its work, and produces output that the caller can print, store, or pass on.

## Using the result

Because a function returns output, you can put its result in a variable, or in a sentence.

~~~powershell
$answer = Get-Doubled -Number 21
Write-Output "The answer is $answer"
~~~

~~~text
Output:

The answer is 42
~~~

The `$(...)` form from Chapter 5 works too, when the result belongs in a sentence.

~~~powershell
Write-Output "Doubled: $(Get-Doubled -Number 5)"
~~~

~~~text
Output:

Doubled: 10
~~~

## Functions that take text

Functions take any kind of input, and text is the most common. Here's one that builds a greeting from a name, and it reuses the same pattern as the script in the last step.

~~~powershell
function Get-Greeting {
    param([string]$Name)

    "Hello, $Name"
}

Get-Greeting -Name "Grace"
~~~

~~~text
Output:

Hello, Grace
~~~

The last line of the function is a string, so that string is its output. You don't need a `return` keyword to give back a value, though you may see one in other people's code. Whatever the function writes is what comes back.

> **Aside: the output you didn't mean to return.**
> Because a function returns everything it writes, a command that prints something on the side can leak into the result. A common example is a method that reports a result by accident. Assigning to `$null` throws the value away, so `$null = $list.Add($item)` keeps it out of the output. If a function returns more than you expected, look for a command inside it that prints without you noticing.

## Keeping functions short

A good function does one job, and its name says what the job is. If you find yourself writing a function that does three things, split it into three. Each piece is easier to read, test, and reuse, and the script that calls them reads like a list of steps.

## Try it

This exercise defines a function, calls it with an argument, and prints the result in a sentence. The reader calls nothing for you, so the function call is part of your script.

Write your script in the starter file, below the comment. It must:

1. Define a function called `Get-Doubled` with a `param` block taking `[int]$Number`, and returning `$Number * 2`.
2. Print `Doubled: ` followed by the result of `Get-Doubled -Number 21`, using `$(...)` inside double quotes.

The expected output is `Doubled: 42`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Writing the function and forgetting to call it. A definition on its own prints nothing, so the output is empty. The call, `Get-Doubled -Number 21`, has to appear after the function, inside the sentence.

---
