# Signals — claude-vibecoding-kit (MAJ 2026-07-17)

## Actions ouvertes
- [P2|ouvert] Trancher la ligne Q5 divergente entre `.claude/commands/init_projet.md` et `templates/.claude/commands/init_projet.md` (format `{{ALIAS}} | {{RACINE}}` vs mention générique "zones.md") — fait quand: une des deux formulations est choisie et répercutée sur l'autre copie — réf: `.claude/commands/init_projet.md:32`, `templates/.claude/commands/init_projet.md:32`

## Questions ouvertes
- Aucune

## Échéances
- Aucune

## Blocages
- Aucun

## Contexte chaud
- `processus-base-connaissances-markdown.md` : fichier non tracké présent à la racine, origine inconnue — non touché cette session, à clarifier si pertinent
- `README.md` : corruption d'encodage pré-existante (double UTF-8) sur l'ensemble du fichier hors les lignes corrigées ces deux dernières sessions — à traiter dans une session dédiée si gênant

## Dernière session (2026-07-17)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->

# Session du 2026-07-17

## Décisions prises
- `/init_projet` inversé : se lance désormais depuis le repo du kit, argument = chemin absolu du projet cible à initialiser (au lieu de l'inverse), cohérent avec le sens déjà adopté pour `/update`.
- Nouvelle étape ajoutée à `/init_projet` : lister les fichiers créés/modifiés (liens cliquables) avant la confirmation finale.
- Projet TableauDeBord initialisé comme nouvelle zone `tableaudebord` ; CLAUDE.md existant fusionné avec le template (règles projet préservées dans "Spécificités projet" et "Données sensibles").

## Livrables produits ou modifiés
- `.claude/commands/init_projet.md` + copie `templates/` : inversion argument + étape liste fichiers
- `README.md`, `CHANGELOG.md` (v2.11, v2.12), `Protocole_start_close_context.md` : synchronisés via `/doc_sync`
- `DEPLOYMENTS.md` : entrée TableauDeBord ajoutée
- TableauDeBord (C:\Users\raph6\Documents\ServOMorph\TableauDeBord) : `.claude/CLAUDE.md` fusionné, `_contexte/`, `.claude/commands/start.md`+`close.md`, `.claude/zones.md`, `ollama_call.sh`, `_docs/protocole_vibecoding.md` créés et committés (commit da040c2 dans ce dépôt)

## Hypothèses validées / invalidées
- VALIDE : le sens de lancement de `/init_projet` était incohérent avec `/update` (déjà inversé en v2.9) — corrigé pour uniformiser
- EN ATTENTE : quelle formulation de la ligne Q5 (asymétrie entre les deux copies d'`init_projet.md`) fait autorité

## Prochaine étape exacte
Trancher l'asymétrie Q5 entre les deux copies d'`init_projet.md`, puis committer.

## Question bloquante pour la session suivante
Quelle formulation de la ligne Q5 (zone supplémentaire) fait autorité entre les deux copies d'`init_projet.md` ?
