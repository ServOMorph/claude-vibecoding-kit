param(
    [Parameter(Mandatory=$true)][string]$DossierEtat,
    [Parameter(Mandatory=$true)][string]$Agent,
    [string]$Mission = '',
    [string]$Objectif = '',
    [string]$Etape = '',
    [string]$DernierEchange = '',
    [string]$ProchaineAction = '',
    [int]$NumeroSession = 0
)

$etatPath = Join-Path (Join-Path $DossierEtat $Agent) 'etat.md'
if (-not (Test-Path -LiteralPath $etatPath)) {
    Write-Error "etat.md introuvable : $etatPath (lancer init_agent.ps1 d'abord)"
    exit 1
}

function Get-Champ([string[]]$Lignes, [string]$Label) {
    $ligne = $Lignes | Where-Object { $_ -like "$Label :*" } | Select-Object -First 1
    if ($ligne) { return ($ligne -split ':', 2)[1].Trim() }
    return ''
}

$lignes = Get-Content -LiteralPath $etatPath

$valMission = if ($Mission) { $Mission } else { Get-Champ $lignes 'Mission' }
$valObjectif = if ($Objectif) { $Objectif } else { Get-Champ $lignes 'Objectif actuel' }
$valEtape = if ($Etape) { $Etape } else { Get-Champ $lignes 'Etape en cours' }
$valDernier = if ($DernierEchange) { $DernierEchange } else { Get-Champ $lignes 'Dernier echange' }
$valProchaine = if ($ProchaineAction) { $ProchaineAction } else { Get-Champ $lignes 'Prochaine action attendue' }
$valSession = if ($NumeroSession -gt 0) { $NumeroSession } else { Get-Champ $lignes 'Numero de session en cours' }

$horodatage = Get-Date -Format 'yyyy-MM-dd HH:mm'
$etat = @"
Mission : $valMission
Objectif actuel : $valObjectif
Etape en cours : $valEtape
Dernier echange : $valDernier
Prochaine action attendue : $valProchaine
Numero de session en cours : $valSession
Mis a jour : $horodatage
"@
[System.IO.File]::WriteAllText($etatPath, $etat)
Write-Output "Mis a jour : $etatPath"
