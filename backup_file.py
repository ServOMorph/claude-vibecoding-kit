#!/usr/bin/env python3
"""
Sauvegarde un fichier vers Google Drive via rclone.
Usage: python backup_file.py <chemin_fichier> [destination_drive]
"""

import os
import sys
import shutil
import subprocess
from datetime import datetime
from pathlib import Path

RCLONE = Path(os.environ["LOCALAPPDATA"]) / "rclone" / "rclone.exe"

if not RCLONE.exists():
    print(f"ERREUR : rclone introuvable à {RCLONE}")
    sys.exit(1)

if len(sys.argv) < 2:
    print("Usage: python backup_file.py <chemin_fichier> [destination_drive]")
    sys.exit(1)

file_path = Path(sys.argv[1])
if not file_path.exists():
    print(f"ERREUR : fichier introuvable {file_path}")
    sys.exit(1)

drive_dest = sys.argv[2] if len(sys.argv) > 2 else "googledrive:BackUps/claude-vibecoding-kit"

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
file_name = file_path.stem
file_ext = file_path.suffix
backup_name = f"{file_name}_{timestamp}{file_ext}"

print(f"[{datetime.now().strftime('%H:%M:%S')}] Sauvegarde {file_path.name} -> {drive_dest}/{backup_name}")

result = subprocess.run(
    [str(RCLONE), "copyto", str(file_path), f"{drive_dest}/{backup_name}"],
    capture_output=True, text=True
)

if result.returncode != 0:
    print(f"ERREUR upload : {result.stderr.strip()}")
    sys.exit(1)

print(f"[{datetime.now().strftime('%H:%M:%S')}] Sauvegarde OK -> {drive_dest}/{backup_name}")
