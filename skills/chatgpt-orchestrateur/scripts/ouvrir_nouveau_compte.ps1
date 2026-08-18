param(
    [Parameter(Mandatory=$true)][string]$DossierEtat,
    [Parameter(Mandatory=$true)][string]$Agent
)

$cheminComptes = Join-Path $PSScriptRoot 'comptes_google.json'
if (-not (Test-Path -LiteralPath $cheminComptes)) {
    Write-Error "Fichier introuvable : $cheminComptes"
    exit 1
}
$comptes = Get-Content -LiteralPath $cheminComptes -Raw -Encoding UTF8 | ConvertFrom-Json

$agentDir = Join-Path $DossierEtat $Agent
[System.IO.Directory]::CreateDirectory($agentDir) | Out-Null
$cheminUsage = Join-Path $agentDir 'comptes_usage.json'

if (Test-Path -LiteralPath $cheminUsage) {
    $usages = @(Get-Content -LiteralPath $cheminUsage -Raw -Encoding UTF8 | ConvertFrom-Json)
} else {
    $usages = @()
}

$profilsEpuises = @($usages | Where-Object { $_.statut -eq 'epuise' } | ForEach-Object { $_.profil })
$profilsConnus = @($usages | ForEach-Object { $_.profil })

$compteChoisi = $comptes | Where-Object { $profilsConnus -notcontains $_.profil -and $profilsEpuises -notcontains $_.profil } | Select-Object -First 1
if (-not $compteChoisi) {
    $compteChoisi = $comptes | Where-Object { $profilsEpuises -notcontains $_.profil } | Select-Object -First 1
}
if (-not $compteChoisi) {
    Write-Error "Tous les comptes de la liste sont marques epuises."
    exit 1
}

$cheminsChromePossibles = @(
    "$env:PROGRAMFILES\Google\Chrome\Application\chrome.exe",
    "${env:PROGRAMFILES(X86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)
$cheminChrome = $cheminsChromePossibles | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $cheminChrome) {
    Write-Error "chrome.exe introuvable dans les emplacements standards."
    exit 1
}

Start-Process -FilePath $cheminChrome -ArgumentList @(
    "--profile-directory=$($compteChoisi.profil)",
    '--new-window',
    'https://chatgpt.com/'
)

& (Join-Path $PSScriptRoot 'definir_compte_actif.ps1') -DossierEtat $DossierEtat -Agent $Agent -Profil $compteChoisi.profil | Out-Null

Write-Output "Compte : $($compteChoisi.nom)"
Write-Output "Profil : $($compteChoisi.profil)"
Write-Output "Email : $($compteChoisi.email)"
