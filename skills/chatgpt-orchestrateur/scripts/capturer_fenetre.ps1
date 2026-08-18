param(
    [ValidateSet('gauche', 'droite', 'aucune')][string]$Moitie = 'gauche',
    [Parameter(Mandatory=$true)][string]$TitreContient,
    [Parameter(Mandatory=$true)][string]$DossierEtat,
    [Parameter(Mandatory=$true)][string]$Agent
)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

Add-Type @'
using System;
using System.Text;
using System.Collections.Generic;
using System.Runtime.InteropServices;

public struct RectFC {
    public int Left;
    public int Top;
    public int Right;
    public int Bottom;
}

public class FenetreFinderCapture {
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);

    [DllImport("user32.dll")]
    public static extern int GetWindowTextLength(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern bool IsWindowVisible(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern bool GetWindowRect(IntPtr hWnd, out RectFC rect);

    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);

    public static List<KeyValuePair<IntPtr, string>> Lister(string titreContient) {
        List<KeyValuePair<IntPtr, string>> resultat = new List<KeyValuePair<IntPtr, string>>();
        EnumWindows((hWnd, lParam) => {
            if (!IsWindowVisible(hWnd)) return true;
            int len = GetWindowTextLength(hWnd);
            if (len > 0) {
                StringBuilder sb = new StringBuilder(len + 1);
                GetWindowText(hWnd, sb, sb.Capacity);
                string titre = sb.ToString();
                if (titre.IndexOf(titreContient, StringComparison.OrdinalIgnoreCase) >= 0) {
                    resultat.Add(new KeyValuePair<IntPtr, string>(hWnd, titre));
                }
            }
            return true;
        }, IntPtr.Zero);
        return resultat;
    }
}
'@

$candidats = [FenetreFinderCapture]::Lister($TitreContient)

if ($Moitie -ne 'aucune') {
    $ecran = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $milieuEcran = $ecran.Left + ($ecran.Width / 2)
    $candidats = $candidats | Where-Object {
        $rect = New-Object RectFC
        [FenetreFinderCapture]::GetWindowRect($_.Key, [ref]$rect) | Out-Null
        $centreX = ($rect.Left + $rect.Right) / 2
        if ($Moitie -eq 'gauche') { $centreX -lt $milieuEcran } else { $centreX -ge $milieuEcran }
    }
}

$nombre = @($candidats).Count
if ($nombre -eq 0) {
    Write-Error "Aucune fenetre trouvee (TitreContient='$TitreContient', Moitie=$Moitie)."
    exit 1
}
if ($nombre -gt 1) {
    Write-Error "Plusieurs fenetres correspondent, preciser TitreContient : $(($candidats | ForEach-Object { $_.Value }) -join ' | ')"
    exit 1
}

$hwnd = $candidats[0].Key
$titre = $candidats[0].Value
[FenetreFinderCapture]::SetForegroundWindow($hwnd) | Out-Null
Start-Sleep -Milliseconds 250

$rect = New-Object RectFC
[FenetreFinderCapture]::GetWindowRect($hwnd, [ref]$rect) | Out-Null
$largeur = $rect.Right - $rect.Left
$hauteur = $rect.Bottom - $rect.Top

$bitmap = New-Object System.Drawing.Bitmap $largeur, $hauteur
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.CopyFromScreen($rect.Left, $rect.Top, 0, 0, (New-Object System.Drawing.Size $largeur, $hauteur))

$dossierCalib = Join-Path (Join-Path $DossierEtat $Agent) 'calibration'
[System.IO.Directory]::CreateDirectory($dossierCalib) | Out-Null
$horodatage = Get-Date -Format 'yyyy-MM-dd_HHhmmss'
$cheminImage = Join-Path $dossierCalib "$horodatage.png"
$bitmap.Save($cheminImage, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$bitmap.Dispose()

Write-Output "Image : $cheminImage"
Write-Output "Fenetre : $titre"
Write-Output "Largeur : $largeur"
Write-Output "Hauteur : $hauteur"
