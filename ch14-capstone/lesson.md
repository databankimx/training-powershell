# 14. Capstone

This is where the tutorial comes together. The capstone is a checker script, one that looks at a computer and reports whether it has the tools the collection needs. It uses almost everything from the chapters before it: commands, files, variables, pipelines, functions, parameters, errors, running programs, and exit codes.

The checker is also a useful thing to keep. It's the kind of small tool people write for themselves once, and then use every time they set up a new machine.

## The brief

Your checker must do four things.

1. **Check each tool.** Each tool gets its own function, which returns `ok` when the tool is found and `missing` when it isn't.
2. **Print a summary.** One line per tool, in a fixed order, followed by a count of how many passed.
3. **Report an exit code.** It exits with `0` when every check passes, and with `1` when any check fails. A script that someone else runs needs that number, because it's how other tools learn the result.
4. **Explain itself.** It has a header with a `#Requires` line and a help block, as Chapter 7 showed, so `Get-Help` can describe it.

The tools to check on a real machine are `git`, `node`, `winget`, and `pwsh`. Those are the ones the collection's setup scripts install.

## What the reader can check

A checker's result depends on the computer it runs on, and that's exactly what the reader can't control. So the exercises in this chapter check the core of the checker, using commands that exist on every Windows machine: `cmd`, which is the Command Prompt, and `where.exe`, which is part of Windows. A third name, which doesn't exist, stands in for a missing tool.

Once the core works, swapping the names for `git`, `node`, `winget`, and `pwsh` is the real checker, and you'd run it on your own computer. The lesson calls that out where it matters.

## Before you start

You don't need any files. Each step starts from an empty script, and the capstone uses the same ideas as the chapters before it. Open PowerShell 7 before you begin, and check the version if you're not sure.

---
