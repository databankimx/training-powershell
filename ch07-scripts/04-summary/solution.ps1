# Write your lines below this comment.
Set-Content -Path "C:\Development\ps-practice\greet.ps1" -Value 'Write-Output "Hello from greet"'
$message = & "C:\Development\ps-practice\greet.ps1"
Write-Output "Greeting: $message"
