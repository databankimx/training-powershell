function Get-Doubled {
    param([int]$Number)

    $Number * 2
}

Write-Output "Doubled: $(Get-Doubled -Number 21)"
