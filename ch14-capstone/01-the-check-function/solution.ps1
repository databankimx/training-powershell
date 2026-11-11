function Test-Tool {
    param([string]$Name)

    $found = Get-Command -Name $Name -ErrorAction SilentlyContinue
    if ($found) {
        "ok"
    } else {
        "missing"
    }
}

Write-Output "cmd: $(Test-Tool -Name 'cmd')"
Write-Output "collection-missing-tool: $(Test-Tool -Name 'collection-missing-tool')"
