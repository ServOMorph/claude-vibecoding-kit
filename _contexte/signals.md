# Signals — claude-vibecoding-kit (MAJ 2026-07-17)

## Actions ouvertes
- [P1|en cours] Propager `/update` (kit v2.17) aux 9 projets restants : Appli_TSA_SDI_TDAH, JeGeekUtile, SérénIATech_dev, VisioAide, TableauDeBord, IA-TSA, La Rev, IA_V7, jeux_vibecoder. Test concluant sur robert-ia et Jeu pour Nino (2/11, vérification post-update passée sans anomalie). fait quand: les 9 projets restants sont à jour (kit v2.17), `ollama_call.py` tracké par git et référencé dans leur CLAUDE.md, `DEPLOYMENTS.md` reflète la vraie version pour chacun. réf: `.claude/commands/update.md` ; `DEPLOYMENTS.md`
- [P2|ouvert] Décider quelles propositions de `base_connaissances/PROPOSITIONS_AMELIORATION.md` mettre en œuvre, en commençant par le Lot 1 (corrections légères : `/close` signale les résidus non commités, section Données sensibles activée, règle "Opus avant refacto", gate de phase, compression des signals vides — le point DEPLOYMENTS.md du Lot 1 est déjà fait, voir Décisions). fait quand: décision actée pour chaque proposition restante du Lot 1 (retenue/écartée) et, si retenue, implémentée. réf: `base_connaissances/PROPOSITIONS_AMELIORATION.md`

## Questions ouvertes
- Aucune

## Échéances
- Aucune

## Blocages
- Aucun

## Contexte chaud
- `.claude/commands/update.md` modifié cette session : migration automatique du contenu "Spécificités projet" détecté (start.md/close.md/CLAUDE.md), y compris le cas de sections orphelines placées après la section dédiée (rencontré sur robert-ia) — l'ancien flux de question 1/2/3 est supprimé. Nouvelle étape 9 "Vérification post-update" (7 contrôles : fichiers à jour, marqueurs intacts, CLAUDE.md cohérent, `_contexte/`/`zones.md` intouchés, `ollama_call.py` tracké, commit propre, `DEPLOYMENTS.md` correct) avant la confirmation ; statut `⚠️` en mode batch si un contrôle échoue.
- `DEPLOYMENTS.md` (hors git) corrigé manuellement pour les 8 lignes fausses (F1) avant tout `/update` ; robert-ia et Jeu pour Nino sont désormais à v2.17 (réellement propagé et vérifié), les 9 autres restent à leur version réelle antérieure (v2.13 ou v2.10 selon le dernier `/update` réellement passé) jusqu'à leur tour.
- `base_connaissances/` créé (session précédente) : `INDEX.md` + une fiche par projet déployé + `ANALYSE.md` (frictions F1-F10, patterns terrain) + `PROPOSITIONS_AMELIORATION.md`. Reproductible via le script `collect_kb.py` (dans le scratchpad de session, pas encore intégré au kit — proposition 3.4).
- `processus-base-connaissances-markdown.md` : fichier vide non tracké à la racine, origine inconnue, toujours pas clarifié.
- `README.md` : corruption d'encodage pré-existante (double UTF-8) — à traiter dans une session dédiée si gênant.
- `jeux_vibecoder` : le lanceur Python et son instruction avaient été ajoutés hors protocole (pas de commit) ; sera régularisé par son passage en `/update`.

## Dernière session (2026-07-17)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->

# Session du 2026-07-17

## Décisions prises
- F1 (`DEPLOYMENTS.md` faux) corrigé : `/update` réécrit désormais version/date sur une ligne existante au lieu de l'ignorer ; `DEPLOYMENTS.md` corrigé manuellement pour les 8 lignes fausses en attendant leur passage en `/update`.
- `/update` modifié : migration automatique (sans question) du contenu "Spécificités projet" détecté, y compris les sections orphelines placées hors de la zone dédiée (cas rencontré sur robert-ia, résolu en migrant "Synchronisation Windows → Linux" et "Contrôle SSH du PC Linux" dedans).
- `/update` : nouvelle étape de vérification post-update (7 contrôles) avant confirmation, avec statut `⚠️` si un contrôle échoue.
- Test de propagation concluant sur 2 projets (robert-ia, Jeu pour Nino) : kit v2.13 → v2.17, `ollama_call.py` tracké par git, CLAUDE.md à jour, vérification post-update passée sans anomalie sur les deux.

## Livrables produits ou modifiés
- `.claude/commands/update.md` : modifié (étapes 5, 6, 7, 9 nouvelle, 10, mode batch).
- `DEPLOYMENTS.md` : corrigé (8 lignes) puis mis à jour (robert-ia, Jeu pour Nino → v2.17).
- `D:\ServOMorph\robert-ia` : `.claude/CLAUDE.md`, start.md, close.md, create_memory.md, ollama_call.py mis à jour, 2 commits (backup + update).
- `D:\ServOMorph\Jeu pour Nino` : idem, 2 commits.

## Hypothèses validées / invalidées
- VALIDE : le protocole `/update` corrigé (migration auto + vérification) fonctionne sans perte de contenu sur 2 projets tests, y compris un cas non prévu initialement (sections orphelines).
- EN ATTENTE : propagation aux 9 projets restants.
- EN ATTENTE : décision sur le reste du Lot 1 des propositions d'amélioration.

## Prochaine étape exacte
Lancer `/update` sur les 9 projets restants (Appli_TSA_SDI_TDAH, JeGeekUtile, SérénIATech_dev, VisioAide, TableauDeBord, IA-TSA, La Rev, IA_V7, jeux_vibecoder), avec vérification post-update systématique.

## Question bloquante pour la session suivante
Aucune
