# Roadmap — Refacto du kit (efficacité, lisibilité, scalabilité)
Objectif : supprimer la cause structurelle des incidents répétés du kit (duplication de la vérité sur 5 emplacements, sans contrôle mécanique), et diviser le coût token d'un `/start` sur le kit comme sur les 22 projets déployés.
Créée le : 2026-08-13

---

## Cadrage (à lire avant Phase 2, ne pas supprimer)

**Constat central (audit du 2026-08-13, vérifié sur disque)** : une modification de commande doit être
répercutée à la main dans 5 emplacements — `.claude/commands/X.md`, `templates/.claude/commands/X.md`,
`README.md`, `CHANGELOG.md`, et deux sections de `Protocole_start_close_context.md` — par un LLM suivant
de la prose (`/doc_sync`), sans aucune vérification à exit code. Tous les défauts listés ci-dessous sont
des instances de ce même défaut, y compris les incidents déjà traités en v3.10 et v3.16.

**Défauts constatés, à traiter dans les phases suivantes :**

| # | Défaut | Phase |
|---|---|---|
| ① | `_contexte/signals.md` : 508 lignes / 46 KB / 22 blocs `# Session du` empilés, alors que `close.md` étape 4 impose l'écrasement. ~94 % d'historique mort chargé à chaque `/start`. Cause : pas d'exutoire, contrairement à `contexte.md` qui a `archive_decisions.md` + un seuil | 4 |
| ② | `.claude/commands/close.md` est le seul fichier du kit en CRLF → `/doc_sync` étape 2 le voit intégralement différent de son miroir (302 lignes de diff pour 2 vraies divergences). Le seul contrôle d'intégrité est aveugle sur le fichier le plus modifié | 2 |
| ③ | Étape `12bis` (backup Drive) : étape native numérotée du `close.md` du kit alors qu'elle est marquée « kit uniquement » — même classe de bug que v3.10, en miroir. Doit rejoindre le bloc `SPECIFICITES PROJET` | 5 |
| ④ | `.claude/CLAUDE.md` (kit) n'a pas la section « Base de connaissances » du template. Aggravant : `doc_sync.md` déclare cette paire « identique » alors que le template contient `{{DONNEES_SENSIBLES}}` — règle infaisable, donc contournée | 5 |
| ⑤ | `templates/.claude/commands/create_agent.md` n'existe pas, alors que `_archives/roadmap_agents.md` le coche `[x]` (lignes 63, 69). Doc contre disque | 5 |
| ⑥ | `Protocole_start_close_context.md` : 675 lignes dont 316 (47 %) de changelog dupliqué de `CHANGELOG.md`, tenu à jour à la main | 6 |
| ⑦ | `llms.txt` n'est couvert par aucune règle de `doc_sync.md` → dérive silencieuse (ignore 4 commandes et les 2 scripts) | 6 |
| ⑧ | `README.md` § « État actuel » : 27 lignes, 8 versions empilées = recopie du CHANGELOG, alors que `/close` étape 8 demande l'état, pas l'historique | 6 |
| ⑨ | `base_connaissances/INDEX.md` figé au 2026-07-17 : 12 projets vs ~22 dans `DEPLOYMENTS.md`, kit annoncé v2.14 | 6 |

**Principe directeur** : chaque phase remplace de la prose à respecter par une vérification qui échoue.
Une règle qu'aucun outil ne contrôle est considérée comme non appliquée, quelle que soit sa clarté.

**Contrainte de propagation** : les phases 4 et 5 touchent `templates/`, donc les 22 projets de
`DEPLOYMENTS.md` au fil de leurs `/update`. Ne rien y modifier sans avoir validé le changement sur
le kit lui-même d'abord.

---

