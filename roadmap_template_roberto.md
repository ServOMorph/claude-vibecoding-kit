# Roadmap — Commande d'insertion de template + template `roberto`
Objectif : créer une commande générique d'insertion de template dans un projet cible (aucune n'existe actuellement — `control_PC` a été copié manuellement), en construisant et testant le template `roberto` (extrait de `Roberto2`) comme cas d'usage concret.
Créée le : 2026-08-15

---

## Cadrage (à lire avant Phase 1, ne pas supprimer)

**Portée** : deux livrables couplés.
1. `templates/roberto/` : template généricisé extrait de `D:\ServOMorph\Roberto2` (MASCOTTE, MACROS, UI_WEB, config `.claude/`, scripts racine) — toutes les fonctions doivent rester opérationnelles après copie dans un projet cible.
2. Une commande `.claude/commands/` (nom à trancher en Phase 2) qui automatise l'insertion d'un template (`templates/<nom>/`) dans un projet cible — généralisable à `control_PC` et aux futurs templates, pas seulement à `roberto`.

**Traçage** : tout le travail d'analyse et de conception intermédiaire vit dans `templates/roberto/` (pas dans `_contexte/` ni dans le chat).

**Ce qui reste ouvert à ce stade** (à trancher en Phase 1/2, pas de décision prise) :
- Périmètre exact du template : Roberto2 complet (y compris `test_memoire_*`, `_test_communication`, `_docs`) ou noyau fonctionnel seulement (MASCOTTE + MACROS + UI_WEB) ?
- Gestion des chemins absolus détectés dans les scripts (`UI_WEB/paths.py`, `UI_WEB/recent_folders.py` notamment) — remplacement par placeholders résolus à l'insertion, ou détection/configuration au premier lancement ?
- Gestion des dépendances Python (aucun `requirements.txt` constaté à ce stade dans Roberto2 — à vérifier) et de la version Python attendue.
- Statut du mécanisme `create_com_agents` déjà installé dans Roberto2 (`statut.md`/`messages.md` MASCOTTE) : à inclure tel quel dans le template ou à traiter séparément (cf. `roadmap_com_agents.md`, Phase 2 en cours sur ce même projet).

---

