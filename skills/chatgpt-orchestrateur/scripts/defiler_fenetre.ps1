param(
    [ValidateSet('gauche', 'droite', 'aucune')][string]$Moitie = 'gauche',
    [Parameter(Mandatory=$true)][string]$TitreContient,
    [double]$PositionSourisX = 0.5,
    [double]$PositionSourisY = 0.5,
    [int]$Crans = 5,
    [switch]$AllerEnBas
)

Add-Type -AssemblyName System.Windows.Forms

Add-Type @'
using System;
using System.Text;
using System.Collections.Generic;
using System.Runtime.InteropServices;

public struct RectFD {
    public int Left;
    public int Top;
    public int Right;
    public int Bottom;
}

public class FenetreFinderDefil {
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
    public static extern bool GetWindowRect(IntPtr hWnd, out RectFD rect);

    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern void SetCursorPos(int x, int y);

    [DllImport("user32.dll")]
    public static extern void mouse_event(uint dwFlags, uint dx, uint dy, int dwData, int dwExtraInfo);

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

$MOUSEEVENTF_WHEEL = 0x0800
$MOUSEEVENTF_LEFTDOWN = 0x0002
$MOUSEEVENTF_LEFTUP = 0x0004
$WHEEL_DELTA = 120

$candidats = [FenetreFinderDefil]::Lister($TitreContient)

if ($Moitie -ne 'aucune') {
    $ecran = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $milieuEcran = $ecran.Left + ($ecran.Width / 2)
    $candidats = $candidats | Where-Object {
        $rect = New-Object RectFD
        [FenetreFinderDefil]::GetWindowRect($_.Key, [ref]$rect) | Out-Null
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
[FenetreFinderDefil]::SetForegroundWindow($hwnd) | Out-Null
Start-Sleep -Milliseconds 200

$rect = New-Object RectFD
[FenetreFinderDefil]::GetWindowRect($hwnd, [ref]$rect) | Out-Null
$largeur = $rect.Right - $rect.Left
$hauteur = $rect.Bottom - $rect.Top
$x = [int]($rect.Left + $largeur * $PositionSourisX)
$y = [int]($rect.Top + $hauteur * $PositionSourisY)

[FenetreFinderDefil]::SetCursorPos($x, $y)

if ($AllerEnBas) {
    [FenetreFinderDefil]::mouse_event($MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
    [FenetreFinderDefil]::mouse_event($MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
    Start-Sleep -Milliseconds 150
    [System.Windows.Forms.SendKeys]::SendWait('{END}')
    Write-Output "Fenetre : $titre"
    Write-Output "Clic neutre en $x, $y puis touche Fin envoyee"
} else {
    for ($i = 0; $i -lt $Crans; $i++) {
        [FenetreFinderDefil]::mouse_event($MOUSEEVENTF_WHEEL, 0, 0, (-$WHEEL_DELTA), 0)
        Start-Sleep -Milliseconds 80
    }
    Write-Output "Fenetre : $titre"
    Write-Output "Molette actionnee en : $x, $y ($Crans crans vers le bas)"
}
