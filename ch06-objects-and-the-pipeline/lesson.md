# 6. Objects and the Pipeline

This is the chapter where PowerShell stops looking like the other shells you may have met. In many shells, a command prints text, and you pick through the text to find what you want. In PowerShell, a command hands back objects, and you ask those objects for exactly the parts you need. Once that clicks, a whole family of tasks becomes a single line.

The pipeline is the way objects travel from one command to the next. The vertical bar, `|`, takes what one command produces and feeds it to the next. You'll use it in almost every script from here on, so the aim of this chapter is to make it feel ordinary.

## What you'll do

1. **Objects, not text.** See what a command returns, and pick out the properties you want.
2. **Filtering with Where-Object.** Keep only the objects that match a test.
3. **Sorting, selecting, and repeating.** Put objects in order, take a few of them, and do something to each one.
4. **Summary.** Put the pipeline together, and try the quizzes.

## The one idea to hold on to

Each command in a pipeline works on one object at a time, or on the whole list it's given, depending on the command. You don't need to know which yet. Read the line from left to right, and ask at each step what is being passed along. That's the question that solves most pipeline problems.

## Before you start

These exercises use the practice folder, and each one that checks files starts by making the files it needs. Open PowerShell 7 before you begin, and check the version if you're not sure.

---