## Phase 1 — Inventaire complet de Roberto2 [FAIT]
- [x] Lister exhaustivement les fichiers de `D:\ServOMorph\Roberto2` (hors `.git`, `__pycache__`) avec leur rôle fonctionnel.
- [x] Identifier tous les chemins absolus, valeurs codées en dur (`D:\ServOMorph\Roberto2\...`) et fichiers de données de session/locales (`UI_WEB/recent_folders.json`, `_contexte/*`, `.claude/scheduled_tasks.lock`, `.claude/memory.md`) à exclure ou génériciser.
- [x] Identifier les dépendances externes (imports Python, appels `ollama_call.py`, éventuel `requirements.txt` manquant) nécessaires au bon fonctionnement après copie.
- [x] Produire `templates/roberto/analysis/inventaire.md` (liste fichier par fichier : conserver tel quel / génériciser / exclure, + dépendances constatées).

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 2 — Conception de la commande d'insertion de template [EN COURS]
- [x] Trancher le nom et la portée de la commande : `/insert_template <chemin_projet_cible> <nom_template> [dossier_destination]`, généraliste (validé par l'utilisateur).
- [x] Définir le mécanisme de placeholders : résolution à l'insertion, vocabulaire générique `{{NOM_PROJET}}`/`{{ALIAS_PROJET}}`/`{{DATE}}`, tout token hors de cette liste bloque le fichier concerné (validé par l'utilisateur).
- [x] Définir la détection d'installation déjà présente (idempotence) : jamais d'écrasement silencieux, fichiers déjà présents listés et laissés intacts (validé par l'utilisateur).
- [x] Rédiger `.claude/commands/insert_template.md`.

**Décision complémentaire actée** : le template `roberto` ne pré-câble pas de structure `_contexte/` vide pour `create_com_agents` (mécanisme encore en pilote non validé) — hors périmètre.

**Convention posée pour la Phase 3** : un dossier `analysis/` à la racine d'un template est réservé au traçage kit, jamais copié par `/insert_template`. Le tri conserver/génériciser/exclure de l'inventaire Phase 1 se traduit en Phase 3 par ce qui est effectivement placé dans `templates/roberto/` (pas par un filtre à l'insertion) ; les fichiers à génériciser doivent recevoir les tokens `{{NOM_PROJET}}`/`{{ALIAS_PROJET}}`/`{{DATE}}` en dur dans leur contenu.

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 3 — Extraction et généricisation du template `roberto` [FAIT]
- [x] Copier dans `templates/roberto/` la structure retenue en Phase 1 (périmètre tranché), en excluant `.git`, `__pycache__`, données de session.
- [x] Appliquer les placeholders définis en Phase 2 aux chemins absolus/valeurs codées en dur.
- [x] Documenter les dépendances et prérequis dans `templates/roberto/README.md` (sur le modèle de `templates/control_PC/README.md`).

**Écart constaté vs inventaire Phase 1** : l'inventaire affirmait "aucun chemin absolu codé en dur dans le code Python" ; deux fichiers y contredisaient (`MACROS/tester_memoire_opencode.py`, `MACROS/tester_communication_opencode.py`, chemins `D:\ServOMorph\Roberto2\...` en dur). Corrigés par résolution relative (`Path(__file__).resolve().parent.parent`), cohérente avec le reste du code — pas de placeholder nécessaire.

**Fichiers génériciés** : `README.md`, `.claude/zones.md`, `MASCOTTE/agent_role.md` (tokens `{{NOM_PROJET}}`/`{{ALIAS_PROJET}}`/`{{DATE}}`). `tests_manuels.md` fourni vide (convention CLAUDE.md).

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 4 — Test réel de bout en bout [FAIT]
- [x] Lancer la commande d'insertion sur un projet cible de test, avec `templates/roberto/`.
- [x] Vérifier fonction par fonction (MASCOTTE, MACROS, UI_WEB, config `.claude/`) que rien n'est cassé après la copie — liste de contrôle issue de l'inventaire Phase 1.
- [x] Corriger la commande et/ou le template en fonction des écarts constatés.
- [x] Bilan : garder tel quel, ajuster, ou écarter.

**Test réalisé** : projet cible de test créé hors du kit (dossier scratchpad, `.claude/zones.md` minimal avec alias racine `projet_test`), procédure `[PREFLIGHT]`/`[COLLECTE]`/`[ECRITURE]` de `insert_template.md` appliquée manuellement.
- 30 fichiers hors `analysis/` copiés (binaires compris, images PNG vérifiées octet-identiques).
- `.claude/zones.md` du template correctement détecté comme déjà présent côté cible (idempotence) et laissé intact — pas d'écrasement.
- Placeholders résolus sans reste (`{{NOM_PROJET}}`→`test_target_roberto`, `{{ALIAS_PROJET}}`→`projet_test`) dans `README.md` et `MASCOTTE/agent_role.md`.
- Tout le code Python copié compile (`py_compile`) sans erreur.
- Le correctif Phase 3 (résolution relative dans `tester_memoire_opencode.py`/`tester_communication_opencode.py`) validé : une fois importés depuis le projet cible, `RACINE_PROJET` pointe bien vers la racine du projet cible, aucune trace de `Roberto2`.
- `UI_WEB/paths.py`/`recent_folders.py` : résolution relative correcte, aucune donnée de session (`recent_folders.json`) copiée.

**Bilan** : garder tel quel. Aucun écart constaté, aucune correction nécessaire côté template ni côté commande.

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 5 — Documentation et clôture [FAIT]
- [x] `/doc_sync` : `CHANGELOG.md`, `README.md`, `Protocole_start_close_context.md` (aucune référence aux commandes kit-only dans ce dernier, rien à synchroniser).
- [x] Mettre à jour `_contexte/signals.md`/`contexte.md` du kit (statut final, décision garder/ajuster/écarter).

**Bilan final** : roadmap close, 5/5 phases FAIT. Décision : garder tel quel (`/insert_template` + `templates/roberto/`), aucun ajustement nécessaire.
