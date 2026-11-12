function Get-Total {
    param(
        [int]$Price,
        [int]$Count = 1
    )

    $Price * $Count
}

Write-Output "Total: $(Get-Total -Price 4 -Count 3)"
Write-Output "One: $(Get-Total -Price 4)"
