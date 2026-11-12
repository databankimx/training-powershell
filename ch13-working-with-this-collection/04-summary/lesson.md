# 4. Summary: Working with This Collection

You can now read a setup script by its parts, understand the headings, summary, and stop messages it prints, and work out which folder a command has to run from. Those three things cover most of what goes wrong when someone follows a quickstart, and they're the skills you'll use every time you start a new tutorial in this collection.

## What you learned

- A setup script has a header, a `param` block, helper functions, and numbered steps, in that order.
- `Stop-Setup` prints a red stop message and exits with code 1. An exit code of 1 tells anything that ran the script that it failed.
- The step headings show how far a script got, and the last one printed is usually where a problem is.
- The summary lists each check with `ok` when it passed. Every line should say `ok`.
- The stop message names the problem on its first line, and says what to do on its second.
- Steps already done are skipped on a second run, so you can fix a problem and run the same command again.
- `-SkipInstall` checks a machine and reports what's missing, without installing anything.
- `npm start` must run from the folder that holds `package.json`, which is often the runner's own folder, not the root.
- `Get-Location` and `Split-Path -Leaf` confirm where you are before you run a command that depends on it.

## Try it

This exercise puts the chapter together. Your script must:

1. Create an ordered list called `$summary`, with `Git` set to `ok` and `Runner` set to `ok`.
2. Print each entry as key, colon, space, and value, using a `foreach` loop over `$summary.GetEnumerator()`.
3. Print the line `Setup finished`.

The expected output is three lines: `Git: ok`, `Runner: ok`, and `Setup finished`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

## Quizzes

Three questions, one for each big idea in the chapter. Pick an answer, and read the explanation whichever way it goes.

```quiz
A setup script stopped partway through. Which line tells you which step failed?
○ The last line of the summary, which lists the checks.
→ The summary only appears when a setup finishes, so a stopped run doesn't print one.
◉ The last step heading printed before the stop message.
→ Right. The heading shows how far the script got, so the problem is in that step.
○ The -SkipInstall switch, which reports the failing step.
→ That switch checks without installing. It doesn't report where a run stopped.
```

```quiz
You fixed a problem that stopped a setup. What should you do next?
◉ Run the same setup again, because steps already done are skipped.
→ Right. The script picks up where it stopped, without repeating finished work.
○ Start again from the beginning, because a second run deletes everything it made.
→ A second run skips steps that are already done, so starting over isn't needed.
○ Edit the script to remove the stop message, so it doesn't stop again.
→ The stop message is there to report a real problem. Fix the problem instead.
```

```quiz
A quickstart says to run npm start, and it fails with a message about package.json. Where should you check first?
○ The root of the tutorial, because that's where the quickstart is.
→ The quickstart's location isn't the one npm needs. The runner's folder is.
○ The PATH, because npm can't find package.json when the PATH is wrong.
→ The PATH finds programs, not files. The problem is the folder.
◉ The folder you're in, with Get-Location, and then move to the runner's folder.
→ Right. npm looks for package.json in the current folder, so the folder you're in is the first thing to confirm.
```

---
