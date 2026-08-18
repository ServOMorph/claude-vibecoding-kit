param(
    [Parameter(Mandatory=$true)][string]$DossierEtat,
    [Parameter(Mandatory=$true)][string]$Agent
)

Add-Type -AssemblyName System.Windows.Forms
$contenu = Get-Clipboard -Raw

if (-not $contenu) {
    Write-Error "Presse-papier vide."
    exit 1
}

$agentDir = Join-Path $DossierEtat $Agent
[System.IO.Directory]::CreateDirectory($agentDir) | Out-Null
$chemin = Join-Path $agentDir '_dernier_presse_papier.md'
[System.IO.File]::WriteAllText($chemin, $contenu)

Write-Output "Fichier : $chemin"
Write-Output "Longueur : $($contenu.Length) caracteres"
