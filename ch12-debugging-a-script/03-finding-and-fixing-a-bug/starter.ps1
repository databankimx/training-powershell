function Get-Total {
    param([int[]]$Prices)

    $total = 0
    foreach ($price in $Prices) {
        $total = $price
    }
    Write-Output $total
}

Write-Output "Total: $(Get-Total -Prices 2,3,5)"
