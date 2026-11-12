# Write your three lines below this comment.
Write-Output "Verb: $((Get-Command Remove-Item).Verb)"
Write-Output "Help for: $((Get-Help Clear-Host).Name)"
Write-Output "Found: $((Get-Command -Verb Set -Noun Content).Name)"
