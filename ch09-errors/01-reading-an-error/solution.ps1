# Write your three lines below this comment.
$Error.Clear()
Get-Item "C:\Development\ps-practice\missing.txt" -ErrorAction SilentlyContinue
Write-Output "Errors recorded: $($Error.Count)"
