<#
  Affiche une notification pres de la barre des taches (icone systray +
  bulle Windows) signalant la fin d'un traitement d'agent ou de zone.
  Un clic sur la notification la fait disparaitre et remet au premier plan
  la fenetre du processus qui a lance ce script (fenetre de l'agent).
#>

param(
    [string]$Name = 'Agent',
    [string]$Message = "J'ai fini !!!",
    [int]$DurationSeconds = 0
)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

Add-Type -ReferencedAssemblies @(
    [System.Windows.Forms.Form].Assembly.Location,
    [System.Drawing.Color].Assembly.Location,
    'System.Management.dll'
) -TypeDefinition @'
using System;
using System.Diagnostics;
using System.Management;
using System.Runtime.InteropServices;
using System.Windows.Forms;

public static class NotifyNative {
    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

    [DllImport("user32.dll")]
    public static extern bool IsIconic(IntPtr hWnd);

    public const int SW_RESTORE = 9;
}

public class TaskbarNotifier : ApplicationContext {
    private readonly NotifyIcon icon;
    private readonly Timer autoClose;
    private readonly Timer showTip;
    private readonly IntPtr targetWindow;
    private readonly string agentName;
    private readonly string message;
    private readonly int durationSeconds;

    public TaskbarNotifier(string agentName, string message, int durationSeconds) {
        this.agentName = agentName;
        this.message = message;
        this.durationSeconds = durationSeconds;
        targetWindow = FindAgentWindow();

        icon = new NotifyIcon();
        icon.Icon = System.Drawing.SystemIcons.Information;
        icon.Text = Truncate(agentName, 63);
        icon.Visible = true;
        icon.BalloonTipClicked += (sender, args) => { FocusAgentWindow(); Dismiss(); };
        icon.BalloonTipClosed += (sender, args) => Dismiss();

        if (durationSeconds > 0) {
            autoClose = new Timer { Interval = durationSeconds * 1000 + 500 };
            autoClose.Tick += (sender, args) => Dismiss();
            autoClose.Start();
        }

        showTip = new Timer { Interval = 300 };
        showTip.Tick += (sender, args) => {
            showTip.Stop();
            showTip.Dispose();
            icon.ShowBalloonTip(this.durationSeconds * 1000, this.agentName, this.message, ToolTipIcon.Info);
        };
        showTip.Start();
    }

    private static string Truncate(string value, int maxLength) {
        return value.Length > maxLength ? value.Substring(0, maxLength) : value;
    }

    private void FocusAgentWindow() {
        if (targetWindow == IntPtr.Zero) {
            return;
        }
        if (NotifyNative.IsIconic(targetWindow)) {
            NotifyNative.ShowWindow(targetWindow, NotifyNative.SW_RESTORE);
        }
        NotifyNative.SetForegroundWindow(targetWindow);
    }

    private void Dismiss() {
        if (autoClose != null) {
            autoClose.Stop();
            autoClose.Dispose();
        }
        icon.Visible = false;
        icon.Dispose();
        ExitThread();
    }

    private static int GetParentProcessId(int pid) {
        using (ManagementObjectSearcher searcher = new ManagementObjectSearcher(
            "SELECT ParentProcessId FROM Win32_Process WHERE ProcessId=" + pid))
        using (ManagementObjectCollection results = searcher.Get()) {
            foreach (ManagementObject entry in results) {
                return Convert.ToInt32(entry["ParentProcessId"]);
            }
        }
        return 0;
    }

    private static IntPtr FindAgentWindow() {
        int pid = Process.GetCurrentProcess().Id;
        for (int depth = 0; depth < 20; depth++) {
            int parentPid = GetParentProcessId(pid);
            if (parentPid == 0) {
                break;
            }
            try {
                Process parent = Process.GetProcessById(parentPid);
                parent.Refresh();
                if (parent.MainWindowHandle != IntPtr.Zero) {
                    return parent.MainWindowHandle;
                }
            } catch (ArgumentException) {
                break;
            }
            pid = parentPid;
        }
        return IntPtr.Zero;
    }
}
'@

$notifier = [TaskbarNotifier]::new($Name, $Message, $DurationSeconds)
[System.Windows.Forms.Application]::Run($notifier)
