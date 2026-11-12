# 3. Profiles

A profile is a script that PowerShell runs every time a window opens. It's where people keep the things they want in every session: a prompt they like, an alias, a folder they visit often, or a setting such as the PATH addition from the last step. Because it runs automatically, it's also one of the first places to look when a window behaves oddly on opening.

## Where the profile lives

PowerShell 7 has several profile files, and the one most people use is for the current user and the current program. Its path is stored in a variable called `$PROFILE`.

~~~powershell
$PROFILE
~~~

~~~text
Output:

C:\Users\jane\Documents\PowerShell\Microsoft.PowerShell_profile.ps1
~~~

Your path will show your own user folder. The file name, `Microsoft.PowerShell_profile.ps1`, is the part that matters. Windows PowerShell 5.1 keeps its profile in a `WindowsPowerShell` folder instead, which is one more reason to know which shell you're in.

~~~powershell
Split-Path $PROFILE -Leaf
~~~

~~~text
Output:

Microsoft.PowerShell_profile.ps1
~~~

`Split-Path -Leaf` keeps only the file name from a full path, which is handy when you want to report a name and not a location.

## What a profile does

A profile is an ordinary PowerShell script. Anything in it runs when a window opens, which can be useful or unwelcome.

~~~powershell
# A line in a profile file, run every time a window opens
Set-Location "C:\Development\ps-practice"
~~~

That would move every new window to the practice folder, which is convenient until you want to be somewhere else. A profile can also set environment variables, load helpers, and change the prompt, and each of those runs before you've typed anything.

The cost of a profile is time and surprise. A profile that takes several seconds to load makes every new window slow to open, and a profile that calls a program that isn't installed prints an error every time you open a window, even when you don't need that program.

> **Aside: the error that opens with every window.**
> If a window prints errors before you type anything, check the profile first. A line that calls a program which has since been removed, or a path that no longer exists, produces an error on every new window. The message names the file and the line, so the cure is usually to edit or remove that line.

## Editing the profile

The profile is a text file, so you can open it in any editor. If it doesn't exist yet, create it first.

~~~powershell
if (-not (Test-Path $PROFILE)) {
    New-Item -Path $PROFILE -ItemType File -Force | Out-Null
}
~~~

~~~text
Output:

(nothing)
~~~

The `-not` reverses the test, so the file is created only when it's missing. After that, `notepad $PROFILE` opens it, and the next window you open runs whatever you saved.

## Skipping the profile

Sometimes you want a window, or a script, to start clean, with no profile running. `-NoProfile` does that, and it's the switch the setup scripts use. It makes every run behave the same, whatever the person running it has in their profile.

~~~powershell
pwsh -NoProfile -Command "Write-Output 'Started without the profile'"
~~~

~~~text
Output:

Started without the profile
~~~

The reader runs your exercises this way for the same reason, so the output doesn't depend on anyone's profile. When you write a script that others will run, consider making it work with `-NoProfile`, so it doesn't depend on settings it can't see.

## Try it

This exercise prints the file name of the profile PowerShell uses. The check compares the line.

Write one line in the starter file, below the comment. It must print:

~~~text
Profile file: Microsoft.PowerShell_profile.ps1
~~~

Use `Write-Output` with `Split-Path $PROFILE -Leaf` inside `$(...)`, in double quotes, after the words `Profile file: `.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Printing `$PROFILE` by itself, which gives the full path with your user folder in it. The exercise wants only the file name, so add `Split-Path -Leaf`.

---
