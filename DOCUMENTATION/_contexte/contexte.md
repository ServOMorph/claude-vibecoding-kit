# Contexte — documentation

## Objectif (immuable sauf décision explicite)
Centraliser la documentation métier du kit en fichiers Markdown (base de connaissance interne, progressive disclosure) : rédiger, maintenir et organiser les documents .md et leur INDEX.md, à partir des sources canoniques du projet (README.md, CHANGELOG.md, _contexte/, décisions, notes de conception, roadmaps).

## Stack / contraintes techniques (stable, rarement modifié)
- Format : fichiers Markdown uniquement, indexés par INDEX.md (catalogue, une ligne par document, progressive disclosure — consulter INDEX.md avant d'affirmer un fait métier, n'ouvrir que le(s) document(s) pertinent(s))
- Sources canoniques du kit à citer avant toute production : README.md, CHANGELOG.md, _docs/protocole_vibecoding.md, _contexte/ (contexte.md, archive_decisions.md, signals.md), base_connaissances/, DEPLOYMENTS.md, AGENTS_REGISTRY.md
- Stack du projet parent : Claude Code, Markdown, Python stdlib, PowerShell/Bash ; zéro dépendance externe

## État actuel (réécrit intégralement à chaque /close)
Bootstrap réalisé (2026-08-21) : INDEX.md + 6 documents (concepts, guides, journal), lint OK (19 liens, 0 mort, 0 doublon).
Prochaine étape : porter P2 en session kit (signal /close → DOCUMENTATION/_contexte/signals.md).

## Décisions structurantes (append only — 10 entrées max, 5 lignes max/entrée, archiver au-delà)
- 2026-08-21 : Initialisation du protocole vibecoding.
- 2026-08-21 : Articulation complémentaire avec base_connaissances/ (fiches projets ≠ doc du kit), écriture limitée à DOCUMENTATION/, alimentation double (signaux /close des autres zones + sessions dédiées).
- 2026-08-21 : Bootstrap réalisé (INDEX.md + 10_concepts/ + 20_guides/ + 30_decisions/, lint OK).
