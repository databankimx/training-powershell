# Write your three lines below this comment.
New-Item -ItemType Directory -Force -Path "C:\Development\ps-practice\lesson-runner" | Out-Null
Set-Location "C:\Development\ps-practice\lesson-runner"
Write-Output "Working in: $(Split-Path -Path (Get-Location).Path -Leaf)"
