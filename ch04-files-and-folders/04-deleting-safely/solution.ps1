# Write your lines below this comment.
Set-Content -Path "C:\Development\ps-practice\old1.txt" -Value "old"
Set-Content -Path "C:\Development\ps-practice\old2.txt" -Value "old"
Set-Content -Path "C:\Development\ps-practice\keep.txt" -Value "keep"
Remove-Item -Path "C:\Development\ps-practice\old*.txt"
Write-Output "Old files removed"
