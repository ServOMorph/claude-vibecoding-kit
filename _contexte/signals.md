# Signals — claude-vibecoding-kit (MAJ 2026-07-21)

## Actions ouvertes
- [P1|en cours] Période de test end-to-end de `/create_agent` : Test 1 (agent `web` dans La Rev) terminé, friction majeure trouvée et corrigée (P6 : vérification préalable du `start.md` du projet cible). Propositions P7-P10 identifiées et différées (contexte.md enrichi, garde-fou d'écriture par validation, charte comme prompt de spécialisation testé, apprentissage automatique des agents). fait quand: plusieurs agents testés sur différents projets/rôles, synthèse remplie dans `TEST_CREATE_AGENT_RESULTS.md`, décision explicite de clôturer la période de test. réf: `TEST_CREATE_AGENT_RESULTS.md` ; `ameliorations_create_agent.md`
- [P1|en cours] Propager `/update` aux 8 projets restants : Appli_TSA_SDI_TDAH, JeGeekUtile, SérénIATech_dev, VisioAide, TableauDeBord, IA-TSA, IA_V7, jeux_vibecoder. Test concluant sur robert-ia, Jeu pour Nino et La Rev (3/11, vérification post-update passée sans anomalie à chaque fois). fait quand: les 8 projets restants sont à jour (kit courant), `ollama_call.py` tracké par git et référencé dans leur CLAUDE.md, `DEPLOYMENTS.md` reflète la vraie version pour chacun. réf: `.claude/commands/update.md` ; `DEPLOYMENTS.md`
- [P2|ouvert] Décider quelles propositions de `base_connaissances/PROPOSITIONS_AMELIORATION.md` mettre en œuvre, en commençant par le Lot 1 (corrections légères : `/close` signale les résidus non commités, section Données sensibles activée, règle "Opus avant refacto", gate de phase, compression des signals vides — le point DEPLOYMENTS.md du Lot 1 est déjà fait, voir Décisions). fait quand: décision actée pour chaque proposition restante du Lot 1 (retenue/écartée) et, si retenue, implémentée. réf: `base_connaissances/PROPOSITIONS_AMELIORATION.md`
- [P2|ouvert] Propositions P7-P10 sur `/create_agent`/`agent_role.md` à trancher dans des sessions dédiées : P7 (analyse du projet cible pour un `contexte.md` pertinent), P8 (garde-fou d'écriture par validation écrite, non spécifiable en l'état — contredit la décision 5 "périmètre déclaratif, pas isolé"), P9 (charte comme prompt de spécialisation, testée sur tokens/alignement/vitesse), P10 (apprentissage automatique des agents — tension directe avec la règle "mémoire jamais écrite automatiquement"). fait quand: chaque proposition tranchée (retenue/écartée) avec une session de conception dédiée si retenue. réf: `ameliorations_create_agent.md`

## Questions ouvertes
- Aucune

## Échéances
- 2026-07-25 : démonstration robert-ia au Moulin du Sud (Génissac) — agents COM/MEMORY créés (Phase 2 close), mais leurs livrables (message WhatsApp, mécanisme multi-contextes `ROBERT_LIEU`) restent à finaliser côté robert-ia, hors périmètre de ce dépôt.

## Blocages
- Aucun

## Contexte chaud
- `TEST_CREATE_AGENT_RESULTS.md` créé à la racine du kit : journal réutilisable pour toute la période de test de `/create_agent`, un test = une entrée. Ne pas le confondre avec `ameliorations_create_agent.md` (sortie de l'étape 10 de la commande, orientée frictions/propositions cumulées) — les deux se complètent.
- `/create_agent` a changé de modèle d'exécution cette session : elle ne se copie plus jamais dans les projets cibles, elle s'exécute toujours depuis le kit avec le projet cible en argument (`<chemin_projet_cible> <dossier> [rôle]`). `templates/.claude/commands/create_agent.md` supprimée en conséquence.
- Friction majeure découverte lors du Test 1 : un agent créé dans un projet dont le `start.md` n'a pas l'étape 2b (chargement de charte) n'affiche jamais sa charte à `/start` — aucune erreur, juste un silence. Corrigée par l'ajout d'une étape 2b de vérification préalable dans `/create_agent` (P6). À surveiller sur les prochains tests.
- `roadmap_agents.md` : les 4 phases restent `[FAIT]` (pas de nouvelle phase ouverte cette session — le test relève du suivi post-roadmap, tracé dans `TEST_CREATE_AGENT_RESULTS.md`/`ameliorations_create_agent.md`, pas dans la roadmap elle-même).
- `.claude/commands/update.md` (kit) : migration automatique du contenu "Spécificités projet" détecté, étape 9 "Vérification post-update" (7 contrôles) avant confirmation, statut `⚠️` en mode batch si un contrôle échoue.
- `DEPLOYMENTS.md` (hors git) : robert-ia, Jeu pour Nino et La Rev à jour (v2.17/v2.22, réellement propagé et vérifié), les 8 autres restent à leur version réelle antérieure (v2.13 ou v2.10) jusqu'à leur tour.
- `base_connaissances/` créé : `INDEX.md` + une fiche par projet déployé + `ANALYSE.md` (frictions F1-F10, patterns terrain) + `PROPOSITIONS_AMELIORATION.md`. Reproductible via le script `collect_kb.py` (dans le scratchpad de session, pas encore intégré au kit — proposition 3.4).
- `processus-base-connaissances-markdown.md` : fichier vide non tracké à la racine, origine inconnue, toujours pas clarifié.
- `README.md` : corruption d'encodage pré-existante (double UTF-8) — à traiter dans une session dédiée si gênant.
- `jeux_vibecoder` : le lanceur Python et son instruction avaient été ajoutés hors protocole (pas de commit) ; sera régularisé par son passage en `/update`.

## Dernière session (2026-07-21)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->

# Session du 2026-07-21

## Décisions prises
- `/create_agent` s'exécute désormais toujours depuis le kit, projet cible en argument (chemin absolu) ; n'est plus jamais copiée dans les projets cibles (copie miroir `templates/.claude/commands/create_agent.md` supprimée).
- P6 implémentée : nouvelle étape 2b, `/create_agent` vérifie que le `start.md` du projet cible charge la charte avant de créer l'agent, sinon avertit et demande confirmation.
- P7-P10 tranchées comme différées, hors périmètre incrémental de `/create_agent` (sessions de conception dédiées si retenues) ; P8 jugée non spécifiable en l'état (contredit la décision 5 du cadrage).

## Livrables produits ou modifiés
- `.claude/commands/create_agent.md` : réécrite (argument chemin projet cible, étape 2b P6).
- `templates/.claude/commands/create_agent.md` : supprimée.
- `templates/agent_role_TEMPLATE.md` : agent autorisé à écrire son propre `_contexte/`.
- `.claude/commands/doc_sync.md`, `.claude/commands/update.md` (+ miroir templates) : mis à jour en cohérence.
- `TEST_CREATE_AGENT_RESULTS.md` (racine du kit) : créé — journal réutilisable de la période de test.
- `ameliorations_create_agent.md` : Test 1 consigné, arbitrage P6-P10.
- Premier agent réel créé : `D:\ServOMorph\La Rev\WEB` (agent `web`), `contexte.md` enrichi par analyse du projet cible.
- `D:\ServOMorph\La Rev` mis à jour via `/update` (v2.13 → v2.22), 2 commits dans son propre repo.
- `DEPLOYMENTS.md`, `CHANGELOG.md` (v2.23), `Protocole_start_close_context.md`, `README.md` : mis à jour.

## Hypothèses validées / invalidées
- VALIDE : sans vérification préalable, `/create_agent` peut créer un agent dont la charte ne s'affichera jamais (`start.md` du projet cible obsolète) — confirmé concrètement sur La Rev, corrigé par la nouvelle étape 2b.
- VALIDE : la charte (`agent_role.md`) dans son ensemble fait office de "prompt de spécialisation" de l'agent, pas seulement le champ Rôle — confirmé en discussion, creusé plus tard (P9).

## Prochaine étape exacte
Test 2 de `/create_agent` (autre projet/rôle) pour continuer la période de test, ou clôturer la période si jugée suffisante.

## Question bloquante pour la session suivante
Aucune
