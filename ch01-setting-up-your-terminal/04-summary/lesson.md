# 4. Summary: Setting Up Your Terminal

You now have PowerShell 7, Windows Terminal opens it by default, and there's a practice folder waiting for the exercises. That's a good morning's work, and most people find the setup takes longer than they expected, so well done for getting through it.

## What you learned

- There are two programs called PowerShell. `pwsh` is PowerShell 7, and `powershell` is the older Windows PowerShell 5.1.
- `$PSVersionTable` tells you which one you're in. Read the major version and the edition.
- winget installs programs by their ID. Use `--exact` so it doesn't guess.
- A new window sees changes that an old window may not.
- Windows Terminal's default profile decides which shell opens. Set it to PowerShell 7 once.
- A practice folder keeps experiments apart from your own files.
- `New-Item` makes folders. `-Force` stops it complaining when they already exist.
- `Test-Path` answers yes or no about a path.

## Try it

This exercise puts the chapter together. Write one line that prints both the major version and the edition, in this form:

~~~text
PowerShell 7 (Core) is ready
~~~

Use the version and the edition from `$PSVersionTable`, both inside double quotes, so the output reads exactly as above. If you're in PowerShell 7 and your default is set, the output will match.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

## Quizzes

Three questions, one for each main idea. Pick an answer, and read the explanation whichever way it goes.

```quiz
Which command shows which PowerShell you're running?
○ $PSVersionTable.PSEdition is the only way, and it only prints words.
→ The edition is useful too, but it's the major version that tells you the family.
◉ $PSVersionTable.PSVersion.Major, which prints 7 for PowerShell 7.
→ Right. The major number is the quickest way to tell the two apart.
○ Get-ChildItem, because it lists the installed programs.
→ Not quite. That command lists files and folders, not programs.
```

```quiz
You changed Windows Terminal's default profile, but a window you opened earlier still shows a 5. What is most likely happening?
○ The setting didn't save, and Windows Terminal has forgotten it.
→ Windows Terminal saves settings as you leave the page, so that's not the usual cause.
○ PowerShell 7 is broken, and needs to be reinstalled.
→ Not quite. PowerShell 7 is fine. The window was opened before the change.
◉ The earlier window opened before the change, and it still has the old shell.
→ Right. A window keeps the shell it started with, so open a new one.
```

```quiz
What does `New-Item -ItemType Directory -Force -Path "C:\Development\ps-practice" | Out-Null` do when the folder already exists?
○ It fails with an error, and creates a second copy of the folder with a new name.
→ Not quite. Windows doesn't allow two folders with the same name in one place.
○ It deletes the folder and makes it again, which empties it.
→ Not quite. That would be a dangerous command, and the switches here don't do it.
◉ It carries on quietly, because -Force tells it not to complain about an existing folder.
→ Right. The folder stays as it is, and the command finishes without an error.
```

---
