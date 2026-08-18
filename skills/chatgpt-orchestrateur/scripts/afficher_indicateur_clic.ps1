param(
    [Parameter(Mandatory=$true)][int]$X,
    [Parameter(Mandatory=$true)][int]$Y,
    [int]$DureeMs = 500
)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

Add-Type -ReferencedAssemblies @([System.Windows.Forms.Form].Assembly.Location, [System.Drawing.Color].Assembly.Location) -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

public class IndicateurClic : Form {
    private readonly Timer animation;
    private readonly Timer autoClose;
    private double phase;
    private readonly Color cleTransparence = Color.FromArgb(1, 1, 1);

    public IndicateurClic(int x, int y, int dureeMs) {
        int taille = 130;
        FormBorderStyle = FormBorderStyle.None;
        StartPosition = FormStartPosition.Manual;
        Bounds = new Rectangle(x - taille / 2, y - taille / 2, taille, taille);
        ShowInTaskbar = false;
        TopMost = true;
        DoubleBuffered = true;
        BackColor = cleTransparence;
        TransparencyKey = cleTransparence;

        animation = new Timer { Interval = 20 };
        animation.Tick += (sender, args) => { phase += 0.18; Invalidate(); };
        animation.Start();

        autoClose = new Timer { Interval = Math.Max(dureeMs, 100) };
        autoClose.Tick += (sender, args) => Close();
        autoClose.Start();
    }

    protected override bool ShowWithoutActivation { get { return true; } }

    protected override CreateParams CreateParams {
        get {
            CreateParams cp = base.CreateParams;
            cp.ExStyle |= 0x08000000; // WS_EX_NOACTIVATE
            cp.ExStyle |= 0x00000020; // WS_EX_TRANSPARENT (clic traverse la fenetre)
            return cp;
        }
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
        double expansion = (phase % (Math.PI * 2)) / (Math.PI * 2);

        int cx = Width / 2;
        int cy = Height / 2;

        int rayonExterieur = (int)(18 + expansion * 32);
        int alphaAnneau = (int)(180 * (1 - expansion));
        using (Pen anneau = new Pen(Color.FromArgb(Math.Max(alphaAnneau, 0), 140, 190, 255), 3)) {
            e.Graphics.DrawEllipse(anneau, cx - rayonExterieur, cy - rayonExterieur, rayonExterieur * 2, rayonExterieur * 2);
        }

        int rayonCoeur = 9;
        int alphaCoeur = 170 + (int)(pulse * 70);
        using (SolidBrush glow = new SolidBrush(Color.FromArgb(80, 140, 190, 255))) {
            e.Graphics.FillEllipse(glow, cx - rayonCoeur * 2, cy - rayonCoeur * 2, rayonCoeur * 4, rayonCoeur * 4);
        }
        using (SolidBrush coeur = new SolidBrush(Color.FromArgb(Math.Min(alphaCoeur, 255), 255, 255, 255))) {
            e.Graphics.FillEllipse(coeur, cx - rayonCoeur, cy - rayonCoeur, rayonCoeur * 2, rayonCoeur * 2);
        }
    }
}
'@

$indicateur = [IndicateurClic]::new($X, $Y, $DureeMs)
[System.Windows.Forms.Application]::Run($indicateur)
