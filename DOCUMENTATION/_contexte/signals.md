# Signals — documentation   (MAJ 2026-08-21)

## Actions ouvertes
- [P2|ouvert|zone kit] Implémenter le signal /close → DOCUMENTATION/_contexte/signals.md (hors périmètre de cette zone, à porter en session kit)
  - fait quand: les /close des autres zones du kit écrivent dans DOCUMENTATION/_contexte/signals.md
  - réf: contexte.md (décision alimentation double), agent_role.md (cycle de vie)
- [P2|ouvert|zone kit] Corriger les écarts check_kit constatés au /close documentation du 2026-08-21 (CRLF : _AFAIRE.txt, base_connaissances/ameliorations_create_agent.md, discord_com/*.json ; versions incohérentes v3.39/v3.40 entre CHANGELOG.md et Protocole_start_close_context.md)
  - fait quand: python scripts/check_kit.py sort en exit 0
  - réf: bilan du commit close(documentation) du 2026-08-21

## Dernière session (2026-08-21)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->
# Session du 2026-08-21

## Décisions prises
- Bootstrap de la base : INDEX.md + 10_concepts/ + 20_guides/ + 30_decisions/ (structure validée par l'utilisateur)

## Livrables produits ou modifiés
- DOCUMENTATION/INDEX.md : créé (6 documents au catalogue)
- DOCUMENTATION/10_concepts/protocole_vibecoding.md : créé
- DOCUMENTATION/10_concepts/glossaire.md : créé
- DOCUMENTATION/20_guides/initialiser_un_projet.md : créé
- DOCUMENTATION/20_guides/sessions_start_close.md : créé
- DOCUMENTATION/20_guides/creer_un_agent.md : créé
- DOCUMENTATION/30_decisions/journal.md : créé
- DOCUMENTATION/agent_role.md : périmètre acté (réécrit)
- DOCUMENTATION/_contexte/contexte.md : décision périmètre ajoutée

## Hypothèses validées / invalidées
- VALIDE : le pattern .md sans RAG (LLM Wiki / OKF) est applicable au kit — la base tient en 6 docs concis
- EN ATTENTE : alimentation par signaux /close des autres zones (mécanisme côté kit)

## Prochaine étape exacte
Porter P2 en session kit : implémenter le signal /close → DOCUMENTATION/_contexte/signals.md dans le protocole du kit.

## Question bloquante pour la session suivante
Aucune
