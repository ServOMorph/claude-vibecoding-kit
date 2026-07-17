# Signals — claude-vibecoding-kit (MAJ 2026-07-17)

## Actions ouvertes
- [P1|ouvert] Propager le lanceur Ollama v2.14 aux projets déployés. fait quand: chaque projet concerné utilise `ollama_call.py` et son `CLAUDE.md` appelle `python ollama_call.py "<prompt>"`. réf: `DEPLOYMENTS.md` ; `.claude/commands/update.md`

## Questions ouvertes
- Aucune

## Échéances
- Aucune

## Blocages
- Aucun

## Contexte chaud
- `processus-base-connaissances-markdown.md` : fichier non tracké présent à la racine, origine inconnue — non touché cette session, à clarifier si pertinent
- `README.md` : corruption d'encodage pré-existante (double UTF-8) sur l'ensemble du fichier hors les lignes corrigées ces dernières sessions — à traiter dans une session dédiée si gênant
- `jeux_vibecoder` : le lanceur Python et son instruction ont été ajoutés, mais le dépôt contient aussi des modifications utilisateur non liées ; aucun commit n’y a été créé.

## Dernière session (2026-07-17)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->

# Session du 2026-07-17

## Décisions prises
- `ollama_call.py` remplace le lanceur Bash : le protocole doit fonctionner sous Windows sans Bash ni WSL.
- La propagation v2.14 reste volontairement séparée : aucun autre projet déployé n’est modifié sans exécution explicite de `/update`.

## Livrables produits ou modifiés
- `templates/ollama_call.py` : lanceur local Python ajouté ; template Bash retiré.
- `.claude/commands/`, `templates/.claude/`, `README.md`, `CHANGELOG.md`, `Protocole_start_close_context.md` : références synchronisées vers v2.14.
- `.gitignore` : bytecode Python ignoré.

## Hypothèses validées / invalidées
- VALIDE : Ollama répond localement depuis PowerShell via le nouveau lanceur Python, sans Bash ni WSL.
- EN ATTENTE : propagation du lanceur v2.14 dans les autres projets déployés.

## Prochaine étape exacte
Exécuter `/update all` depuis ce kit, puis vérifier la présence de `ollama_call.py` et l’instruction associée dans chaque projet.

## Question bloquante pour la session suivante
Aucune
