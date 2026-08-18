param(
    [Parameter(Mandatory=$true)][string]$DossierEtat,
    [Parameter(Mandatory=$true)][string]$Agent,
    [int]$CaracteresAjoutes = 0,
    [int]$SeuilTokens
)

$agentDir = Join-Path $DossierEtat $Agent
$cheminActif = Join-Path $agentDir 'compte_actif.json'
if (-not (Test-Path -LiteralPath $cheminActif)) {
    exit 0
}
$actif = Get-Content -LiteralPath $cheminActif -Raw -Encoding UTF8 | ConvertFrom-Json

$cheminUsage = Join-Path $agentDir 'comptes_usage.json'
if (Test-Path -LiteralPath $cheminUsage) {
    $usages = @(Get-Content -LiteralPath $cheminUsage -Raw -Encoding UTF8 | ConvertFrom-Json)
} else {
    $usages = @()
}

$entree = $usages | Where-Object { $_.profil -eq $actif.profil } | Select-Object -First 1
if (-not $entree) {
    Write-Error "Compte actif '$($actif.profil)' absent de comptes_usage.json (appeler definir_compte_actif.ps1 d'abord)."
    exit 1
}

$tokensAjoutes = [Math]::Ceiling($CaracteresAjoutes / 4)
$entree.tokensEstimes += $tokensAjoutes
$entree.derniereMaj = Get-Date -Format 'yyyy-MM-dd HH:mm'
if ($PSBoundParameters.ContainsKey('SeuilTokens')) {
    $entree.seuilTokens = $SeuilTokens
}
if ($entree.tokensEstimes -ge $entree.seuilTokens -and $entree.statut -ne 'epuise') {
    $entree.statut = 'epuise'
}

$usages | ConvertTo-Json | Set-Content -LiteralPath $cheminUsage -Encoding UTF8

Write-Output "Compte : $($entree.nom) ($($entree.profil))"
Write-Output "TokensEstimes : $($entree.tokensEstimes)"
Write-Output "Statut : $($entree.statut)"
if ($entree.statut -eq 'epuise') {
    Write-Output "ALERTE : compte '$($entree.nom)' estime epuise."
}
