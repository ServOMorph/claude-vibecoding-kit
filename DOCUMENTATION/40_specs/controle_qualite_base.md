---
type: spec
description: Contrôle qualité de la base DOCUMENTATION : script check_docs.py (mécanique) + phase doc_sync (sémantique), à porter en session kit
tags: spec, qualité, doc_sync
maj: 2026-08-21
---

# Contrôle qualité de la base DOCUMENTATION

Spec d'implémentation (session documentation du 2026-08-21, à porter en session kit). Objet : vérifier que l'agent documentation fait bien son travail et lui proposer des améliorations. Deux volets : mécanique (gate, exit code) et sémantique (passage LLM intégré à /doc_sync, ciblé par le diff). Aucun correctif automatique nulle part.

## 1. Script `scripts/check_docs.py`

À créer dans `scripts/` du kit (script interne, pas de miroir dans `templates/`). Code intégral :

```python
#!/usr/bin/env python3
"""
check_docs.py — Contrôle qualité de la base DOCUMENTATION/ du kit.

Contrôles (spec : DOCUMENTATION/40_specs/controle_qualite_base.md) :
1. INDEX.md cohérent : document listé existe, aucun .md orphelin, date MAJ au format AAAA-MM-JJ
2. Liens markdown morts (internes DOCUMENTATION/ et sources canoniques)
3. Doublons : paires de documents partageant >= 3 lignes de prose identiques (heuristique)
4. Règles d'écriture : frontmatter minimal (type, description, tags, maj) ; <= 200 lignes pour 10_concepts/ et 20_guides/
5. Journal append-only : 30_decisions/journal.md sans modification de lignes existantes (git)
6. Invariants : commits « (documentation) » limités à DOCUMENTATION/, aucun secret détecté

Sortie : une ligne par écart, exit code 1 si au moins un écart. Aucun correctif automatique.
Usage : python scripts/check_docs.py [racine_kit]
"""

import re
import subprocess
import sys
from pathlib import Path

KIT_ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent
DOCS_DIR = KIT_ROOT / "DOCUMENTATION"
INDEX_PATH = DOCS_DIR / "INDEX.md"
JOURNAL_REL = "30_decisions/journal.md"

NON_INDEXED = {"INDEX.md", "agent_role.md"}
EXCLUDED_DIRS = {"_contexte"}
LINE_LIMIT = 200
LINE_LIMIT_DIRS = {"10_concepts", "20_guides"}
PROSE_MIN_LEN = 50
DOUBLON_THRESHOLD = 3
FRONTMATTER_KEYS = ("type", "description", "tags", "maj")

SECRET_PATTERNS = [
    re.compile(r"(?i)\b(api[_-]?key|secret[_-]?key|access[_-]?token|password|passwd|client[_-]?secret)\b\s*[:=]\s*['\"]?[A-Za-z0-9+/=_-]{16,}"),
    re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
    re.compile(r"-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----"),
]


def git_output(args):
    """Sortie git en texte, None si git indisponible ou en erreur."""
    try:
        result = subprocess.run(
            ["git", "-C", str(KIT_ROOT)] + args,
            capture_output=True,
            text=True,
            encoding="utf-8",
        )
        return result.stdout if result.returncode == 0 else None
    except (OSError, subprocess.SubprocessError):
        return None


def iter_docs():
    """Documents de connaissance : .md de DOCUMENTATION/ hors INDEX, agent_role.md et _contexte/."""
    for path in sorted(DOCS_DIR.rglob("*.md")):
        rel = path.relative_to(DOCS_DIR)
        if rel.name in NON_INDEXED or rel.parts[0] in EXCLUDED_DIRS:
            continue
        yield path


def check_index():
    errors = []
    if not INDEX_PATH.exists():
        errors.append("DOCUMENTATION/INDEX.md introuvable")
        return errors
    content = INDEX_PATH.read_text(encoding="utf-8")
    listed = set()
    for match in re.finditer(r"^\|\s*\[[^\]]+\]\(([^)]+)\)\s*\|", content, re.MULTILINE):
        target = match.group(1).strip()
        if not target.endswith(".md"):
            continue
        listed.add(target)
        if not (DOCS_DIR / target).resolve().exists():
            errors.append(f"INDEX.md : document listé introuvable : {target}")
    for path in iter_docs():
        rel = path.relative_to(DOCS_DIR).as_posix()
        if rel not in listed:
            errors.append(f"INDEX.md : .md non listé (orphelin) : {rel}")
    for line in content.splitlines():
        if "](" not in line:
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) >= 4 and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", cells[3]):
            errors.append(f"INDEX.md : date MAJ absente ou invalide : {cells[0]}")
    return errors


def check_links():
    errors = []
    pattern = re.compile(r"!?\[[^\]]*\]\(([^)\s]+)\)")
    for path in sorted(DOCS_DIR.rglob("*.md")):
        try:
            content = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        for match in pattern.finditer(content):
            if match.group(0).startswith("!"):
                continue
            target = match.group(1).split("#")[0]
            if not target or target.startswith(("http://", "https://", "mailto:")):
                continue
            if "{" in target or "<" in target:
                continue
            if not (path.parent / target).resolve().exists():
                errors.append(f"Lien mort : {target} (dans {path.relative_to(KIT_ROOT).as_posix()})")
    return errors


def extract_prose_lines(content):
    lines = set()
    in_code = False
    for line in content.splitlines():
        stripped = " ".join(line.split())
        if stripped.startswith("```"):
            in_code = not in_code
            continue
        if in_code or len(stripped) < PROSE_MIN_LEN:
            continue
        if stripped.startswith(("#", "|", "<!--")):
            continue
        lines.add(stripped)
    return lines


