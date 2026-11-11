# 1. Environment Variables

An environment variable is a named setting that the operating system keeps and passes to every program that starts. It looks a lot like a PowerShell variable, but it belongs to the computer, not to the script. Programs read these settings to learn things such as where to put temporary files, which user is running them, and which folders hold the tools they need.

## Reading environment variables

In PowerShell, environment variables live under `$env:`. The name comes after the colon, and it's read like any other variable.

~~~powershell
$env:COMPUTERNAME
~~~

~~~text
Output:

DESKTOP-EXAMPLE
~~~

Your computer's name will be different, which is the point. The value belongs to your machine, and a script can read it to know where it's running.

~~~powershell
Write-Output "Temporary files go in: $env:TEMP"
~~~

~~~text
Output:

Temporary files go in: C:\Users\jane\AppData\Local\Temp
~~~

Inside double quotes, `$env:TEMP` is replaced by its value, just as a normal variable would be. The path in the example belongs to one user, and yours will look different.

## Setting one for the current session

You can set an environment variable with an equals sign, the same way you set a variable. The change applies to the current window and to any program it starts from there. It doesn't touch the computer's settings, and it vanishes when the window closes.

~~~powershell
$env:GREETING = "Hello"
Write-Output "$env:GREETING from the environment"
~~~

~~~text
Output:

Hello from the environment
~~~

Programs started from this window now see `GREETING`, and a new window doesn't. That's the first lesson of the chapter: a setting made in one session stays in that session unless you save it somewhere permanent.

## Saving a setting for good

To make a setting last, store it with `[Environment]::SetEnvironmentVariable`. It takes a name, a value, and a scope. The scope `User` applies to your account, and `Machine` applies to every account on the computer.

~~~powershell
[Environment]::SetEnvironmentVariable("GREETING", "Hello", "User")
~~~

~~~text
Output:

(nothing)
~~~

This writes the setting to your user profile. New windows will see it, but windows that were already open won't, and nor will any program that was running before the change. Setting a `Machine` value needs an Administrator window, and it affects every account, so use it only when you mean it.

> **Aside: the variable you can't see.**
> A setting saved with `SetEnvironmentVariable` won't appear in the window where you set it, and that surprises people every time. The current session keeps its own copy. Open a new window, or copy the value into `$env:` in the current one, and the setting shows up.

## Removing a setting

Setting a variable to nothing removes it for the current session.

~~~powershell
$env:GREETING = $null
Write-Output "Greeting is: [$env:GREETING]"
~~~

~~~text
Output:

Greeting is: []
~~~

The brackets in the output show that the value is empty, which is easy to miss without them. The setting is gone from this session, but any saved `User` value would still be there in a new window.

## Try it

This exercise sets an environment variable for the current session, then reads it back in a sentence. The check compares the line, and nothing is saved to your computer.

Write two lines in the starter file, below the comment:

1. A line that sets `$env:GREETING` to `Hello`.
2. A `Write-Output` line that prints `Hello from the environment`, using `$env:GREETING` in double quotes, followed by the words ` from the environment`.

The expected output is `Hello from the environment`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Writing `$GREETING` instead of `$env:GREETING`. Without the `env:`, PowerShell reads an ordinary variable with that name, which is a different thing from the environment setting. The line sets one and reads the other, and the output is wrong.

---
