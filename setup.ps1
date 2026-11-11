# setup.ps1
#
# Prepares the PowerShell Basics tutorial. It can be run from anywhere:
#   0. Checks Git. If this script isn't inside the repository, it clones the repository into
#      C:\Development\training\training-powershell (or uses the folder already there), then runs the copy of this
#      script inside that folder, so every later step uses the repository's own files.
#   1. Checks PowerShell 7. The tutorial teaches PowerShell 7, so it is installed with winget if it's missing. If this
#      script is running in Windows PowerShell 5.1, it relaunches itself in PowerShell 7 once that's installed.
#   2. Checks Node.js 24 or later, which the lesson runner needs.
#   3. Checks the C++ Build Tools. They are the fallback when Electron's download fails, so they are installed up front.
#   4. Installs the runner's packages exactly as recorded in package-lock.json (npm ci), and makes sure the Electron
#      binary is present. If the download fails, the native modules are rebuilt with the C++ environment loaded, and
#      the download is retried.
#   5. Runs the runner's tests.
#
# Anything missing is installed with winget. Use -SkipInstall to only check. Installing the C++ Build Tools needs an
# elevated (Administrator) PowerShell. Safe to run again: anything already in place is skipped.
#
# Run from anywhere with:
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\setup.ps1

param(
    [switch]$SkipInstall,
    [string]$RepoUrl = "https://github.com/databankimx/training-powershell.git",
    [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
Set-Location $root

$defaultRepoPath = "C:\Development\training\training-powershell"
$requiredNodeMajor = 24
$summary = [ordered]@{}

function Write-Step([string]$title) {
    Write-Host ""
    Write-Host "== $title ==" -ForegroundColor Cyan
}

function Stop-Setup([string]$message) {
    Write-Host ""
    Write-Host "SETUP STOPPED: $message" -ForegroundColor Red
    Write-Host "Fix the problem above, then run this script again. Steps already done are skipped."
    exit 1
}

function Add-Warning([string]$message) {
    Write-Host "   WARNING: $message" -ForegroundColor Yellow
}

function Test-Administrator {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Invoke-Winget([string]$id) {
    if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
        Stop-Setup "winget is not available. Install 'App Installer' from the Microsoft Store, or install $id by hand."
    }
    Write-Host "   winget install -e --id $id" -ForegroundColor Gray
    & winget install -e --id $id --silent --accept-package-agreements --accept-source-agreements
    # 0 = installed. -1978335189 = already installed, which is fine here. 3010 = installed, and a restart is needed.
    if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne -1978335189 -and $LASTEXITCODE -ne 3010) {
        Stop-Setup "winget could not install $id (exit code $LASTEXITCODE)."
    }
}

# Finds a program on PATH, or in the folder it installs to. A program installed in this session isn't on PATH until
# a new window opens, so the usual folders are checked too.
function Find-Program([string]$CommandName, [string[]]$Candidates) {
    $command = Get-Command $CommandName -ErrorAction SilentlyContinue
    if ($command) { return $command.Source }
    foreach ($candidate in $Candidates) {
        if ($candidate -and (Test-Path $candidate)) { return $candidate }
    }
    return $null
}

function Add-FolderToPath([string]$exePath) {
    $folder = Split-Path $exePath -Parent
    if ($env:Path -notlike "*$folder*") { $env:Path = "$folder;$env:Path" }
}

function Get-VisualStudioInstallPath {
    # vswhere finds Visual Studio installations. Only one with the C++ compiler component counts.
    $vswhere = Join-Path ${env:ProgramFiles(x86)} "Microsoft Visual Studio\Installer\vswhere.exe"
    if (-not (Test-Path $vswhere)) { return $null }
    $path = & $vswhere -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -latest -property installationPath 2>$null
    if ($path) { return ($path | Select-Object -First 1).Trim() }
    return $null
}

function Test-BuildTools {
    return [bool](Get-VisualStudioInstallPath)
}

function Install-BuildTools {
    if (-not (Test-Administrator)) {
        Stop-Setup "The C++ Build Tools need an elevated PowerShell. Open PowerShell 7 as Administrator, and run this script again."
    }
    Write-Host "   Installing Visual Studio Build Tools with the C++ workload."
    Write-Host "   This downloads about 4 to 5 GB and may take several minutes."
    $override = "--quiet --wait --norestart --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"
    Write-Host "   winget install --id Microsoft.VisualStudio.BuildTools --override ""$override""" -ForegroundColor Gray
    & winget install --id Microsoft.VisualStudio.BuildTools -e --accept-package-agreements --accept-source-agreements --override $override
    # 0 = success, 3010 = success but a restart is needed, -1978335189 = already installed.
    if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne 3010 -and $LASTEXITCODE -ne -1978335189) {
        Stop-Setup "winget could not install the C++ Build Tools (exit code $LASTEXITCODE)."
    }
    Start-Sleep -Seconds 5
    return (Test-BuildTools)
}

