<#
  Fenetre interne lancee par demarrer_bordure_controle.ps1 - jamais appelee
  directement. Reste affichee jusqu'a etre fermee (Stop-Process sur son PID,
  via arreter_bordure_controle.ps1).
#>

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

Add-Type -ReferencedAssemblies @([System.Windows.Forms.Form].Assembly.Location, [System.Drawing.Color].Assembly.Location) -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

public class BordureControle : Form {
    private readonly Timer animation;
    private double phase;

    public BordureControle(Rectangle bounds) {
        FormBorderStyle = FormBorderStyle.None;
        StartPosition = FormStartPosition.Manual;
        Bounds = bounds;
        ShowInTaskbar = false;
        TopMost = true;
        DoubleBuffered = true;
        BackColor = Color.FromArgb(1, 1, 1);
        TransparencyKey = Color.FromArgb(1, 1, 1);

        animation = new Timer { Interval = 45 };
        animation.Tick += (sender, args) => { phase += 0.03; Invalidate(); };
        animation.Start();
    }

    protected override bool ShowWithoutActivation { get { return true; } }

    protected override CreateParams CreateParams {
        get {
            CreateParams cp = base.CreateParams;
            cp.ExStyle |= 0x08000000; // WS_EX_NOACTIVATE
            cp.ExStyle |= 0x00000020; // WS_EX_TRANSPARENT
            return cp;
        }
    }

    protected override void OnPaint(PaintEventArgs e) {
        base.OnPaint(e);
        e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
        double pulse = (Math.Sin(phase) + 1) / 2;

        int epaisseur = 6;
        Rectangle bord = new Rectangle(epaisseur / 2, epaisseur / 2, Width - epaisseur, Height - epaisseur);
        for (int layer = 5; layer >= 1; layer--) {
            int alpha = (int)((8 + pulse * 14) / layer);
            using (Pen glow = new Pen(Color.FromArgb(alpha, 130, 180, 255), epaisseur + layer * 5)) {
                e.Graphics.DrawRectangle(glow, bord);
            }
        }
        using (Pen core = new Pen(Color.FromArgb(120 + (int)(pulse * 50), 200, 220, 255), epaisseur)) {
            e.Graphics.DrawRectangle(core, bord);
        }
    }
}
'@

$screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bordure = [BordureControle]::new($screen)
[System.Windows.Forms.Application]::Run($bordure)
