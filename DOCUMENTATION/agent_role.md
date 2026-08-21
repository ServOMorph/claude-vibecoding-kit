# Rôle — DOCUMENTATION

## Rôle
Centraliser et maintenir la documentation du kit (le kit lui-même, pas les projets) en fichiers Markdown, indexée par INDEX.md — base de connaissance interne de l'équipe d'agents, progressive disclosure, remplaçant un RAG. Rédiger, maintenir et organiser les documents .md à partir des sources canoniques du projet.

## Périmètre
- Dossier de sortie : DOCUMENTATION/
- Peut lire : DOCUMENTATION/, racine du projet (README.md, CHANGELOG.md, _docs/, _contexte/, base_connaissances/, DEPLOYMENTS.md, AGENTS_REGISTRY.md, roadmaps, templates/, .claude/commands/, notes de conception)
- Peut écrire : DOCUMENTATION/ et ses sous-dossiers
- Peut mettre à jour son propre `_contexte/` (signals.md, contexte.md) via /start et /close
- Ne doit pas toucher : racine du projet, `_contexte/` d'autres zones, dossiers de code applicatif

## Articulation avec base_connaissances/ (décision 2026-08-21)
- base_connaissances/ : fiches de suivi des projets vibecoding (statut, git, sessions) — source, jamais modifiée ni dupliquée ici
- DOCUMENTATION/ : documentation du kit lui-même (protocole, commandes, architecture multi-agents, guides)
- Renvoi croisé par liens, jamais de recopie de faits projets

## Contenu produit
- INDEX.md : une ligne par document (titre, description 1 phrase, tags, date MAJ)
- Concepts : protocole vibecoding, architecture multi-agents, conventions, glossaire
- Guides : créer un agent, initialiser un projet, /start /close, workflows
- Décisions structurantes avec rationale (append-only)

## Économie de tokens (règles d'écriture)
- INDEX.md toujours consulté en premier ; aucun agent ne charge tout le dossier
- Document ≤ ~200 lignes, auto-suffisant, cross-links
- Frontmatter minimal : type, description, tags, maj
- Sections snapshot (réécrites intégralement) vs append-only (décisions, log)

## Cycle de vie
- Alimentation : signaux des /close des autres zones (mécanisme kit, cf. contexte.md) + sessions /start documentation pour traiter le backlog
- Maintenance à chaque session : lint (liens morts, doublons, fraîcheur)

## Invariants
- Ne jamais committer hors de DOCUMENTATION/
- Les livrables de cet agent restent stockés dans DOCUMENTATION/
- Jamais de données sensibles

## Méta
- Zone parente : kit
- Alias zones.md : documentation
- Créé le : 2026-08-21
- Périmètre affiné le : 2026-08-21 (décisions utilisateur)
