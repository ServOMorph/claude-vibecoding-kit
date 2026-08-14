<#
  Affiche un halo de contrôle autour d'une fenêtre cible ou, par défaut,
  sur la moitié droite de l'écran principal.
  Esc ferme immédiatement le workflow, même si une autre application est active.
#>

param(
    [int]$WindowLeft = [int]::MinValue,
    [int]$WindowTop = 0,
    [int]$WindowWidth = 0,
    [int]$WindowHeight = 0,
    [string]$LogFile = ''
)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

Add-Type -ReferencedAssemblies @([System.Windows.Forms.Form].Assembly.Location, [System.Drawing.Color].Assembly.Location) -TypeDefinition @'
using System;
using System.Drawing;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows.Forms;

public static class ControlPcNative {
    [DllImport("user32.dll")]
    public static extern bool RegisterHotKey(IntPtr hWnd, int id, uint modifiers, uint key);

    [DllImport("user32.dll")]
    public static extern bool UnregisterHotKey(IntPtr hWnd, int id);
}

public class ControlPcHalo : Form {
    private const int WmHotKey = 0x0312;
    private const int EscapeHotKeyId = 1;
    private const int WsExTransparent = 0x00000020;
    private const int WsExToolWindow = 0x00000080;
    private const int OuterMargin = 12;
    private readonly Timer animation;
    private readonly int taskbarHeight;
    private readonly Size controlSize;
    private readonly string logFile;
    private string[] statusLogs = {
        "SYSTEME PRET — zone droite active",
        "SURVEILLANCE — annulation Esc disponible",
        "MACROS — aucune action en cours",
        "CONTROLE — attente d'une commande"
    };
    private double phase;
    private int visibleLog;
    private DateTime lastLogChange = DateTime.UtcNow;
    private DateTime lastLogRead = DateTime.MinValue;

    protected override CreateParams CreateParams {
        get {
            CreateParams parameters = base.CreateParams;
            parameters.ExStyle |= WsExTransparent | WsExToolWindow;
            return parameters;
        }
    }

    public ControlPcHalo(Rectangle controlArea, int taskbarHeight, string logFile) {
        FormBorderStyle = FormBorderStyle.None;
        StartPosition = FormStartPosition.Manual;
        Bounds = Rectangle.Inflate(controlArea, OuterMargin, OuterMargin);
        ShowInTaskbar = false;
        TopMost = true;
        BackColor = Color.Magenta;
        TransparencyKey = Color.Magenta;
        DoubleBuffered = true;
        this.taskbarHeight = Math.Max(1, taskbarHeight);
        controlSize = controlArea.Size;
        this.logFile = logFile;
        RefreshLogs();
        animation = new Timer { Interval = 35 };
        animation.Tick += (sender, args) => {
            phase += 0.16;
            RefreshLogs();
            if ((DateTime.UtcNow - lastLogChange).TotalSeconds >= 3) {
                visibleLog = (visibleLog + 1) % statusLogs.Length;
                lastLogChange = DateTime.UtcNow;
            }
            Invalidate();
        };
        animation.Start();
    }

    private void RefreshLogs() {
        if (String.IsNullOrWhiteSpace(logFile) || (DateTime.UtcNow - lastLogRead).TotalMilliseconds < 500) return;
        lastLogRead = DateTime.UtcNow;
        try {
            string[] logs = Array.FindAll(File.ReadAllLines(logFile), line => !String.IsNullOrWhiteSpace(line));
            if (logs.Length == 0 || String.Join("\n", logs) == String.Join("\n", statusLogs)) return;
            statusLogs = logs;
            visibleLog = statusLogs.Length - 1;
            lastLogChange = DateTime.UtcNow;
        } catch (IOException) {
            // Le journal peut être momentanément verrouillé pendant un ajout.
        }
    }

    protected override void OnShown(EventArgs e) {
        base.OnShown(e);
        ControlPcNative.RegisterHotKey(Handle, EscapeHotKeyId, 0, 0x1B);
    }

    protected override void OnFormClosed(FormClosedEventArgs e) {
        animation.Stop();
        animation.Dispose();
        ControlPcNative.UnregisterHotKey(Handle, EscapeHotKeyId);
        base.OnFormClosed(e);
    }

