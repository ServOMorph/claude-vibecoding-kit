# Signals — claude-vibecoding-kit (MAJ 2026-07-21)

## Actions ouvertes
- [P1|en cours] Période de test end-to-end de `/create_agent` : Test 1 (agent `web` dans La Rev) terminé, friction majeure trouvée et corrigée (P6 : vérification préalable du `start.md` du projet cible). Propositions P7-P10 identifiées et différées (contexte.md enrichi, garde-fou d'écriture par validation, charte comme prompt de spécialisation testé, apprentissage automatique des agents). fait quand: plusieurs agents testés sur différents projets/rôles, synthèse remplie dans `TEST_CREATE_AGENT_RESULTS.md`, décision explicite de clôturer la période de test. réf: `TEST_CREATE_AGENT_RESULTS.md` ; `ameliorations_create_agent.md`
- [P1|en cours] Propager `/update` aux 8 projets restants : Appli_TSA_SDI_TDAH, JeGeekUtile, SérénIATech_dev, VisioAide, TableauDeBord, IA-TSA, IA_V7, jeux_vibecoder. Test concluant sur robert-ia, Jeu pour Nino et La Rev (3/11, vérification post-update passée sans anomalie à chaque fois). fait quand: les 8 projets restants sont à jour (kit courant), `ollama_call.py` tracké par git et référencé dans leur CLAUDE.md, `DEPLOYMENTS.md` reflète la vraie version pour chacun. réf: `.claude/commands/update.md` ; `DEPLOYMENTS.md`
- [P2|ouvert] Propositions P7-P10 sur `/create_agent`/`agent_role.md` à trancher dans des sessions dédiées : P7 (analyse du projet cible pour un `contexte.md` pertinent), P8 (garde-fou d'écriture par validation écrite, non spécifiable en l'état — contredit la décision 5 "périmètre déclaratif, pas isolé"), P9 (charte comme prompt de spécialisation, testée sur tokens/alignement/vitesse), P10 (apprentissage automatique des agents — tension directe avec la règle "mémoire jamais écrite automatiquement"). fait quand: chaque proposition tranchée (retenue/écartée) avec une session de conception dédiée si retenue. réf: `ameliorations_create_agent.md`
- [P2|ouvert] Décider quelles propositions des Lots 2-4 de `base_connaissances/PROPOSITIONS_AMELIORATION.md` mettre en œuvre (Lot 1 entièrement clos cette session). Lot 2 = 1.2 (réconciliation v2.14 + `/update all`, doublon avec l'action de propagation ci-dessus) ; Lot 3 = 1.4+2.2 (statut LIVRÉ/À VALIDER, gate de phase), 1.5, 1.6 ; Lot 4 = 2.1, 2.3, 3.2-A, 3.4. fait quand: décision actée pour chaque proposition restante (retenue/écartée) et, si retenue, implémentée. réf: `base_connaissances/PROPOSITIONS_AMELIORATION.md`

## Échéances
- 2026-07-25 : démonstration robert-ia au Moulin du Sud (Génissac) — agents COM/MEMORY créés (Phase 2 close), mais leurs livrables (message WhatsApp, mécanisme multi-contextes `ROBERT_LIEU`) restent à finaliser côté robert-ia, hors périmètre de ce dépôt.

## Contexte chaud
- Lot 1 de `PROPOSITIONS_AMELIORATION.md` entièrement implémenté cette session (1.1 déjà fait précédemment + 1.3, 1.7, 2.4, 2.5, 3.1) : kit v2.24. Détail dans `CHANGELOG.md` et `Protocole_start_close_context.md`.
- `TEST_CREATE_AGENT_RESULTS.md` créé à la racine du kit : journal réutilisable pour toute la période de test de `/create_agent`, un test = une entrée. Ne pas le confondre avec `ameliorations_create_agent.md` (sortie de l'étape 10 de la commande, orientée frictions/propositions cumulées) — les deux se complètent.
- `/create_agent` s'exécute toujours depuis le kit avec le projet cible en argument (`<chemin_projet_cible> <dossier> [rôle]`), jamais copiée dans les projets cibles.
- Friction majeure découverte lors du Test 1 : un agent créé dans un projet dont le `start.md` n'a pas l'étape 2b (chargement de charte) n'affiche jamais sa charte à `/start` — aucune erreur, juste un silence. Corrigée par l'ajout d'une étape 2b de vérification préalable dans `/create_agent` (P6). À surveiller sur les prochains tests.
- `DEPLOYMENTS.md` (hors git) : robert-ia, Jeu pour Nino et La Rev à jour (v2.17/v2.22, réellement propagé et vérifié), les 8 autres restent à leur version réelle antérieure (v2.13 ou v2.10) jusqu'à leur tour.
- `base_connaissances/` créé : `INDEX.md` + une fiche par projet déployé + `ANALYSE.md` (frictions F1-F10, patterns terrain) + `PROPOSITIONS_AMELIORATION.md`. Reproductible via le script `collect_kb.py` (dans le scratchpad de session, pas encore intégré au kit — proposition 3.4).
- `processus-base-connaissances-markdown.md` : fichier vide non tracké à la racine, origine inconnue, toujours pas clarifié.
- `README.md` : corruption d'encodage pré-existante (double UTF-8) — à traiter dans une session dédiée si gênant.
- `jeux_vibecoder` : le lanceur Python et son instruction avaient été ajoutés hors protocole (pas de commit) ; sera régularisé par son passage en `/update`.

## Dernière session (2026-07-21)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->

# Session du 2026-07-21

## Décisions prises
- Lot 1 de `PROPOSITIONS_AMELIORATION.md` retenu en bloc et implémenté (1.3, 1.7, 2.4, 2.5, 3.1) : effort faible/trivial confirmé pour chacune, aucune écartée.
- Section "Données sensibles" de CLAUDE.md activée : question posée par `/init_projet` (Q6) et par `/update` si jamais renseignée (skip en mode batch, statut `⚠️`).
- Sections vides de `signals.md` omises entièrement (au lieu de titre sans puce) ; limite de 5 lignes par entrée de "Décisions structurantes".

## Livrables produits ou modifiés
- `.claude/commands/close.md` (+ miroir templates) : étape 11 (résidus non commités), étape 4 (sections vides omises), étape 5 (limite 5 lignes).
- `.claude/CLAUDE.md` (+ miroir templates) : section Données sensibles activée (rappel + placeholder), nouvelle section "Modèles recommandés", ligne benchmark comme gate de phase.
- `.claude/commands/init_projet.md` (+ miroir templates) : question Q6 données sensibles + placeholder `{{DONNEES_SENSIBLES}}`.
- `.claude/commands/update.md` (+ miroir templates) : logique de question ponctuelle si section Données sensibles jamais renseignée.
- `templates/_contexte/signals.md`, `templates/_contexte/contexte.md` : gabarit allégé (sections vides retirées, limite 5 lignes mentionnée).
- `CHANGELOG.md` (v2.24), `Protocole_start_close_context.md` (table modèles + changelog miroir) : mis à jour.
- `_contexte/archive_decisions.md` : 2 décisions du 2026-07-17 archivées pour rester sous la limite de 10 entrées.

## Hypothèses validées / invalidées
- VALIDE : les 5 propositions restantes du Lot 1, évaluées "effort faible/trivial" le 2026-07-17, n'ont nécessité aucun arbitrage complexe à l'implémentation.

## Prochaine étape exacte
Reprendre soit le Test 2 de `/create_agent`, soit la propagation `/update` aux 8 projets restants, soit trancher les propositions P7-P10 ou les Lots 2-4 de `PROPOSITIONS_AMELIORATION.md`.

## Question bloquante pour la session suivante
Aucune
