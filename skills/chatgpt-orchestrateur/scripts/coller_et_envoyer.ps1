param(
    [string]$NomProcessus = 'chrome',
    [ValidateSet('gauche', 'droite', 'aucune')][string]$Moitie = 'gauche',
    [string]$TitreContient = '',
    [double]$PositionClicX = 0.5,
    [double]$PositionClicY = 0.93,
    [int]$DelaiApresClicMs = 300,
    [int]$DelaiApresCollerMs = 300,
    [switch]$SansEnvoi
)

Add-Type -AssemblyName System.Windows.Forms

Add-Type @'
using System;
using System.Runtime.InteropServices;

public struct RectNative {
    public int Left;
    public int Top;
    public int Right;
    public int Bottom;
}

public static class FenetreNative {
    [DllImport("user32.dll")]
    public static extern bool GetWindowRect(IntPtr hWnd, out RectNative rect);

    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern void SetCursorPos(int x, int y);

    [DllImport("user32.dll")]
    public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);
}
'@

$MOUSEEVENTF_LEFTDOWN = 0x0002
$MOUSEEVENTF_LEFTUP = 0x0004

$ecran = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$milieuEcran = $ecran.Left + ($ecran.Width / 2)

$candidats = Get-Process -Name $NomProcessus -ErrorAction SilentlyContinue |
    Where-Object { $_.MainWindowTitle -ne '' -and $_.MainWindowHandle -ne [IntPtr]::Zero }

if ($TitreContient) {
    $candidats = $candidats | Where-Object { $_.MainWindowTitle -like "*$TitreContient*" }
}

$fenetres = foreach ($p in $candidats) {
    $rect = New-Object RectNative
    if ([FenetreNative]::GetWindowRect($p.MainWindowHandle, [ref]$rect)) {
        $centreX = ($rect.Left + $rect.Right) / 2
        [PSCustomObject]@{
            Titre  = $p.MainWindowTitle
            Handle = $p.MainWindowHandle
            Rect   = $rect
            CentreX = $centreX
        }
    }
}

if ($Moitie -eq 'gauche') {
    $fenetres = $fenetres | Where-Object { $_.CentreX -lt $milieuEcran }
} elseif ($Moitie -eq 'droite') {
    $fenetres = $fenetres | Where-Object { $_.CentreX -ge $milieuEcran }
}

$nombre = @($fenetres).Count
if ($nombre -eq 0) {
    Write-Error "Aucune fenetre '$NomProcessus' trouvee (Moitie=$Moitie, TitreContient='$TitreContient')."
    exit 1
}
if ($nombre -gt 1) {
    Write-Error "Plusieurs fenetres correspondent, preciser -TitreContient : $(($fenetres | ForEach-Object { $_.Titre }) -join ' | ')"
    exit 1
}

$cible = $fenetres[0]
[FenetreNative]::SetForegroundWindow($cible.Handle) | Out-Null
Start-Sleep -Milliseconds 200

$rect = $cible.Rect
$largeur = $rect.Right - $rect.Left
$hauteur = $rect.Bottom - $rect.Top
$x = [int]($rect.Left + $largeur * $PositionClicX)
$y = [int]($rect.Top + $hauteur * $PositionClicY)

[FenetreNative]::SetCursorPos($x, $y)
[FenetreNative]::mouse_event($MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
[FenetreNative]::mouse_event($MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
Start-Sleep -Milliseconds $DelaiApresClicMs

[System.Windows.Forms.SendKeys]::SendWait('^v')
Start-Sleep -Milliseconds $DelaiApresCollerMs

if (-not $SansEnvoi) {
    [System.Windows.Forms.SendKeys]::SendWait('{ENTER}')
}

Write-Output "Fenetre ciblee : $($cible.Titre)"
Write-Output "Clic en : $x, $y"
Write-Output "Envoye : $(-not $SansEnvoi)"
