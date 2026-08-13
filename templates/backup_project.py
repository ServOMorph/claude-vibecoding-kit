"""Sauvegarde miroir d'un dossier de projet vers Google Drive via rclone (sans historique)."""

import os
import sys
import subprocess
from datetime import datetime
from pathlib import Path

RCLONE = Path(os.environ["LOCALAPPDATA"]) / "rclone" / "rclone.exe"

EXCLUDES = [
    ".git/**",
    "node_modules/**",
    "__pycache__/**",
    "venv/**",
    ".venv/**",
    "dist/**",
    "build/**",
]


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: python backup_project.py <chemin_projet> [nom_dossier_drive]")
        return 1

    if not RCLONE.exists():
        print(f"ERREUR : rclone introuvable à {RCLONE}")
        return 1

    project_path = Path(sys.argv[1])
    if not project_path.is_dir():
        print(f"ERREUR : dossier introuvable {project_path}")
        return 1

    drive_name = sys.argv[2] if len(sys.argv) > 2 else project_path.name
    drive_dest = f"googledrive:BackUps/{drive_name}"

    cmd = [str(RCLONE), "sync", str(project_path), drive_dest]
    for pattern in EXCLUDES:
        cmd += ["--exclude", pattern]

    print(f"[{datetime.now().strftime('%H:%M:%S')}] Sauvegarde {project_path} -> {drive_dest}")

    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"ERREUR upload : {result.stderr.strip()}")
        return 1

    print(f"[{datetime.now().strftime('%H:%M:%S')}] Sauvegarde OK -> {drive_dest}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
