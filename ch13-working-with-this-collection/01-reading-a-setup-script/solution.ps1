function Stop-Setup([string]$message) {
    Write-Output "SETUP STOPPED: $message"
}

Stop-Setup -message "Git is missing"
