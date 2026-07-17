# Changelog — claude-vibecoding-kit

Toutes les modifications notables du kit sont consignées ici.
Le détail complet par version reste documenté dans `Protocole_start_close_context.md`.

## v2.14 — 2026-07-17

### Corrigé
- La délégation Ollama repose désormais sur `ollama_call.py`, un lanceur Python compatible Windows, sans dépendance à Bash ou WSL. La sortie est écrite en UTF-8 pour éviter les erreurs d'encodage de la console Windows.
- `/init_projet`, `/update`, `CLAUDE.md` et la documentation propagent et utilisent ce nouveau lanceur. Les fichiers bytecode Python sont ignorés par Git.

## v2.13 — 2026-07-17

### Modifié
- `/close` : si le `README.md` du projet cible n'existe pas encore, il est désormais créé automatiquement (sections objectif, stack, structure, état actuel) au lieu de demander confirmation à l'utilisateur.

### Corrigé
- `/update` : suppression des références obsolètes au mécanisme de substitution `{{ALIAS}}`/`{{RACINE}}` dans `start.md`/`close.md` (ces fichiers lisent `zones.md` directement depuis une version antérieure du kit, la doc `/update` ne le reflétait plus). Correction de l'objectif, du message de confirmation (étape 9) et de la liste de fichiers copiés en mode initialisation (étape 2), qui mentionnaient `init_projet.md`/`update.md` comme fichiers propagés vers les projets cibles alors qu'ils restent dans le kit.

## v2.12 — 2026-07-17

### Ajouté
- `/init_projet` : nouvelle étape listant, avant la confirmation finale, tous les fichiers créés ou modifiés au cours de l'initialisation, sous forme de liens cliquables (chemin absolu).

## v2.11 — 2026-07-17

### Modifié
- `/init_projet` : inversion du sens de lancement — la commande se lance désormais depuis le repo du kit (working directory), avec en argument le chemin absolu du projet cible à initialiser (au lieu de se lancer depuis le projet cible avec le chemin du kit en argument). Toutes les opérations de copie référencent désormais explicitement ce chemin, et `DEPLOYMENTS.md`/`CHANGELOG.md` sont lus directement à la racine du kit.

## v2.10 — 2026-07-14

### Corrigé
- `ollama_call.sh` : suppression de la dépendance à `jq` (absente sur certains postes). Le script encode/décode le JSON via `python`/`python3` (déjà requis ailleurs dans le kit), avec remontée explicite des erreurs HTTP Ollama (ex: modèle introuvable) au lieu d'un échec silencieux.
- `/update` : la procédure ne copiait jamais `ollama_call.sh` vers les projets cibles — corrigé, il est désormais inclus dans la table de copie et les commits de sauvegarde/mise à jour.

### Modifié
- `ollama_call.sh` : modèle par défaut changé de `gemma3:4b` (jamais installé) à `gemma4:e4b`. Reste surchargeable via `OLLAMA_MODEL`.

## v2.9 — 2026-07-03

### Modifié
- `/update` : inversion du sens de lancement — la commande se lance désormais depuis le repo du kit (working directory), avec en argument le chemin absolu du projet cible à mettre à jour (au lieu de se lancer depuis le projet cible avec le chemin du kit en argument). Toutes les opérations sur le projet cible référencent désormais explicitement ce chemin (`git -C <cible> ...`), et `DEPLOYMENTS.md`/`CHANGELOG.md` sont lus directement à la racine du kit.

## v2.8 — 2026-07-03

### Ajouté
- `CLAUDE.md` : nouvelle section "Spécificités projet", préservée intégralement par `/update` (comme "Données sensibles").
- `start.md` / `close.md` : bloc `SPECIFICITES PROJET` en fin de fichier, préservé par `/update` (extraction/réinjection). Convention de référencement explicite par étape/section pour limiter la perte de position logique.
- `/update` : si la zone "Spécificités projet" est absente (fichier jamais migré), détection par diff contre le fichier kit et question à l'utilisateur (migrer / ignorer / décider ligne par ligne) — y compris en mode `/update all`, qui se met en pause ciblée sur le projet concerné sans interrompre le reste du batch.
- `.claude/commands/close.md` (kit) : lancement de `/doc_sync` ajouté entre l'étape 8 et l'étape 9, via la zone "Spécificités projet".

