# Write your lines below this comment.
$state = cmd /c echo ready
cmd /c "exit 2"
Write-Output "Output: $state"
Write-Output "Exit code: $LASTEXITCODE"
