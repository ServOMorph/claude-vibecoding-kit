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
- Kit v2.26. Propagation `/update all` terminée : les 12 projets de `DEPLOYMENTS.md` sont à jour, tous les contrôles post-update passent.
- `AGENTS_REGISTRY.md` (hors git) centralise désormais tous les agents (4 connus : com, memory, web, linkedin) ; `/create_agent` l'alimente automatiquement (étape 10).
- Nouvelle commande `/cherche_meilleure_action` (kit uniquement, Opus) validée en usage réel.
- Test 2 `/create_agent` fait (conversion d'une zone existante en agent) ; frictions P11/P12 ouvertes, non tranchées.
- `roadmap_agents.md` : les 4 phases restent `[FAIT]`, aucun changement cette session (hors périmètre).

## Décisions structurantes
_Décisions antérieures au 2026-07-21 (session `/cherche_meilleure_action`) archivées dans `_contexte/archive_decisions.md`._
- 2026-07-20 : dossier `_docs/` introduit à la racine du kit, à la demande de l'utilisateur, comme emplacement pour la documentation générée (première pièce : `roadmap_agents_explained.html`).
- 2026-07-21 : Phase 2 de `roadmap_agents.md` close — agents COM et MEMORY créés manuellement dans robert-ia (avant l'existence de `/create_agent`) ; MEMORY a produit un prompt de passation (`prompt_multi_contexte_knowledge.md`) plutôt que de modifier `backend/` directement, périmètre déclaratif préservé.
- 2026-07-21 : Phase 3 de `roadmap_agents.md` close — `/create_agent` généralisée (kit + template), charte générique `agent_role_TEMPLATE.md`, étape 2b dans `start.md`, `update.md` documente l'exclusion des zones-agents. Décision utilisateur : `/create_agent` n'est pas propagée par `/update`, copie manuelle projet par projet.
- 2026-07-21 : Phase 4 de `roadmap_agents.md` close (rétrospective sur Opus) — constat que `/create_agent` n'a jamais tourné réellement ; P1 (rôle durable) et P2 (question périmètre d'écriture, `{{ECRITURE_ETENDUE}}`) implémentées suite à des frictions observées sur COM/MEMORY ; validation end-to-end reportée. Sortie écrite dans `ameliorations_create_agent.md`.
- 2026-07-21 : décision utilisateur — `/create_agent` ne se copie plus jamais dans les projets cibles, elle s'exécute toujours depuis le kit avec le projet cible en argument. Revient sur la décision Phase 3 (copie manuelle projet par projet).
- 2026-07-21 : premier test end-to-end réel de `/create_agent` (agent `web`, La Rev) — friction majeure trouvée (charte silencieusement non chargée si `start.md` cible obsolète) et corrigée (P6). Ouverture d'une période de test tracée dans `TEST_CREATE_AGENT_RESULTS.md`.
- 2026-07-21 : Lot 1 de `PROPOSITIONS_AMELIORATION.md` implémenté (1.3, 1.7, 2.4, 2.5, 3.1) — décision utilisateur de tout retenir, aucune n'a justifié d'être écartée. Kit v2.24.
- 2026-07-21 : Test 2 `/create_agent` — conversion d'une zone déjà mature (`linkedin`, SérénIATech_dev) en agent, cas non couvert par la procédure standard ; traité par déviation manuelle validée par l'utilisateur (charte seule, `_contexte/`/`zones.md` existants préservés). Frictions P11/P12 consignées, non tranchées.
- 2026-07-21 : nouvelle commande `/cherche_meilleure_action` créée (kit uniquement, modèle Opus) — décision utilisateur : sortie = recommandation unique + question de confirmation, jamais de décision tranchée seule par la commande.
- 2026-07-21 : `AGENTS_REGISTRY.md` créé pour centraliser agents + retex — décision utilisateur : un seul fichier, hors git (paths locaux, repo public MIT), au prix de ne pas partager les retex si le kit s'ouvre un jour à d'autres contributeurs.
