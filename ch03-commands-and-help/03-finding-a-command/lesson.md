# 3. Finding a Command

You don't need to know every command, and you won't. What you need is a way to find the right one when you've got a job to do and no name for it. `Get-Command` is that way, and it's the command you'll use when everything else has failed.

## Searching by verb and noun

Give `Get-Command` a verb, a noun, or both, and it lists the commands that match.

~~~powershell
Get-Command -Verb Set -Noun Content
~~~

~~~text
Output:

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Cmdlet          Set-Content                                        7.0.0.0    Microsoft.PowerShell.Management
~~~

You asked for a `Set` command that works with `Content`, and you got `Set-Content`. That's the one you want when you need to write text into a file. The table shows the command's type, its name, its version, and the module it comes from, which is a collection of related commands.

The `Version` column may differ on your computer. The name is the part to rely on.

## Searching with a wildcard

Use a star to search more broadly. The star means "anything", as it did with `-Filter` in Chapter 4.

~~~powershell
Get-Command -Verb Get -Noun "Child*"
~~~

~~~text
Output:

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Cmdlet          Get-ChildItem                                      7.0.0.0    Microsoft.PowerShell.Management
~~~

`Child*` matches any noun that starts with "Child". This is how you find a command when you remember a part of its name, and not the whole of it.

> **Aside: the list that's longer than you think.**
> A broad search can return a long list, because PowerShell has thousands of commands. Narrow the search with both a verb and a noun before you scroll through the results. If you get more than you can read, add a word.

## Finding a command by what it's for

`Get-Command` searches by name, not by purpose. When you know what you want to do but not what the command is called, search for a likely noun, and read the verbs that come back.

~~~powershell
Get-Command -Noun "Process"
~~~

~~~text
Output:

(a list of commands that work with processes, such as Get-Process, Stop-Process, and Start-Process)
~~~

Each name tells you a little about what it does, because the verb is chosen with care. Read the list for the verb that matches your task, and then use `Get-Help` on that command.

## A first look at Get-Member

Some commands return objects, and each object has properties and methods that you can use. `Get-Member` lists them. It's a command for finding out what you can do with a thing, and you'll use it more as the tutorial goes on.

~~~powershell
Get-Date | Get-Member -Name Year, Month, Day
~~~

~~~text
Output:

   TypeName: System.DateTime

Name  MemberType Definition
----  ---------- ----------
Day   Property   int Day {get;}
Month Property   int Month {get;}
Year  Property   int Year {get;}
~~~

The pipe passes the date object to `Get-Member`, which lists its properties. `Year`, `Month`, and `Day` are properties, which are values an object holds. You met one earlier in `$PSVersionTable.PSVersion.Major`, and you'll learn them properly in Chapter 6.

Leave out `-Name` to see everything the object has, which is a long list. Most of it you won't need yet, and that's fine.

## Try it

This exercise finds a command by its verb and noun, and prints its name in a sentence. The check compares the sentence exactly.

Write one line in the starter file, below the comment. It should print:

~~~text
Found: Set-Content
~~~

Use `Write-Output`, with `(Get-Command -Verb Set -Noun Content).Name` inside `$(...)` in double quotes. Keep the word `Found:` and the space after it exactly as shown.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Searching with a noun that's close but not quite right, and getting nothing back. `Get-Command -Noun "Contents"` finds nothing, because the command's noun is `Content`, with no s. If a search returns nothing, try a wildcard, such as `Content*`, to see what's close.

---
