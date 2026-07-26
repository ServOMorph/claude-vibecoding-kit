# Signals — claude-vibecoding-kit (MAJ 2026-07-26)

## Actions ouvertes
- [P1|ouvert] Test 3 réel de `/create_agent` en mode conversion, sur la version réécrite (phases ancrées). Aucun test n'a encore exercé cette branche telle qu'écrite : l'agent `design` (jeu_zombies) était un cas de conversion mais traité manuellement, pas via la procédure. fait quand: `/create_agent` lancée sur un alias déjà enregistré et le comportement conforme à `[PREFLIGHT]`/`[ECRITURE]` (pas de modif `zones.md`/`signals.md` existant) vérifié en conditions réelles. réf: `.claude/commands/create_agent.md`, `TEST_CREATE_AGENT_RESULTS.md`
- [P2|ouvert] Propositions P7-P10 sur `/create_agent`/`agent_role.md` restant à trancher (P11/P12/P13 implémentées le 2026-07-26) : P7 (partiellement couvert par l'analyse stack conditionnelle, à confirmer sur Test 3), P8 (garde-fou d'écriture, non spécifiable en l'état), P9 (charte comme prompt de spécialisation), P10 (apprentissage automatique des agents, tension avec la règle mémoire). fait quand: chaque proposition tranchée (retenue/écartée), implémentée si retenue. réf: `ameliorations_create_agent.md`
- [P2|ouvert] Décider quelles propositions des Lots 2-4 de `base_connaissances/PROPOSITIONS_AMELIORATION.md` mettre en œuvre (Lot 1 clos). Lot 3 = 1.4+2.2, 1.5, 1.6 ; Lot 4 = 2.1, 2.3, 3.2-A, 3.4. fait quand: décision actée pour chaque proposition restante, implémentée si retenue. réf: `base_connaissances/PROPOSITIONS_AMELIORATION.md`
- [P2|ouvert] `README.md` n'a jamais listé `/doc_sync` dans "Ce que ça fait" — omission préexistante. fait quand: ligne ajoutée au README. réf: `README.md`, section "Ce que ça fait"

## Contexte chaud
- Kit en v3.0 (bump majeur : placeholder `{{NOM_AGENT}}`→`{{DOSSIER_AGENT}}` renommé). `.claude/commands/create_agent.md` entièrement restructurée en phases ancrées `[PREFLIGHT]`/`[COLLECTE]`/`[ECRITURE]`/`[SORTIE]`/`[AUDIT]` par un agent externe, puis corrigée (renvois internes par ancre au lieu de numéro d'étape, `{{ALIAS_RACINE}}` omis si non déterminable plutôt que vide) et complétée avec la phase `[AUDIT]` (analyse à froid de la commande elle-même, Opus imposé, jamais automatique, sortie obligatoire dans `ameliorations_create_agent.md`).
- Agent `design` créé dans `D:\ServOMorph\jeu_zombies\DESIGN` (design artistique/UX de Nox Protocol) — cas de conversion (alias déjà présent dans `zones.md`, dossier vide), traité manuellement puisque la commande réécrite n'avait pas encore tourné. `contexte.md` de cet agent alimenté avec la stack réelle du projet (Godot 4.5, GDD, contraintes licences) plutôt que le stub générique.
- `AGENTS_REGISTRY.md` (hors git) : entrée `design` ajoutée.
- `roadmap_agents.md` Phase 2 : statut corrigé `[EN COURS]`→`[FAIT]` (toutes les sous-tâches étaient déjà cochées, incohérence pré-existante).
- `processus-base-connaissances-markdown.md` : fichier vide non tracké, origine inconnue, toujours pas clarifié.
- `README.md` : corruption d'encodage pré-existante (double UTF-8) — à traiter si gênant.

## Dernière session (2026-07-26)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->

# Session du 2026-07-26

## Décisions prises
- `/create_agent` réécrite en phases nommées ancrées, avec mode conversion explicite (P12), analyse `{{STACK}}` conditionnelle (P13) et règle `{{ALIAS_RACINE}}` durcie (P11) — implémentées et documentées (bump majeur v3.0).
- Nouvelle phase `[AUDIT]` ajoutée sur demande utilisateur : analyse à froid de `create_agent.md` elle-même, jamais automatique, Opus imposé, sortie écrite obligatoire.
- Agent `design` créé dans `jeu_zombies/DESIGN` (cas de conversion, traité manuellement) pour couvrir le design artistique/UX du jeu.
- `roadmap_agents.md` Phase 2 : statut corrigé (incohérence pré-existante, sans lien avec cette session).

## Livrables produits ou modifiés
- `.claude/commands/create_agent.md` : réécriture complète (phases + mode conversion + [AUDIT]).
- `templates/agent_role_TEMPLATE.md` : placeholder `{{NOM_AGENT}}`→`{{DOSSIER_AGENT}}`.
- `CHANGELOG.md` (v3.0), `Protocole_start_close_context.md`, `README.md` : synchronisés via `/doc_sync`.
- `ameliorations_create_agent.md` : P11/P12/P13 marquées implémentées, entrée agent `design` ajoutée.
- `AGENTS_REGISTRY.md` (hors git) : entrée `design`.
- `jeu_zombies/DESIGN/agent_role.md`, `_contexte/contexte.md`, `_contexte/signals.md` (hors dépôt kit).
- `roadmap_agents.md` : Phase 2 `[EN COURS]`→`[FAIT]`.

## Hypothèses validées / invalidées
- EN ATTENTE : le mode conversion réécrit n'a jamais tourné tel qu'écrit — l'agent `design` était un cas de conversion mais géré manuellement, pas via la procédure `[PREFLIGHT]`/`[ECRITURE]`.

## Prochaine étape exacte
Lancer un Test 3 réel de `/create_agent` en mode conversion pour valider le comportement de la version réécrite, ou trancher P7-P10 restantes.

## Question bloquante pour la session suivante
Aucune

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