# Native modules are compiled with the C++ compiler, which needs the Visual Studio environment variables.
# vcvars64.bat sets them, and this function copies the result into the current PowerShell session.
function Import-BuildToolsEnvironment {
    $install = Get-VisualStudioInstallPath
    if (-not $install) { return $false }
    $vcvars = Join-Path $install "VC\Auxiliary\Build\vcvars64.bat"
    if (-not (Test-Path $vcvars)) { return $false }
    $environmentLines = cmd /c "`"$vcvars`" >nul 2>&1 && set"
    foreach ($line in $environmentLines) {
        if ($line -match "^([^=]+)=(.*)$") {
            Set-Item -Path "env:$($Matches[1])" -Value $Matches[2]
        }
    }
    return $true
}

$gitCandidates = @("C:\Program Files\Git\cmd\git.exe")
$nodeCandidates = @("C:\Program Files\nodejs\node.exe")
$pwshCandidates = @("C:\Program Files\PowerShell\7\pwsh.exe")

Write-Host ""
Write-Host "PowerShell Basics setup" -ForegroundColor Yellow

# 0. Git and the repository -----------------------------------------------------------------------------------

Write-Step "0. Git and the repository"

$gitExe = Find-Program 'git' $gitCandidates
if (-not $gitExe) {
    if ($SkipInstall) { Stop-Setup "Git isn't installed. Install Git from https://git-scm.com, or run this script without -SkipInstall." }
    Write-Host "   Git is missing: installing it"
    Invoke-Winget "Git.Git"
    $gitExe = Find-Program 'git' $gitCandidates
    if (-not $gitExe) { Stop-Setup "Git was installed, but git.exe can't be found. Open a new PowerShell window and run this script again." }
}
Add-FolderToPath $gitExe
Write-Host "   Git: $gitExe"
$summary["Git"] = "ok"

if (-not (Test-Path (Join-Path $root "lesson-runner\package.json"))) {
    # The script is running outside the tutorial. Use the folder that is already in place, or clone the repository into it.
    if (Test-Path $defaultRepoPath) {
        $runnerFile = Join-Path $defaultRepoPath "lesson-runner\package.json"
        if (-not (Test-Path $runnerFile)) {
            $runnerFolder = Join-Path $defaultRepoPath "lesson-runner"
            Write-Host "   Contents of ${runnerFolder}:" -ForegroundColor Yellow
            if (Test-Path $runnerFolder) {
                Get-ChildItem -Path $runnerFolder -Force | ForEach-Object { Write-Host "     $($_.Name)" }
            } else {
                Write-Host "     (the lesson-runner folder does not exist)"
            }
            Stop-Setup "$runnerFile was not found. The folder $defaultRepoPath is not a complete copy of the tutorial. Move or rename that folder, then run this script again, so the repository can be cloned into a new folder."
        }
        Write-Host "   Using the existing folder at $defaultRepoPath (no clone needed)"
        $repoRoot = $defaultRepoPath
    } else {
        Write-Host "   Cloning $RepoUrl ($Branch) into $defaultRepoPath"
        New-Item -ItemType Directory -Force -Path (Split-Path $defaultRepoPath -Parent) | Out-Null
        & $gitExe clone --branch $Branch $RepoUrl $defaultRepoPath
        if ($LASTEXITCODE -ne 0) {
            Stop-Setup "git clone failed (exit code $LASTEXITCODE). Check the address, and your access to the repository."
        }
        $repoRoot = $defaultRepoPath
    }
    $childScript = Join-Path $repoRoot "setup.ps1"
    if (-not (Test-Path $childScript)) {
        Stop-Setup "The repository at $repoRoot has no setup.ps1. Check that the branch '$Branch' is the right one."
    }
    Write-Host "   Continuing from the repository's own copy of this script."
    $childParams = @{}
    if ($SkipInstall) { $childParams["SkipInstall"] = $true }
    & $childScript @childParams
    exit $LASTEXITCODE
}
$summary["Repository"] = $root

# 1. PowerShell 7 ----------------------------------------------------------------------------------------

Write-Step "1. PowerShell 7"

$pwshExe = Find-Program 'pwsh' $pwshCandidates
if (-not $pwshExe -and -not $SkipInstall) {
    Write-Host "   PowerShell 7 is missing: installing it"
    Invoke-Winget "Microsoft.PowerShell"
    $pwshExe = Find-Program 'pwsh' $pwshCandidates
}
if (-not $pwshExe) {
    Stop-Setup "PowerShell 7 isn't installed. Run this script without -SkipInstall, or install PowerShell 7 from https://aka.ms/powershell."
}
Add-FolderToPath $pwshExe
$pwshVersion = (& $pwshExe -NoProfile -Command '$PSVersionTable.PSVersion.ToString()').Trim()
Write-Host "   PowerShell $pwshVersion at $pwshExe"
$summary["PowerShell 7"] = $pwshVersion

# This script may have been started in Windows PowerShell 5.1. The rest of the setup, and the tutorial, use PowerShell 7,
# so the script relaunches itself there once it's installed.
if ($PSVersionTable.PSEdition -ne "Core") {
    Write-Host "   This script is running in Windows PowerShell. Relaunching it in PowerShell 7."
    $relaunchParams = @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", (Join-Path $root "setup.ps1"))
    if ($SkipInstall) { $relaunchParams += "-SkipInstall" }
    & $pwshExe @relaunchParams
    exit $LASTEXITCODE
}

# 2. Node.js ---------------------------------------------------------------------------------------------

Write-Step "2. Node.js $requiredNodeMajor or later"

$nodeExe = Find-Program 'node' $nodeCandidates
if (-not $nodeExe -and -not $SkipInstall) {
    Write-Host "   Node.js is missing: installing the LTS release"
    Invoke-Winget "OpenJS.NodeJS.LTS"
    $nodeExe = Find-Program 'node' $nodeCandidates
}
if (-not $nodeExe) {
    Stop-Setup "Node.js isn't installed. Run this script without -SkipInstall, or install Node.js $requiredNodeMajor or later from https://nodejs.org."
}

Add-FolderToPath $nodeExe
$nodeDir = Split-Path $nodeExe -Parent
$nodeVersion = (& $nodeExe --version | Select-Object -First 1).Trim()
if ($nodeVersion -match "^v(\d+)\.") {
    $nodeMajor = [int]$Matches[1]
} else {
    Stop-Setup "Couldn't read the Node.js version: $nodeVersion"
}
if ($nodeMajor -lt $requiredNodeMajor) {
    Stop-Setup "Node.js $nodeVersion was found, but the runner needs Node.js $requiredNodeMajor or later. Install a current LTS release from https://nodejs.org, then run this script again."
}
Write-Host "   Node.js $nodeVersion in $nodeDir"
$summary["Node.js"] = $nodeVersion

$npmCmd = Join-Path $nodeDir "npm.cmd"
if (-not (Test-Path $npmCmd)) {
    Stop-Setup "npm wasn't found next to Node.js at $npmCmd. Reinstall Node.js, then run this script again."
}

# 3. C++ Build Tools ---------------------------------------------------------------------------------------

Write-Step "3. C++ Build Tools (the fallback if Electron's download fails)"

$hasBuildTools = Test-BuildTools
if (-not $hasBuildTools -and -not $SkipInstall) {
    Write-Host "   C++ Build Tools not found. They are needed to rebuild native modules if Electron's download fails."
    $hasBuildTools = Install-BuildTools
}
if ($hasBuildTools) {
    Write-Host "   C++ Build Tools found"
    $summary["C++ Build Tools"] = "ok"
} else {
    Stop-Setup "The C++ Build Tools aren't installed. Run this script as Administrator without -SkipInstall, or install 'Visual Studio Build Tools' with the 'Desktop development with C++' workload by hand."
}

# 4. Packages and Electron ----------------------------------------------------------------------------------

Write-Step "4. Runner packages (from package-lock.json)"
Set-Location (Join-Path $root "lesson-runner")
& $npmCmd ci
if ($LASTEXITCODE -ne 0) {
    Stop-Setup "npm ci failed (exit code $LASTEXITCODE). Check the messages above, and your network access to the npm registry."
}
$summary["Runner packages"] = "ok"

Write-Step "4b. Electron binary"
$electronExe = Join-Path (Get-Location) "node_modules\electron\dist\electron.exe"
$electronInstall = Join-Path (Get-Location) "node_modules\electron\install.js"

if (-not (Test-Path $electronExe)) {
    Write-Host "   Electron binary not found. Downloading it."
    if (-not (Test-Path $electronInstall)) {
        Stop-Setup "Electron's install.js is missing. Check the messages from npm ci above."
    }
    & $nodeExe $electronInstall
    $firstAttempt = $LASTEXITCODE

    if ($firstAttempt -ne 0 -or -not (Test-Path $electronExe)) {
        # A known npm problem (npm bug 4828) can leave an optional native package unbuilt. Rebuilding with the compiler
        # environment loaded usually fixes it, and then the download is retried.
        Write-Host "   The download failed. Rebuilding native modules with the C++ environment, then trying again."
        if (Import-BuildToolsEnvironment) {
            Write-Host "   C++ environment loaded for this session"
        } else {
            Add-Warning "The C++ environment could not be loaded, so the rebuild may fail."
        }
        & $npmCmd rebuild
        if ($LASTEXITCODE -ne 0) {
            Write-Host "   npm rebuild reported problems, so the retry below decides the outcome." -ForegroundColor Yellow
        }

        & $nodeExe $electronInstall
        if ($LASTEXITCODE -ne 0) {
            Stop-Setup "Electron's binary still won't download (exit code $LASTEXITCODE). Check network access to github.com, and that the C++ Build Tools are installed."
        }
    }
}

if (Test-Path $electronExe) {
    Write-Host "   Electron binary ready"
    $summary["Electron binary"] = "ok"
} else {
    Stop-Setup "Electron's binary is still missing after the download. Run this script again, or check the messages above."
}

# 5. Tests -------------------------------------------------------------------------------------------------

Write-Step "5. Runner tests"
& $npmCmd test
if ($LASTEXITCODE -ne 0) {
    Stop-Setup "The runner's tests failed. Check the messages above, then run this script again."
}
$summary["Tests"] = "ok"

Set-Location $root

Write-Step "Summary"
foreach ($item in $summary.GetEnumerator()) {
    Write-Host ("   {0,-20} {1}" -f $item.Key, $item.Value)
}

Write-Host ""
Write-Host "Setup finished." -ForegroundColor Green
Write-Host ""
Write-Host "To start the tutorial:" -ForegroundColor Green
Write-Host "   cd `"$root\lesson-runner`""
Write-Host "   npm start"
