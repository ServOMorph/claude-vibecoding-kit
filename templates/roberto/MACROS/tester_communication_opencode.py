from __future__ import annotations

import time
import uuid
from pathlib import Path

from . import envoyer_message_opencode

RACINE_PROJET = Path(__file__).resolve().parent.parent
FICHIER_REPONSE = RACINE_PROJET / "_test_communication" / "reponse.txt"
TIMEOUT_S = 30.0
POLL_S = 0.5


def tester_communication(timeout_s: float = TIMEOUT_S) -> tuple[bool, str]:
    FICHIER_REPONSE.parent.mkdir(parents=True, exist_ok=True)
    if FICHIER_REPONSE.exists():
        FICHIER_REPONSE.unlink()

    token = f"OK-{uuid.uuid4().hex[:8]}"
    message = (
        f"Cree le fichier {FICHIER_REPONSE} avec exactement le contenu suivant, "
        f"sans rien ajouter d'autre : {token}"
    )

    success, envoi_message = envoyer_message_opencode.envoyer_message(message)
    if not success:
        return False, envoi_message

    deadline = time.monotonic() + timeout_s
    while time.monotonic() < deadline:
        if FICHIER_REPONSE.exists():
            contenu = FICHIER_REPONSE.read_text(encoding="utf-8").strip()
            if contenu == token:
                return True, f"Communication validee : {contenu}"
            return False, f"Contenu inattendu : {contenu!r} (attendu {token!r})"
        time.sleep(POLL_S)

    return False, "Timeout : aucun fichier recu d'OpenCode."
