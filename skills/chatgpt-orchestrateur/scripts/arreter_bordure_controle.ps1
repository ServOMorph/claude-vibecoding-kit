param(
    [Parameter(Mandatory=$true)][string]$DossierEtat,
    [Parameter(Mandatory=$true)][string]$Agent
)

$agentDir = Join-Path $DossierEtat $Agent
$cheminPid = Join-Path $agentDir '_bordure.pid'

if (-not (Test-Path -LiteralPath $cheminPid)) {
    Write-Output "Aucune bordure active."
    exit 0
}

$pidTexte = (Get-Content -LiteralPath $cheminPid -Raw).Trim()
$processus = Get-Process -Id ([int]$pidTexte) -ErrorAction SilentlyContinue
if ($processus) {
    Stop-Process -Id $processus.Id -Force
    Write-Output "Bordure arretee (PID $pidTexte)."
} else {
    Write-Output "Bordure deja arretee (PID $pidTexte introuvable)."
}

Remove-Item -LiteralPath $cheminPid -Force -ErrorAction SilentlyContinue
