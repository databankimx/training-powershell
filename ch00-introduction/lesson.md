# 0. Introduction

Welcome. This tutorial teaches you PowerShell, which is the program you'll use to run most of the setup scripts and commands in this collection. If you've never opened a terminal before, you're in the right place. Nobody starts out knowing this, and most people who are good at it started exactly where you are now.

## What a terminal is

A terminal is a window where you type a command and the computer types a reply. You've used a terminal already, even if you didn't call it that. Every time you've typed a web address, that was a request to a program somewhere. A terminal lets you make those requests directly, to the computer itself.

Here is a command you might type, and what it looks like when it works.

~~~powershell
Get-Date
~~~

~~~text
Output:

Tuesday, November 10, 2026 9:14:22 AM
~~~

Your output will show the date and time on your computer, which will be different from the example. The command is the part that matters.

## What a shell is

A terminal is the window. The shell is the program inside the window that reads what you type and does something with it. Windows has more than one shell. This tutorial teaches PowerShell, which is the one the collection uses.

You'll sometimes see the two words used as if they mean the same thing. They don't, and the difference matters once you start changing settings in Chapter 1.

The shell is the part with opinions. Different shells understand different commands, and the same task can look completely different in each of them. Here are three ways to ask for the same list of files, one in each of three shells.

~~~powershell
Get-ChildItem
~~~

~~~text
dir
~~~

~~~text
ls
~~~

The first one is PowerShell. The second is the Command Prompt, and the third is Bash, which you may meet in other tutorials. Each one reads a different language, and each one would be confused by the others. That's not a flaw. It's a reminder that you need to know which shell you're in.

## What PowerShell is

PowerShell is a shell, and a scripting language, and a set of tools for working with your computer. It's the one that Microsoft recommends for most Windows work, and it's the one this collection uses for setup.

PowerShell has two main ideas, and the rest of the tutorial builds on both.

**Commands return objects, not just text.** When you list files, you don't only get a list of names. You get objects with names, sizes, dates, and more. You can ask for any part of them.

**Commands pass their results along a pipeline.** The vertical bar, `|`, takes the result of one command and hands it to the next. You'll use it all the time, and you'll see it first in Chapter 6.

Here's a taste of both, so you know what's coming. Don't worry if it doesn't make sense yet.

~~~powershell
Get-ChildItem | Sort-Object Length -Descending | Select-Object -First 3 Name, Length
~~~

~~~text
Output:

Name         Length
----         ------
setup.ps1      4120
README.md      2310
LICENSE        1073
~~~

Read it from left to right. Get the files, sort them by size, keep the first three, and show their names and sizes. That's a whole task in one line, and you'll write lines like it by the end of Chapter 6.

## Why this tutorial exists

The other tutorials in this collection assume you can open PowerShell, move to a folder, and run a script. They say so once, and then they get on with their subject. If that assumption doesn't hold for you, the other tutorials stop being useful very quickly.

Here's a short list of the places it comes up:

- The setup scripts start in a PowerShell window, and their messages are written for PowerShell readers.
- The quickstarts say things like `cd` and `npm start`, and they expect you to know which folder you're in.
- The Git tutorial has you type commands into a terminal, and it's no help if you can't find one.
- Error messages often mention a path or a line number that means nothing until you know how to read them.

This tutorial makes all of that ordinary. It will take a few hours, not a few weeks.

## How this tutorial is laid out

The tutorial has chapters, and each chapter has lessons. Most lessons end with an exercise. You type a script in the Source pane, press Run, and compare the output with the sample. A check tells you whether you got it right. If you're stuck, the hint helps. If you're still stuck, the spoiler button shows one correct answer. Use the spoiler after you've tried, not before. Peeking first is like reading the last page of a mystery, and you'll enjoy the next one less.

Exercises run in a practice folder. The lessons use this path:

~~~text
C:\Development\ps-practice
~~~

You can use any folder you like. The lessons will show commands with the path above, and you can swap in your own path whenever you see it. Chapter 1 explains how.

The two buttons treat that folder differently, so read this part before you press either one. **Run** keeps the files in the practice folder, so you can experiment, and look at what your script made. On a step that checks files, **Check** empties the practice folder first, then runs your script, and only then compares the result. That means anything you created there by hand is removed when you press Check. The runner says so in the output, and the button's tooltip repeats it. If you want to keep something, copy it somewhere else first.

Each chapter finishes with a summary and three quizzes. The quizzes are there to help you remember, and a wrong answer is useful information, not a grade.

## What you'll need

- A Windows 10 or 11 computer
- An internet connection, for the setup script to install PowerShell 7 and the other tools
- Some patience, and a willingness to read an error message twice before you panic

You don't need to know any programming. You don't need to know what a variable is, or why a file has a `.ps1` extension. You'll learn both of those in the next few chapters.

## A word about errors

You're going to see red text. Lots of it. It's the computer saying that something didn't go the way the command expected, and it's usually telling you exactly what it wanted. Chapter 9 teaches you how to read it.

The first time you see an error, it will feel like you've broken something. You haven't. Errors are how PowerShell tells you where to look, and the people who write the most scripts see them every day.

## Before you start

Chapter 1 sets up your terminal, so the next lesson is about installing PowerShell 7 and making Windows Terminal open it by default. The setup script does most of the installing for you. Chapter 1 explains what it did, and why you'd want PowerShell 7 instead of the older version that comes with Windows.

When you're ready, move on to Chapter 1.

---
