# Write one line for each step below this comment.
New-Item -ItemType Directory -Force -Path "C:\Development\ps-practice\archive" | Out-Null
Set-Content -Path "C:\Development\ps-practice\draft.txt" -Value "First draft"
Copy-Item -Path "C:\Development\ps-practice\draft.txt" -Destination "C:\Development\ps-practice\copy.txt"
Move-Item -Path "C:\Development\ps-practice\copy.txt" -Destination "C:\Development\ps-practice\archive\copy.txt"
Rename-Item -Path "C:\Development\ps-practice\draft.txt" -NewName "final.txt"
Write-Output "Copy, move, and rename done"
