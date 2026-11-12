# Write your lines below this comment.
Set-Content -Path "C:\Development\ps-practice\apple.txt" -Value "apple"
Set-Content -Path "C:\Development\ps-practice\banana.txt" -Value "banana"
Set-Content -Path "C:\Development\ps-practice\cherry.log" -Value "cherry"
$textFiles = Get-ChildItem -Path "C:\Development\ps-practice" -File | Where-Object { $_.Extension -eq ".txt" }
Write-Output "Text files: $($textFiles.Count)"
