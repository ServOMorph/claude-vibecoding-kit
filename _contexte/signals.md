# Signals — claude-vibecoding-kit (MAJ 2026-07-30)

## Actions ouvertes
- [P1|ouvert] Test 3 réel de `/create_agent` en mode conversion, sur la version réécrite (phases ancrées). Aucun test n'a encore exercé cette branche telle qu'écrite : l'agent `design` (jeu_zombies) était un cas de conversion mais traité manuellement, pas via la procédure. fait quand: `/create_agent` lancée sur un alias déjà enregistré et le comportement conforme à `[PREFLIGHT]`/`[ECRITURE]` (pas de modif `zones.md`/`signals.md` existant) vérifié en conditions réelles. réf: `.claude/commands/create_agent.md`, `TEST_CREATE_AGENT_RESULTS.md`
- [P2|ouvert] Tester le renommage automatique du dossier d'agent en mode conversion (règle MAJUSCULES ajoutée le 2026-07-30) : aucun agent existant actuellement en minuscules pour exercer cette branche. fait quand: `/create_agent` lancée en mode conversion sur un dossier à la casse non conforme, renommage + mise à jour de `zones.md` vérifiés en conditions réelles. réf: `.claude/commands/create_agent.md`, `ameliorations_create_agent.md`
- [P2|ouvert] Propositions P7-P10 sur `/create_agent`/`agent_role.md` restant à trancher (P11/P12/P13 implémentées le 2026-07-26) : P7 (partiellement couvert par l'analyse stack conditionnelle, confirmé sur l'agent `explo` et l'agent `editeur`), P8 (garde-fou d'écriture, non spécifiable en l'état), P9 (charte comme prompt de spécialisation), P10 (apprentissage automatique des agents, tension avec la règle mémoire). fait quand: chaque proposition tranchée (retenue/écartée), implémentée si retenue. réf: `ameliorations_create_agent.md`
- [P2|ouvert] Décider quelles propositions des Lots 2-4 de `base_connaissances/PROPOSITIONS_AMELIORATION.md` mettre en œuvre (Lot 1 clos). Lot 3 = 1.4+2.2, 1.5, 1.6 ; Lot 4 = 2.1, 2.3, 3.2-A, 3.4. fait quand: décision actée pour chaque proposition restante, implémentée si retenue. réf: `base_connaissances/PROPOSITIONS_AMELIORATION.md`
- [P2|ouvert] `jeu_zombies` (déployé v2.26, `D:\ServOMorph\jeu_zombies`) en retard sur le kit (v3.2) — n'a pas encore la section "Tests manuels" ni "Déclencheurs de vérification" de `CLAUDE.md`. Propagation reportée par l'utilisateur le 2026-07-28. fait quand: `/update` lancé sur jeu_zombies et `.claude/CLAUDE.md` du projet reflète le contenu v3.2. réf: `DEPLOYMENTS.md`, `.claude/CLAUDE.md`

## Contexte chaud
- Kit en v3.2 (bump minor). `/create_agent` : dossier de l'agent (créé ou converti) normalisé en MAJUSCULES pour la reconnaissance visuelle ; alias de zone toujours en minuscules. Testé en mode création sur l'agent `editeur` (crea_zik) — pas encore testé en mode conversion (renommage d'un dossier existant).
- `processus-base-connaissances-markdown.md` : fichier vide non tracké, origine inconnue, toujours pas clarifié.
- `README.md` : corruption d'encodage pré-existante (double UTF-8) — à traiter si gênant.

## Dernière session (2026-07-30)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->

# Session du 2026-07-30

## Décisions prises
- `/create_agent` : dossier de l'agent (créé ou converti) normalisé en MAJUSCULES pour la reconnaissance visuelle dans l'arborescence ; l'alias de zone reste en minuscules.
- Mode conversion : si le dossier existant a une casse non conforme, il est renommé (`git mv` si suivi par git) et le chemin mis à jour dans `zones.md` (alias inchangé).
- Kit bumpé en v3.2.

## Livrables produits ou modifiés
- `.claude/commands/create_agent.md` : règle MAJUSCULES ajoutée en [PREFLIGHT], cas de renommage documenté en [ECRITURE] (mode conversion).
- `ameliorations_create_agent.md` : entrée 2026-07-30 (agent `editeur`, crea_zik) — premier test de la règle en mode création.
- Agent `editeur` créé dans `D:\ServOMorph\crea_zik\EDITEUR` (hors dépôt kit), périmètre étendu à `frontend/`/`backend/` sur décision utilisateur.
- `AGENTS_REGISTRY.md` (hors git) : entrée `editeur`.
- `CHANGELOG.md`, `Protocole_start_close_context.md`, `README.md` : synchronisés via `/doc_sync`.

## Hypothèses validées / invalidées
- VALIDE : la règle MAJUSCULES fonctionne en mode création (dossier `EDITEUR` créé directement en majuscules, alias `editeur` dérivé correctement).
- EN ATTENTE : le renommage en mode conversion (dossier existant à la casse non conforme) n'a pas été exercé en conditions réelles — aucun agent minuscule actuel à convertir.

## Prochaine étape exacte
Tester le renommage en mode conversion dès qu'un agent existant à la casse non conforme se présente ; sinon trancher les actions P2 en attente (P7-P10, Lots 2-4, jeu_zombies).

## Question bloquante pour la session suivante
Aucune

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
