param(
    [Parameter(Mandatory=$true)][string]$DossierEtat,
    [Parameter(Mandatory=$true)][string]$Agent,
    [Parameter(Mandatory=$true)][double]$PositionClicX,
    [Parameter(Mandatory=$true)][double]$PositionClicY
)

$agentDir = Join-Path $DossierEtat $Agent
[System.IO.Directory]::CreateDirectory($agentDir) | Out-Null
$cheminCalib = Join-Path $agentDir 'calibration.json'

$horodatage = Get-Date -Format 'yyyy-MM-ddTHH:mm:ss'
$calib = [PSCustomObject]@{
    PositionClicX = $PositionClicX
    PositionClicY = $PositionClicY
    CalibreLe     = $horodatage
} | ConvertTo-Json

[System.IO.File]::WriteAllText($cheminCalib, $calib)
Write-Output "Calibration enregistree : $cheminCalib (X=$PositionClicX, Y=$PositionClicY)"
