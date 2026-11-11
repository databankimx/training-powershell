# Write your lines below this comment.
Set-Content -Path "C:\Development\ps-practice\report.txt" -Value "Chapter 4 complete"
Copy-Item -Path "C:\Development\ps-practice\report.txt" -Destination "C:\Development\ps-practice\report-backup.txt"
Remove-Item -Path "C:\Development\ps-practice\report.txt"
Write-Output "Report saved as report-backup.txt"
