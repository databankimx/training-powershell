# 12. Debugging a Script

Every script has bugs at some point, and most of them are small. A variable is spelled two ways, a loop runs one time too many, a value is replaced instead of added to. Debugging is the work of finding which of these is happening, and it's a skill you'll use for the rest of your time with scripts.

The good news is that PowerShell gives you several ways in, and most bugs yield to one of them. This chapter teaches the three that matter most: let the shell catch the mistakes it can see, print the values that matter, and read the line an error points to.

## What you'll do

1. **Let the shell catch mistakes.** Turn on strict mode, so typos and undefined names become errors you can see.
2. **Print what the script is doing.** Use `Write-Verbose` and `Write-Host` to watch values change, and know which output is which.
3. **Find and fix a bug.** Work from a script that gives the wrong answer, and correct it.
4. **Summary.** Put the chapter together, and try the quizzes.

## Before you start

Each exercise starts from a script that contains a bug. Your job is to find it and fix it, so the check passes. The lessons show the techniques on small examples first, so you'll have seen each one before you need it.

Open PowerShell 7 before you begin, and check the version if you're not sure.

---
