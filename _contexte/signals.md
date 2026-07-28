# Signals — claude-vibecoding-kit (MAJ 2026-07-28)

## Actions ouvertes
- [P1|ouvert] Test 3 réel de `/create_agent` en mode conversion, sur la version réécrite (phases ancrées). Aucun test n'a encore exercé cette branche telle qu'écrite : l'agent `design` (jeu_zombies) était un cas de conversion mais traité manuellement, pas via la procédure. fait quand: `/create_agent` lancée sur un alias déjà enregistré et le comportement conforme à `[PREFLIGHT]`/`[ECRITURE]` (pas de modif `zones.md`/`signals.md` existant) vérifié en conditions réelles. réf: `.claude/commands/create_agent.md`, `TEST_CREATE_AGENT_RESULTS.md`
- [P2|ouvert] Propositions P7-P10 sur `/create_agent`/`agent_role.md` restant à trancher (P11/P12/P13 implémentées le 2026-07-26) : P7 (partiellement couvert par l'analyse stack conditionnelle, à confirmer sur Test 3), P8 (garde-fou d'écriture, non spécifiable en l'état), P9 (charte comme prompt de spécialisation), P10 (apprentissage automatique des agents, tension avec la règle mémoire). fait quand: chaque proposition tranchée (retenue/écartée), implémentée si retenue. réf: `ameliorations_create_agent.md`
- [P2|ouvert] Décider quelles propositions des Lots 2-4 de `base_connaissances/PROPOSITIONS_AMELIORATION.md` mettre en œuvre (Lot 1 clos). Lot 3 = 1.4+2.2, 1.5, 1.6 ; Lot 4 = 2.1, 2.3, 3.2-A, 3.4. fait quand: décision actée pour chaque proposition restante, implémentée si retenue. réf: `base_connaissances/PROPOSITIONS_AMELIORATION.md`
- [P2|ouvert] `jeu_zombies` (déployé v2.26, `D:\ServOMorph\jeu_zombies`) en retard sur le kit (v3.1) — n'a pas encore la section "Tests manuels" ni "Déclencheurs de vérification" de `CLAUDE.md`. Propagation reportée par l'utilisateur le 2026-07-28. fait quand: `/update` lancé sur jeu_zombies et `.claude/CLAUDE.md` du projet reflète le contenu v3.1. réf: `DEPLOYMENTS.md`, `.claude/CLAUDE.md`

## Contexte chaud
- Kit en v3.1 (bump minor). `CLAUDE.md` (kit + template) : nouvelle section "Tests manuels" (`tests_manuels.md` racine projet, file d'attente exhaustive des contrôles manuels non validés, chemin relatif générique — pas de chemin absolu projet-spécifique dans le template) + nouvelle sous-section "Déclencheurs de vérification" sous "Honnêteté" (nommer un fichier = l'avoir lu dans la session ; chiffres de `signals.md`/`contexte.md` datés, à revérifier ; vocabulaire de vérification réservé à un appel d'outil réel ; question plutôt qu'affirmation d'absence).
- Ces règles de vérification font suite à une erreur en session : affirmation que jeu_zombies n'était pas dans `DEPLOYMENTS.md` sans avoir lu le fichier — faux, il y est (v2.26). Corrigé, règle ajoutée pour éviter la récidive.
- `README.md` : ligne `/doc_sync` ajoutée dans "Ce que ça fait" (omission préexistante comblée).
- `processus-base-connaissances-markdown.md` : fichier vide non tracké, origine inconnue, toujours pas clarifié.
- `README.md` : corruption d'encodage pré-existante (double UTF-8) — à traiter si gênant.

## Dernière session (2026-07-28)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->

# Session du 2026-07-28

## Décisions prises
- README.md : ligne `/doc_sync` ajoutée dans "Ce que ça fait" (omission préexistante comblée).
- Nouvelle section "Tests manuels" dans `CLAUDE.md` (kit + template) : chemin relatif générique `tests_manuels.md`, décision utilisateur après signalement que le chemin absolu jeu_zombies proposé cassait la généricité du template.
- Nouvelle sous-section "Déclencheurs de vérification" dans `CLAUDE.md` (kit + template), suite à une affirmation non vérifiée en session (jeu_zombies déclaré absent de `DEPLOYMENTS.md` sans l'avoir lu).
- Kit bumpé en v3.1.

## Livrables produits ou modifiés
- `README.md` : ligne `/doc_sync` ajoutée.
- `.claude/CLAUDE.md`, `templates/.claude/CLAUDE.md` : sections "Tests manuels" + "Déclencheurs de vérification" ajoutées (miroir vérifié identique).
- `CHANGELOG.md`, `Protocole_start_close_context.md` : entrées v3.1.
- `/doc_sync` exécuté deux fois dans la session, aucun conflit ni asymétrie détecté.

## Hypothèses validées / invalidées
- INVALIDE : affirmation "jeu_zombies n'est pas dans `DEPLOYMENTS.md`" — faux, il y figure (v2.26) ; fichier non lu avant l'affirmation. Corrigé par les nouvelles règles de vérification.

## Prochaine étape exacte
`/update` sur jeu_zombies pour le faire passer de v2.26 à v3.1, reporté par l'utilisateur.

## Question bloquante pour la session suivante
Aucune

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
