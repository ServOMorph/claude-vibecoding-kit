param(
    [Parameter(Mandatory=$true)][string]$TitreContientA,
    [string]$TitreContientB = '',
    [int]$MaxBureaux = 8
)

Add-Type @'
using System;
using System.Text;
using System.Collections.Generic;
using System.Runtime.InteropServices;

public class BureauNative {
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);

    [DllImport("user32.dll")]
    public static extern int GetWindowTextLength(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

    [DllImport("user32.dll")]
    public static extern bool IsIconic(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);

    [DllImport("dwmapi.dll")]
    public static extern int DwmGetWindowAttribute(IntPtr hwnd, int dwAttribute, out int pvAttribute, int cbAttribute);

    public static List<KeyValuePair<IntPtr, string>> ListerFenetres() {
        List<KeyValuePair<IntPtr, string>> resultat = new List<KeyValuePair<IntPtr, string>>();
        EnumWindows((hWnd, lParam) => {
            int len = GetWindowTextLength(hWnd);
            if (len > 0) {
                StringBuilder sb = new StringBuilder(len + 1);
                GetWindowText(hWnd, sb, sb.Capacity);
                resultat.Add(new KeyValuePair<IntPtr, string>(hWnd, sb.ToString()));
            }
            return true;
        }, IntPtr.Zero);
        return resultat;
    }
}
'@

$SW_RESTORE = 9
$DWMWA_CLOAKED = 14
$KEYEVENTF_KEYUP = 0x0002
$VK_LWIN = 0x5B
$VK_CONTROL = 0x11
$VK_LEFT = 0x25
$VK_RIGHT = 0x27

function Send-CtrlWinFleche([string]$Direction) {
    $vkFleche = if ($Direction -eq 'Left') { $VK_LEFT } else { $VK_RIGHT }
    [BureauNative]::keybd_event($VK_CONTROL, 0, 0, [UIntPtr]::Zero)
    [BureauNative]::keybd_event($VK_LWIN, 0, 0, [UIntPtr]::Zero)
    [BureauNative]::keybd_event($vkFleche, 0, 0, [UIntPtr]::Zero)
    Start-Sleep -Milliseconds 60
    [BureauNative]::keybd_event($vkFleche, 0, $KEYEVENTF_KEYUP, [UIntPtr]::Zero)
    [BureauNative]::keybd_event($VK_LWIN, 0, $KEYEVENTF_KEYUP, [UIntPtr]::Zero)
    [BureauNative]::keybd_event($VK_CONTROL, 0, $KEYEVENTF_KEYUP, [UIntPtr]::Zero)
}

function Find-FenetreParTitre([string]$TitreContient) {
    $fenetres = [BureauNative]::ListerFenetres()
    $trouvee = $fenetres | Where-Object { $_.Value -like "*$TitreContient*" } | Select-Object -First 1
    return $trouvee
}

function Test-FenetreCloaked([IntPtr]$Handle) {
    $valeur = 0
    [BureauNative]::DwmGetWindowAttribute($Handle, $DWMWA_CLOAKED, [ref]$valeur, 4) | Out-Null
    return $valeur -ne 0
}

$fenA = Find-FenetreParTitre $TitreContientA
if (-not $fenA.Key) {
    Write-Error "Fenetre introuvable (TitreContient='$TitreContientA')."
    exit 1
}
$hwndA = $fenA.Key

for ($i = 0; $i -lt $MaxBureaux; $i++) {
    Send-CtrlWinFleche 'Left'
    Start-Sleep -Milliseconds 250
}

$trouve = -not (Test-FenetreCloaked $hwndA)
$essais = 0
while (-not $trouve -and $essais -lt $MaxBureaux) {
    Send-CtrlWinFleche 'Right'
    Start-Sleep -Milliseconds 400
    $trouve = -not (Test-FenetreCloaked $hwndA)
    $essais++
}

if (-not $trouve) {
    Write-Error "Bureau virtuel contenant '$($fenA.Value)' introuvable apres $MaxBureaux essais."
    exit 1
}

if ([BureauNative]::IsIconic($hwndA)) {
    [BureauNative]::ShowWindow($hwndA, $SW_RESTORE) | Out-Null
}
[BureauNative]::SetForegroundWindow($hwndA) | Out-Null
Write-Output "Bureau actif localise pour : $($fenA.Value)"

if ($TitreContientB) {
    $fenB = Find-FenetreParTitre $TitreContientB
    if ($fenB.Key) {
        $cloakedB = Test-FenetreCloaked $fenB.Key
        if ((-not $cloakedB) -and [BureauNative]::IsIconic($fenB.Key)) {
            [BureauNative]::ShowWindow($fenB.Key, $SW_RESTORE) | Out-Null
        }
        Write-Output "Fenetre B : $($fenB.Value) (meme bureau : $(-not $cloakedB))"
    } else {
        Write-Output "Fenetre B introuvable (TitreContient='$TitreContientB')."
    }
}

[BureauNative]::SetForegroundWindow($hwndA) | Out-Null
