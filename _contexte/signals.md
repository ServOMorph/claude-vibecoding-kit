# Signals — claude-vibecoding-kit (MAJ 2026-07-21)

## Actions ouvertes
- [P1|en cours] Période de test end-to-end de `/create_agent` : Test 1 (`web`/La Rev) et Test 2 (`linkedin`/SérénIATech_dev, conversion d'une zone existante) terminés. Frictions P6 (corrigée), P11 (`{{ALIAS_RACINE}}` peu fiable), P12 (pas de chemin procédure pour convertir une zone existante) identifiées. fait quand: P11/P12 tranchées et/ou un 3e test réalisé, synthèse remplie dans `TEST_CREATE_AGENT_RESULTS.md`, décision explicite de clôturer la période de test. réf: `TEST_CREATE_AGENT_RESULTS.md` ; `ameliorations_create_agent.md`
- [P2|ouvert] Propositions P7-P12 sur `/create_agent`/`agent_role.md` à trancher : P7 (analyse du projet cible pour un `contexte.md` pertinent), P8 (garde-fou d'écriture, non spécifiable en l'état), P9 (charte comme prompt de spécialisation), P10 (apprentissage automatique des agents, tension avec la règle mémoire), P11 (`{{ALIAS_RACINE}}`), P12 (conversion d'une zone existante en agent). fait quand: chaque proposition tranchée (retenue/écartée), implémentée si retenue. réf: `ameliorations_create_agent.md`
- [P2|ouvert] Décider quelles propositions des Lots 2-4 de `base_connaissances/PROPOSITIONS_AMELIORATION.md` mettre en œuvre (Lot 1 clos, Lot 2/1.2 absorbé par la propagation `/update all` de cette session). Lot 3 = 1.4+2.2, 1.5, 1.6 ; Lot 4 = 2.1, 2.3, 3.2-A, 3.4. fait quand: décision actée pour chaque proposition restante, implémentée si retenue. réf: `base_connaissances/PROPOSITIONS_AMELIORATION.md`
- [P2|ouvert] `README.md` n'a jamais listé `/doc_sync` dans "Ce que ça fait" — omission préexistante repérée en `/doc_sync`, non corrigée (hors périmètre du changement de cette session). fait quand: ligne ajoutée au README. réf: `README.md`, section "Ce que ça fait"

## Échéances
- 2026-07-25 : démonstration robert-ia au Moulin du Sud (Génissac) — agents COM/MEMORY créés (Phase 2 close), livrables (WhatsApp, `ROBERT_LIEU`) à finaliser côté robert-ia, hors périmètre de ce dépôt.

## Contexte chaud
- Propagation `/update all` terminée : 12/12 projets à jour (kit v2.25 au moment du batch), tous les contrôles post-update passent. Deux résidus pré-existants non liés à l'update, laissés tels quels : `robert-ia/.claude/zones.md` (lignes `com`/`memory` non commitées) et `La Rev/.claude/zones.md` (ligne `web` non commitée).
- Nouvelle commande `/cherche_meilleure_action` (kit uniquement, Opus) : aide à la décision, testée en conditions réelles cette session (a recommandé la propagation `/update all`, suivie).
- `AGENTS_REGISTRY.md` créé (racine du kit, hors git comme `DEPLOYMENTS.md`) : registre centralisé de tous les agents (alias, projet, chemin, rôle, verdict, retex), peuplé rétroactivement (com, memory, web, linkedin). `/create_agent` étape 10 l'alimente désormais automatiquement à chaque création.
- Corruption pré-existante corrigée : frontmatter de `.claude/commands/create_agent.md` (`u---` → `---`).
- Kit en v2.26. `TEST_CREATE_AGENT_RESULTS.md`/`ameliorations_create_agent.md` : Test 2 documenté, P11/P12 ouvertes.
- `processus-base-connaissances-markdown.md` : fichier vide non tracké, origine inconnue, toujours pas clarifié.
- `README.md` : corruption d'encodage pré-existante (double UTF-8) — à traiter si gênant.

## Dernière session (2026-07-21)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->

# Session du 2026-07-21

## Décisions prises
- Test 2 `/create_agent` : conversion de la zone existante `linkedin` (SérénIATech_dev) en agent — cas non couvert par la procédure standard, traité par déviation manuelle validée par l'utilisateur (charte seule ajoutée, `_contexte/`/`zones.md` existants non écrasés).
- Nouvelle commande `/cherche_meilleure_action` créée (kit uniquement, Opus) : recommandation + confirmation, jamais de décision tranchée seule.
- Sur sa propre recommandation, propagation `/update all` lancée et menée à terme sur les 12 projets du registre.
- `AGENTS_REGISTRY.md` créé pour centraliser agents + retex, hors git (paths locaux, repo public).

## Livrables produits ou modifiés
- SérénIATech_dev : `/update` individuel (v2.13→v2.24), agent `linkedin` (`agent_role.md` + section ajoutée à `contexte.md`).
- `.claude/commands/cherche_meilleure_action.md` (nouveau, kit uniquement).
- `.claude/commands/create_agent.md` : étape 10 (registre agents), frontmatter corrigé.
- `AGENTS_REGISTRY.md` (nouveau, hors git), `.gitignore` mis à jour.
- 12 projets de `DEPLOYMENTS.md` mis à jour au kit courant (v2.25 au moment du batch).
- `CHANGELOG.md` (v2.25, v2.26), `Protocole_start_close_context.md`, `README.md`, `TEST_CREATE_AGENT_RESULTS.md` (Test 2), `ameliorations_create_agent.md` (P11/P12).

## Hypothèses validées / invalidées
- VALIDE : la recommandation de `/cherche_meilleure_action` (propager `/update` plutôt que continuer sur `/create_agent`) s'est avérée pertinente et a été suivie sans réserve.
- EN ATTENTE : P11/P12 non tranchées.

## Prochaine étape exacte
Trancher P11/P12 (frictions du Test 2), ou lancer un Test 3 `/create_agent` en intégrant ces correctifs, ou avancer sur les Lots 3-4.

## Question bloquante pour la session suivante
Aucune
