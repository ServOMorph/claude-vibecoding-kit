from __future__ import annotations

import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

WORKFLOW_DIR = Path(__file__).resolve().parent
KIT_ROOT = WORKFLOW_DIR.parents[4]
DEPLOYMENTS = KIT_ROOT / "DEPLOYMENTS.md"
ORDRE_PROJETS = WORKFLOW_DIR / "ordre_projets.md"

sys.path.insert(0, str(WORKFLOW_DIR))
import urgences_sereniatech  # noqa: E402

PROJET_SERENIATECH = "SérénIATech_dev (origine du kit)"

ETAT_ACTUEL_RE = re.compile(r"^## État actuel.*$", re.MULTILINE)
NEXT_SECTION_RE = re.compile(r"^## .*$", re.MULTILINE)


def read_table(path: Path, columns: int) -> list[list[str]]:
    rows = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) != columns or set(cells[0]) <= {"-"}:
            continue
        if cells[0] in ("Rang", "Projet"):
            continue
        rows.append(cells)
    return rows


def deployments_paths() -> dict[str, Path]:
    paths = {}
    for nom, chemin, *_ in read_table(DEPLOYMENTS, 5):
        paths[nom] = Path(chemin)
    return paths


def ordre_projets() -> list[tuple[str, str]]:
    return [(nom, alias) for _, nom, alias in read_table(ORDRE_PROJETS, 3)]


def etat_actuel(contexte_path: Path) -> str:
    if not contexte_path.is_file():
        return "état inconnu (pas de _contexte/contexte.md)"
    text = contexte_path.read_text(encoding="utf-8")
    match = ETAT_ACTUEL_RE.search(text)
    if not match:
        return "état inconnu (section État actuel absente)"
    start = match.end()
    next_match = NEXT_SECTION_RE.search(text, start)
    end = next_match.start() if next_match else len(text)
    return text[start:end].strip()


def main() -> None:
    paths = deployments_paths()
    for rang, (nom, alias) in enumerate(ordre_projets(), start=1):
        if nom == PROJET_SERENIATECH:
            urgentes = urgences_sereniatech.actions_urgentes()
            if not urgentes:
                print(f"{rang}. {nom} ({alias})\n   Aucune action urgente.\n")
                continue
            lignes = "\n   ".join(
                f"[{item['zone']}] {item['titre']}"
                + (f" (échéance {item['date']})" if item.get("date") else "")
                for item in urgentes
            )
            print(f"{rang}. {nom} ({alias})\n   {lignes}\n")
            continue

        chemin = paths.get(nom)
        if chemin is None:
            print(f"{rang}. {nom} — absent de DEPLOYMENTS.md")
            continue
        etat = etat_actuel(chemin / "_contexte" / "contexte.md")
        print(f"{rang}. {nom} ({alias})\n   {etat}\n")


if __name__ == "__main__":
    main()
