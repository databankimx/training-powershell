# 9. Errors

Things go wrong. A file isn't where you expected, a network share is offline, a program isn't installed. In a script, what matters isn't whether an error happens, but what the script does next. It can stop, it can carry on, or it can say something useful and try another way.

Most beginners find errors frightening, and they're right to be a little wary. The red text is designed to get your attention, and it usually does. Once you know what the parts of an error mean, most of them turn out to be the computer being helpful in a very direct way.

## What you'll do

1. **Reading an error.** Find the parts of an error message, and see how PowerShell records errors.
2. **Catching an error.** Use `try`, `catch`, and `finally` to decide what happens when something fails.
3. **Choosing how errors behave.** Use `-ErrorAction` and `$ErrorActionPreference` to decide whether an error stops the script.
4. **Summary.** Put the chapter together, and try the quizzes.

## Before you start

The exercises here use a file that doesn't exist, on purpose. Each one starts from an empty script, and none of them needs files in the practice folder. Open PowerShell 7 before you begin, and check the version if you're not sure.

---
