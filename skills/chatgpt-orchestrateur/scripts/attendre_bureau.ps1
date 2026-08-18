param(
    [Parameter(Mandatory=$true)][string]$Agent,
    [string]$Message = "Change de bureau si besoin. Clique OK quand c'est fait pour que je prenne le controle."
)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

Add-Type -ReferencedAssemblies @([System.Windows.Forms.Form].Assembly.Location, [System.Drawing.Color].Assembly.Location) -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

public class OverlayAttente : Form {
    private readonly Timer animation;
    private readonly string agentName;
    private readonly string message;
    private double phase;
    public Button BoutonOk;

    public OverlayAttente(Rectangle bounds, string agentName, string message) {
        this.agentName = agentName;
        this.message = message;
        FormBorderStyle = FormBorderStyle.None;
        StartPosition = FormStartPosition.Manual;
        Bounds = bounds;
        ShowInTaskbar = false;
        TopMost = true;
        BackColor = Color.FromArgb(10, 16, 32);
        Opacity = 0.78;
        DoubleBuffered = true;

        animation = new Timer { Interval = 40 };
        animation.Tick += (sender, args) => { phase += 0.045; Invalidate(); };
        animation.Start();

        BoutonOk = new Button();
        BoutonOk.Text = "OK";
        BoutonOk.Font = new Font("Calibri", 18, FontStyle.Bold);
        BoutonOk.Size = new Size(170, 56);
        BoutonOk.FlatStyle = FlatStyle.Flat;
        BoutonOk.FlatAppearance.BorderColor = Color.FromArgb(180, 210, 255);
        BoutonOk.FlatAppearance.BorderSize = 2;
        BoutonOk.BackColor = Color.FromArgb(30, 55, 100);
        BoutonOk.ForeColor = Color.White;
        BoutonOk.Cursor = Cursors.Hand;
        BoutonOk.Click += (sender, args) => Close();
        Controls.Add(BoutonOk);
        AcceptButton = BoutonOk;
    }

    protected override void OnShown(EventArgs e) {
        base.OnShown(e);
        BoutonOk.Focus();
    }

    protected override void OnFormClosed(FormClosedEventArgs e) {
        animation.Stop();
        animation.Dispose();
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

        using (Font nameFont = new Font("Calibri", 40, FontStyle.Bold, GraphicsUnit.Point))
        using (Font messageFont = new Font("Calibri", 22, FontStyle.Regular, GraphicsUnit.Point)) {
            SizeF nameSize = e.Graphics.MeasureString(agentName, nameFont);
            SizeF messageSize = e.Graphics.MeasureString(message, messageFont, (int)(Width * 0.7));
            float totalHeight = nameSize.Height + messageSize.Height + 16;
            float top = (Height - totalHeight) / 2 - 40;
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

            float messageTop = top + nameSize.Height + 16;
            RectangleF messageRect = new RectangleF((Width - Width * 0.7f) / 2, messageTop, Width * 0.7f, messageSize.Height + 20);
            StringFormat centre = new StringFormat { Alignment = StringAlignment.Center };
            using (SolidBrush messageGlow = new SolidBrush(Color.FromArgb(glowAlpha, 140, 190, 255))) {
                for (int offset = 5; offset >= 2; offset -= 2) {
                    e.Graphics.DrawString(message, messageFont, messageGlow, new RectangleF(messageRect.X - offset, messageRect.Y - offset, messageRect.Width, messageRect.Height), centre);
                }
            }
            using (SolidBrush messageCore = new SolidBrush(Color.FromArgb(255, 240, 246, 255))) {
                e.Graphics.DrawString(message, messageFont, messageCore, messageRect, centre);
            }

            BoutonOk.Location = new Point((Width - BoutonOk.Width) / 2, (int)(messageTop + messageRect.Height + 30));
        }
    }
}
'@

$screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$overlay = [OverlayAttente]::new($screen, $Agent, $Message)
[System.Windows.Forms.Application]::Run($overlay)
Write-Output "Confirme."
