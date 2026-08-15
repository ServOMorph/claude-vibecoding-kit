from __future__ import annotations

import time
from pathlib import Path

from . import opencode

RACINE_PROJET = Path(__file__).resolve().parent.parent
DOSSIER_TEST = RACINE_PROJET / "test_memoire_gemma"
FICHIER_1 = DOSSIER_TEST / "fichier1.txt"
FICHIER_2 = DOSSIER_TEST / "fichier2.txt"
CONTENU_1 = "ETAPE1"
CONTENU_2 = "ETAPE2"

TIMEOUT_S = 120.0
POLL_S = 1.0


def _attendre(chemin: Path, timeout_s: float) -> bool:
    deadline = time.monotonic() + timeout_s
    while time.monotonic() < deadline:
        if chemin.exists():
            return True
        time.sleep(POLL_S)
    return False


def tester_memoire_contexte() -> tuple[bool, str]:
    if DOSSIER_TEST.exists():
        for fichier in DOSSIER_TEST.iterdir():
            fichier.unlink()
        DOSSIER_TEST.rmdir()

    opencode.nouvelle_conversation()
    opencode.envoyer_prompt_initial("Dans le dossier actuel, cree un sous-dossier nomme test_memoire_gemma.")
    if not _attendre(DOSSIER_TEST, TIMEOUT_S):
        return False, "Etape 1 echouee : sous-dossier test_memoire_gemma non cree."

    opencode.envoyer_message_suivant(
        f"Dans ce sous-dossier que tu viens de creer, cree un fichier fichier1.txt "
        f"contenant exactement le texte {CONTENU_1}."
    )
    if not _attendre(FICHIER_1, TIMEOUT_S):
        return False, "Etape 2 echouee : fichier1.txt non cree dans le bon dossier."

    opencode.envoyer_message_suivant(
        f"Toujours dans ce meme sous-dossier, cree un fichier fichier2.txt "
        f"contenant exactement le texte {CONTENU_2}."
    )
    if not _attendre(FICHIER_2, TIMEOUT_S):
        return False, "Etape 3 echouee : fichier2.txt non cree dans le bon dossier."

    contenu1 = FICHIER_1.read_text(encoding="utf-8").strip()
    contenu2 = FICHIER_2.read_text(encoding="utf-8").strip()
    if contenu1 != CONTENU_1 or contenu2 != CONTENU_2:
        return False, f"Contenu inattendu : fichier1={contenu1!r}, fichier2={contenu2!r}"

    return True, "Memoire de contexte validee sur 3 messages."
