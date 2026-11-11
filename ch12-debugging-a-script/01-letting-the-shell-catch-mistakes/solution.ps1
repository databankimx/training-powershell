Set-StrictMode -Version Latest
$name = "Ada"
try {
    Write-Output "Hello, $nmae"
} catch {
    Write-Output "Caught a typo"
}
