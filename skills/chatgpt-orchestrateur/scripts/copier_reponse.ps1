param(
    [ValidateSet('gauche', 'droite', 'aucune')][string]$Moitie = 'gauche',
    [Parameter(Mandatory=$true)][string]$TitreContient,
    [Parameter(Mandatory=$true)][double]$PositionClicX,
    [Parameter(Mandatory=$true)][double]$PositionClicY,
    [Parameter(Mandatory=$true)][string]$DossierEtat,
    [Parameter(Mandatory=$true)][string]$Agent,
    [int]$DelaiApresClicMs = 300
)

Add-Type -AssemblyName System.Windows.Forms

Add-Type @'
using System;
using System.Text;
using System.Collections.Generic;
using System.Runtime.InteropServices;

public struct RectFCopie {
    public int Left;
    public int Top;
    public int Right;
    public int Bottom;
}

public class FenetreFinderCopie {
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
    public static extern bool GetWindowRect(IntPtr hWnd, out RectFCopie rect);

    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern void SetCursorPos(int x, int y);

    [DllImport("user32.dll")]
    public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);

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

$MOUSEEVENTF_LEFTDOWN = 0x0002
$MOUSEEVENTF_LEFTUP = 0x0004

$candidats = [FenetreFinderCopie]::Lister($TitreContient)

if ($Moitie -ne 'aucune') {
    $ecran = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $milieuEcran = $ecran.Left + ($ecran.Width / 2)
    $candidats = $candidats | Where-Object {
        $rect = New-Object RectFCopie
        [FenetreFinderCopie]::GetWindowRect($_.Key, [ref]$rect) | Out-Null
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
[FenetreFinderCopie]::SetForegroundWindow($hwnd) | Out-Null
Start-Sleep -Milliseconds 200

$rect = New-Object RectFCopie
[FenetreFinderCopie]::GetWindowRect($hwnd, [ref]$rect) | Out-Null
$largeur = $rect.Right - $rect.Left
$hauteur = $rect.Bottom - $rect.Top
$x = [int]($rect.Left + $largeur * $PositionClicX)
$y = [int]($rect.Top + $hauteur * $PositionClicY)

$marqueurVide = "__copier_reponse_vide__$([guid]::NewGuid())"
Set-Clipboard -Value $marqueurVide

[FenetreFinderCopie]::SetCursorPos($x, $y)
Start-Process -FilePath 'powershell.exe' -ArgumentList @('-NoProfile', '-WindowStyle', 'Hidden', '-File', (Join-Path $PSScriptRoot 'afficher_indicateur_clic.ps1'), '-X', $x, '-Y', $y) -WindowStyle Hidden -Wait
[FenetreFinderCopie]::mouse_event($MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
[FenetreFinderCopie]::mouse_event($MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
Start-Sleep -Milliseconds $DelaiApresClicMs

$contenu = Get-Clipboard -Raw
if ((-not $contenu) -or ($contenu -eq $marqueurVide)) {
    Write-Error "Le clic en $x, $y n'a rien copie (presse-papier toujours vide/inchange) - bouton copier probablement mal positionne."
    exit 1
}

$agentDir = Join-Path $DossierEtat $Agent
[System.IO.Directory]::CreateDirectory($agentDir) | Out-Null
$chemin = Join-Path $agentDir '_dernier_presse_papier.md'
[System.IO.File]::WriteAllText($chemin, $contenu)

Write-Output "Fenetre ciblee : $titre"
Write-Output "Clic copier en : $x, $y"
Write-Output "Fichier : $chemin"
Write-Output "Longueur : $($contenu.Length) caracteres"