## Phase 1 — Nettoyage de la racine [FAIT]
- [x] Supprimer `templates/__pycache__/` et `tests/__pycache__/` (gitignorés mais présents sur disque).
- [x] Créer `scripts/` et `_archives/` ; déplacer `backup_file.py`, `deploy_create_memory.py` → `scripts/`.
- [x] Archiver `roadmap_agents.md` (4/4 phases FAIT), `note_conception_create_agent.md` (Phase 1 close), `_docs/roadmap_agents_explained.html` → `_archives/` ; `_docs/` supprimé (vide, sans rapport avec le `_docs/` créé par `/init_projet` dans les projets cibles).
- [x] Déplacer `TEST_CREATE_AGENT_RESULTS.md` et `ameliorations_create_agent.md` → `base_connaissances/`.
- [x] Réparer les références : `.claude/commands/create_agent.md` (3 chemins `ameliorations_*`/`TEST_*`), `.claude/commands/close.md` (chemin `backup_file.py` de l'étape 12bis).
- [x] Réécrire `README.md` § « Structure du kit » (l'arborescence omettait `llms.txt`, `LICENSE`, `_contexte/`, `.claude/`, les roadmaps et les notes ; les 4 commandes kit-only n'étaient pas expliquées).
- Racine passée de 16 à 10 fichiers, dont 2 gitignorés.
- Non traité volontairement : `roadmap_messages_zones.md` reste à la racine — sa mise au rebut dépend du bilan de Phase 2 de `roadmap_com_agents.md` (décision utilisateur du 2026-08-13).

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 2 — Normalisation des fins de ligne [FAIT]
Prérequis de la Phase 3 : sans EOL uniforme, aucune comparaison mécanique de fichiers n'est exploitable.
- [x] Créer `.gitattributes` à la racine : `* text=auto eol=lf`.
- [x] Convertir `.claude/commands/close.md` en LF (seul fichier CRLF du kit, défaut ②).
- [x] Vérifier qu'aucun autre fichier versionné n'est en CRLF après normalisation (`file` ou équivalent sur l'ensemble du dépôt) : 13 fichiers base_connaissances/ convertis.
- [x] Vérifier que `/doc_sync` étape 2 ne signale plus de faux positif sur `close.md` — le diff normalisé doit se réduire aux 2 divergences réelles (`allowed-tools` + étape 12bis).
- Test : `diff .claude/commands/close.md templates/.claude/commands/close.md` retourne 21 lignes (divergences réelles uniquement).

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 3 — `scripts/check_kit.py` : contrôle d'intégrité mécanique [FAIT]
Cœur du refacto. Remplace les étapes en prose de `/doc_sync` par un exit code.
- [x] Écrire `scripts/check_kit.py` (stdlib uniquement, comme `ollama_call.py` — contrainte « zéro dépendance » du README). Contrôles :
  - paires miroir `.claude/` ↔ `templates/.claude/` identiques **après** exclusion du bloc `SPECIFICITES PROJET` et des lignes contenant un placeholder `{{...}}` ;
  - aucun fichier versionné en CRLF ;
  - commandes listées dans `README.md` § « Ce que ça fait » = fichiers réels de `.claude/commands/` et `templates/.claude/commands/`, avec la mention « kit uniquement » sur celles absentes de `templates/` ;
  - version en tête de `CHANGELOG.md` = version citée dans `README.md` § « État actuel » = dernière entrée du changelog de `Protocole_start_close_context.md` ;
  - `_contexte/signals.md` sous le seuil de la Phase 4 (nombre de blocs `# Session du`) ;
  - tout fichier cité par un chemin relatif dans `.claude/commands/*.md` existe réellement.
- [x] Sortie : une ligne par écart, exit code 1 si au moins un écart. Aucun correctif automatique (le kit décide, pas le script).
- [x] Tests dans `tests/test_check_kit.py` : 14 tests couvrant tous les contrôles (au moins un cas passant et un cas en échec par contrôle).
- [x] Brancher : `/doc_sync` étape 1 (avant analyse) et `/close` étape 10 (avant commit), avec la règle « un écart signalé bloque le commit tant qu'il n'est pas traité ou explicitement écarté ».
- [x] Faire tourner sur l'état courant : écarts détectés et consignés (voir ci-dessous).

**Écarts actuels détectés par `check_kit.py` (à traiter dans les phases suivantes) :**
- Divergence : `.claude/commands/close.md` != `templates/.claude/commands/close.md` → défaut ③ (étape 12bis et 9bis à déplacer dans bloc SPECIFICITES PROJET, Phase 5)
- Divergence : `.claude/CLAUDE.md` != `templates/.claude/CLAUDE.md` → défaut ④ (section "Base de connaissances" manquante dans le kit, Phase 5)
- Version incohérente : CHANGELOG.md et README.md annoncent v3.18, Protocole_start_close_context.md annonce v2.3 → à corriger en Phase 6 (dé-duplication)

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 4 — Rotation de `signals.md` [FAIT]
Défaut ①. Le gain le plus visible : il porte sur le kit **et** sur les 22 projets déployés.
- [x] Seuil tranché : conserver la dernière session dans `signals.md`, les précédentes dans `_contexte/archive_sessions.md`.
- [x] Modifier `close.md` étape 4 (kit + template) : formuler la rotation comme un déplacement vers `archive_sessions.md`, pas comme une suppression — l'absence d'exutoire est la cause de l'accumulation, pas le manque de clarté de la consigne.
- [x] Appliquer au `signals.md` du kit : 21 blocs déplacés vers `archive_sessions.md`, 1 conservé.
- [x] Vérifier que `start.md` ne charge jamais `archive_sessions.md` (sinon le gain est nul).
- [x] Documenter le format dans `Protocole_start_close_context.md` § « Format canonique de `signals.md` ».
- [x] Mesurer : taille de `signals.md` avant/après (508→58 lignes, 46→12.6 KB), consignée dans le CHANGELOG.

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 5 — Correctifs de divergence kit ↔ template [FAIT]
Défauts ③④⑤. À faire après la Phase 3 : `check_kit.py` doit les détecter avant qu'on les corrige, sinon rien ne garantit qu'il les détectera à l'avenir.
- [x] ③ Déplacer l'étape `14bis` (ex-`12bis`) de `close.md` (kit) dans le bloc `SPECIFICITES PROJET`, aux côtés de l'étape `9bis` déjà correctement placée. Chemins absolus remplacés par chemins relatifs (`scripts/backup_file.py`, `DEPLOYMENTS.md`).
- [x] ④ Ajouter la section « Base de connaissances » à `.claude/CLAUDE.md` (kit) ; corriger la règle de `doc_sync.md` étape 2 pour les fichiers à placeholders (comparaison hors lignes `{{...}}`, cohérente avec `check_kit.py`).
- [x] ⑤ Corrigé `_archives/roadmap_agents.md` (lignes 63, 68-69) : `create_agent.md` est une commande **kit uniquement**, pas un template. La documentation affirmant son existence dans `templates/` était erronée.
- [x] Compléter la table miroir de `doc_sync.md` : `llms.txt` (fichier racine uniquement), `templates/*.py` (`ollama_call.py`, `backup_project.py` — scripts templates), `scripts/*.py` (scripts internes du kit).
- [x] `check_kit.py` passe au vert pour les contrôles 1 (paires miroir) et 2 (CRLF) — reste les écarts de version (Phase 6).

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 6 — Dé-duplication et rattrapage documentaire [FAIT]
Défauts ⑥⑦⑧⑨. En dernier : inutile de réécrire une doc que les phases précédentes vont encore déplacer.
- [x] ⑥ `Protocole_start_close_context.md` : 316 lignes de changelog dupliqué remplacées par un renvoi à `CHANGELOG.md`. Version mise à jour (v2.3 → v3.18). Sections `/create_com_agents`, `/doc_sync`, `/cherche_meilleure_action` déjà présentes dans le corps du document.
- [x] ⑧ `README.md` § « État actuel » : réduit de 29 lignes (8 versions empilées) à 5 lignes max, aligné sur `contexte.md`, avec renvoi à `CHANGELOG.md`. Règle précisée : l'état courant seulement, pas l'historique.
- [x] ⑦ `llms.txt` : 4 commandes kit-only (`/create_agent`, `/create_com_agents`, `/cherche_meilleure_action`, `/doc_sync`) et `scripts/` (`backup_file.py`, `deploy_create_memory.py`) ajoutés. Inscrit dans `check_kit.py` contrôle 3 (commandes listées).
- [x] ⑨ `base_connaissances/INDEX.md` : mention explicite de la date de gel (2026-07-17, 12 projets) + renvoi à `DEPLOYMENTS.md` pour la liste complète (~22 projets).
- [x] `/doc_sync` : étape 5 (changelog dupliqué) retirée. Bump CHANGELOG v3.19.

**⏸ Checkpoint** — Refacto complet terminé. Voir `CHANGELOG.md` v3.19 pour le bilan.
