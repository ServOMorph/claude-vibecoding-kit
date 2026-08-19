"""
com_manager.py — Gestion du cycle de vie des 3 processus de voice-code-bridge.

Usage CLI :
  python com_manager.py start [node|stt|tts]    -> lance le(s) processus, sauve le PID
  python com_manager.py stop [node|stt|tts]     -> arrete le(s) processus via le PID sauvegarde
  python com_manager.py restart [node|stt|tts]  -> stop + start
  python com_manager.py status [node|stt|tts]   -> verifie l'etat du/des processus

Sans argument de composant : agit sur les 3 processus (node, stt, tts).
Claude utilise ce script pour gerer l'assistant vocal sans intervention manuelle.
"""
import subprocess
import sys
import time
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent / "voice-code-bridge"
SERVER_DIR = BASE_DIR / "server"
PID_DIR = Path(__file__).parent

PYTHON311 = ["py", "-3.11"]

PROCESSES = {
    "node": {
        "cmd": ["node", "server.js"],
        "cwd": SERVER_DIR,
        "pid_file": PID_DIR / "node.pid",
    },
    "stt": {
        "cmd": PYTHON311 + ["stt_server.py"],
        "cwd": SERVER_DIR,
        "pid_file": PID_DIR / "stt.pid",
    },
    "tts": {
        "cmd": PYTHON311 + ["tts_server.py"],
        "cwd": SERVER_DIR,
        "pid_file": PID_DIR / "tts.pid",
    },
}


def _pid_actif(pid: int) -> bool:
    try:
        result = subprocess.run(
            ["tasklist", "/FI", f"PID eq {pid}", "/NH"],
            capture_output=True, text=True
        )
        return str(pid) in result.stdout
    except Exception:
        return False


def _lire_pid(pid_file: Path) -> int | None:
    if pid_file.exists():
        try:
            return int(pid_file.read_text().strip())
        except Exception:
            pass
    return None


def cmd_status(name: str) -> str:
    proc = PROCESSES[name]
    pid = _lire_pid(proc["pid_file"])
    if pid and _pid_actif(pid):
        return f"[OK] {name} actif (PID {pid})"
    return f"[KO] {name} inactif"


def cmd_start(name: str) -> str:
    proc = PROCESSES[name]
    pid = _lire_pid(proc["pid_file"])
    if pid and _pid_actif(pid):
        return f"[OK] {name} deja actif (PID {pid})"

    handle = subprocess.Popen(
        proc["cmd"],
        cwd=str(proc["cwd"]),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        creationflags=subprocess.DETACHED_PROCESS if sys.platform == "win32" else 0,
    )
    proc["pid_file"].write_text(str(handle.pid))
    time.sleep(1)
    if _pid_actif(handle.pid):
        return f"[OK] {name} lance (PID {handle.pid})"
    return f"[KO] {name} n'a pas demarre"


def cmd_stop(name: str) -> str:
    proc = PROCESSES[name]
    pid = _lire_pid(proc["pid_file"])
    if not pid:
        return f"[INFO] {name} : aucun PID enregistre"
    if not _pid_actif(pid):
        proc["pid_file"].unlink(missing_ok=True)
        return f"[INFO] {name} deja arrete"
    subprocess.call(["taskkill", "/F", "/T", "/PID", str(pid)],
                     stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1)
    proc["pid_file"].unlink(missing_ok=True)
    return f"[OK] {name} arrete (PID {pid})"


def cmd_restart(name: str) -> str:
    stop_msg = cmd_stop(name)
    time.sleep(1)
    start_msg = cmd_start(name)
    return f"{stop_msg}\n{start_msg}"


ACTIONS = {
    "start": cmd_start,
    "stop": cmd_stop,
    "restart": cmd_restart,
    "status": cmd_status,
}


if __name__ == "__main__":
    action = sys.argv[1] if len(sys.argv) > 1 else "status"
    component = sys.argv[2] if len(sys.argv) > 2 else None

    if action not in ACTIONS:
        print(f"Action inconnue : {action}. Utilise : start | stop | restart | status")
        sys.exit(1)

    names = [component] if component else list(PROCESSES.keys())
    invalid = [n for n in names if n not in PROCESSES]
    if invalid:
        print(f"Composant inconnu : {invalid}. Utilise : node | stt | tts")
        sys.exit(1)

    if action == "start":
        # STT et TTS doivent charger leur modele avant que Node ne soit utile
        order = [n for n in ["stt", "tts", "node"] if n in names]
    else:
        order = names

    for n in order:
        print(ACTIONS[action](n))
        if action == "start" and n in ("stt", "tts"):
            time.sleep(3)
