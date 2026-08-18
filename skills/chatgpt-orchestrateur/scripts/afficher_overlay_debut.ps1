param(
    [Parameter(Mandatory=$true)][string]$Agent,
    [Parameter(Mandatory=$true)][string]$Raison,
    [int]$DureeSecondes = 2
)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

Add-Type -ReferencedAssemblies @([System.Windows.Forms.Form].Assembly.Location, [System.Drawing.Color].Assembly.Location) -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

public class OverlayDebut : Form {
    private readonly Timer animation;
    private readonly Timer autoClose;
    private readonly string agentName;
    private readonly string raison;
    private double phase;

    public OverlayDebut(Rectangle bounds, string agentName, string raison, int durationSeconds) {
        this.agentName = agentName;
        this.raison = raison;
        FormBorderStyle = FormBorderStyle.None;
        StartPosition = FormStartPosition.Manual;
        Bounds = bounds;
        ShowInTaskbar = false;
        TopMost = true;
        BackColor = Color.FromArgb(10, 16, 32);
        Opacity = 0.78;
        DoubleBuffered = true;
        Cursor = Cursors.Hand;
        Click += (sender, args) => Close();

        animation = new Timer { Interval = 40 };
        animation.Tick += (sender, args) => { phase += 0.045; Invalidate(); };
        animation.Start();

        autoClose = new Timer { Interval = Math.Max(durationSeconds, 1) * 1000 };
        autoClose.Tick += (sender, args) => Close();
        autoClose.Start();
    }

    protected override void OnFormClosed(FormClosedEventArgs e) {
        animation.Stop();
        animation.Dispose();
        autoClose.Stop();
        autoClose.Dispose();
        base.OnFormClosed(e);
    }

    protected override void OnPaint(PaintEventArgs e) {
        base.OnPaint(e);
        e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
        double pulse = (Math.Sin(phase) + 1) / 2;

        int margin = 22;
        Rectangle frame = new Rectangle(margin, margin, Width - margin * 2, Height - margin * 2);
        for (int layer = 7; layer >= 1; layer--) {
            int alpha = (int)((10 + pulse * 18) / layer);
            using (Pen glow = new Pen(Color.FromArgb(alpha, 130, 180, 255), layer * 5)) {
                e.Graphics.DrawRectangle(glow, frame);
            }
        }
        using (Pen core = new Pen(Color.FromArgb(200 + (int)(pulse * 30), 210, 230, 255), 2 + (float)pulse * 0.6f)) {
            e.Graphics.DrawRectangle(core, frame);
        }

        using (Font nameFont = new Font("Calibri", 42, FontStyle.Bold, GraphicsUnit.Point))
        using (Font raisonFont = new Font("Calibri", 20, FontStyle.Regular, GraphicsUnit.Point)) {
            SizeF nameSize = e.Graphics.MeasureString(agentName, nameFont);
            SizeF raisonSize = e.Graphics.MeasureString(raison, raisonFont, (int)(Width * 0.7));
            float totalHeight = nameSize.Height + raisonSize.Height + 16;
            float top = (Height - totalHeight) / 2;
            float nameLeft = (Width - nameSize.Width) / 2;

            int glowAlpha = 50 + (int)(pulse * 55);
            using (SolidBrush textGlow = new SolidBrush(Color.FromArgb(glowAlpha, 130, 185, 255))) {
                for (int offset = 8; offset >= 2; offset -= 2) {
                    e.Graphics.DrawString(agentName, nameFont, textGlow, nameLeft - offset, top - offset);
                    e.Graphics.DrawString(agentName, nameFont, textGlow, nameLeft + offset, top + offset);
                }
            }
            using (SolidBrush textCore = new SolidBrush(Color.White)) {
                e.Graphics.DrawString(agentName, nameFont, textCore, nameLeft, top);
            }

            float raisonTop = top + nameSize.Height + 16;
            RectangleF raisonRect = new RectangleF((Width - Width * 0.7f) / 2, raisonTop, Width * 0.7f, raisonSize.Height + 20);
            StringFormat centre = new StringFormat { Alignment = StringAlignment.Center };
            using (SolidBrush raisonGlow = new SolidBrush(Color.FromArgb(glowAlpha, 140, 190, 255))) {
                for (int offset = 5; offset >= 2; offset -= 2) {
                    e.Graphics.DrawString(raison, raisonFont, raisonGlow, new RectangleF(raisonRect.X - offset, raisonRect.Y - offset, raisonRect.Width, raisonRect.Height), centre);
                }
            }
            using (SolidBrush raisonCore = new SolidBrush(Color.FromArgb(255, 240, 246, 255))) {
                e.Graphics.DrawString(raison, raisonFont, raisonCore, raisonRect, centre);
            }
        }
    }
}
'@

$screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$overlay = [OverlayDebut]::new($screen, $Agent, $Raison, $DureeSecondes)
[System.Windows.Forms.Application]::Run($overlay)
