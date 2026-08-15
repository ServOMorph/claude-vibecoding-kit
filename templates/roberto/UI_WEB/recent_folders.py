from __future__ import annotations

import json

from . import paths

MAX_RECENT = 5
DATA_FILE = paths.PACKAGE_DIR / "recent_folders.json"


def load_recent() -> list[str]:
    if not DATA_FILE.exists():
        return []
    try:
        return json.loads(DATA_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return []


def add_recent(folder: str) -> list[str]:
    recent = [f for f in load_recent() if f != folder]
    recent.insert(0, folder)
    recent = recent[:MAX_RECENT]
    DATA_FILE.write_text(json.dumps(recent, ensure_ascii=False, indent=2), encoding="utf-8")
    return recent
