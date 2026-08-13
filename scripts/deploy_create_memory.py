#!/usr/bin/env python3
"""
Déploie create_memory.md dans les projets listés dans DEPLOYMENTS.md.
Économise les tokens : logs succincts, pas de relecture inutile.
"""

import os
import shutil
from pathlib import Path
from datetime import datetime

KIT_ROOT = Path(__file__).parent
TEMPLATE_FILE = KIT_ROOT / "templates" / ".claude" / "commands" / "create_memory.md"
DEPLOYMENTS = KIT_ROOT / "DEPLOYMENTS.md"

def parse_deployments():
    """Extrait les chemins de projet depuis DEPLOYMENTS.md (format table markdown)."""
    projects = []
    with open(DEPLOYMENTS, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line.startswith('|') and '|' in line[1:]:
                parts = [p.strip() for p in line.split('|')]
                if len(parts) >= 3 and parts[1] and not parts[1].startswith('Chemin'):
                    path = parts[2]
                    if path and path != 'Zone(s)' and not path.startswith('/'):
                        projects.append(path)
    return projects

def deploy_to_project(project_path, template_file):
    """Copie create_memory.md dans un projet. Retourne (status, msg)."""
    project_path = Path(project_path)
    target_dir = project_path / ".claude" / "commands"
    target_file = target_dir / "create_memory.md"

    # Vérifications rapides
    if not project_path.exists():
        return "SKIP", f"chemin inexistant"
    if not template_file.exists():
        return "ERROR", f"template absent du kit"
    if target_file.exists():
        return "OK", f"déjà présent"

    # Copie
    try:
        target_dir.mkdir(parents=True, exist_ok=True)
        shutil.copy2(template_file, target_file)
        return "DEPLOYED", f"créé"
    except Exception as e:
        return "ERROR", str(e)

def main():
    print(f"\n=== Déploiement create_memory.md [{datetime.now().strftime('%H:%M:%S')}] ===\n")

    if not TEMPLATE_FILE.exists():
        print(f"ERROR: template absent ({TEMPLATE_FILE})")
        return

    projects = parse_deployments()
    print(f"Projets trouvés : {len(projects)}\n")

    stats = {"DEPLOYED": 0, "OK": 0, "SKIP": 0, "ERROR": 0}

    for project_path in projects:
        status, msg = deploy_to_project(project_path, TEMPLATE_FILE)
        stats[status] += 1

        # Log succinct
        project_name = Path(project_path).name
        symbol = "✓" if status in ["DEPLOYED", "OK"] else ("⊘" if status == "SKIP" else "✗")
        print(f"{symbol} {project_name:30} | {msg}")

    print(f"\n--- Résumé ---")
    print(f"Déployés : {stats['DEPLOYED']} | Déjà présent : {stats['OK']} | Ignorés : {stats['SKIP']} | Erreurs : {stats['ERROR']}")

if __name__ == "__main__":
    main()
