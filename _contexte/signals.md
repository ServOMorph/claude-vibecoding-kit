# Signals — claude-vibecoding-kit (MAJ 2026-07-20)

## Actions ouvertes
- [P1|en cours] Roadmap `roadmap_agents.md` : construire un template de création d'agent (« agent = zone à rôle ») en s'appuyant sur robert-ia comme banc d'essai (démo du 25/07/2026 au Moulin du Sud). Phase 1 (analyse + conception) pas encore lancée. fait quand: les 4 phases de `roadmap_agents.md` sont `[FAIT]` (analyse/conception → agents COM/MEMORY créés dans robert-ia → commande `/create_agent` généralisée dans le kit → rétrospective écrite). réf: `roadmap_agents.md`
- [P1|en cours] Propager `/update` (kit v2.18) aux 9 projets restants : Appli_TSA_SDI_TDAH, JeGeekUtile, SérénIATech_dev, VisioAide, TableauDeBord, IA-TSA, La Rev, IA_V7, jeux_vibecoder. Test concluant sur robert-ia et Jeu pour Nino (2/11, vérification post-update passée sans anomalie). fait quand: les 9 projets restants sont à jour (kit v2.18), `ollama_call.py` tracké par git et référencé dans leur CLAUDE.md, `DEPLOYMENTS.md` reflète la vraie version pour chacun. réf: `.claude/commands/update.md` ; `DEPLOYMENTS.md`
- [P2|ouvert] Décider quelles propositions de `base_connaissances/PROPOSITIONS_AMELIORATION.md` mettre en œuvre, en commençant par le Lot 1 (corrections légères : `/close` signale les résidus non commités, section Données sensibles activée, règle "Opus avant refacto", gate de phase, compression des signals vides — le point DEPLOYMENTS.md du Lot 1 est déjà fait, voir Décisions). fait quand: décision actée pour chaque proposition restante du Lot 1 (retenue/écartée) et, si retenue, implémentée. réf: `base_connaissances/PROPOSITIONS_AMELIORATION.md`

## Questions ouvertes
- Aucune

## Échéances
- 2026-07-25 : démonstration robert-ia au Moulin du Sud (Génissac) — les agents COM et MEMORY de robert-ia (Phase 2 de `roadmap_agents.md`) doivent être opérationnels avant cette date.

## Blocages
- Aucun

## Contexte chaud
- `roadmap_agents.md` créée cette session : template de création d'agent (« zone à rôle », pas un subagent Claude Code). Cadrage durci après revue critique par Fable 5 (prompt utilisé ponctuellement, non conservé sur disque à la demande de l'utilisateur) : 6 décisions de conception actées — charte nommée `agent_role.md` (anti-collision avec `AGENTS.md` déjà présent à la racine de robert-ia), `/update` ne doit jamais toucher les `_contexte/` des sous-zones-agents, unicité d'alias contrôlée avant écriture dans `zones.md`, charte chargée automatiquement par `/start`, périmètre déclaratif assumé (pas d'isolation technique), rétrospective de fin de commande avec sortie écrite obligatoire (`ameliorations_create_agent.md`).
- Ordre de la roadmap confirmé par l'utilisateur : créer manuellement les agents COM/MEMORY dans robert-ia d'abord (avant le 25/07), généraliser en commande `/create_agent` + template ensuite (après l'événement).
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
- Nouvelle initiative actée : template de création d'agent = « zone à rôle » (dossier + charte `agent_role.md` + `_contexte/` + entrée `zones.md`, piloté par `/start`/`/close`) — explicitement pas un subagent Claude Code.
- Ordre de travail confirmé : créer manuellement les agents COM/MEMORY dans robert-ia avant le 25/07 (démo), généraliser en commande `/create_agent` après.
- 6 décisions de conception actées après revue critique par Fable 5 : nom de charte `agent_role.md`, `/update` n'touche jamais les `_contexte/` de sous-zones, unicité d'alias contrôlée, charte chargée auto par `/start`, périmètre déclaratif (pas d'isolation technique), rétrospective à sortie écrite obligatoire.

## Livrables produits ou modifiés
- `roadmap_agents.md` : créé (cadrage + 6 décisions de conception + 4 phases).
- Un prompt de revue critique a été rédigé et soumis à Fable 5 ; ses résultats sont intégrés à `roadmap_agents.md`, le prompt lui-même a été supprimé volontairement après usage (pas conservé comme livrable).

## Hypothèses validées / invalidées
- VALIDE : la revue croisée par un second modèle (Fable 5) avant tout code a produit des points concrets et actionnables (nommage, impact `/update`, unicité alias) plutôt que du remplissage.
- EN ATTENTE : Phase 1 de `roadmap_agents.md` (analyse kit + conception détaillée) pas encore lancée.

## Prochaine étape exacte
Lancer la Phase 1 de `roadmap_agents.md` : analyser la mécanique zones/start/close/update, spécifier `agent_role.md` et l'arborescence d'un agent, produire la note de conception avant de créer quoi que ce soit dans robert-ia.

## Question bloquante pour la session suivante
Aucune