def check_doublons():
    errors = []
    docs = list(iter_docs())
    prose = {p: extract_prose_lines(p.read_text(encoding="utf-8")) for p in docs}
    for i in range(len(docs)):
        for j in range(i + 1, len(docs)):
            shared = prose[docs[i]] & prose[docs[j]]
            if len(shared) >= DOUBLON_THRESHOLD:
                rel_i = docs[i].relative_to(DOCS_DIR).as_posix()
                rel_j = docs[j].relative_to(DOCS_DIR).as_posix()
                errors.append(f"Doublon potentiel : {rel_i} / {rel_j} ({len(shared)} lignes de prose identiques)")
    return errors


def check_style():
    errors = []
    for path in iter_docs():
        rel = path.relative_to(DOCS_DIR)
        content = path.read_text(encoding="utf-8")
        if rel.parts[0] in LINE_LIMIT_DIRS:
            line_count = len(content.splitlines())
            if line_count > LINE_LIMIT:
                errors.append(f"Règle d'écriture : {rel.as_posix()} dépasse {LINE_LIMIT} lignes ({line_count})")
        if not content.startswith("---"):
            errors.append(f"Règle d'écriture : frontmatter absent dans {rel.as_posix()}")
            continue
        for key in FRONTMATTER_KEYS:
            if not re.search(rf"^{key}:\s*\S", content, re.MULTILINE):
                errors.append(f"Règle d'écriture : clé frontmatter manquante ({key}) dans {rel.as_posix()}")
    return errors


def check_journal_append_only():
    errors = []
    if not (DOCS_DIR / JOURNAL_REL).exists():
        errors.append("Journal introuvable : 30_decisions/journal.md")
        return errors
    hashes = git_output(["--no-pager", "log", "--format=%H", "--", "DOCUMENTATION/30_decisions/journal.md"])
    if hashes is None:
        errors.append("Journal : git indisponible, contrôle append-only non effectué")
        return errors
    for commit in hashes.split():
        new = git_output(["--no-pager", "show", f"{commit}:DOCUMENTATION/30_decisions/journal.md"])
        old = git_output(["--no-pager", "show", f"{commit}~1:DOCUMENTATION/30_decisions/journal.md"])
        if new is None or old is None:
            continue
        if not new.replace("\r\n", "\n").strip().startswith(old.replace("\r\n", "\n").strip()):
            errors.append(f"Journal non append-only : le commit {commit[:8]} a modifié des lignes existantes")
    return errors


