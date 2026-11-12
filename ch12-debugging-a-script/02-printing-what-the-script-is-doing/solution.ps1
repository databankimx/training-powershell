function Get-Triple {
    param([int]$Number)

    Write-Verbose "Tripling $Number"
    Write-Output ($Number * 3)
}

Write-Output "Result: $(Get-Triple -Number 5)"
