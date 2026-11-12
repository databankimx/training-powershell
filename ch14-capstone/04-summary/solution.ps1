function Test-Tool {
    param([string]$Name)

    $found = Get-Command -Name $Name -ErrorAction SilentlyContinue
    if ($found) {
        "ok"
    } else {
        "missing"
    }
}

$checks = [ordered]@{
    "cmd"                     = Test-Tool -Name 'cmd'
    "where.exe"               = Test-Tool -Name 'where.exe'
    "collection-missing-tool" = Test-Tool -Name 'collection-missing-tool'
}

$failed = @($checks.Values | Where-Object { $_ -ne "ok" }).Count
$passed = @($checks.Values | Where-Object { $_ -eq "ok" }).Count
Write-Output "Passed $passed of $($checks.Count)"

if ($failed -gt 0) {
    Write-Output "Result: failed"
} else {
    Write-Output "Result: passed"
}