def check_invariants():
    errors = []
    log = git_output(["--no-pager", "log", "--format=COMMIT%x09%s", "--name-only"])
    if log is None:
        errors.append("Invariants : git indisponible, contrôle des commits non effectué")
    else:
        for block in log.strip().split("COMMIT")[1:]:
            lines = block.strip().splitlines()
            subject = lines[0]
            paths = [p.strip() for p in lines[1:] if p.strip()]
            if "(documentation)" in subject:
                for path in paths:
                    if not path.startswith("DOCUMENTATION/"):
                        errors.append(f"Invariant : le commit « {subject[:60]} » touche {path} hors de DOCUMENTATION/")
    for path in sorted(DOCS_DIR.rglob("*.md")):
        try:
            content = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        for pattern in SECRET_PATTERNS:
            match = pattern.search(content)
            if match:
                line_no = content[: match.start()].count("\n") + 1
                errors.append(f"Invariant : secret potentiel dans {path.relative_to(KIT_ROOT).as_posix()}:{line_no}")
    return errors


def main():
    all_errors = []
    all_errors.extend(check_index())
    all_errors.extend(check_links())
    all_errors.extend(check_doublons())
    all_errors.extend(check_style())
    all_errors.extend(check_journal_append_only())
    all_errors.extend(check_invariants())
    if all_errors:
        print("ECARTS DETECTES :")
        for error in all_errors:
            print(f"  - {error}")
        sys.exit(1)
    else:
        print("Tous les contrôles sont passants.")
        sys.exit(0)


if __name__ == "__main__":
    main()
```

## 2. Mise à jour de `.claude/commands/doc_sync.md`

Instructions exactes :

1. Insérer la nouvelle étape ci-dessous entre « ### 2. Identifier ce qui a changé » et « ### 2. Synchroniser les paires miroir »
2. Renuméroter la suite : Synchroniser les paires miroir → 4, Vérifier README.md → 5, Vérifier CHANGELOG.md → 6, Vérifier DEPLOYMENTS.md → 7, Rapport final → 8
3. Dans la note « scripts internes du kit » de l'étape Synchroniser les paires miroir : ajouter `scripts/check_docs.py` à la liste

Texte de la nouvelle étape :

```markdown
### 3. Contrôle de la base DOCUMENTATION/

Exécuter le contrôle qualité de la base :
```bash
python scripts/check_docs.py
```

**Règle :** un écart signalé bloque la synchronisation tant qu'il n'est pas traité ou explicitement écarté (comme à l'étape 1).

Si le contrôle passe et que l'étape 2 a identifié des changements touchant le contenu documenté (commandes, templates, CLAUDE.md, structure), contrôler aussi la cohérence sémantique :

- Relire les documents de DOCUMENTATION/ qui traitent des éléments modifiés (commencer par INDEX.md)
- Fraîcheur réelle : le contenu dit-il encore vrai, comparé aux sources canoniques ?
- Couverture : un changement non documenté ?
- Règles anti-complaisance : chaque remarque cite un fichier et une ligne précise ; chaque amélioration proposée est actionnable ; interdiction de conclure « tout est bon » sans avoir relu chaque document concerné
- Ne pas modifier DOCUMENTATION/ directement : présenter les propositions à l'utilisateur ; n'écrire dans DOCUMENTATION/_contexte/signals.md (actions ouvertes : priorité + « fait quand ») que les propositions qu'il valide

Spec : `DOCUMENTATION/40_specs/controle_qualite_base.md`
```

## 3. Critères de fin

- `python scripts/check_docs.py` → exit 0
- `python scripts/check_kit.py` → exit 0 (le contrôle 6 de check_kit vérifie que les fichiers cités dans `.claude/commands/*.md` existent : créer le script avant de modifier la commande, dans le même commit)
- Entrée CHANGELOG.md ajoutée (minor : ajout d'un contrôle, pas de suppression ni de changement de structure)

## 4. Ordre des opérations (session kit)

1. Créer `scripts/check_docs.py` (code du § 1, intégral)
2. Mettre à jour `.claude/commands/doc_sync.md` (§ 2)
3. Exécuter les deux scripts : exit 0 attendu sur les deux
4. CHANGELOG.md + commit

## 5. Usage par l'agent documentation

`python scripts/check_docs.py` est exécutable en lecture seule à tout moment, notamment en début de session /start documentation (lint de la base, obligation du cycle de vie d'agent_role.md). Il ne remplace pas le passage sémantique de /doc_sync (fraîcheur réelle, couverture) : le mécanique donne le socle de vérité, le sémantique l'interprète.
