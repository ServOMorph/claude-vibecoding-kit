<#
  Affiche un overlay plein écran, opacité réduite, avec un contour néon bleu
  foncé animé. Signale visuellement la fin d'un traitement d'agent ou de zone.
  Esc ou un clic ferme immédiatement l'overlay.
#>

param(
    [string]$Name = 'Agent',
    [string]$Message = "J'ai fini !!!",
    [int]$DurationSeconds = 5
)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

Add-Type -ReferencedAssemblies @([System.Windows.Forms.Form].Assembly.Location, [System.Drawing.Color].Assembly.Location) -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Runtime.InteropServices;
using System.Windows.Forms;

public static class OverlayNative {
    [DllImport("user32.dll")]
    public static extern bool RegisterHotKey(IntPtr hWnd, int id, uint modifiers, uint key);

    [DllImport("user32.dll")]
    public static extern bool UnregisterHotKey(IntPtr hWnd, int id);
}

public class NeonOverlay : Form {
    private const int WmHotKey = 0x0312;
    private const int EscapeHotKeyId = 1;
    private readonly Timer animation;
    private readonly Timer autoClose;
    private readonly string agentName;
    private readonly string message;
    private double phase;

    public NeonOverlay(Rectangle bounds, string agentName, string message, int durationSeconds) {
        this.agentName = agentName;
        this.message = message;
        FormBorderStyle = FormBorderStyle.None;
        StartPosition = FormStartPosition.Manual;
        Bounds = bounds;
        ShowInTaskbar = false;
        TopMost = true;
        BackColor = Color.FromArgb(8, 8, 24);
        Opacity = 0.55;
        DoubleBuffered = true;
        Cursor = Cursors.Hand;
        Click += (sender, args) => Close();

        animation = new Timer { Interval = 35 };
        animation.Tick += (sender, args) => {
            phase += 0.10;
            Invalidate();
        };
        animation.Start();

        if (durationSeconds > 0) {
            autoClose = new Timer { Interval = durationSeconds * 1000 };
            autoClose.Tick += (sender, args) => Close();
            autoClose.Start();
        }
    }

    protected override void OnShown(EventArgs e) {
        base.OnShown(e);
        OverlayNative.RegisterHotKey(Handle, EscapeHotKeyId, 0, 0x1B);
    }

    protected override void OnFormClosed(FormClosedEventArgs e) {
        animation.Stop();
        animation.Dispose();
        if (autoClose != null) {
            autoClose.Stop();
            autoClose.Dispose();
        }
        OverlayNative.UnregisterHotKey(Handle, EscapeHotKeyId);
        base.OnFormClosed(e);
    }

    protected override void WndProc(ref Message m) {
        if (m.Msg == WmHotKey && m.WParam.ToInt32() == EscapeHotKeyId) {
            Close();
            return;
        }
        base.WndProc(ref m);
    }

    protected override void OnPaint(PaintEventArgs e) {
        base.OnPaint(e);
        e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
        double pulse = (Math.Sin(phase) + 1) / 2;

        int margin = 18;
        Rectangle frame = new Rectangle(margin, margin, Width - margin * 2, Height - margin * 2);
        for (int layer = 5; layer >= 1; layer--) {
            int alpha = (int)((25 + pulse * 45) / layer);
            using (Pen glow = new Pen(Color.FromArgb(alpha, 40, 110, 255), layer * 4)) {
                e.Graphics.DrawRectangle(glow, frame);
            }
        }
        using (Pen core = new Pen(Color.FromArgb(220 + (int)(pulse * 35), 130, 190, 255), 2 + (float)pulse)) {
            e.Graphics.DrawRectangle(core, frame);
        }

        using (Font nameFont = new Font("Segoe UI", 42, FontStyle.Bold, GraphicsUnit.Point))
        using (Font messageFont = new Font("Segoe UI", 30, FontStyle.Regular, GraphicsUnit.Point)) {
            SizeF nameSize = e.Graphics.MeasureString(agentName, nameFont);
            SizeF messageSize = e.Graphics.MeasureString(message, messageFont);
            float totalHeight = nameSize.Height + messageSize.Height + 18;
            float top = (Height - totalHeight) / 2;
            float nameLeft = (Width - nameSize.Width) / 2;
            float messageLeft = (Width - messageSize.Width) / 2;

            int glowAlpha = 90 + (int)(pulse * 100);
            using (SolidBrush textGlow = new SolidBrush(Color.FromArgb(glowAlpha, 60, 140, 255))) {
                for (int offset = 6; offset >= 2; offset -= 2) {
                    e.Graphics.DrawString(agentName, nameFont, textGlow, nameLeft - offset, top - offset);
                    e.Graphics.DrawString(agentName, nameFont, textGlow, nameLeft + offset, top + offset);
                }
            }
            using (SolidBrush textCore = new SolidBrush(Color.FromArgb(255, 200, 225, 255))) {
                e.Graphics.DrawString(agentName, nameFont, textCore, nameLeft, top);
            }

            float messageTop = top + nameSize.Height + 18;
            using (SolidBrush messageGlow = new SolidBrush(Color.FromArgb(glowAlpha, 80, 170, 255))) {
                for (int offset = 5; offset >= 2; offset -= 2) {
                    e.Graphics.DrawString(message, messageFont, messageGlow, messageLeft - offset, messageTop - offset);
                    e.Graphics.DrawString(message, messageFont, messageGlow, messageLeft + offset, messageTop + offset);
                }
            }
            using (SolidBrush messageCore = new SolidBrush(Color.FromArgb(255, 225, 240, 255))) {
                e.Graphics.DrawString(message, messageFont, messageCore, messageLeft, messageTop);
            }
        }
    }
}
'@

$screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$overlay = [NeonOverlay]::new($screen, $Name, $Message, $DurationSeconds)
[System.Windows.Forms.Application]::Run($overlay)
