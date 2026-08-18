param(
    [Parameter(Mandatory=$true)][string]$DossierEtat,
    [Parameter(Mandatory=$true)][string]$Agent,
    [Parameter(Mandatory=$true)][ValidateSet('instruction','rapport','reprise')][string]$Type,
    [string]$Contenu = '',
    [string]$FichierContenu = '',
    [Parameter(Mandatory=$true)][string]$Resume,
    [switch]$SansClipboard
)

if (-not $Contenu -and -not $FichierContenu) {
    Write-Error "Fournir -Contenu ou -FichierContenu"
    exit 1
}
if ($FichierContenu) {
    $Contenu = Get-Content -LiteralPath $FichierContenu -Raw -Encoding UTF8
}

$agentDir = Join-Path $DossierEtat $Agent
$echangesDir = Join-Path $agentDir 'echanges'
[System.IO.Directory]::CreateDirectory($echangesDir) | Out-Null

$horodatage = Get-Date -Format 'yyyy-MM-dd_HHhmm'
$nomFichier = "${horodatage}_${Type}.md"
$cheminEchange = Join-Path $echangesDir $nomFichier
[System.IO.File]::WriteAllText($cheminEchange, $Contenu)

$horodatageIso = Get-Date -Format 'yyyy-MM-ddTHH:mm:ss'
$ligneLog = [PSCustomObject]@{
    horodatage = $horodatageIso
    agent      = $Agent
    type       = $Type
    resume     = $Resume
    fichier    = "echanges/$nomFichier"
} | ConvertTo-Json -Compress
Add-Content -LiteralPath (Join-Path $agentDir 'log.jsonl') -Value $ligneLog

$clipboardOk = $false
if (-not $SansClipboard) {
    try {
        Set-Clipboard -Value $Contenu
        $clipboardOk = $true
    } catch {
        $clipboardOk = $false
    }
}

Write-Output "Fichier : $cheminEchange"
Write-Output "Clipboard : $clipboardOk"
