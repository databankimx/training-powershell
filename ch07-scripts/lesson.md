# 7. Scripts

So far you've typed commands one line at a time, and each exercise has been a short script in the starter file. This chapter is about the step that turns those lines into something you can keep. A script is a text file full of commands, saved with a `.ps1` ending, that you can run again tomorrow, hand to a colleague, or call from another script.

Almost every tool in this collection is a script at heart. The setup script you ran at the start is one. So is the reader you're using. Once you can read and write them, the rest of the collection stops being a black box.

## What you'll do

1. **Saving and running a script.** Put commands in a file, run it by its path, and understand the execution policy.
2. **Calling one script from another.** Use the call operator, `&`, and understand how a script finds its own folder.
3. **Headers and comments.** Write comments, a `#Requires` line, and a short help block that says what the script is for.
4. **Summary.** Put the chapter together, and try the quizzes.

## Before you start

Scripts run from their own folder, which is not necessarily the one you're working in. The examples use full paths for that reason. The exercises use the practice folder, and they make any script files they need as part of the exercise.

Open PowerShell 7 before you begin. A script is a file, so the commands in this chapter work from any window.

---
