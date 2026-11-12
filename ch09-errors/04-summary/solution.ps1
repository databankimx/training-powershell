function Test-File {
    param([string]$Path)

    try {
        Get-Item -Path $Path -ErrorAction Stop | Out-Null
        "Found"
    } catch {
        "Missing"
    }
}

$result = Test-File -Path "C:\Development\ps-practice\missing.txt"
Write-Output "missing.txt: $result"
Write-Output "Checks run: 1"
