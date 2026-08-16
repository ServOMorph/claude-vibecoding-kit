"""
Helper Discord ↔ Claude Code natif.

Usage CLI :
  python discord_loop.py wait           → bloque jusqu'à commande, affiche sur stdout
  python discord_loop.py send "msg"     → envoie message Discord et attend envoi
  python discord_loop.py done           → marque commande comme traitée (idle)
  python discord_loop.py notify "msg"   → notifie Discord sans attendre (fire & forget)

Ces 4 commandes sont utilisées par la boucle native Claude via /discord_loop.
Claude exécute lui-même les commandes reçues — aucun sous-processus claude -p.
"""
import json
import sys
import time
from pathlib import Path

DIR = Path(__file__).parent
COMMANDS = DIR / "commands.json"
QUEUE = DIR / "queue.json"
CONFIG_FILE = DIR / "config_bot_discord.json"

WAIT_TIMEOUT = 10    # secondes par cycle (< timeout Bash 120s) — rebouclage infini possible
SEND_TIMEOUT = 10    # secondes max pour confirmer envoi bot


def _lire(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def _ecrire(path: Path, data: dict):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def wait_for_command() -> str | None:
    """Bloque jusqu'à commande pending. Retourne la commande ou None si timeout."""
    debut = time.time()
    while time.time() - debut < WAIT_TIMEOUT:
        d = _lire(COMMANDS)
        if d["status"] == "pending":
            d["status"] = "processing"
            _ecrire(COMMANDS, d)
            return d["command"]
        time.sleep(1)
    return None


def send_response(msg: str):
    """Écrit message dans queue.json et attend que le bot l'envoie."""
    _ecrire(QUEUE, {
        "status": "pending",
        "message": msg[:1900],
        "response": "",
        "timestamp": int(time.time())
    })
    debut = time.time()
    while time.time() - debut < SEND_TIMEOUT:
        q = _lire(QUEUE)
        if q["status"] in ("waiting", "responded", "idle"):
            return
        time.sleep(0.5)


def mark_done():
    """Remet commands.json à idle après traitement."""
    d = _lire(COMMANDS)
    d["status"] = "idle"
    d["command"] = ""
    _ecrire(COMMANDS, d)


if __name__ == "__main__":
    config = _lire(CONFIG_FILE)
    if not config.get("enabled", False):
        print("Discord désactivée (enabled: false dans config_bot_discord.json).")
        sys.exit(0)

    action = sys.argv[1] if len(sys.argv) > 1 else "wait"

    if action == "wait":
        cmd = wait_for_command()
        if cmd:
            print(cmd)
        else:
            print("TIMEOUT")
            sys.exit(1)

    elif action == "send":
        msg = " ".join(sys.argv[2:]) if len(sys.argv) > 2 else ""
        send_response(msg)

    elif action == "notify":
        msg = " ".join(sys.argv[2:]) if len(sys.argv) > 2 else ""
        _ecrire(QUEUE, {
            "status": "pending",
            "message": msg[:1900],
            "response": "",
            "timestamp": int(time.time())
        })

    elif action == "done":
        mark_done()

    else:
        print(f"Action inconnue : {action}. Utilise : wait | send | done | notify")
        sys.exit(1)
