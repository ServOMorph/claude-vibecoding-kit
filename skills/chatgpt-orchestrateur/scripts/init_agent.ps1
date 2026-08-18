param(
    [Parameter(Mandatory=$true)][string]$DossierEtat,
    [Parameter(Mandatory=$true)][string]$Agent,
    [Parameter(Mandatory=$true)][string]$Mission,
    [Parameter(Mandatory=$true)][string]$Objectif
)

$agentDir = Join-Path $DossierEtat $Agent
$echangesDir = Join-Path $agentDir 'echanges'
[System.IO.Directory]::CreateDirectory($echangesDir) | Out-Null

$etatPath = Join-Path $agentDir 'etat.md'
if (Test-Path -LiteralPath $etatPath) {
    Write-Output "Deja initialise : $etatPath"
    exit 0
}

$horodatage = Get-Date -Format 'yyyy-MM-dd HH:mm'
$etat = @"
Mission : $Mission
Objectif actuel : $Objectif
Etape en cours : Initialisation
Dernier echange : $horodatage - mission initialisee
Prochaine action attendue : premiere instruction de l'orchestrateur
Numero de session en cours : 1
Mis a jour : $horodatage
"@
[System.IO.File]::WriteAllText($etatPath, $etat)
[System.IO.File]::WriteAllText((Join-Path $agentDir 'decisions.md'), '')
[System.IO.File]::WriteAllText((Join-Path $agentDir 'questions_ouvertes.md'), '')
[System.IO.File]::WriteAllText((Join-Path $agentDir 'log.jsonl'), '')

Write-Output "Initialise : $agentDir"
