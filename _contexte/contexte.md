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
- Kit v3.22 : `roadmap_template_roberto.md` en cours (Phase 1 FAIT, Phase 2 EN COURS) — commande générique d'insertion de template + extraction du template `roberto` depuis `Roberto2`.
- Corruption d'encodage constatée dans `control_pc.sqlite` (accents perdus sur des lignes du 2026-08-14) — à corriger.
- `create_com_agents` (Roberto2, v3.16) : Phase 2 en cours, correctif de placement d'étape à retester.
- `/create_agent` : mode conversion pas encore validé end-to-end (Test 3 à faire).
- `jeu_zombies` (v2.26 déployé) toujours en retard sur le kit — `/update` à lancer.

## Décisions structurantes
_Décisions antérieures au 2026-08-04 (session crea_zik/doc_sync) archivées dans `_contexte/archive_decisions.md`._
- 2026-08-15 : `roadmap_template_roberto.md` créée — aucune commande n'automatise actuellement l'insertion d'un template (`control_PC` copié manuellement, vérifié par grep). Portée : commande générique `.claude/commands/` d'insertion de `templates/<nom>/` dans un projet cible + template `roberto` extrait de `D:\ServOMorph\Roberto2` comme cas d'usage. Traçage dans `templates/roberto/` (décidé par l'utilisateur). Phase 1 (inventaire de Roberto2) FAIT : noyau fonctionnel identifié (`MACROS/`, `UI_WEB/`, `MASCOTTE/`), aucun chemin absolu en dur dans le code Python, dépendances `pywin32`/`pyautogui`/`pywebview` sans `requirements.txt` source. Kit v3.22.
- 2026-08-15 : template `control_PC` validé en conditions réelles sur la fenêtre LinkedIn — journal vivant confirmé, reconnaissance par empreinte confirmée (titre de fenêtre vs signature `control_pc.sqlite`), macro `linkedin.planifier_un_post` déroulée jusqu'à l'écran de confirmation sans déclencher l'action finale, statut passé à `validée`. Corruption d'encodage détectée en marge (accents perdus, lignes `discoveries` du 2026-08-14), non corrigée. Kit v3.21.
- 2026-08-14 : template `control_PC` ajouté : halo de fenêtre violet avec arrêt `Esc`, journal de session affiché dans la barre basse, détection visuelle prudente, base SQLite locale et macros indexées par application. Parcours LinkedIn de planification documenté jusqu'avant programmation finale ; aucune donnée personnelle ni publication enregistrée. Kit v3.20.
- 2026-08-13 : `roadmap_refacto_kit.md` close (6/6 phases FAIT), exécutée en autonomie par un agent devstral puis relue et clôturée par Claude (l'agent n'a pas pu lancer `/close` lui-même, problème de connexion). Kit v3.19, `check_kit.py` au vert.
- 2026-08-13 : audit structurel du kit (9 défauts identifiés) — vérité dupliquée sur 5 emplacements (`.claude/commands/`, `templates/.claude/commands/`, `README.md`, `CHANGELOG.md`, `Protocole_start_close_context.md`) sans aucun contrôle mécanique. Racine nettoyée (16→10 fichiers, `git mv` vers `scripts/`/`_archives/`/`base_connaissances/`, références réparées, `README.md` § Structure réécrit). `roadmap_refacto_kit.md` créée : normalisation LF, `check_kit.py` (contrôle mécanique), rotation `signals.md`, correctifs de divergence kit/template, dé-duplication doc. Kit v3.18.
- 2026-08-13 : `/init_projet` propose un backup Google Drive automatique (`backup_project.py`, rclone sync) pour les projets sans git — Q4bis, injection conditionnelle de l'étape dans le `close.md` du projet cible. Init de `Capafy_AI` (zone `capafy_ai`), mis sous git a posteriori par l'utilisateur, commit initial + push faits. Kit v3.17.
- 2026-08-13 : commande `create_com_agents` créée (mécanisme en étoile agent↔orchestrateur, `statut.md`/`messages.md`) et installée en pilote réel sur Roberto2. Bug trouvé en conditions réelles : étape conditionnelle placée après une synthèse narrative dans `start.md` est sautée à l'exécution — corrigée par un placement adjacent à une étape courte déjà fiable, appliquée dans Roberto2 et dans la commande source du kit. Kit v3.16.
- 2026-08-08 : vérification réelle (fetch + status) des 18 dépôts + le kit — 13 dépôts avaient un commit local jamais poussé malgré l'apparence de clôture du 2026-08-05. Poussés sur confirmation utilisateur, action P1 close. `Lieux_Hybrides` reste sans upstream, assumé. Kit v3.11.
- 2026-08-10 : agent `review` créé dans `jeu_zombies` (revue de code continue) via `/create_agent`. Feature "synthèse agents pour l'orchestrateur" (agents écrivent à `/close`, racine lit à `/start` et propose des actions) conçue et implémentée en expérimentation limitée à `jeu_zombies` uniquement — pas de modification des templates du kit, propagation différée au bilan de sa roadmap dédiée. Kit v3.12.
- 2026-08-11 : commande locale `/create_agent` créée dans `jeu_espace` — donne à l'orchestrateur (zone racine) la capacité de créer lui-même des agents dans son projet, sans passer par le kit. Copie autonome (templates embarqués localement, pas de bookkeeping kit, pas de phase `[AUDIT]`). Test isolé, aucun template du kit modifié ; propagation à trancher après retour d'expérience (~2026-08-25). Kit v3.13.
- 2026-08-12 : étape 12bis de `/close` (sauvegarde `DEPLOYMENTS.md` vers Google Drive) validée en conditions réelles pour la première fois — confirmation demandée, upload déclenché via `backup_file.py`, fichier horodaté déposé dans `googledrive:BackUps/claude-vibecoding-kit/`.
