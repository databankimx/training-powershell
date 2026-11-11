# Write your lines below this comment.
Set-Content -Path "C:\Development\ps-practice\apple.txt" -Value "apple"
Set-Content -Path "C:\Development\ps-practice\banana.txt" -Value "banana"
Set-Content -Path "C:\Development\ps-practice\cherry.log" -Value "cherry"
Get-ChildItem -Path "C:\Development\ps-practice" -Filter "*.txt" -Name | Sort-Object
