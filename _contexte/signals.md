# Signals — claude-vibecoding-kit (MAJ 2026-07-17)

## Actions ouvertes
- [P1|en attente de test] Tester la mise à jour de la dernière version du kit sur un projet dédié avant toute propagation. fait quand: un `/update <chemin absolu>` a mis à jour un projet de test, les fichiers `ollama_call.py` et `CLAUDE.md` sont vérifiés, et le résultat est consigné. réf: `.claude/commands/update.md` ; `DEPLOYMENTS.md`
- [P1|ouvert après test] Propager le lanceur Ollama à jour aux projets déployés. prérequis: test de mise à jour concluant. fait quand: chaque projet concerné utilise `ollama_call.py` et son `CLAUDE.md` appelle `python ollama_call.py "<prompt>"`. réf: `DEPLOYMENTS.md` ; `.claude/commands/update.md`
- [P2|ouvert] Décider quelles propositions de `base_connaissances/PROPOSITIONS_AMELIORATION.md` mettre en œuvre, en commençant par le Lot 1 (corrections légères : `/update` met à jour DEPLOYMENTS.md, `/close` signale les résidus non commités, section Données sensibles activée, règle "Opus avant refacto", gate de phase, compression des signals vides). fait quand: décision actée pour chaque proposition du Lot 1 (retenue/écartée) et, si retenue, implémentée. réf: `base_connaissances/PROPOSITIONS_AMELIORATION.md`

## Questions ouvertes
- Aucune

## Échéances
- Aucune

## Blocages
- Aucun

## Contexte chaud
- `base_connaissances/` créé cette session : `INDEX.md` + une fiche par projet déployé + `ANALYSE.md` (frictions F1-F10, patterns terrain) + `PROPOSITIONS_AMELIORATION.md`. Reproductible via le script `collect_kb.py` (actuellement dans le scratchpad de session, pas encore intégré au kit — voir proposition 3.4).
- `processus-base-connaissances-markdown.md` : fichier vide non tracké à la racine, origine inconnue. Son intention (base de connaissances markdown) a été reprise cette session sous `base_connaissances/` ; ce fichier reste à clarifier (le supprimer ou le remplir ?).
- `README.md` : corruption d'encodage pré-existante (double UTF-8) sur l'ensemble du fichier hors les lignes corrigées ces dernières sessions — à traiter dans une session dédiée si gênant
- `jeux_vibecoder` : le lanceur Python et son instruction ont été ajoutés, mais le dépôt contient aussi des modifications utilisateur non liées ; aucun commit n'y a été créé.
- La propagation du lanceur Ollama reste suspendue : tester d'abord `/update` sur un seul projet avant d'exécuter `/update all`.
- `DEPLOYMENTS.md` est un registre local hors git (gitignoré) : sa fraîcheur n'est jamais garantie par un commit — friction F1 documentée dans `base_connaissances/ANALYSE.md`.

## Dernière session (2026-07-17)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->

# Session du 2026-07-17

## Décisions prises
- Base de connaissances multi-projets créée sous `base_connaissances/` (12 fiches + index) à partir de git, `_contexte/`, roadmaps, mémoire projet et transcripts Claude Code des 11 projets déployés.
- Analyse transversale et propositions d'amélioration produites, mais aucune n'a été mise en œuvre — décision de mise en œuvre laissée à une session dédiée.
- Du travail non commité d'une session antérieure (durcissement de `ollama_call.py`, suite `unittest`, correctif `/doc_sync`) a été retrouvé dans le working tree et inclus dans ce close pour ramener le dépôt à un état cohérent.

## Livrables produits ou modifiés
- `base_connaissances/INDEX.md`, `base_connaissances/*.md` (12 fiches projet) : créés.
- `base_connaissances/ANALYSE.md` : 10 frictions (F1-F10), 7 patterns terrain identifiés.
- `base_connaissances/PROPOSITIONS_AMELIORATION.md` : 16 propositions priorisées P1/P2/P3.
- `templates/ollama_call.py`, `.claude/commands/doc_sync.md`, `tests/test_ollama_call.py`, `README.md`, `CHANGELOG.md`, `Protocole_start_close_context.md` : travail antérieur non commité, intégré à ce close.

## Hypothèses validées / invalidées
- VALIDE : le cycle /start-/close et le multi-zones sont largement adoptés sur les 11 projets (795 commits, ~395 sessions analysées).
- EN ATTENTE : mise en œuvre des propositions d'amélioration — aucune décision prise cette session.
- EN ATTENTE : test de propagation du lanceur Ollama (action reportée depuis plusieurs sessions).

## Prochaine étape exacte
Décider du Lot 1 des propositions d'amélioration (`base_connaissances/PROPOSITIONS_AMELIORATION.md`), puis reprendre le test de mise à jour v2.x sur un projet dédié avant toute propagation.

## Question bloquante pour la session suivante
Aucune
