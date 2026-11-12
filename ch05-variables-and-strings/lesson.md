# 5. Variables and Strings

A variable is a named box for a value. You put something in it, give the box a name, and use the name whenever you want the value back. That's the whole idea, and almost every script you'll write depends on it.

A string is text, such as a file name, a sentence, or a path. Strings are where most of the trouble starts, because the quotation marks around them change what PowerShell does with the words inside. This chapter takes that trouble on directly, one rule at a time.

## What you'll do

1. **Storing values in variables.** Create a variable, read it back, and change it.
2. **Quoting and interpolation.** Single quotes, double quotes, and how a value gets into a sentence.
3. **Building text.** Reading a string's length, changing its case, and joining pieces together.
4. **Summary.** Put the chapter together, and try the quizzes.

## The rule for this chapter

A variable starts with a dollar sign, and the dollar sign is the only thing that makes PowerShell treat a word as a variable. `$name` means "the value in the box called name". `name` on its own is just the word name. Keep that in mind, because most quoting mistakes come from forgetting it.

## Before you start

The exercises here don't use the practice folder, so you won't need any files. Open PowerShell 7, and check the version if you're not sure. A variable you make in one script is gone when that script finishes, so each exercise starts from nothing, and each one creates the values it needs.

---
