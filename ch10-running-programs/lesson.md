# 10. Running Programs

Most of the tools in this collection are programs, not PowerShell commands. Git, Node.js, winget, and dotnet are separate programs that PowerShell starts, waits for, and reads the results from. A script that runs them well is a script that can check its own work, and the setup scripts you've met depend on exactly that.

This chapter covers how to start a program from PowerShell, how to read the result it reports, and how to pick out what it printed. It ends with a step that matters as much as any of the others: knowing when a PowerShell script has grown into something that should be a real program.

## What you'll do

1. **Running a program.** Start a program from a script, and see what it prints.
2. **Exit codes.** Read the number a program reports when it finishes, and act on it.
3. **Capturing output.** Store what a program prints, so a script can use it.
4. **Where to stop.** Recognize when PowerShell is the wrong tool, and what to use instead.
5. **Summary.** Put the chapter together, and try the quizzes.

## The examples in this chapter

The examples use `cmd`, the Command Prompt, which is part of every Windows computer. That keeps them independent of anything you may or may not have installed. `cmd /c` runs a single command and then exits, and it's a convenient way to show how programs behave.

Where a command prints text, the output is shown in the example. Your version of Windows may print slightly different text, but the exit codes are the part the lessons depend on.

---
