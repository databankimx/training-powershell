# Write your four lines below this comment.
Set-Location "C:\Development\ps-practice"
Write-Output "In: $((Get-Location).Path)"
Set-Location ".."
Write-Output "Out: $((Get-Location).Path)"
