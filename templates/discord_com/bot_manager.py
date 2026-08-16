"""
bot_manager.py — Gestion du cycle de vie de bot.py.

Usage CLI :
  python discord_com/bot_manager.py start    → lance bot.py en arrière-plan, sauve le PID
  python discord_com/bot_manager.py stop     → arrête bot.py via le PID sauvegardé
  python discord_com/bot_manager.py restart  → stop + start
  python discord_com/bot_manager.py status   → vérifie si bot.py tourne

Claude utilise ce script pour gérer bot.py sans intervention manuelle.
"""
import json
import os
import signal
import subprocess
import sys
import time
from pathlib import Path

DIR = Path(__file__).parent
PID_FILE = DIR / "bot.pid"
BOT_SCRIPT = DIR / "bot.py"
CONFIG_FILE = DIR / "config_bot_discord.json"


def _lire_config() -> dict:
    return json.loads(CONFIG_FILE.read_text(encoding="utf-8"))


def _pid_actif(pid: int) -> bool:
    """Retourne True si le processus pid est en cours d'exécution (Windows-safe)."""
    try:
        result = subprocess.run(
            ["tasklist", "/FI", f"PID eq {pid}", "/NH"],
            capture_output=True, text=True
        )
        return str(pid) in result.stdout
    except Exception:
        return False


def _lire_pid() -> int | None:
    if PID_FILE.exists():
        try:
            return int(PID_FILE.read_text().strip())
        except Exception:
            pass
    return None


def cmd_status() -> str:
    pid = _lire_pid()
    if pid and _pid_actif(pid):
        return f"[OK] bot.py actif (PID {pid})"
    return "[KO] bot.py inactif"


def cmd_start() -> str:
    config = _lire_config()
    if not config.get("enabled", False):
        return "[KO] Discord desactive (enabled: false)"

    pid = _lire_pid()
    if pid and _pid_actif(pid):
        return f"[OK] bot.py deja actif (PID {pid})"

    proc = subprocess.Popen(
        [sys.executable, str(BOT_SCRIPT)],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        creationflags=subprocess.DETACHED_PROCESS if sys.platform == "win32" else 0,
    )
    PID_FILE.write_text(str(proc.pid))
    time.sleep(2)  # laisser le bot se connecter
    if _pid_actif(proc.pid):
        return f"[OK] bot.py lance (PID {proc.pid})"
    return "[KO] bot.py n'a pas demarre"


def cmd_stop() -> str:
    pid = _lire_pid()
    if not pid:
        return "[INFO] Aucun PID enregistre"
    if not _pid_actif(pid):
        PID_FILE.unlink(missing_ok=True)
        return "[INFO] bot.py deja arrete"
    try:
        if sys.platform == "win32":
            subprocess.call(["taskkill", "/F", "/PID", str(pid)],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        else:
            os.kill(pid, signal.SIGTERM)
        time.sleep(1)
        PID_FILE.unlink(missing_ok=True)
        return f"[OK] bot.py arrete (PID {pid})"
    except Exception as e:
        return f"[KO] Erreur arret : {e}"


def cmd_restart() -> str:
    stop_msg = cmd_stop()
    time.sleep(1)
    start_msg = cmd_start()
    return f"{stop_msg}\n{start_msg}"


if __name__ == "__main__":
    action = sys.argv[1] if len(sys.argv) > 1 else "status"
    if action == "start":
        print(cmd_start())
    elif action == "stop":
        print(cmd_stop())
    elif action == "restart":
        print(cmd_restart())
    elif action == "status":
        print(cmd_status())
    else:
        print(f"Action inconnue : {action}. Utilise : start | stop | restart | status")
        sys.exit(1)
