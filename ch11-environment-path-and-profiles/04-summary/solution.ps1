# Write your lines below this comment.
$env:GREETING = "Hello"
$env:Path = "C:\Development\ps-practice;" + $env:Path
Write-Output "Setting: $env:GREETING"
Write-Output "On PATH: $($env:Path -split ';' -contains 'C:\Development\ps-practice')"