## v2.7 — 2026-07-03

### Ajouté
- `/update` : nouveau mode batch `/update all` — met à jour tous les projets listés dans `DEPLOYMENTS.md` en une seule commande, exécution silencieuse avec résumé final, sans interrompre le batch en cas de projet introuvable ou non-git.

## v2.6 — 2026-07-03

### Ajouté
- `CLAUDE.md` : nouvelle section "Roadmap" — critères de création, format canonique (nommage, phase `[EN COURS]` unique, checkpoint `/compact`), et sous-section "Contenu des phases" (tests intégrés à la phase fonctionnelle, phase de refacto dédiée uniquement si dette technique visible). Règle appliquée en permanence via CLAUDE.md plutôt que via une commande dédiée, pour couvrir les demandes de roadmap formulées en cours de session.

## v2.5 — 2026-07-03

### Ajouté
- `/close` : nouvelle étape 9 — vérification explicite que les étapes 3 à 8 ont bien été exécutées (pas seulement planifiées) avant le commit, avec exécution immédiate de toute commande de génération non encore lancée. Étapes 9-10 deviennent 10-11. Corrige un cas observé où une étape de régénération listée dans une commande `/close` dérivée avait été committée après coup plutôt qu'avant.

## v2.4 — 2026-06-29

### Modifié
- Pattern roadmap unifié : `roadmap_*.md` → `roadmap*.md` dans `/start`, `/close` et `Protocole_start_close_context.md`.

## v2.3 — 2026-06-21

### Ajouté
- Commande `/update` : met à jour les fichiers de protocole (`start.md`, `close.md`, `init_projet.md`) dans un projet déjà initialisé, sans toucher aux données projet.
- `zones.md` : table centralisée des alias → dossiers réels, copiée par `/init` et `/update`.

### Modifié
- `/close` : utilise désormais la zone **implicite** (working directory courant) si aucun argument n'est fourni, alignant le comportement avec `/start`.
- Build : `DEPLOYMENTS.md` ajouté au `.gitignore` pour permettre à chaque clone du kit d'avoir son propre registre de déploiements.

## v2.2 — 2026-06-20

### Modifié
- `/start` (étape 5) : `signals.md` est désormais affiché **intégralement**, sans résumé ni reformulation. La synthèse précédente pouvait omettre des actions ouvertes, échéances ou blocages ; l'affichage intégral garantit qu'aucun signal de pilotage n'est perdu au démarrage. Les autres fichiers (roadmap, contexte) restent résumés en complément.
- Fichiers touchés : `templates/.claude/commands/start.md`, `Protocole_start_close_context.md`.

## v2.1 — 2026-06-12

### Corrigé
- `ollama_call.sh` : correction du bug d'échappement JSON. Le payload est désormais construit avec `jq -n --arg` et passé à curl via `-d @-`.

### Modifié
- Suppression du champ "Résumé de démarrage" du manifest (écrit par `/close`, jamais lu par `/start`). Le manifest se réduit à la liste "Charger au démarrage".
- Fusion de `derniere_session.md` dans `signals.md` (section "Dernière session").
- `/close` passe de 10 à 9 étapes ; `/start` charge 2 fichiers au lieu de 3 (hors roadmap).
- Frontmatter des commandes : `start.md` (`model: haiku`), `close.md` (`model: sonnet` + `allowed-tools` git).

## v2 — 2026

### Ajouté
- Section "Structure `_contexte/`" : formats canoniques stricts pour `_manifest.md`, `contexte.md`, `signals.md`.
- Commande `/init` : initialisation basée sur un kit de templates avec substitution de placeholders.

### Modifié
- `/start` : ordre de lecture hiérarchisé (`signals.md` → `contexte.md` → roadmap).
- `/close` : gestion des priorités [P1/P2], section "Contexte chaud", structure fixe de `contexte.md` avec règle d'archivage, étape git renforcée.
- Table des modèles : "Debug → Sonnet" (Fable retiré, non disponible publiquement).
- `ollama_call.sh` : vérification de disponibilité du service, gestion d'erreur, modèle `gemma3:4b`.
