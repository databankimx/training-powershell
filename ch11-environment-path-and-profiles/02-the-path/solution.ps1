# Write two lines below this comment.
$env:Path = "C:\Development\ps-practice;" + $env:Path
Write-Output "On PATH: $($env:Path -split ';' -contains 'C:\Development\ps-practice')"
