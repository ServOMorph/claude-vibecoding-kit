param(
    [Parameter(Mandatory=$true)][string]$DossierEtat,
    [Parameter(Mandatory=$true)][string]$Agent,
    [string]$Nom = '',
    [string]$Profil = ''
)

if (-not $Nom -and -not $Profil) {
    Write-Error "Fournir -Nom ou -Profil"
    exit 1
}

$cheminComptes = Join-Path $PSScriptRoot 'comptes_google.json'
$comptes = Get-Content -LiteralPath $cheminComptes -Raw -Encoding UTF8 | ConvertFrom-Json

if ($Profil) {
    $compte = $comptes | Where-Object { $_.profil -eq $Profil } | Select-Object -First 1
} else {
    $compte = $comptes | Where-Object { $_.nom -like "*$Nom*" } | Select-Object -First 1
}
if (-not $compte) {
    Write-Error "Compte introuvable dans comptes_google.json (Nom='$Nom', Profil='$Profil')"
    exit 1
}

$agentDir = Join-Path $DossierEtat $Agent
[System.IO.Directory]::CreateDirectory($agentDir) | Out-Null

$cheminUsage = Join-Path $agentDir 'comptes_usage.json'
if (Test-Path -LiteralPath $cheminUsage) {
    $usages = @(Get-Content -LiteralPath $cheminUsage -Raw -Encoding UTF8 | ConvertFrom-Json)
} else {
    $usages = @()
}

$horodatage = Get-Date -Format 'yyyy-MM-dd HH:mm'
$entree = $usages | Where-Object { $_.profil -eq $compte.profil } | Select-Object -First 1
if (-not $entree) {
    $entree = [PSCustomObject]@{
        nom           = $compte.nom
        profil        = $compte.profil
        email         = $compte.email
        tokensEstimes = 0
        seuilTokens   = 60000
        statut        = 'actif'
        depuisLe      = $horodatage
        derniereMaj   = $horodatage
    }
    $usages += $entree
} else {
    if ($entree.statut -ne 'epuise') { $entree.statut = 'actif' }
    $entree.derniereMaj = $horodatage
}

foreach ($u in $usages) {
    if ($u.profil -ne $compte.profil -and $u.statut -eq 'actif') {
        $u.statut = 'inactif'
    }
}

$usages | ConvertTo-Json | Set-Content -LiteralPath $cheminUsage -Encoding UTF8

$actif = [PSCustomObject]@{
    nom    = $compte.nom
    profil = $compte.profil
    email  = $compte.email
}
$actif | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $agentDir 'compte_actif.json') -Encoding UTF8

Write-Output "Compte actif : $($compte.nom) ($($compte.profil), $($compte.email))"
