param(
    [Parameter(Mandatory=$true)][string]$DossierEtat,
    [Parameter(Mandatory=$true)][string]$Agent
)

function Get-Champ([string[]]$Lignes, [string]$Label) {
    $ligne = $Lignes | Where-Object { $_ -like "$Label :*" } | Select-Object -First 1
    if ($ligne) { return ($ligne -split ':', 2)[1].Trim() }
    return ''
}

$agentDir = Join-Path $DossierEtat $Agent
$etatPath = Join-Path $agentDir 'etat.md'
if (-not (Test-Path -LiteralPath $etatPath)) {
    Write-Error "etat.md introuvable : $etatPath"
    exit 1
}

$lignesEtat = Get-Content -LiteralPath $etatPath -Encoding UTF8
$mission = Get-Champ $lignesEtat 'Mission'
$objectif = Get-Champ $lignesEtat 'Objectif actuel'
$sessionActuelle = [int](Get-Champ $lignesEtat 'Numero de session en cours')
$sessionSuivante = $sessionActuelle + 1

function Read-TexteFichier([string]$Chemin) {
    if (-not (Test-Path -LiteralPath $Chemin)) { return '' }
    $brut = Get-Content -LiteralPath $Chemin -Raw -Encoding UTF8
    if ($null -eq $brut) { return '' }
    return $brut.Trim()
}

$decisions = Read-TexteFichier (Join-Path $agentDir 'decisions.md')
if (-not $decisions) { $decisions = '(aucune)' }

$questions = Read-TexteFichier (Join-Path $agentDir 'questions_ouvertes.md')
if (-not $questions) { $questions = '(aucune)' }

$echangesDir = Join-Path $agentDir 'echanges'
$dernierRapport = Get-ChildItem -LiteralPath $echangesDir -Filter '*_rapport.md' -ErrorAction SilentlyContinue |
    Sort-Object Name -Descending | Select-Object -First 1
$resumeDernierRapport = if ($dernierRapport) { Read-TexteFichier $dernierRapport.FullName } else { '(aucun rapport envoye pour le moment)' }

$prompt = @"
Tu reprends le role d'orchestrateur d'une mission deja commencee (session n $sessionSuivante ;
la precedente a atteint sa limite de messages gratuite).

Mission : $mission
Objectif actuel : $objectif

Decisions deja prises :
$decisions

Questions encore ouvertes :
$questions

Dernier travail realise par l'agent :
$resumeDernierRapport

Continue a partir de cet etat. Ne redemande pas ce qui est deja tranche ci-dessus.
Donne ta prochaine instruction a l'agent.

Rappel de format : reponds toujours en un seul bloc Markdown pret a copier-coller, sans aucun
commentaire avant ou apres le bloc.
"@

& "$PSScriptRoot\log_echange.ps1" -DossierEtat $DossierEtat -Agent $Agent -Type reprise -Contenu $prompt -Resume "reprise session $sessionSuivante"
& "$PSScriptRoot\maj_etat.ps1" -DossierEtat $DossierEtat -Agent $Agent -NumeroSession $sessionSuivante -Etape 'Reprise en attente de premiere instruction' -DernierEchange "$(Get-Date -Format 'yyyy-MM-dd HH:mm') - prompt de reprise genere (session $sessionSuivante)"
