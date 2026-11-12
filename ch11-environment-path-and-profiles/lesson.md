# 11. Environment, PATH, and Profiles

Every PowerShell window starts with a set of settings already in place. Some tell programs where to find things, some tell scripts about the computer they're running on, and some run every time a window opens. Together they're called the environment, and most of the strange behavior people meet in a terminal comes from one of these three things.

This chapter explains each one. You'll read and change environment variables, learn how the `PATH` decides which programs can be found, and see what a profile does when a window opens. The most useful thing you'll take away is why a change made in one window often doesn't appear in another, and what to do about it.

## What you'll do

1. **Environment variables.** Read the settings a window inherits, and set one for the current session.
2. **The PATH.** See how Windows finds programs, why there are two copies of it, and why new windows see changes that old ones don't.
3. **Profiles.** Find out what runs when a window opens, and when to skip it.
4. **Summary.** Put the chapter together, and try the quizzes.

## Before you start

The exercises here change settings only for the window that runs them, so nothing changes on your computer. Each one starts from an empty script. Open PowerShell 7 before you begin, and check the version if you're not sure.

---
