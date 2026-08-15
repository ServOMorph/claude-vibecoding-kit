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
- [ ] Trancher le nom et la portée de la commande (généraliste `templates/<nom>/` → projet cible, sur le modèle `[PREFLIGHT]/[COLLECTE]/[ECRITURE]/[SORTIE]` de `create_agent.md`).
- [ ] Définir le mécanisme de placeholders (chemins absolus, nom de projet cible) et son point de résolution (à l'insertion vs au premier lancement).
- [ ] Définir la détection d'installation déjà présente (idempotence) et le comportement si des fichiers cibles existent déjà (jamais d'écrasement silencieux, cf. conventions `create_agent.md`).
- [ ] Rédiger `.claude/commands/<nom_commande>.md`.

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 3 — Extraction et généricisation du template `roberto` [TODO]
- [ ] Copier dans `templates/roberto/` la structure retenue en Phase 1 (périmètre tranché), en excluant `.git`, `__pycache__`, données de session.
- [ ] Appliquer les placeholders définis en Phase 2 aux chemins absolus/valeurs codées en dur.
- [ ] Documenter les dépendances et prérequis dans `templates/roberto/README.md` (sur le modèle de `templates/control_PC/README.md`).

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 4 — Test réel de bout en bout [TODO]
- [ ] Lancer la commande d'insertion sur un projet cible de test, avec `templates/roberto/`.
- [ ] Vérifier fonction par fonction (MASCOTTE, MACROS, UI_WEB, config `.claude/`) que rien n'est cassé après la copie — liste de contrôle issue de l'inventaire Phase 1.
- [ ] Corriger la commande et/ou le template en fonction des écarts constatés.
- [ ] Bilan : garder tel quel, ajuster, ou écarter.

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 5 — Documentation et clôture [TODO]
- [ ] `/doc_sync` : `CHANGELOG.md`, `README.md`, `Protocole_start_close_context.md`.
- [ ] Mettre à jour `_contexte/signals.md`/`contexte.md` du kit (statut final, décision garder/ajuster/écarter).
