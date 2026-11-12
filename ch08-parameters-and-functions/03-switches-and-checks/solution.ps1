function Format-Label {
    param(
        [string]$Text,
        [switch]$Upper
    )

    if ($Upper) {
        $Text.ToUpper()
    } else {
        $Text
    }
}

Write-Output (Format-Label -Text "ready")
Write-Output (Format-Label -Text "ready" -Upper)