    protected override void WndProc(ref Message message) {
        if (message.Msg == WmHotKey && message.WParam.ToInt32() == EscapeHotKeyId) {
            Close();
            return;
        }
        base.WndProc(ref message);
    }

    protected override void OnPaint(PaintEventArgs e) {
        base.OnPaint(e);
        double pulse = (Math.Sin(phase) + 1) / 2;
        int left = OuterMargin - 4;
        int right = OuterMargin + controlSize.Width + 4;
        int top = OuterMargin - 4;
        int barTop = OuterMargin + controlSize.Height - taskbarHeight;
        int barWidth = right - left;
        int auraAlpha = 35 + (int)(pulse * 95);
        int neonAlpha = 95 + (int)(pulse * 130);
        using (Pen edge = new Pen(Color.FromArgb(115 + (int)(pulse * 90), 105, 55, 165), 2))
        using (SolidBrush barAura = new SolidBrush(Color.FromArgb(auraAlpha, 55, 15, 105)))
        using (SolidBrush barNeon = new SolidBrush(Color.FromArgb(neonAlpha, 95, 30, 165)))
        using (Pen neonCore = new Pen(Color.FromArgb(205 + (int)(pulse * 50), 185, 115, 245), 2 + (float)pulse)) {
            e.Graphics.DrawLine(edge, left, barTop, left, top);
            e.Graphics.DrawLine(edge, left, top, right, top);
            e.Graphics.DrawLine(edge, right, top, right, barTop);
            e.Graphics.FillRectangle(barAura, left, barTop, barWidth, taskbarHeight);
            e.Graphics.FillRectangle(barNeon, left + 2, barTop + 2, barWidth - 4, Math.Max(1, taskbarHeight - 4));
            e.Graphics.DrawLine(neonCore, left, barTop + 2, right, barTop + 2);
        }

        using (Font logFont = new Font("Segoe UI", 9, FontStyle.Regular, GraphicsUnit.Point)) {
            SizeF textSize = e.Graphics.MeasureString(statusLogs[visibleLog], logFont);
            int logBoxWidth = Math.Min(barWidth - 24, (int)Math.Ceiling(textSize.Width) + 24);
            int logBoxHeight = Math.Min(Math.Max(1, taskbarHeight - 10), (int)Math.Ceiling(textSize.Height) + 10);
            int logBoxLeft = left + (barWidth - logBoxWidth) / 2;
            int logBoxTop = barTop + (taskbarHeight - logBoxHeight) / 2;
            using (SolidBrush logBackground = new SolidBrush(Color.FromArgb(230, 14, 14, 17)))
            using (SolidBrush logText = new SolidBrush(Color.FromArgb(245, 238, 232, 248))) {
                e.Graphics.FillRectangle(logBackground, logBoxLeft, logBoxTop, logBoxWidth, logBoxHeight);
                e.Graphics.DrawString(statusLogs[visibleLog], logFont, logText, logBoxLeft + 12, logBoxTop + 5);
            }
        }
    }
}
'@

$screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$workingArea = [System.Windows.Forms.Screen]::PrimaryScreen.WorkingArea
$taskbarHeight = $screen.Bottom - $workingArea.Bottom
if ([string]::IsNullOrWhiteSpace($LogFile)) {
    $LogFile = Join-Path $PSScriptRoot 'logs\control.log'
}
$logDirectory = Split-Path -Parent $LogFile
[System.IO.Directory]::CreateDirectory($logDirectory) | Out-Null
if (-not (Test-Path -LiteralPath $LogFile)) {
    [System.IO.File]::WriteAllText($LogFile, '')
}
$controlArea = if ($WindowWidth -gt 0 -and $WindowHeight -gt 0) {
    [System.Drawing.Rectangle]::new($WindowLeft, $WindowTop, $WindowWidth, $WindowHeight)
} else {
    [System.Drawing.Rectangle]::new(
        $screen.Left + [math]::Floor($screen.Width / 2),
        $screen.Top,
        [math]::Ceiling($screen.Width / 2),
        $screen.Height
    )
}

$halo = [ControlPcHalo]::new($controlArea, $taskbarHeight, $LogFile)
[System.Windows.Forms.Application]::Run($halo)
