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
- Kit v3.1. `CLAUDE.md` (kit + template) : section "Tests manuels" (`tests_manuels.md`, file d'attente de contrôles manuels) et sous-section "Déclencheurs de vérification" (règles mécaniques anti-affirmation-non-vérifiée) ajoutées.
- `/create_agent` réécrite en phases ancrées (`[PREFLIGHT]`/`[COLLECTE]`/`[ECRITURE]`/`[SORTIE]`/`[AUDIT]`) : mode conversion explicite (P12), `{{STACK}}` conditionnelle (P13), `{{ALIAS_RACINE}}` durcie (P11), toutes implémentées. Mode conversion non encore validé en conditions réelles — Test 3 à faire.
- `jeu_zombies` (v2.26 déployé) en retard sur le kit — `/update` à lancer pour récupérer les nouvelles règles `CLAUDE.md`.
- `AGENTS_REGISTRY.md` (hors git) centralise 5 agents (com, memory, web, linkedin, design).

## Décisions structurantes
_Décisions antérieures au 2026-07-26 (session create_agent v3.0) archivées dans `_contexte/archive_decisions.md`._
- 2026-07-21 : Phase 3 de `roadmap_agents.md` close — `/create_agent` généralisée (kit + template), charte générique `agent_role_TEMPLATE.md`, étape 2b dans `start.md`, `update.md` documente l'exclusion des zones-agents. Décision utilisateur : `/create_agent` n'est pas propagée par `/update`, copie manuelle projet par projet.
- 2026-07-21 : Phase 4 de `roadmap_agents.md` close (rétrospective sur Opus) — constat que `/create_agent` n'a jamais tourné réellement ; P1 (rôle durable) et P2 (question périmètre d'écriture, `{{ECRITURE_ETENDUE}}`) implémentées suite à des frictions observées sur COM/MEMORY ; validation end-to-end reportée. Sortie écrite dans `ameliorations_create_agent.md`.
- 2026-07-21 : décision utilisateur — `/create_agent` ne se copie plus jamais dans les projets cibles, elle s'exécute toujours depuis le kit avec le projet cible en argument. Revient sur la décision Phase 3 (copie manuelle projet par projet).
- 2026-07-21 : premier test end-to-end réel de `/create_agent` (agent `web`, La Rev) — friction majeure trouvée (charte silencieusement non chargée si `start.md` cible obsolète) et corrigée (P6). Ouverture d'une période de test tracée dans `TEST_CREATE_AGENT_RESULTS.md`.
- 2026-07-21 : Lot 1 de `PROPOSITIONS_AMELIORATION.md` implémenté (1.3, 1.7, 2.4, 2.5, 3.1) — décision utilisateur de tout retenir, aucune n'a justifié d'être écartée. Kit v2.24.
- 2026-07-21 : Test 2 `/create_agent` — conversion d'une zone déjà mature (`linkedin`, SérénIATech_dev) en agent, cas non couvert par la procédure standard ; traité par déviation manuelle validée par l'utilisateur (charte seule, `_contexte/`/`zones.md` existants préservés). Frictions P11/P12 consignées, non tranchées.
- 2026-07-21 : nouvelle commande `/cherche_meilleure_action` créée (kit uniquement, modèle Opus) — décision utilisateur : sortie = recommandation unique + question de confirmation, jamais de décision tranchée seule par la commande.
- 2026-07-21 : `AGENTS_REGISTRY.md` créé pour centraliser agents + retex — décision utilisateur : un seul fichier, hors git (paths locaux, repo public MIT), au prix de ne pas partager les retex si le kit s'ouvre un jour à d'autres contributeurs.
- 2026-07-26 : `/create_agent` réécrite en phases nommées ancrées (au lieu de numéros d'étape) par un agent externe, relue et corrigée. P11/P12/P13 implémentées. Décision utilisateur : ajouter une phase `[AUDIT]` dédiée à l'analyse à froid de la commande elle-même, jamais automatique, Opus imposé.
- 2026-07-26 : agent `design` créé dans `jeu_zombies/DESIGN` (design artistique/UX complet du jeu) — cas de conversion d'une zone déjà enregistrée, traité manuellement ; `contexte.md` alimenté avec la stack réelle du projet (Godot 4.5, GDD) plutôt que le stub générique.
- 2026-07-28 : `CLAUDE.md` (kit + template) enrichi de deux sections — "Tests manuels" (`tests_manuels.md`, chemin relatif générique après refus d'un chemin absolu jeu_zombies-spécifique) et "Déclencheurs de vérification" sous "Honnêteté" (règles mécaniques suite à une affirmation non vérifiée en session sur le contenu de `DEPLOYMENTS.md`). Kit v3.1.
