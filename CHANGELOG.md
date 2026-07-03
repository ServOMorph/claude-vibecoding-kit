# Changelog — claude-vibecoding-kit

Toutes les modifications notables du kit sont consignées ici.
Le détail complet par version reste documenté dans `Protocole_start_close_context.md`.

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
