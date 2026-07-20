# Signals — claude-vibecoding-kit (MAJ 2026-07-20)

## Actions ouvertes
- [P1|en cours] Roadmap `roadmap_agents.md` : construire un template de création d'agent (« agent = zone à rôle ») en s'appuyant sur robert-ia comme banc d'essai (démo du 25/07/2026 au Moulin du Sud). Phase 1 (analyse + conception) FAIT — livrable `note_conception_create_agent.md`. Phase 2 (création manuelle des agents COM/MEMORY dans robert-ia) démarrée mais pas encore réalisée. fait quand: les 4 phases de `roadmap_agents.md` sont `[FAIT]` (analyse/conception → agents COM/MEMORY créés dans robert-ia → commande `/create_agent` généralisée dans le kit → rétrospective écrite). réf: `roadmap_agents.md` ; `note_conception_create_agent.md`
- [P1|en cours] Propager `/update` (kit v2.18) aux 9 projets restants : Appli_TSA_SDI_TDAH, JeGeekUtile, SérénIATech_dev, VisioAide, TableauDeBord, IA-TSA, La Rev, IA_V7, jeux_vibecoder. Test concluant sur robert-ia et Jeu pour Nino (2/11, vérification post-update passée sans anomalie). fait quand: les 9 projets restants sont à jour (kit v2.18), `ollama_call.py` tracké par git et référencé dans leur CLAUDE.md, `DEPLOYMENTS.md` reflète la vraie version pour chacun. réf: `.claude/commands/update.md` ; `DEPLOYMENTS.md`
- [P2|ouvert] Décider quelles propositions de `base_connaissances/PROPOSITIONS_AMELIORATION.md` mettre en œuvre, en commençant par le Lot 1 (corrections légères : `/close` signale les résidus non commités, section Données sensibles activée, règle "Opus avant refacto", gate de phase, compression des signals vides — le point DEPLOYMENTS.md du Lot 1 est déjà fait, voir Décisions). fait quand: décision actée pour chaque proposition restante du Lot 1 (retenue/écartée) et, si retenue, implémentée. réf: `base_connaissances/PROPOSITIONS_AMELIORATION.md`

## Questions ouvertes
- Aucune

## Échéances
- 2026-07-25 : démonstration robert-ia au Moulin du Sud (Génissac) — les agents COM et MEMORY de robert-ia (Phase 2 de `roadmap_agents.md`) doivent être opérationnels avant cette date.

## Blocages
- Aucun

