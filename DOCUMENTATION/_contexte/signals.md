# Signals — documentation   (MAJ 2026-08-21)

## Actions ouvertes
- [P2|ouvert|zone kit] Implémenter le signal /close → DOCUMENTATION/_contexte/signals.md (hors périmètre de cette zone, à porter en session kit)
  - fait quand: les /close des autres zones du kit écrivent dans DOCUMENTATION/_contexte/signals.md
  - réf: contexte.md (décision alimentation double), agent_role.md (cycle de vie)
- [P2|ouvert|zone kit] Corriger les écarts check_kit constatés au /close documentation du 2026-08-21 (CRLF : _AFAIRE.txt, base_connaissances/ameliorations_create_agent.md, discord_com/*.json ; versions incohérentes v3.39/v3.40 entre CHANGELOG.md et Protocole_start_close_context.md)
  - fait quand: python scripts/check_kit.py sort en exit 0
  - réf: bilan du commit close(documentation) du 2026-08-21
- [P2|ouvert|zone kit] Implémenter le contrôle qualité de la base DOCUMENTATION : scripts/check_docs.py + phase doc_sync (étape 3 + note scripts sans miroir)
  - fait quand: python scripts/check_docs.py et python scripts/check_kit.py sortent en exit 0, doc_sync.md mis à jour, CHANGELOG ajouté
  - réf: DOCUMENTATION/40_specs/controle_qualite_base.md

## Dernière session (2026-08-21)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->
# Session du 2026-08-21

## Décisions prises
- Contrôle qualité de la base : mécanique (check_docs.py, 6 contrôles, gate) + sémantique (phase doc_sync ciblée par le diff), pas de commande dédiée
- Portage de l'implémentation en session kit (respect du périmètre de zone)

## Livrables produits ou modifiés
- DOCUMENTATION/40_specs/controle_qualite_base.md : créé (code check_docs.py intégral + mise à jour doc_sync spécifiée)
- DOCUMENTATION/INDEX.md : ligne de la spec ajoutée
- DOCUMENTATION/_contexte/signals.md : action P2 zone kit ajoutée
- DOCUMENTATION/_contexte/contexte.md : état actuel réécrit

## Hypothèses validées / invalidées
- VALIDE : le script extrait de la spec passe sur la base réelle (exit 0) et détecte une base absente (exit 1)
- VALIDE : doc_sync est le bon véhicule — gate existant, diff réutilisé pour cibler le passage sémantique

## Prochaine étape exacte
Session kit : créer scripts/check_docs.py, mettre à jour doc_sync.md (étape 3 + renumérotation + note), vérifier check_docs.py et check_kit.py en exit 0, CHANGELOG minor, commit.

## Question bloquante pour la session suivante
Aucune
