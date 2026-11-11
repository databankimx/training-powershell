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
    "cmd"                    = Test-Tool -Name 'cmd'
    "where.exe"              = Test-Tool -Name 'where.exe'
    "collection-missing-tool" = Test-Tool -Name 'collection-missing-tool'
}

foreach ($check in $checks.GetEnumerator()) {
    Write-Output "$($check.Key): $($check.Value)"
}

$passed = @($checks.Values | Where-Object { $_ -eq "ok" }).Count
Write-Output "Passed $passed of $($checks.Count)"
