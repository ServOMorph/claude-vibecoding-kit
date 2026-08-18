param(
    [Parameter(Mandatory=$true)][string]$DossierEtat,
    [Parameter(Mandatory=$true)][string]$Agent
)

$agentDir = Join-Path $DossierEtat $Agent
[System.IO.Directory]::CreateDirectory($agentDir) | Out-Null
$cheminPid = Join-Path $agentDir '_bordure.pid'

if (Test-Path -LiteralPath $cheminPid) {
    $pidExistant = Get-Content -LiteralPath $cheminPid -Raw
    if ($pidExistant -and (Get-Process -Id ([int]$pidExistant.Trim()) -ErrorAction SilentlyContinue)) {
        Write-Output "Bordure deja active (PID $($pidExistant.Trim()))."
        exit 0
    }
}

$scriptBordure = Join-Path $PSScriptRoot 'bordure_controle_interne.ps1'
$processus = Start-Process -FilePath 'powershell.exe' -ArgumentList @('-NoProfile', '-WindowStyle', 'Hidden', '-File', $scriptBordure) -WindowStyle Hidden -PassThru

[System.IO.File]::WriteAllText($cheminPid, $processus.Id)
Write-Output "Bordure de controle demarree (PID $($processus.Id))."
