# 1. Parameters

A parameter is a value a script expects to be given when it runs. You declare the parameters at the top of the script, in a block that starts with the word `param`, and the script then uses them like variables.

## A script with a parameter

Here's a small script that greets someone. It takes one parameter, called `Name`.

~~~powershell
param(
    [string]$Name
)

Write-Output "Hello, $Name"
~~~

Save that as `greet.ps1`. The `[string]` in front of `$Name` says the value must be text. The `$Name` after it is the parameter, and inside the script it behaves like any other variable.

Run it with a value, using the parameter's name after a dash.

~~~powershell
.\greet.ps1 -Name "Ada"
~~~

~~~text
Output:

Hello, Ada
~~~

The name after `-Name` is the value that's passed in. Change it, and the greeting changes. The script hasn't been edited, and it doesn't need to be.

## Default values

A parameter can have a default, which is the value it takes when nobody passes one. Write the default after an equals sign.

~~~powershell
param(
    [string]$Name = "friend"
)

Write-Output "Hello, $Name"
~~~

~~~powershell
.\greet.ps1
~~~

~~~text
Output:

Hello, friend
~~~

With no value passed, the default is used. With `-Name "Ada"`, the passed value replaces it. A parameter with a default is optional, and one without a default is wherever the script expects you to supply something.

## Several parameters

A script can take as many parameters as it needs. Separate them with commas inside the block.

~~~powershell
param(
    [string]$Name = "friend",
    [int]$Count = 1
)

for ($i = 0; $i -lt $Count; $i++) {
    Write-Output "Hello, $Name"
}
~~~

~~~powershell
.\greet.ps1 -Name "Ada" -Count 2
~~~

~~~text
Output:

Hello, Ada
Hello, Ada
~~~

`[int]` means a whole number. The loop runs the greeting once for each count. You'll meet loops in more detail later on, so for now the point is simply that two parameters arrive together, and the script uses both.

## Passing values by name

Naming each parameter is clearer than relying on position. Compare these two calls. They do the same thing, but the second is easier to read.

~~~powershell
.\greet.ps1 "Ada" 2
~~~

~~~powershell
.\greet.ps1 -Name "Ada" -Count 2
~~~

When the names are given, the order doesn't matter, so `-Count 2 -Name "Ada"` also works. Without names, PowerShell fills the parameters in the order they're declared. Naming them is the habit to build, especially in a script that someone else will read.

> **Aside: the parameter you forgot.**
> A parameter with no default, and no value passed, is empty. The script runs anyway, and a line that uses it prints nothing for that part. It's the same silent failure you met with variables in Chapter 5. A `Mandatory` setting makes PowerShell ask for the value instead, which you'll see in the next step.

## Try it

This exercise writes a script with a parameter, and runs it with the default value. The reader passes no arguments, so the output comes from the default.

Write your script in the starter file, below the comment. It must:

1. Declare a `param` block with one parameter, `[string]$Name`, whose default is `"Ada"`.
2. Print `Hello, ` followed by the value of `$Name`, using `Write-Output` with a string in double quotes.

The expected output is `Hello, Ada`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Writing the default without the equals sign, such as `[string]$Name "Ada"`. PowerShell needs the `=` between the parameter and its default, and without it the line doesn't say what the default is.

---
