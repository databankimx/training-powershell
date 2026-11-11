# Write your lines below this comment.
New-Item -ItemType Directory -Force -Path "C:\Development\ps-practice\reports" | Out-Null
Set-Location "C:\Development\ps-practice\reports"
Set-Content -Path "summary.txt" -Value "Summary written"
Write-Output "Summary written in reports"
