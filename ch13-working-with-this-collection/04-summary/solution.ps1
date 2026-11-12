$summary = [ordered]@{
    Git    = "ok"
    Runner = "ok"
}

foreach ($item in $summary.GetEnumerator()) {
    Write-Output "$($item.Key): $($item.Value)"
}
Write-Output "Setup finished"
