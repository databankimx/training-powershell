# 2. Reading What Setup Says

A setup script talks to you while it runs, and what it says tells you where you are. Three kinds of message matter most: the step headings, the summary at the end, and the stop message if something went wrong. Learn to read them, and you'll rarely need to guess what happened.

## The step headings

Each step starts with a heading, and the headings are numbered. They're the script's table of contents, printed as it goes.

~~~text
== 0. Git and the repository ==
   Git: C:\Program Files\Git\cmd\git.exe
== 1. Node.js 24 or later ==
   Node.js v24.11.0 in C:\Program Files\nodejs
== 2. C++ Build Tools ==
   C++ Build Tools found
~~~

If the script stops, the last heading it printed tells you the step that failed. In the example above, the last heading is step 2, so the problem is in the C++ Build Tools check, and the message below that heading says what to do.

## The summary

When a setup finishes, it prints a summary: one line per check, with `ok` when the check passed. It's the quickest way to confirm that everything is in place.

~~~text
== Summary ==
   Git                  ok
   Node.js              ok
   C++ Build Tools      ok
   Tests                ok
~~~

Every line should say `ok`. If one doesn't, the summary shows you which check it was, even if the messages above have scrolled away.

## The stop message

When a step can't continue, the script prints a red stop message, and exits. It always has the same shape.

~~~text
SETUP STOPPED: winget is not available. Install 'App Installer' from the Microsoft Store, or install Git by hand.
Fix the problem above, then run this script again. Steps already done are skipped.
~~~

Read the first line for the problem, and the second for what to do. The promise that steps already done are skipped means you can fix the problem and run the same command again, without starting over.

## The -SkipInstall switch

Setup scripts usually take `-SkipInstall`. With it, the script checks every tool and reports what's missing, but it installs nothing. That makes it a safe way to see what a setup would do, or to check an existing computer before you change it.

~~~powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\setup.ps1 -SkipInstall
~~~

Use it first when you're not sure what's on a machine. It answers the question "what's missing?" without asking for any installs.

> **Aside: the message that means it worked.**
> A summary full of `ok` lines is the script telling you it's finished, and a clean finish is worth noticing. If you ran a setup and saw no summary, the script didn't finish, even if it printed a lot of text. Scroll to the end, and look for the stop message or the summary.

## Try it

This exercise builds a summary block in the same style as a setup script. The check compares the two lines.

Write your script in the starter file, below the comment. It must:

1. Create an ordered list called `$summary`, using `[ordered]@{ }`, with two entries: `Git` set to `ok`, and `Node.js` set to `ok`.
2. Use a `foreach` loop over `$summary.GetEnumerator()`, where each item is written with `Write-Output` as the item's key, a colon, a space, and the item's value.

The expected output is two lines: `Git: ok` and `Node.js: ok`. The order matters, so the entries must be in the order given.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

> **Common mistake.** Using `@{ }` instead of `[ordered]@{ }`. A plain hashtable doesn't keep its entries in order, so the two lines can come out swapped. The `[ordered]` is what keeps the summary in the sequence the script ran.

---
