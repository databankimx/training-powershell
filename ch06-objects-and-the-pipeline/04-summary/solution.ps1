# Write your lines below this comment.
Set-Content -Path "C:\Development\ps-practice\apple.txt" -Value "apple"
Set-Content -Path "C:\Development\ps-practice\banana.txt" -Value "banana"
Set-Content -Path "C:\Development\ps-practice\cherry.log" -Value "cherry"
$files = Get-ChildItem -Path "C:\Development\ps-practice" -File
Write-Output "Files: $($files.Count)"
Write-Output "First: $(($files | Sort-Object Name | Select-Object -First 1).Name)"
Write-Output "Last: $(($files | Sort-Object Name | Select-Object -Last 1).Name)"
