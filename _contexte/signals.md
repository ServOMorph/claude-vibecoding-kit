# Signals — claude-vibecoding-kit (MAJ 2026-07-21)

## Actions ouvertes
- [P2|ouvert] Valider `/create_agent` end-to-end : la commande n'a jamais été exécutée réellement (COM/MEMORY dans robert-ia ont été créés à la main en Phase 2, avant que la commande existe). P1 (rôle durable) et P2 (périmètre d'écriture, `{{ECRITURE_ETENDUE}}`) implémentées mais non vérifiées en conditions réelles. fait quand: un agent a été créé via `/create_agent` dans un projet réel, `ameliorations_create_agent.md` mis à jour avec le résultat. réf: `ameliorations_create_agent.md` ; `.claude/commands/create_agent.md`
- [P1|en cours] Propager `/update` (kit v2.18) aux 9 projets restants : Appli_TSA_SDI_TDAH, JeGeekUtile, SérénIATech_dev, VisioAide, TableauDeBord, IA-TSA, La Rev, IA_V7, jeux_vibecoder. Test concluant sur robert-ia et Jeu pour Nino (2/11, vérification post-update passée sans anomalie). fait quand: les 9 projets restants sont à jour (kit v2.18), `ollama_call.py` tracké par git et référencé dans leur CLAUDE.md, `DEPLOYMENTS.md` reflète la vraie version pour chacun. réf: `.claude/commands/update.md` ; `DEPLOYMENTS.md`
- [P2|ouvert] Décider quelles propositions de `base_connaissances/PROPOSITIONS_AMELIORATION.md` mettre en œuvre, en commençant par le Lot 1 (corrections légères : `/close` signale les résidus non commités, section Données sensibles activée, règle "Opus avant refacto", gate de phase, compression des signals vides — le point DEPLOYMENTS.md du Lot 1 est déjà fait, voir Décisions). fait quand: décision actée pour chaque proposition restante du Lot 1 (retenue/écartée) et, si retenue, implémentée. réf: `base_connaissances/PROPOSITIONS_AMELIORATION.md`

## Questions ouvertes
- Aucune

## Échéances
- 2026-07-25 : démonstration robert-ia au Moulin du Sud (Génissac) — agents COM/MEMORY créés (Phase 2 close), mais leurs livrables (message WhatsApp, mécanisme multi-contextes `ROBERT_LIEU`) restent à finaliser côté robert-ia, hors périmètre de ce dépôt.

## Blocages
- Aucun

## Contexte chaud
- `roadmap_agents.md` : les 4 phases sont `[FAIT]`. `/create_agent` généralisée (kit + template), mais jamais exécutée réellement — COM/MEMORY dans robert-ia ont été créés à la main avant que la commande existe. P1 (rôle durable) et P2 (question périmètre d'écriture, placeholder `{{ECRITURE_ETENDUE}}`) ajoutées en Phase 4 suite à des frictions réellement observées, non encore vérifiées à l'usage. Détail dans `ameliorations_create_agent.md`.
- Divergence de paire miroir détectée et corrigée cette session : `templates/.claude/commands/update.md` n'avait jamais reçu la modification Phase 3 de `.claude/commands/update.md` (mention des zones-agents). À garder en tête : les paires miroir listées dans `doc_sync.md` peuvent diverger silencieusement si `/doc_sync` n'est pas relancé juste après une édition.
- `.claude/commands/update.md` (kit) : migration automatique du contenu "Spécificités projet" détecté, étape 9 "Vérification post-update" (7 contrôles) avant confirmation, statut `⚠️` en mode batch si un contrôle échoue.
- `DEPLOYMENTS.md` (hors git) : robert-ia et Jeu pour Nino à v2.17 (réellement propagé et vérifié), les 9 autres restent à leur version réelle antérieure (v2.13 ou v2.10) jusqu'à leur tour.
- `base_connaissances/` créé : `INDEX.md` + une fiche par projet déployé + `ANALYSE.md` (frictions F1-F10, patterns terrain) + `PROPOSITIONS_AMELIORATION.md`. Reproductible via le script `collect_kb.py` (dans le scratchpad de session, pas encore intégré au kit — proposition 3.4).
- `processus-base-connaissances-markdown.md` : fichier vide non tracké à la racine, origine inconnue, toujours pas clarifié.
- `README.md` : corruption d'encodage pré-existante (double UTF-8) — à traiter dans une session dédiée si gênant.
- `jeux_vibecoder` : le lanceur Python et son instruction avaient été ajoutés hors protocole (pas de commit) ; sera régularisé par son passage en `/update`.

## Dernière session (2026-07-21)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->

# Session du 2026-07-21

## Décisions prises
- Phases 2, 3 et 4 de `roadmap_agents.md` closes — les 4 phases sont désormais `[FAIT]`.
- `/create_agent` n'est pas propagée par `/update` (décision utilisateur, session précédente, confirmée).
- Phase 4 (rétrospective, sur Opus) : constat que la commande n'a jamais tourné réellement ; P1 (rôle durable) et P2 (question périmètre d'écriture) retenues et implémentées ; P4 et P5 écartées.

## Livrables produits ou modifiés
- `.claude/commands/create_agent.md` + `templates/.claude/commands/create_agent.md` : étape 1 enrichie (rôle durable, périmètre d'écriture).
- `templates/agent_role_TEMPLATE.md` : placeholder `{{ECRITURE_ETENDUE}}`.
- `ameliorations_create_agent.md` (racine du kit) : créé — journal des frictions/améliorations, sortie concrète de la Phase 4.
- `templates/.claude/commands/update.md` : resynchronisé sur sa paire miroir (divergence Phase 3 non détectée).
- `Protocole_start_close_context.md` : changelog complété (v2.19-v2.21 manquantes) + entrée v2.22.
- `CHANGELOG.md`, `README.md`, `roadmap_agents.md` : mis à jour.

## Hypothèses validées / invalidées
- INVALIDE : la validation de `/create_agent` supposée acquise après la Phase 3 -> en réalité jamais exécutée, la création COM/MEMORY ayant précédé la commande. Pivot : action ouverte P3 (test end-to-end) ajoutée aux signals.
- VALIDE : les paires miroir de `doc_sync.md` peuvent diverger silencieusement si `/doc_sync` n'est pas relancé juste après une édition (cas réel trouvé sur `update.md`).

## Prochaine étape exacte
Valider `/create_agent` en créant un agent réel avec la commande (P3), avant de considérer le template pleinement fiable.

## Question bloquante pour la session suivante
Aucune
