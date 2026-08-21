---
type: concept
description: Vocabulaire du kit : zones, signals, checkpoints, progressive disclosure, snapshot vs append-only
tags: glossaire, vocabulaire
maj: 2026-08-21
---

# Glossaire

| Terme | Définition |
|---|---|
| Zone | Sous-projet dans un repo, identifié par un alias (table `zones.md`) et un dossier |
| Zone-agent | Zone avec charte `agent_role.md` (rôle, périmètre, invariants), créée par /create_agent |
| Alias | Nom court d'une zone (ex: documentation) |
| `_contexte/` | Dossier de contexte d'une zone : contexte.md, signals.md, archives |
| signals.md | Fichier de pilotage : actions ouvertes, blocages, dernière session — lu en premier par /start |
| contexte.md | Contexte stable : objectif, stack, état actuel, décisions structurantes |
| Dernière session | Section de signals.md écrasée intégralement par /close (synthèse < 25 lignes) |
| /compact | Compression de l'historique en cours de session |
| Checkpoint | Arrêt imposé entre deux phases de roadmap : demander /compact, attendre confirmation écrite |
| Roadmap | Chantier multi-phases (`roadmap_<sujet>.md`), une phase [EN COURS] à la fois |
| Progressive disclosure | Lire INDEX puis n'ouvrir que les documents pertinents, jamais tout le dossier |
| Snapshot | Section réécrite intégralement à chaque mise à jour (état actuel) |
| Append-only | Section où l'on ajoute sans jamais réécrire l'existant (décisions, journal) |
| Mémoire projet | `.claude/memory.md` ou `_contexte/memory.md`, écrite uniquement via /create_memory |
| Délégation Ollama | Traitement local via `python ollama_call.py` pour tâches templated ou sensibles |
| base_connaissances/ | Fiches de suivi des projets vibecoding (statut, git, sessions) — source, jamais dupliquée |
| DEPLOYMENTS.md | Registre des projets initialisés (hors git) |
| AGENTS_REGISTRY.md | Registre des agents créés (hors git) |
