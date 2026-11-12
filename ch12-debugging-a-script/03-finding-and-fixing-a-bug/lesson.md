# 3. Finding and Fixing a Bug

Here's a script that adds up some prices. It runs without errors, and it gives the wrong answer. That combination is the hardest kind of bug to find, because nothing tells you where to look. The method is always the same: say what you expect, look at what actually happens, and narrow the gap until you can see the line responsible.

## The script

The function takes a list of prices and should return their total. It has a loop, which you'll meet in more detail later. For now, read it as "for each price in the list, do the line inside".

~~~powershell
function Get-Total {
    param([int[]]$Prices)

    $total = 0
    foreach ($price in $Prices) {
        $total = $price
    }
    Write-Output $total
}

Write-Output "Total: $(Get-Total -Prices 2,3,5)"
~~~

~~~text
Output:

Total: 5
~~~

The prices are 2, 3, and 5, which add up to 10. The script says 5. It's the last price, not the total, so something is replacing the total each time round the loop instead of adding to it.

## Looking at the values

The fastest check is to print the total at each step. A `Write-Verbose` line inside the loop shows what the script believes after each price, and you can run it with `-Verbose` to see the sequence.

~~~powershell
function Get-Total {
    param([int[]]$Prices)

    $total = 0
    foreach ($price in $Prices) {
        $total = $price
        Write-Verbose "Price $price, total is now $total"
    }
    Write-Output $total
}

Get-Total -Prices 2,3,5 -Verbose
~~~

~~~text
Output:

VERBOSE: Price 2, total is now 2
VERBOSE: Price 3, total is now 3
VERBOSE: Price 5, total is now 5
5
~~~

The sequence gives the answer. The total becomes each price in turn, and never accumulates. The line `$total = $price` is the bug, because it throws away the previous total every time.

## The fix

Adding to the total is written with `+=`, which means "add this to the current value and store the result". Use that in place of plain assignment.

~~~powershell
function Get-Total {
    param([int[]]$Prices)

    $total = 0
    foreach ($price in $Prices) {
        $total += $price
    }
    Write-Output $total
}

Write-Output "Total: $(Get-Total -Prices 2,3,5)"
~~~

~~~text
Output:

Total: 10
~~~

The total is now 10. The change is one line, and the method that found it, printing values until the gap is visible, works on far larger scripts than this one.

> **Aside: the bug you were sure wasn't there.**
> The line that looks obviously right is the one most often wrong, because you've already read it and believed it. When you're stuck, stop reading the code and start printing the values. What the script does is the evidence, and what it looks like it does is just your expectation.

## Reading the error line

Many bugs produce an error instead of a wrong answer. The error names a line and a column, and the line is almost always where to look first. A message such as `Cannot convert value "abc" to type "System.Int32"` on line 7 tells you a value that should be a number is text, and line 7 is where it was passed. Start there, and work backward to the value's source.

## Try it

This exercise has a bug. The starter file contains the script above, with `$total = $price` in the loop. Find the bug, fix it so the total is correct, and check the result.

Edit the starter file, which has the buggy function and the call. Make the change in the loop only, and keep the rest of the script as it is. Your fixed script must print:

~~~text
Total: 10
~~~

Press Run (F5) to see your output. Press Check (Ctrl+F5) to compare it with the sample.

Stuck? Press Show solution (spoiler) to see one correct answer, after you've tried. Try printing the total inside the loop first, as the lesson shows, before you look at the answer.

> **Common mistake.** Hard-coding the answer, or changing the call so it passes different prices. The check compares only the output, so a hard-coded `10` would pass it, but the bug would still be there for the next set of prices. Fix the loop, so the function is right for any list.

---