## Contexte chaud
- `note_conception_create_agent.md` (racine du kit) : livrable de la Phase 1, produit cette session. Arborescence d'un agent tranchée (`<dossier>/agent_role.md` + `<dossier>/_contexte/{signals,contexte}.md`), format de charte spécifié, insertion prévue dans `start.md` (nouvelle étape 2b, avant le chargement de `signals.md`), procédure d'unicité d'alias pour `/create_agent` décrite. Conclusion (à confirmer formellement en Phase 3) : `/update` ne cible que `.claude/` et `_contexte/` racine, donc aucun risque actuel sur les `_contexte/` de sous-zones tant qu'aucune charte n'est posée à la racine.
- `_docs/roadmap_agents_explained.html` : document pédagogique (vulgarisation complète de `roadmap_agents.md` pour un lecteur novice — vocabulaire, phases, décisions, points de friction), produit et ajouté à la racine du kit cette session à la demande de l'utilisateur. Nouveau dossier `_docs/` créé à la racine, jamais présent dans le kit auparavant — à refléter dans la structure du README (fait) et à surveiller si `/doc_sync`/`update.md` doivent un jour le connaître.
- Ordre de la roadmap confirmé par l'utilisateur : créer manuellement les agents COM/MEMORY dans robert-ia d'abord (avant le 25/07), généraliser en commande `/create_agent` + template ensuite (après l'événement). Checkpoint Phase 1 → Phase 2 non explicitement confirmé par un `/compact` de l'utilisateur (la session a enchaîné directement sur la production du document HTML) ; à garder en tête pour la prochaine session.
- `.claude/commands/update.md` modifié session 2026-07-17 : migration automatique du contenu "Spécificités projet" détecté (start.md/close.md/CLAUDE.md), y compris le cas de sections orphelines placées après la section dédiée (rencontré sur robert-ia) — l'ancien flux de question 1/2/3 est supprimé. Nouvelle étape 9 "Vérification post-update" (7 contrôles : fichiers à jour, marqueurs intacts, CLAUDE.md cohérent, `_contexte/`/`zones.md` intouchés, `ollama_call.py` tracké, commit propre, `DEPLOYMENTS.md` correct) avant la confirmation ; statut `⚠️` en mode batch si un contrôle échoue.
- `DEPLOYMENTS.md` (hors git) corrigé manuellement pour les 8 lignes fausses (F1) avant tout `/update` ; robert-ia et Jeu pour Nino sont désormais à v2.17 (réellement propagé et vérifié), les 9 autres restent à leur version réelle antérieure (v2.13 ou v2.10 selon le dernier `/update` réellement passé) jusqu'à leur tour.
- `base_connaissances/` créé : `INDEX.md` + une fiche par projet déployé + `ANALYSE.md` (frictions F1-F10, patterns terrain) + `PROPOSITIONS_AMELIORATION.md`. Reproductible via le script `collect_kb.py` (dans le scratchpad de session, pas encore intégré au kit — proposition 3.4).
- `processus-base-connaissances-markdown.md` : fichier vide non tracké à la racine, origine inconnue, toujours pas clarifié.
- `README.md` : corruption d'encodage pré-existante (double UTF-8) — à traiter dans une session dédiée si gênant.
- `jeux_vibecoder` : le lanceur Python et son instruction avaient été ajoutés hors protocole (pas de commit) ; sera régularisé par son passage en `/update`.

## Dernière session (2026-07-20)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->

# Session du 2026-07-20

## Décisions prises
- Phase 1 de `roadmap_agents.md` exécutée intégralement : mécanique zones/start/close/update analysée, arborescence d'un agent tranchée, format de `agent_role.md` spécifié, insertion de l'étape 2b dans `start.md` décidée, procédure d'unicité d'alias décrite.
- Nouveau dossier `_docs/` créé à la racine du kit, à la demande explicite de l'utilisateur, pour y héberger de la documentation générée (première pièce : le HTML pédagogique).

## Livrables produits ou modifiés
- `note_conception_create_agent.md` (racine du kit) : créé — livrable formel de la Phase 1.
- `_docs/roadmap_agents_explained.html` : créé — vulgarisation complète de `roadmap_agents.md` pour un lecteur novice, également publiée en artifact Claude.
- `roadmap_agents.md` : Phase 1 passée à `[FAIT]` (cases cochées), Phase 2 passée à `[EN COURS]`.

## Hypothèses validées / invalidées
- VALIDE : `/update` ne touche déjà pas aux `_contexte/` de sous-zones (il ne cible que la racine `.claude/`/`_contexte/`) — aucun correctif de code nécessaire tant qu'aucune charte n'est posée à la racine ; à confirmer noir sur blanc dans `update.md` en Phase 3.
- EN ATTENTE : le checkpoint `/compact` de fin de Phase 1 n'a pas été explicitement acté par l'utilisateur avant d'enchaîner sur la production du HTML — la roadmap a quand même été mise à jour comme si la Phase 1 était close, car son contenu est réellement terminé.

## Prochaine étape exacte
Lancer la Phase 2 de `roadmap_agents.md` : créer manuellement `COM/` et `MEMORY/` dans robert-ia (charte + `_contexte/` + entrée `zones.md`), en appliquant les décisions de `note_conception_create_agent.md`, avant le 25/07.

## Question bloquante pour la session suivante
Aucune
