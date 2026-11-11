# Appendix: Cheat Sheet, Glossary, and Troubleshooting

This appendix is reference material. Use the cheat sheet while you work, the glossary when a word stops making sense, and the troubleshooting section when a window won't behave. Nothing here is a new lesson, so there's no exercise.

## Cheat sheet

### Moving around

| You want | Write | Chapter |
|---|---|---|
| Where am I | `(Get-Location).Path` | 2 |
| Change folder | `Set-Location "C:\Development\ps-practice"` or `cd` | 2 |
| Up one folder | `Set-Location ".."` | 2 |
| List a folder | `Get-ChildItem -Path "C:\Development\ps-practice"` or `ls` | 4 |
| Complete a name | Type a few letters, then press Tab | 2 |
| Recall a command | Up arrow, or Ctrl+R and a few letters | 2 |

### Help and finding commands

| You want | Write | Chapter |
|---|---|---|
| Help for a command | `Get-Help Get-ChildItem` | 3 |
| Examples only | `Get-Help Get-ChildItem -Examples` | 3 |
| One parameter's help | `Get-Help Get-ChildItem -Parameter Filter` | 3 |
| Find by verb and noun | `Get-Command -Verb Set -Noun Content` | 3 |
| What an object has | `... \| Get-Member` | 3 |

### Files and folders

| You want | Write | Chapter |
|---|---|---|
| Write text to a file | `Set-Content -Path "...\notes.txt" -Value "text"` | 4 |
| Add a line | `Add-Content -Path "...\notes.txt" -Value "text"` | 4 |
| Read a file | `Get-Content -Path "...\notes.txt"` | 4 |
| Check a path | `Test-Path "..."` | 4 |
| Filter by name | `Get-ChildItem -Path "..." -Filter "*.txt" -Name` | 4 |
| Include subfolders | `Get-ChildItem -Path "..." -Recurse -Name` | 4 |
| Copy | `Copy-Item -Path "a" -Destination "b"` | 4 |
| Move | `Move-Item -Path "a" -Destination "b"` | 4 |
| Rename (name only) | `Rename-Item -Path "a" -NewName "b.txt"` | 4 |
| Preview a delete | `Remove-Item -Path "..." -WhatIf` | 4 |

### Variables and text

| You want | Write | Chapter |
|---|---|---|
| Store a value | `$name = "Ada"` | 5 |
| Use it in text | `"Hello, $name"` | 5 |
| Literal text | `'Price: $9'` | 5 |
| A property in text | `"Length: $($folder.Length)"` | 5 |
| Call a method | `$folder.ToUpper()` (brackets needed) | 5 |
| Several lines | `@"` on its own line, text, then `"@` | 5 |

### Pipeline

| You want | Write | Chapter |
|---|---|---|
| Keep some objects | `Where-Object { $_.Extension -eq ".txt" }` | 6 |
| Sort | `Sort-Object Name -Descending` | 6 |
| Take a few | `Select-Object -First 2` | 6 |
| Do something to each | `ForEach-Object { "File: $($_.Name)" }` | 6 |
| Show as a list | `Format-List Name, Length` | 6 |

### Scripts

| You want | Write | Chapter |
|---|---|---|
| Run a script | `.\name.ps1` from its folder | 7 |
| Run from anywhere | `& "C:\path\name.ps1"` | 7 |
| Run once, ignoring policy | `powershell -NoProfile -ExecutionPolicy Bypass -File ".\name.ps1"` | 7 |
| The script's folder | `$PSScriptRoot` | 7 |
| Build a path beside it | `Join-Path $PSScriptRoot "file.txt"` | 7 |
| Require PowerShell 7 | `#Requires -Version 7.0` | 7 |

### Parameters and functions

| You want | Write | Chapter |
|---|---|---|
| Input with a default | `param([string]$Name = "friend")` | 8 |
| An on-or-off option | `[switch]$Upper` | 8 |
| A required value | `[Parameter(Mandatory)]` above the parameter | 8 |
| Limit the values | `[ValidateSet("Small", "Medium", "Large")]` | 8 |
| Define a function | `function Get-Total { param(...) ... }` | 8 |

### Errors

| You want | Write | Chapter |
|---|---|---|
| Catch a failure | `try { ... } catch { ... }` | 9 |
| Always run a step | `finally { ... }` | 9 |
| Make an error catchable | `-ErrorAction Stop` | 9 |
| Hide an error | `-ErrorAction SilentlyContinue` | 9 |
| Script-wide default | `$ErrorActionPreference = "Stop"` | 9 |
| Recorded errors | `$Error`, newest first | 9 |

### Programs

| You want | Write | Chapter |
|---|---|---|
| Run a program | `cmd /c echo hello` | 10 |
| Its exit code | `$LASTEXITCODE`, read straight after | 10 |
| Keep its output | `$found = cmd /c echo found` | 10 |
| Include errors | `... 2>&1` | 10 |

