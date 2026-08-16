"""Bridge Claude Code ↔ Discord. Importer dans n'importe quel agent/script."""
import json
import time
from pathlib import Path

DIR = Path(__file__).parent
QUEUE = DIR / "queue.json"
CONFIG = json.loads((DIR / "config_bot_discord.json").read_text(encoding="utf-8"))


def est_active() -> bool:
    return CONFIG.get("enabled", False)


def envoyer(message: str, timeout: int = 300) -> str:
    """
    Envoie un message sur Discord et attend la réponse utilisateur.
    Retourne la réponse (str) ou lève TimeoutError si pas de réponse.
    """
    if not est_active():
        raise RuntimeError("Discord com désactivée (enabled: false dans config_bot_discord.json)")

    # Écrire le message dans la queue
    QUEUE.write_text(json.dumps({
        "status": "pending",
        "message": message,
        "response": "",
        "timestamp": int(time.time())
    }, ensure_ascii=False, indent=2), encoding="utf-8")

    # Attendre la réponse
    debut = time.time()
    while time.time() - debut < timeout:
        q = json.loads(QUEUE.read_text(encoding="utf-8"))
        if q["status"] == "responded":
            # Remettre en idle
            q["status"] = "idle"
            QUEUE.write_text(json.dumps(q, ensure_ascii=False, indent=2), encoding="utf-8")
            return q["response"]
        time.sleep(1)

    raise TimeoutError(f"Pas de réponse Discord après {timeout}s")


def notifier(message: str):
    """Envoie un message sans attendre de réponse."""
    if not est_active():
        return
    QUEUE.write_text(json.dumps({
        "status": "pending",
        "message": message,
        "response": "",
        "timestamp": int(time.time())
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    # Attendre que le bot envoie (status passe à waiting)
    debut = time.time()
    while time.time() - debut < 10:
        q = json.loads(QUEUE.read_text(encoding="utf-8"))
        if q["status"] in ("waiting", "responded", "idle"):
            return
        time.sleep(0.5)
