# 4. Summary: The Terminal

You can now read the prompt, find out where you are, and move between folders. You can name a place with an absolute path or a relative one, and you know which to choose. Tab completion and the history do the tedious parts for you. That's the terminal, and it's the part of the tutorial that every other chapter sits on.

## What you learned

- The prompt shows the shell and the current folder. Read it before you type anything you'd be sorry to lose.
- `Get-Location`, `pwd`, and `(Get-Location).Path` tell you where you are, with more or less detail.
- An absolute path starts from the drive, such as `C:\`. It means the same thing wherever you are.
- A relative path starts from the current folder. `.` is the current folder, and `..` is the one above.
- `Set-Location`, or `cd`, changes folder. `cd ..` goes up one level, and `cd \` goes to the top of the drive.
- `ls` and `dir` are short names for `Get-ChildItem`. In scripts, use the full name.
- Tab completes a name, and pressing it again cycles through the matches.
- The Up arrow and Ctrl+R bring back commands you've already run.
- Relative paths in a script depend on where the script is running, so write them with care.

## Try it

This exercise moves into the practice folder, prints where it is, moves back up, and prints where it is again. Write four lines in the starter file, below the comment:

1. A `Set-Location` line that moves to `C:\Development\ps-practice`.
2. A `Write-Output` line that prints `In: ` followed by the location, using `(Get-Location).Path`.
3. A `Set-Location` line that moves up one folder, using `..`.
4. A `Write-Output` line that prints `Out: ` followed by the location, again using `(Get-Location).Path`.

The expected output is two lines: `In: C:\Development\ps-practice` and `Out: C:\Development`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

## Quizzes

Three questions, one for each big idea in the chapter. Pick an answer, and read the explanation whichever way it goes.

```quiz
You're in C:\Development\ps-practice\reports, and you want to write a file in the practice folder. Which relative path gets you there?
○ .\notes.txt
→ That's the file in the current folder, which is reports. It's not the one you want.
◉ ..\notes.txt
→ Right. .. goes up one level from reports, so this lands in ps-practice.
○ \notes.txt
→ A leading backslash means the top of the current drive, which is C:\notes.txt. That's a different place.
```

```quiz
What is the quickest way to get from one long folder name to the next without typing it in full?
◉ Type the first few letters, and press Tab.
→ Right. Tab completes a name when it's the only match, and cycles through the matches when it isn't.
○ Type the whole path again each time, because it's the only safe way.
→ It's safe, but it's slow. Tab completion does the same job more quickly.
○ Use cd with a question mark, which searches for folders.
→ Not quite. PowerShell doesn't use question marks that way in a path. Tab is the tool here.
```

```quiz
You want to run a command you used ten minutes ago, without typing it again. What should you do?
○ Retype it, because the shell forgets everything when you press Enter.
→ The shell remembers. You can get the command back without retyping it.
○ Close the window and open a new one, which restores the last command.
→ A new window starts with an empty history. Press Up or Ctrl+R in the same window.
◉ Press the Up arrow, or press Ctrl+R and type a few letters from the command.
→ Right. The history brings the command back, and you can edit it before you run it.
```

---
