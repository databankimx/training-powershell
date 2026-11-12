$ErrorActionPreference = "Stop"

try {
    Get-Item "C:\Development\ps-practice\missing.txt"
} catch {
    Write-Output "Stopped at the first error"
}
