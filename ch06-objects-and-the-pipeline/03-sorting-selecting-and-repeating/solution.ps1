# Write your lines below this comment.
Set-Content -Path "C:\Development\ps-practice\apple.txt" -Value "apple"
Set-Content -Path "C:\Development\ps-practice\banana.txt" -Value "banana"
Set-Content -Path "C:\Development\ps-practice\cherry.log" -Value "cherry"
Get-ChildItem -Path "C:\Development\ps-practice" -File | Sort-Object Name -Descending | Select-Object -First 2 | ForEach-Object { "File: $($_.Name)" }
