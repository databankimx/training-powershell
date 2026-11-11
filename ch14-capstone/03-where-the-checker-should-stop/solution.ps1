$lines = 180
$functions = 4
if ($lines -gt 100 -or $functions -gt 6) {
    Write-Output "Move this checker to a .NET program"
} else {
    Write-Output "Keep this checker in PowerShell"
}
