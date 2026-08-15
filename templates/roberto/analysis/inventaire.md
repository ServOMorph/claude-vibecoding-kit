# Inventaire — Roberto2 → template `roberto`

Source analysée : `D:\ServOMorph\Roberto2` (hors `.git`, `__pycache__`).
Méthode : lecture directe de chaque fichier cité (imports, contenu, grep chemins absolus `D:\ServOMorph`/`D:/ServOMorph` sur tout l'arbre).

Légende statut :
- **CONSERVER** : noyau fonctionnel, copié tel quel dans `templates/roberto/`.
- **GÉNÉRICISER** : contient une référence au projet source (nom, chemin) à remplacer par un placeholder résolu à l'insertion.
- **EXCLURE** : état de session, historique propre à Roberto2, ou fichier géré par le mécanisme kit standard (pas du template).

---

## Dépendances externes constatées

- **Aucun `requirements.txt` dans Roberto2** (absent de l'arborescence).
- Imports tiers relevés (grep sur tous les `.py`) :
  - `pywin32` : `win32gui`, `win32con`, `win32clipboard`, `win32api`, `pywintypes` (MACROS/capturer_coordonnees.py, opencode.py ; UI_WEB/launcher.py)
  - `pyautogui` (MACROS/opencode.py)
  - `webview` (pywebview) (UI_WEB/app.py, api.py)
  - `tkinter` (stdlib, aucune install requise) (UI_WEB/launcher.py)
- Aucun chemin absolu codé en dur dans le code Python : tous les modules résolvent leurs chemins via `Path(__file__)` (vérifié dans `UI_WEB/paths.py`, `MASCOTTE/run_MASCOTTE.py`, `run.py`).
- Les seuls chemins absolus (`D:\ServOMorph\Roberto2`) constatés sont dans des **fichiers de données/config**, pas dans le code : `UI/recents.txt`, `UI_WEB/recent_folders.json` (déjà exclu par `.gitignore`), `.claude/zones.md`.
- `MACROS/tester_memoire_opencode.py`, `MACROS/tester_communication_opencode.py`, `_contexte/*`, `CHANGELOG.md`, `README.md` contiennent le littéral `roberto2` (nom de zone / libellés), sans impact fonctionnel sur le code.
- **Conséquence pour Phase 2** : le mécanisme de placeholders doit couvrir des fichiers de config/données (zones.md, README), pas du patch de code Python.

---

## Racine

| Fichier | Statut | Note |
|---|---|---|
| `.gitignore` | CONSERVER | Générique (`__pycache__/`, `*.pyc`, `UI_WEB/recent_folders.json`). |
| `CHANGELOG.md` | EXCLURE | Historique propre à Roberto2. |
| `GEMINI.md` | EXCLURE | Copie du `.claude/CLAUDE.md` standard du kit (contenu identique aux sections génériques), redondant — géré par l'init kit standard, pas par le template. |
| `ollama_call.py` | CONSERVER | Utilitaire générique de délégation Ollama, référencé par `CLAUDE.md` (`Délégation Ollama`), aucune dépendance à Roberto2. |
| `README.md` | GÉNÉRICISER | Décrit Roberto2 spécifiquement (objectif, stack, état) — à réécrire en `templates/roberto/README.md` sur le modèle `templates/control_PC/README.md`. |
| `roadmap_migration_ui_web.md` | EXCLURE | Roadmap terminée (historique de chantier, 4/4 phases FAIT). |
| `run.py` | CONSERVER | Lanceur (`UI_WEB.app`, option `--watch`), aucun chemin absolu. |
| `tests_manuels.md` | EXCLURE | Contient un test en attente propre à la session actuelle (Promo Explosive) — le template doit fournir un fichier vide, pas cet état. |

## `.claude/`

| Fichier | Statut | Note |
|---|---|---|
| `.claude/CLAUDE.md` | EXCLURE | Fichier kit standard, installé par `/init_projet`, pas par le template. |
| `.claude/commands/close.md`, `start.md` | EXCLURE | Confirmé par diff avec le kit courant : versions divergentes/obsolètes de commandes kit standard (manquent `check_kit.py`, `/doc_sync`, rotation sessions ; contiennent une variante `COM_AGENTS` non alignée). Ne pas copier — le projet cible reçoit les commandes à jour via le kit. |
| `.claude/commands/create_memory.md` | EXCLURE | Identique au kit standard (diff vide) — géré par le kit, pas par le template. |
| `.claude/memory.md` | GÉNÉRICISER (optionnel) | Contient une règle métier réelle (positionnement fenêtres UI_WEB gauche / macros droite) utile à documenter dans le README du template plutôt qu'à copier tel quel (mécanisme `/create_memory` régénère ce fichier côté cible). |
| `.claude/scheduled_tasks.lock` | EXCLURE | Verrou runtime (pid, session), pur état d'exécution. |
| `.claude/zones.md` | GÉNÉRICISER | Table alias→dossier propre à Roberto2 (`roberto2`, `mascotte`) — à régénérer avec le nom du projet cible à l'insertion. |

## `MACROS/` — noyau fonctionnel

| Fichier | Statut | Note |
|---|---|---|
| `__init__.py` | CONSERVER | |
| `capturer_coordonnees.py` | CONSERVER | Capture coordonnée écran (F8), dépend de `pywin32`. |
| `envoyer_message_opencode.py` | CONSERVER | Dépend de `UI_WEB.launcher`, `MACROS.opencode`. |
| `lancer_programme.py` | CONSERVER | Dépend de `UI_WEB.launcher`, `pywin32`. |
| `opencode.py` | CONSERVER | Dépend de `pyautogui`, `pywin32`, `UI_WEB.launcher`. |
| `tester_communication_opencode.py` | CONSERVER | Contient le littéral `roberto2` dans un message de test — impact cosmétique seulement (à vérifier au moment de la rédaction du template si à génériciser). |
| `tester_memoire_opencode.py` | CONSERVER | Idem, littéral `roberto2` cosmétique. |

## `MASCOTTE/` — zone-agent complète

| Fichier | Statut | Note |
|---|---|---|
| `agent_role.md` | GÉNÉRICISER | Référence explicite "Zone parente : roberto2" (méta) — à adapter au nom du projet cible. |
| `AMELIORATIONS_GRAPHISME.md` | EXCLURE | Notes de travail/historique propres à Roberto2. |
| `roadmap_amelioration_graphisme.md` | EXCLURE | Roadmap en cours propre à la session Roberto2 (Phase 0 EN COURS, avancement daté) — pas un état de départ valide pour un nouveau projet. |
| `_contexte/contexte.md`, `signals.md`, `statut.md`, `messages.md` | EXCLURE | État vivant de session (avancement daté, littéral `roberto2` dans `messages.md`) — régénérés vides par `/start`/`/create_com_agents` côté cible. |
| `animations/*.js` (9 fichiers) | CONSERVER | Noyau fonctionnel du rendu mascotte (aucune référence absolue trouvée). |
| `app.js`, `index.html`, `style.css` | CONSERVER | |
| `assets/*.png` (2 fichiers) | CONSERVER | |
| `run_MASCOTTE.py` | CONSERVER | Serveur de dev local (`Path(__file__).parent`), aucun chemin absolu. |

## `UI/`

| Fichier | Statut | Note |
|---|---|---|
| `recents.txt` | EXCLURE | Donnée de session : contient `D:\ServOMorph\Roberto2` en dur. |

## `UI_WEB/` — noyau fonctionnel

| Fichier | Statut | Note |
|---|---|---|
| `__init__.py` | CONSERVER | |
| `api.py` | CONSERVER | Dépend de `MACROS`, `webview`, `recent_folders`. |
| `app.js`, `index.html`, `style.css` | CONSERVER | |
| `app.py` | CONSERVER | Point d'entrée pywebview, aucun chemin absolu. |
| `launcher.py` | CONSERVER | Dépend de `pywin32`, `tkinter`. |
| `mascotte/animations_base.js`, `config_rendu.js`, `registry.js` | CONSERVER | Sous-ensemble d'animations intégré à l'UI (copie/subset de `MASCOTTE/animations/`) — vérifier en Phase 3 si synchronisé avec `MASCOTTE/animations/` ou volontairement figé. |
| `paths.py` | CONSERVER | Résolution 100% relative (`Path(__file__).resolve().parent`). |
| `recent_folders.json` | EXCLURE | Donnée de session (déjà `.gitignore`), contient `D:\\ServOMorph\\Roberto2`. |
| `recent_folders.py` | CONSERVER | Code générique, aucun chemin en dur. |
| `screen.py` | CONSERVER | |

## `_archive/`

| Fichier | Statut | Note |
|---|---|---|
| `MACROS/lancer_droite.ahk`, `MACROS/opencode.ahk`, `UI/lanceur.ahk` | EXCLURE | Scripts AutoHotkey legacy remplacés par `UI_WEB/`/`MACROS/` (confirmé par `README.md` : "remplacés par `UI_WEB/`/`MACROS/`") — poids mort, non fonctionnels dans le flux actuel. |

## `_contexte/` (racine)

| Fichier | Statut | Note |
|---|---|---|
| `archive_decisions.md`, `contexte.md`, `signals.md` | EXCLURE | État de session vivant propre à Roberto2, contient le littéral `roberto2`. |

## `_docs/`

| Fichier | Statut | Note |
|---|---|---|
| `idée du projet.txt` | EXCLURE | Contenu : "Créer une appli type openclaw et hermès" — spécifique à l'intention initiale de Roberto2. |
| `protocole_vibecoding.md` | EXCLURE | Documentation générique du protocole kit (v2.3) — dupliquée/gérée par le kit lui-même, pas par le template. |

## `_test_communication/`

| Fichier | Statut | Note |
|---|---|---|
| `reponse.txt`, `test_script.py` | EXCLURE | Résidu de test ponctuel (`test_script.py` affiche juste un message de test ; `reponse.txt` contient un identifiant `OK-aafc2578`) — pas fonctionnel, pas réutilisable. |

## `test_memoire_32k/`, `test_memoire_gemma/`, `test_memoire_gemma_v2/`

| Dossier | Statut | Note |
|---|---|---|
| Tous fichiers | EXCLURE | Expérimentations ponctuelles de test mémoire Ollama/Gemma (`fichier1.txt` = "ETAPE1", `test_memoire_gemma/README.md` = "This folder is for memory tests with Gemma", `test_memoire_gemma_v2/` ne contient qu'un `.gitkeep`) — non réutilisables. |

---

## Synthèse pour Phase 2/3

**Noyau CONSERVER (copie directe)** : `MACROS/` (7 fichiers), `MASCOTTE/{animations,assets,app.js,index.html,style.css,run_MASCOTTE.py}`, `UI_WEB/` (hors `recent_folders.json`), `run.py`, `ollama_call.py`, `.gitignore`.

**GÉNÉRICISER (placeholders à définir en Phase 2)** : `README.md`, `.claude/zones.md`, `MASCOTTE/agent_role.md` (littéral nom de zone parente).

**EXCLURE (ne fait pas partie du template)** : tout `_contexte/*`, `.claude/CLAUDE.md`/`commands/*` (gérés par le kit standard), `.claude/scheduled_tasks.lock`, `.claude/memory.md`, `_archive/`, `_docs/`, `_test_communication/`, `test_memoire_*/`, `CHANGELOG.md`, `GEMINI.md`, `roadmap_migration_ui_web.md`, `tests_manuels.md` (fournir vide), `MASCOTTE/roadmap_amelioration_graphisme.md`, `MASCOTTE/AMELIORATIONS_GRAPHISME.md`, `UI/recents.txt`, `UI_WEB/recent_folders.json`.

**Dépendances à documenter dans `templates/roberto/README.md`** (aucun `requirements.txt` source) : `pywin32`, `pyautogui`, `pywebview`.

**Question ouverte non tranchée ici** (reste au Cadrage de la roadmap) : statut du mécanisme `create_com_agents` déjà installé dans `MASCOTTE/_contexte/statut.md` — cet inventaire classe tout `_contexte/*` en EXCLURE (état vivant), ce qui répond de facto à la question pour les *données* de session ; reste à trancher en Phase 2 si le template doit pré-câbler la structure `_contexte/` vide + `statut.md` vide pour que `create_com_agents` soit immédiatement utilisable après insertion, ou si c'est hors périmètre.
