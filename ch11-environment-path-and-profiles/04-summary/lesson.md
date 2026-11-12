# 4. Summary: Environment, PATH, and Profiles

You can now read and set environment variables, explain how the PATH decides which programs are found, and say what a profile does when a window opens. Those three things account for a large share of the surprises people meet in a terminal, and you'll recognize them when they come back.

## What you learned

- Environment variables are settings the operating system passes to programs. Read them with `$env:Name`.
- A value set with `$env:Name = ...` lasts only for the current session.
- `[Environment]::SetEnvironmentVariable` saves a value for the `User` or `Machine` scope. Windows windows that are already open don't see it.
- The `PATH` is a list of folders, and Windows searches them in order when it looks for a program.
- The machine PATH and the user PATH are joined when a window opens, so a window opened before an install can't see the new folder.
- Add to the PATH with `+`. Setting it to one folder removes every other folder.
- `-contains` checks a list for one value, and returns `True` or `False`.
- `$PROFILE` holds the path of the profile, a script that runs each time a window opens.
- A profile can slow a window, or print errors on every open. Check it first when a window behaves oddly.
- `-NoProfile` starts a session without the profile, which makes a script behave the same for everyone.

## Try it

This exercise sets an environment variable and a PATH entry for the session, then reports both. Your script must:

1. Set `$env:GREETING` to `Hello`.
2. Add `C:\Development\ps-practice;` to the front of `$env:Path`, keeping the existing value.
3. Print `Setting: ` followed by `$env:GREETING`.
4. Print `On PATH: ` followed by the result of checking whether `C:\Development\ps-practice` is in `$env:Path`, using `-split ';' -contains`.

The expected output is two lines: `Setting: Hello` and `On PATH: True`.

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried.

## Quizzes

Three questions, one for each big idea in the chapter. Pick an answer, and read the explanation whichever way it goes.

```quiz
You installed a program, then opened a window that was already open before the install, and the program isn't found. What is the most likely cause?
○ The program was installed incorrectly and needs reinstalling.
→ Possibly, but the more common cause is simpler. The window still holds the old PATH.
◉ The window was opened before the install, so it still has the PATH from before.
→ Right. A window keeps the PATH it started with. A new window reads the saved lists again.
○ PowerShell cannot find programs that were installed after it started.
→ PowerShell does find them, but only in a window that reads the PATH after the install.
```

```quiz
You want to add a folder to the PATH for one session. Which line keeps the existing folders?
○ $env:Path = "C:\Development\ps-practice"
→ That replaces the whole PATH with one folder, and most programs stop being found.
○ $env:Path = "C:\Development\ps-practice;" - $env:Path
→ The minus sign isn't how PATH entries are joined. Use + and keep the semicolon.
◉ $env:Path = "C:\Development\ps-practice;" + $env:Path
→ Right. The new folder goes in front, and the existing list follows after the semicolon.
```

```quiz
A window prints an error before you type anything, every time it opens. Where is the first place to look?
◉ The profile, at the path in $PROFILE, because it runs each time a window opens.
→ Right. A line in the profile that calls a missing program or path prints an error on every open.
○ The PATH, because every new window reads it and an error there is always the cause.
→ The PATH can cause not-found errors, but an error on every open that you didn't type is more often the profile.
○ The environment variables, because they are sent to every program on start.
→ Environment variables are passed along, but they don't run commands. The profile does.
```

---