### Environment and profiles

| You want | Write | Chapter |
|---|---|---|
| Read a setting | `$env:COMPUTERNAME` | 11 |
| Set for this session | `$env:GREETING = "Hello"` | 11 |
| Save for the user | `[Environment]::SetEnvironmentVariable("NAME", "value", "User")` | 11 |
| Add to the PATH | `$env:Path = "C:\folder;" + $env:Path` | 11 |
| Profile file | `$PROFILE` | 11 |
| Skip the profile | `pwsh -NoProfile` | 11 |

### Debugging

| You want | Write | Chapter |
|---|---|---|
| Catch misspellings | `Set-StrictMode -Version Latest` | 12 |
| A note for debugging | `Write-Verbose "..."`, shown with `-Verbose` | 12 |
| A note on screen only | `Write-Host "..."` | 12 |
| A value for the caller | `Write-Output ...` | 12 |

## Glossary

Each term lists the chapter where it's introduced.

- **Alias.** A short name for a command, such as `ls` for `Get-ChildItem`. *Chapter 2.*
- **Argument.** A value passed to a command or script. *Chapter 8.*
- **Call operator (`&`).** Runs the script or program at the path that follows it. *Chapter 7.*
- **Cmdlet.** A PowerShell command written in .NET, such as `Get-ChildItem`. *Chapter 3.*
- **Command.** An instruction PowerShell runs, usually written as a verb and a noun. *Chapter 3.*
- **Comment.** Text PowerShell ignores, marked with `#` or `<# #>`. *Chapter 7.*
- **Current location.** The folder a window is in, shown in the prompt. *Chapter 2.*
- **Environment variable.** A setting kept by the operating system and passed to programs, read with `$env:`. *Chapter 11.*
- **Error record.** The object PowerShell keeps for each error, listed in `$Error`. *Chapter 9.*
- **Execution policy.** The setting that decides which scripts PowerShell will run. *Chapter 7.*
- **Exit code.** The number a program reports when it finishes. Zero means success. *Chapter 10.*
- **Function.** A named piece of work that takes input and returns output. *Chapter 8.*
- **Glob pattern.** A name with a star in it, such as `*.txt`, which matches any text in that place. *Chapter 4.*
- **Help block.** A comment at the top of a script, written with `.SYNOPSIS` and similar labels, which `Get-Help` shows. *Chapter 7.*
- **Interpolation.** Replacing a variable or expression inside double quotes with its value. *Chapter 5.*
- **Object.** A value with properties and methods, which commands return. *Chapter 6.*
- **Parameter.** A named input to a command or script, such as `-Path`. *Chapter 1 and 8.*
- **PATH.** The list of folders Windows searches for programs. *Chapter 11.*
- **Pipeline.** Passing the output of one command to the next, with `|`. *Chapter 6.*
- **Profile.** A script PowerShell runs each time a window opens, found in `$PROFILE`. *Chapter 11.*
- **Property.** A value an object holds, read without brackets. *Chapter 5 and 6.*
- **Relative path.** A path that starts from the current folder, such as `..\notes.txt`. *Chapter 2.*
- **Script.** Commands saved in a `.ps1` file. *Chapter 7.*
- **Spoiler.** A worked answer hidden until you choose to show it. *Chapter 0.*
- **String.** Text, written in single or double quotes. *Chapter 5.*
- **Switch.** A parameter with no value, on when it's present. *Chapter 4 and 8.*
- **Terminating error.** An error that stops a script, unless it's caught. *Chapter 9.*
- **Verb.** The first part of a command's name, saying what it does, such as `Get`. *Chapter 3.*
- **Verbose output.** Extra messages shown only when a caller asks with `-Verbose`. *Chapter 12.*

## When a window won't behave

Most window problems come from one of five causes. Work through them in order.

**The window still shows the old shell or the old PATH.** Close it and open a new one. A window keeps the settings it started with, so a change made after it opened won't appear in it.

**A command is not recognized.** Check that the program is installed, then open a new window, because the PATH is read when a window opens. Run `$env:Path -split ';'` to see the folders Windows will search.

**Errors appear before you type anything.** Look at the profile, at the path in `$PROFILE`. A line that calls a missing program or a missing folder produces an error on every new window. Start a window with `pwsh -NoProfile` to confirm, then edit the profile.

**A script won't run, with a message about scripts being disabled.** Check `Get-ExecutionPolicy`. For one script, use `powershell -NoProfile -ExecutionPolicy Bypass -File ".\name.ps1"`, and change the policy only if you understand what that does.

**A change still doesn't appear after a restart.** A restart of Windows is the last resort, and it makes every program read the current settings. Try a new window first. If a restart is needed, run the command again afterward to check.

If none of these fixes the problem, copy the full text of the error, including its first line, and send it to the person who maintains the tutorial. The first line names the command and the problem, and it's the most useful part to share.

---
