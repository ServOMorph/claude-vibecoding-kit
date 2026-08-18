param(
    [Parameter(Mandatory=$true)][string]$DossierEtat,
    [Parameter(Mandatory=$true)][string]$Agent,
    [int]$CaracteresAjoutes = 0,
    [int]$SeuilTokens = 60000,
    [switch]$Reinitialiser
)

$agentDir = Join-Path $DossierEtat $Agent
[System.IO.Directory]::CreateDirectory($agentDir) | Out-Null
$cheminUsage = Join-Path $agentDir 'usage.json'

if ((Test-Path -LiteralPath $cheminUsage) -and (-not $Reinitialiser)) {
    $usage = Get-Content -LiteralPath $cheminUsage -Raw -Encoding UTF8 | ConvertFrom-Json
} else {
    $usage = [PSCustomObject]@{
        TokensEstimes = 0
        SeuilTokens   = $SeuilTokens
        DepuisLe      = Get-Date -Format 'yyyy-MM-dd HH:mm'
    }
}

$tokensAjoutes = [Math]::Ceiling($CaracteresAjoutes / 4)
$usage.TokensEstimes += $tokensAjoutes
if ($PSBoundParameters.ContainsKey('SeuilTokens')) {
    $usage.SeuilTokens = $SeuilTokens
}

$usage | ConvertTo-Json | Set-Content -LiteralPath $cheminUsage -Encoding UTF8

Write-Output "TokensEstimes : $($usage.TokensEstimes)"
Write-Output "SeuilTokens : $($usage.SeuilTokens)"
if ($usage.TokensEstimes -ge $usage.SeuilTokens) {
    Write-Output "ALERTE : seuil de tokens estimes atteint ou depasse."
}
