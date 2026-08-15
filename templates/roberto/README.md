# {{NOM_PROJET}}

## Objectif
Automatiser des interactions PC (lancement de programmes, envoi de messages, capture de coordonnées écran) via une UI Python + pywebview, avec une mascotte animée en retour visuel.

## Stack
Python — UI en Python + pywebview + HTML/CSS/JS.

## Structure
- `MACROS/` : automatisations Python (lancer un programme, ouvrir une application, envoyer un message, capturer une coordonnée écran via F8, tester la communication)
- `UI_WEB/` : interface Python + pywebview + HTML/CSS/JS (backend `api.py`, briques techniques `launcher.py`/`screen.py`)
- `MASCOTTE/` : zone-agent, mascotte animée (hibou procédural, animations JS) destinée à l'intégration dans `UI_WEB/` — voir `MASCOTTE/_contexte/statut.md`
- `run.py` : lance l'UI (option `--watch` pour relance auto au changement de fichier)
- `ollama_call.py` : délégation de tâches répétitives/templated à Ollama

## Dépendances

Aucun `requirements.txt` fourni par le template — à créer si besoin. Dépendances constatées :
- `pywin32` (`win32gui`, `win32con`, `win32clipboard`, `win32api`, `pywintypes`)
- `pyautogui`
- `pywebview`
- `tkinter` (stdlib, aucune install requise)

## Lancement
```
python run.py
```
`--watch` : relance automatique au changement de fichier.
