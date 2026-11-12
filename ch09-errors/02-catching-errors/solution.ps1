try {
    Get-Item "C:\Development\ps-practice\missing.txt" -ErrorAction Stop
    Write-Output "File found"
} catch {
    Write-Output "Could not find the file"
} finally {
    Write-Output "Check finished"
}
