# Contexte — claude-vibecoding-kit

## Objectif (immuable sauf décision explicite)
Fournir un kit reproductible pour gérer le vibecoding sur des projets multi-sessions, avec contexte persistant via `/start`/`/close` et support multi-zones.

## Stack / contraintes techniques
- **Langage** : Markdown + Bash/PowerShell pour scripts
- **Framework** : Claude Code CLI + Agent SDK
- **Gestion git** : commits automatiques depuis `/close`
- **Modèles recommandés** : Haiku (start), Sonnet (close), Opus (plans/debug)
- **Intégration** : Ollama pour tâches sensibles/templated
- **Déploiement** : copie template vers projets via `/init`, tracking dans DEPLOYMENTS.md

## État actuel
- Kit v3.16 : nouvelle commande `create_com_agents` (mécanisme de communication agent↔orchestrateur en étoile), pilotée en conditions réelles sur Roberto2 — Phase 2 de `roadmap_com_agents.md` en cours, un bug de placement d'étape trouvé et corrigé, reste à retester.
- Roadmap `roadmap_messages_zones.md` (système de communication kit → zone) : design antérieur, statut à trancher en Phase 3 de `roadmap_com_agents.md` (recouvrement possible avec le nouveau mécanisme).
- `/create_agent` : mode conversion pas encore validé end-to-end (Test 3 à faire).
- `jeu_zombies` (v2.26 déployé) toujours en retard sur le kit — `/update` à lancer.

## Décisions structurantes
_Décisions antérieures au 2026-08-04 (`git push` étendu à crea_zik) archivées dans `_contexte/archive_decisions.md`._
- 2026-08-13 : commande `create_com_agents` créée (mécanisme en étoile agent↔orchestrateur, `statut.md`/`messages.md`) et installée en pilote réel sur Roberto2. Bug trouvé en conditions réelles : étape conditionnelle placée après une synthèse narrative dans `start.md` est sautée à l'exécution — corrigée par un placement adjacent à une étape courte déjà fiable, appliquée dans Roberto2 et dans la commande source du kit. Kit v3.16.
- 2026-08-04 : `git push` automatique étendu à une 4ème zone, `crea_zik`. Corruption pré-existante de `.claude/commands/doc_sync.md` (frontmatter `a---`) corrigée. Kit v3.8.
- 2026-08-04 : décision "garder" actée pour `git push` automatique après validation réelle sur les 4 zones test. Promu en étape native (12) de `templates/.claude/commands/close.md` et `.claude/commands/close.md` (kit). Propagé à 15 projets déployés avec remote git (commit + push dans 14, `Lieux_Hybrides` en commit local sur décision explicite de ne pas configurer l'upstream). Kit v3.9.
- 2026-08-05 : correctif de la propagation v3.9 — l'instruction `git push` était restée dans le bloc "Spécificités projet" des 18 close.md concernés au lieu d'une étape native, corrigée et commitée dans les 18 (push en attente). Corruption locale non commitée du `close.md` du kit restaurée. Kit v3.10.
- 2026-08-08 : vérification réelle (fetch + status) des 18 dépôts + le kit — 13 dépôts avaient un commit local jamais poussé malgré l'apparence de clôture du 2026-08-05. Poussés sur confirmation utilisateur, action P1 close. `Lieux_Hybrides` reste sans upstream, assumé. Kit v3.11.
- 2026-08-10 : agent `review` créé dans `jeu_zombies` (revue de code continue) via `/create_agent`. Feature "synthèse agents pour l'orchestrateur" (agents écrivent à `/close`, racine lit à `/start` et propose des actions) conçue et implémentée en expérimentation limitée à `jeu_zombies` uniquement — pas de modification des templates du kit, propagation différée au bilan de sa roadmap dédiée. Kit v3.12.
- 2026-08-11 : commande locale `/create_agent` créée dans `jeu_espace` — donne à l'orchestrateur (zone racine) la capacité de créer lui-même des agents dans son projet, sans passer par le kit. Copie autonome (templates embarqués localement, pas de bookkeeping kit, pas de phase `[AUDIT]`). Test isolé, aucun template du kit modifié ; propagation à trancher après retour d'expérience (~2026-08-25). Kit v3.13.
- 2026-08-12 : sauvegarde automatique de `DEPLOYMENTS.md` vers Google Drive ajoutée à `/close` du kit (étape 12bis, optionnelle) — script `backup_file.py` (rclone `copyto`, réutilise la config déjà authentifiée), destination `googledrive:BackUps/claude-vibecoding-kit/`. Kit v3.14.
- 2026-08-12 : étape 12bis de `/close` (sauvegarde `DEPLOYMENTS.md` vers Google Drive) validée en conditions réelles pour la première fois — confirmation demandée, upload déclenché via `backup_file.py`, fichier horodaté déposé dans `googledrive:BackUps/claude-vibecoding-kit/`.
- 2026-08-12 : `create_memory.md` ajouté à l'étape 3 d'`init_projet.md` (gap : fichier jamais propagé aux nouveaux projets) et déployé sur les 22 projets réels de `DEPLOYMENTS.md` via nouveau script `deploy_create_memory.py`. Clôture faite a posteriori après un `/clear` accidentel avant `/close` — synthèse reconstruite depuis le commit `57a3522` et l'état réel des dépôts (4 projets recommis lors de la clôture : `site_internet_Sereniatech_V2`, `jeu_espace`, `Participation_GitHub`, `Roberto2`). Kit v3.15.
