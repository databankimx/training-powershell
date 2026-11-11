$summary = [ordered]@{
    Git     = "ok"
    "Node.js" = "ok"
}

foreach ($item in $summary.GetEnumerator()) {
    Write-Output "$($item.Key): $($item.Value)"
}
