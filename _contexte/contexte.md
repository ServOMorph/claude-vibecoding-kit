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
- Kit v2.24. Lot 1 de `PROPOSITIONS_AMELIORATION.md` entièrement implémenté (1.1 déjà fait + 1.3, 1.7, 2.4, 2.5, 3.1 cette session) : résidus non commités signalés par `/close`, section Données sensibles activée, section Modèles recommandés dans CLAUDE.md, benchmark admis comme gate de phase, signals.md compressé.
- `roadmap_agents.md` : les 4 phases restent `[FAIT]`, aucun changement cette session (hors périmètre).
- 8 projets restent à propager vers la dernière version du kit : Appli_TSA_SDI_TDAH, JeGeekUtile, SérénIATech_dev, VisioAide, TableauDeBord, IA-TSA, IA_V7, jeux_vibecoder.
- Période de test end-to-end de `/create_agent` ouverte (Test 1 fait sur La Rev), P7-P10 toujours à trancher.
- Le README reste affecté par une corruption d'encodage historique hors les lignes corrigées.

## Décisions structurantes
_Décisions antérieures au 2026-07-21 (Lot 1, propositions 1.3/1.7/2.4/2.5/3.1) archivées dans `_contexte/archive_decisions.md`._
- 2026-07-20 : nouvelle initiative « template de création d'agent » — un agent = une zone à rôle (dossier + charte `agent_role.md` + `_contexte/` propre, enregistrée dans `zones.md`, pilotée par `/start`/`/close`), explicitement pas un subagent Claude Code. Expérimentée d'abord sur robert-ia (agents COM et MEMORY pour la démo du 25/07/2026), généralisée ensuite en commande `/create_agent`.
- 2026-07-20 : revue critique du plan par un second modèle (Fable 5) avant tout code (prompt utilisé ponctuellement, non conservé sur disque), 6 décisions de conception actées : charte `agent_role.md` (anti-collision `AGENTS.md`), `/update` n'touche jamais les `_contexte/` de sous-zones, unicité d'alias contrôlée dans `zones.md`, charte chargée automatiquement par `/start`, périmètre déclaratif (pas d'isolation technique réelle), rétrospective de fin de commande avec sortie écrite obligatoire.
- 2026-07-20 : Phase 1 de `roadmap_agents.md` close — note de conception écrite (`note_conception_create_agent.md`), arborescence d'agent et format de charte figés, insertion de l'étape 2b dans `start.md` (chargement de `agent_role.md` avant `signals.md`) actée pour la Phase 3.
- 2026-07-20 : dossier `_docs/` introduit à la racine du kit, à la demande de l'utilisateur, comme emplacement pour la documentation générée (première pièce : `roadmap_agents_explained.html`).
- 2026-07-21 : Phase 2 de `roadmap_agents.md` close — agents COM et MEMORY créés manuellement dans robert-ia (avant l'existence de `/create_agent`) ; MEMORY a produit un prompt de passation (`prompt_multi_contexte_knowledge.md`) plutôt que de modifier `backend/` directement, périmètre déclaratif préservé.
- 2026-07-21 : Phase 3 de `roadmap_agents.md` close — `/create_agent` généralisée (kit + template), charte générique `agent_role_TEMPLATE.md`, étape 2b dans `start.md`, `update.md` documente l'exclusion des zones-agents. Décision utilisateur : `/create_agent` n'est pas propagée par `/update`, copie manuelle projet par projet.
- 2026-07-21 : Phase 4 de `roadmap_agents.md` close (rétrospective sur Opus) — constat que `/create_agent` n'a jamais tourné réellement ; P1 (rôle durable) et P2 (question périmètre d'écriture, `{{ECRITURE_ETENDUE}}`) implémentées suite à des frictions observées sur COM/MEMORY ; validation end-to-end reportée. Sortie écrite dans `ameliorations_create_agent.md`.
- 2026-07-21 : décision utilisateur — `/create_agent` ne se copie plus jamais dans les projets cibles, elle s'exécute toujours depuis le kit avec le projet cible en argument. Revient sur la décision Phase 3 (copie manuelle projet par projet).
- 2026-07-21 : premier test end-to-end réel de `/create_agent` (agent `web`, La Rev) — friction majeure trouvée (charte silencieusement non chargée si `start.md` cible obsolète) et corrigée (P6). Ouverture d'une période de test tracée dans `TEST_CREATE_AGENT_RESULTS.md`, réutilisable pour les prochains agents créés.
- 2026-07-21 : Lot 1 de `PROPOSITIONS_AMELIORATION.md` implémenté (1.3, 1.7, 2.4, 2.5, 3.1) — décision utilisateur de tout retenir, aucune n'a justifié d'être écartée (effort faible/trivial confirmé). Kit v2.24.
