from __future__ import annotations

import json
import sys
from datetime import date
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

PROJET_DIR = Path(r"C:\Users\raph6\Documents\SerenIATech\SérénIATech_dev")
ORGA_JSON = PROJET_DIR / "Orga" / "data" / "orga.json"
ETIQUETTES_JSON = PROJET_DIR / "Orga" / "data" / "etiquettes.json"


def echeance_depassee(item: dict, aujourdhui: date) -> bool:
    valeur = item.get("date")
    if not valeur:
        return False
    try:
        return date.fromisoformat(valeur) < aujourdhui
    except ValueError:
        return False


def actions_urgentes() -> list[dict]:
    orga = json.loads(ORGA_JSON.read_text(encoding="utf-8"))
    etiquettes = json.loads(ETIQUETTES_JSON.read_text(encoding="utf-8"))
    aujourdhui = date.today()

    urgentes = []
    for item in orga["items"]:
        if item.get("statut") != "ouvert":
            continue
        est_urgent = etiquettes.get(item["id"]) == "urgent" or echeance_depassee(item, aujourdhui)
        if est_urgent:
            urgentes.append(item)
    return urgentes


def main() -> None:
    for item in actions_urgentes():
        echeance = f" (échéance {item['date']})" if item.get("date") else ""
        print(f"[{item['zone']}] {item['titre']}{echeance}")


if __name__ == "__main__":
    main()
