# Write your three lines below this comment.
Set-Content -Path "C:\Development\ps-practice\helper.ps1" -Value 'Write-Output "Hi from helper"'
$result = & "C:\Development\ps-practice\helper.ps1"
Write-Output "Child says: $result"
