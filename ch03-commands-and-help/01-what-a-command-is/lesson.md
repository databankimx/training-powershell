# 1. What a Command Is

Every command you've typed so far has the same shape, and once you can see it, a lot of PowerShell stops looking like a list of random words. The shape is a verb, a dash, and a noun. Then come the parameters, which tell the command what to work on and how.

## Verb and noun

Look at a few of the commands you know.

~~~powershell
Get-ChildItem
Set-Content
Remove-Item
Copy-Item
~~~

Each one is a verb and a noun, joined by a dash. `Get` is the verb, meaning "fetch something", and `ChildItem` is the noun, meaning "the things inside a folder". Put them together and you get "get the child items", which is exactly what the command does.

The verbs are chosen from a fixed list, so the same verb means the same kind of action wherever you meet it. `Get` always fetches. `Set` always changes something. `Remove` always deletes. Once you know the verbs, you can guess a command's behavior from its name, and you won't be far wrong.

Here are some of the verbs you'll see most.

~~~text
Get      fetch something, and change nothing
Set      change something that already exists
New      make something new
Add      add to something that already exists
Remove   delete something
Copy     make a second copy
Move     move something somewhere else
Test     check whether something is true, and answer True or False
~~~

> **Aside: why Get changes nothing.**
> A `Get` command is safe to run as often as you like, because it only reads. That's a promise the verb makes, and it's why people run `Get-` commands to see what's going on before they run anything that changes things. When a command's verb is Get, the worst it can do is show you something you didn't expect.

## Parameters

A parameter tells a command what to work on. It starts with a dash and a name, and then comes the value.

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -Filter "*.txt"
~~~

Here `-Path` and `-Filter` are the parameters, and each one is followed by its value. You can put them in any order, because PowerShell matches them by name. You can also leave out the name of the first parameter, in many commands, and the value is taken as the default. `Get-ChildItem "C:\Development\ps-practice"` works, because `-Path` is the first thing PowerShell expects.

Naming the parameter is clearer, and clearer is better in a script. Write the names, even when you don't strictly need to.

## Switches

A switch is a parameter with no value. Its presence turns something on, and its absence leaves it off. You met one in Chapter 4, when you used `-Name`.

~~~powershell
Get-ChildItem -Path "C:\Development\ps-practice" -Name
~~~

`-Name` is a switch. You don't write `-Name $true`, and you don't write `-Name "yes"`. You write `-Name`, and that's the whole instruction.

Some switches are paired with an opposite, such as `-Recurse`, and a few are sensible to combine. `-WhatIf` is a switch you already know, which asks a command to describe its work without doing it.

## Reading a command you don't know

When you meet a new command, break it apart the same way every time. Ask for its verb and its noun, and then look up its parameters.

~~~powershell
(Get-Command Get-Date).Verb
~~~

~~~text
Output:

Get
~~~

~~~powershell
(Get-Command Get-Date).Noun
~~~

~~~text
Output:

Date
~~~

`Get-Command` tells you about a command, and `.Verb` and `.Noun` pick out its two halves. You'll look up parameters in the next step, using help.

## Try it

This exercise takes a command apart, and prints its verb and noun. The check compares the sentence exactly.

Write one line in the starter file, below the comment. It should print:

~~~text
Verb: Get Noun: Date
~~~

Use `Write-Output`, with `(Get-Command Get-Date).Verb` and `(Get-Command Get-Date).Noun` inside `$(...)` in double quotes. Put a single space between the words, as in the example.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Putting the verb and noun inside one set of brackets, such as `(Get-Command Get-Date).Verb Noun`, and expecting both to appear. Each property needs its own `$(...)` inside the string, or PowerShell can't tell which part is a value and which is plain text.

---
