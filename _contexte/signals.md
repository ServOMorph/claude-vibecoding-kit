# Signals — claude-vibecoding-kit (MAJ 2026-07-31 ter)

## Actions ouvertes
- [P1|ouvert] `/init_projet` ne gère pas `GEMINI.md` (équivalent CLAUDE.md pour Gemini) — seulement `AGENTS.md`. Demandé explicitement lors de l'init d'Open_Code_Apprentissage, créé manuellement hors procédure standard. fait quand: `/init_projet` propose la création de `GEMINI.md` au même titre que `AGENTS.md` (question dédiée ou fusionnée), template ajouté sous `templates/`. réf: `.claude/commands/init_projet.md`, `D:\ServOMorph\Open_Code_Apprentissage\GEMINI.md`
- [P2|ouvert] Trancher les points ouverts de `note_conception_pause_agents.md` (position exacte dans `/init_projet`, contenu de la question, enchaînement ou non sur `/create_agent`, persistance de l'échange, articulation avec Q5) puis implémenter si retenu. Cadrage initial acté le 2026-07-31 : nouvelle étape dans `/init_projet` (pas `/create_agent`), déclenchement systématique, cette note est un document seul, aucune implémentation faite. fait quand: chaque point tranché, `/init_projet` modifié si retenu. réf: `note_conception_pause_agents.md`
- [P1|ouvert] Tester en conditions réelles la base de connaissances `DOCUMENTATION/` : étape 7 de `/close` (template, proposition conditionnelle), question AGENTS.md de `/update`/`/init_projet`. Aucun des deux n'a encore tourné réellement — implémentation faite sur analyse de code, pas exercée. fait quand: un `/close` sur une zone de Moulin du Sud (autre que `documentation`) déclenche l'étape 7 comme prévu, et un `/update`/`/init_projet` réel pose la question AGENTS.md. réf: `templates/.claude/commands/close.md`, `.claude/commands/update.md`, `.claude/commands/init_projet.md`
- [P1|ouvert] Test 3 réel de `/create_agent` en mode conversion, sur la version réécrite (phases ancrées). Aucun test n'a encore exercé cette branche telle qu'écrite : l'agent `design` (jeu_zombies) était un cas de conversion mais traité manuellement, pas via la procédure. fait quand: `/create_agent` lancée sur un alias déjà enregistré et le comportement conforme à `[PREFLIGHT]`/`[ECRITURE]` (pas de modif `zones.md`/`signals.md` existant) vérifié en conditions réelles. réf: `.claude/commands/create_agent.md`, `TEST_CREATE_AGENT_RESULTS.md`
- [P2|ouvert] Tester l'étape 10 de `/create_agent` (message presse-papier pour l'agent racine, ajoutée le 2026-07-31) via un appel réel de la commande — cette session, le message a été généré et copié manuellement (`Set-Clipboard`) hors du flux de la commande, jamais via `[SORTIE]` tel qu'écrit. fait quand: `/create_agent` lancée en conditions réelles, question presse-papier posée et exécutée par la commande elle-même. réf: `.claude/commands/create_agent.md` (étape 10)
- [P2|ouvert] Tester le renommage automatique du dossier d'agent en mode conversion (règle MAJUSCULES ajoutée le 2026-07-30) : aucun agent existant actuellement en minuscules pour exercer cette branche. fait quand: `/create_agent` lancée en mode conversion sur un dossier à la casse non conforme, renommage + mise à jour de `zones.md` vérifiés en conditions réelles. réf: `.claude/commands/create_agent.md`, `ameliorations_create_agent.md`
- [P2|ouvert] Propositions P7-P10 sur `/create_agent`/`agent_role.md` restant à trancher (P11/P12/P13 implémentées le 2026-07-26) : P7 (partiellement couvert par l'analyse stack conditionnelle, confirmé sur l'agent `explo` et l'agent `editeur`), P8 (garde-fou d'écriture, non spécifiable en l'état), P9 (charte comme prompt de spécialisation), P10 (apprentissage automatique des agents, tension avec la règle mémoire). fait quand: chaque proposition tranchée (retenue/écartée), implémentée si retenue. réf: `ameliorations_create_agent.md`
- [P2|ouvert] Décider quelles propositions des Lots 2-4 de `base_connaissances/PROPOSITIONS_AMELIORATION.md` mettre en œuvre (Lot 1 clos). Lot 3 = 1.4+2.2, 1.5, 1.6 ; Lot 4 = 2.1, 2.3, 3.2-A, 3.4. fait quand: décision actée pour chaque proposition restante, implémentée si retenue. réf: `base_connaissances/PROPOSITIONS_AMELIORATION.md`
- [P2|ouvert] `jeu_zombies` (déployé v2.26, `D:\ServOMorph\jeu_zombies`) en retard sur le kit (v3.5) — n'a pas encore la section "Tests manuels" ni "Déclencheurs de vérification" de `CLAUDE.md`, ni la base de connaissances. Propagation reportée par l'utilisateur le 2026-07-28. fait quand: `/update` lancé sur jeu_zombies et `.claude/CLAUDE.md` du projet reflète le contenu à jour. réf: `DEPLOYMENTS.md`, `.claude/CLAUDE.md`

## Contexte chaud
- Kit en v3.5 (bump minor). `/create_agent` : nouvelle étape `[SORTIE]` (10) proposant de copier dans le presse-papier un message de mise à jour pour l'agent racine du projet cible (jamais écrit dans les fichiers du projet cible) — demande explicite de l'utilisateur après une première tentative d'écriture directe dans `signals.md`, annulée. Récapitulatif final renuméroté 10→11, `[AUDIT]` 11→12.
- Agents `dev`/`design` créés dans `jeu_espace` (projet externe) via `/create_agent`, en lot : `dev` étendu au code Godot racine (scripts/, scenes/, project.godot), `design` restreint à son propre dossier.
- `AGENTS.md` introduit comme équivalent `CLAUDE.md` pour agents non-Claude (Codex, ChatGPT, Gemini) — jamais créé automatiquement, toujours sur confirmation explicite (`/init_projet` Q7, `/update` étape 7), jamais écrasé s'il existe déjà.
- `/create_agent` : dossier de l'agent (créé ou converti) normalisé en MAJUSCULES pour la reconnaissance visuelle ; alias de zone toujours en minuscules. Testé en mode création sur plusieurs projets — pas encore testé en mode conversion (renommage d'un dossier existant).
- `README.md` : corruption d'encodage pré-existante (double UTF-8) — à traiter si gênant.

## Dernière session (2026-07-31)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->

# Session du 2026-07-31 (étape presse-papier /create_agent + agents dev/design jeu_espace)

## Décisions prises
- `/create_agent` : nouvelle étape `[SORTIE]` proposant de copier dans le presse-papier un message de mise à jour pour l'agent racine, plutôt que de l'écrire dans `signals.md` du projet cible (demande explicite de l'utilisateur, revert de la première approche).
- Agents `dev`/`design` créés dans jeu_espace (projet externe), question groupée sur le périmètre d'écriture (dev étendu au code Godot racine, design restreint à son dossier).
- Kit bumpé en v3.5 (minor) via `/doc_sync`.

## Livrables produits ou modifiés
- `.claude/commands/create_agent.md` : étape 10 (presse-papier) ajoutée, renumérotation 10→11/11→12.
- `CHANGELOG.md`, `Protocole_start_close_context.md` : entrées v3.5 ajoutées (miroir vérifié).
- `ameliorations_create_agent.md` : entrée agents dev/design (jeu_espace).
- `AGENTS_REGISTRY.md` (hors git) : entrées dev/design ajoutées.
- Hors dépôt kit (jeu_espace) : agents `dev`/`design` créés (agent_role.md + `_contexte/`), `zones.md` mis à jour ; modification initiale de `_contexte/signals.md` (message pour l'orchestrateur) annulée sur demande utilisateur.

## Hypothèses validées / invalidées
- VALIDE : l'ajout de l'étape presse-papier n'a pas nécessité de bump major (structure `_contexte/` inchangée).
- EN ATTENTE : l'étape 10 n'a jamais été exercée via un appel réel de `/create_agent` — message généré et copié manuellement, hors du flux de la commande.

## Prochaine étape exacte
Tester l'étape 10 (presse-papier) lors d'un prochain appel réel de `/create_agent` ; trancher les actions P1 en attente (GEMINI.md, test réel base de connaissances, Test 3 conversion).

## Question bloquante pour la session suivante
Aucune

# Session du 2026-07-31 (init jeu_espace + rattrapage commits)

## Décisions prises
- `/init_projet` exécuté sur `D:\ServOMorph\jeu_espace` (zone `orchestrateur`, repo sous git, `AGENTS.md` créé sur confirmation) d'après `_DOCS/idée de base.txt`.
- Corruption accidentelle (`" pl"` parasite avant un commentaire) corrigée dans `.claude/commands/create_agent.md`, détectée lors du contrôle `git status` avant clôture.
- Décision utilisateur : inclure dans le commit de clôture les changements non commités de sessions antérieures (`ameliorations_create_agent.md`, `note_conception_pause_agents.md`) plutôt que les laisser en suspens.

## Livrables produits ou modifiés
- Hors dépôt kit (`jeu_espace`) : `.claude/CLAUDE.md`, `.claude/zones.md`, `.claude/commands/start.md`, `.claude/commands/close.md`, `_contexte/contexte.md`, `_contexte/signals.md`, `ollama_call.py`, `_docs/protocole_vibecoding.md`, `AGENTS.md`. Commit initial fait dans ce repo.
- `DEPLOYMENTS.md` (hors git) : entrée ajoutée pour jeu_espace / orchestrateur / v3.3.
- `.claude/commands/create_agent.md` : corruption corrigée.
- `ameliorations_create_agent.md`, `note_conception_pause_agents.md` : commités cette session (contenu de sessions antérieures, non modifié).
- `CHANGELOG.md` : entrée v3.4.

## Hypothèses validées / invalidées
- EN ATTENTE : gap `GEMINI.md` (action P1) toujours ouvert, non retraité — jeu_espace n'en avait pas besoin.
- INVALIDE : les clôtures précédentes n'avaient pas réellement tout commité malgré leur message — `create_agent.md`/`ameliorations_create_agent.md` restaient en souffrance.

## Prochaine étape exacte
Sur jeu_espace : décider si `/create_agent` est lancé pour `codeur` et `design`. Sur le kit : surveiller les résidus non commités aux prochaines clôtures.

## Question bloquante pour la session suivante
Aucune

# Session du 2026-07-31 (init Open_Code_Apprentissage)

## Décisions prises
- `/init_projet` exécuté sur `D:\ServOMorph\Open_Code_Apprentissage` (zone `orchestrateur`, repo déjà sous git) — reformulation + questions préalables avant lancement, conformément à la demande explicite de l'utilisateur dans le fichier `but du projet.txt` du projet cible.
- 3 agents validés pour ce projet après discussion (pas de création lancée cette session) : `notes`, `NARRATEUR`, `data`.
- `GEMINI.md` créé manuellement sur demande explicite, hors procédure standard `/init_projet` (qui ne gère qu'`AGENTS.md`) — gap consigné en action ouverte.

## Livrables produits ou modifiés
- Hors dépôt kit (`Open_Code_Apprentissage`) : `.claude/CLAUDE.md`, `.claude/zones.md`, `.claude/commands/start.md`, `.claude/commands/close.md`, `_contexte/contexte.md`, `_contexte/signals.md`, `ollama_call.py` (modèle par défaut `gemma4:12b`), `AGENTS.md`, `GEMINI.md`, `_DOCS/protocole_vibecoding.md`. Commit initial fait dans ce repo.
- `DEPLOYMENTS.md` (hors git) : entrée ajoutée pour Open_Code_Apprentissage / orchestrateur / v3.3.
- `README.md` : section "État actuel" corrigée — restait bloquée à v3.2, ne mentionnait pas les ajouts v3.3 (base de connaissances, AGENTS.md) de la session précédente. Correction documentaire, pas de bump (aucun template/commande déployé modifié).
- Aucun fichier de commande/template du kit modifié cette session.

## Hypothèses validées / invalidées
- VALIDE : la procédure de reformulation + questions avant lancement (demandée par l'utilisateur pour ce projet précis) s'intègre sans friction dans `/init_projet` tel qu'il existe.
- EN ATTENTE : la pause de réflexion sur le nombre d'agents avant `/create_agent` n'est pour l'instant qu'un pattern ad hoc suivi manuellement dans cette session, pas une étape formalisée du kit.

## Prochaine étape exacte
Sur Open_Code_Apprentissage : lancer `/create_agent` pour les 3 agents validés (notes, NARRATEUR, data). Sur le kit : session dédiée pour formaliser GEMINI.md dans `/init_projet` et documenter le pattern "pause réflexion agents".

## Question bloquante pour la session suivante
Aucune

# Session du 2026-07-30 (base de connaissances)

## Décisions prises
- Système de base de connaissances `.md` (pattern "progressive disclosure" : `INDEX.md` catalogue + docs individuels, jamais de suppression, archivage à la place) validé — d'abord implémenté dans Moulin du Sud (agent `documentation`), puis généralisé au kit.
- `/close` (template) : nouvelle étape 7 conditionnelle proposant une entrée/MAJ dans `DOCUMENTATION/` en fin de session, jamais automatique (confirmation utilisateur requise, la zone fermée n'a pas la main sur le dossier d'une autre zone).
- `AGENTS.md` introduit comme équivalent `CLAUDE.md` pour agents non-Claude — jamais créé automatiquement : `/init_projet` (Q7) et `/update` (étape 7) posent la question à chaque fois, sautée en mode batch, jamais écrasé s'il existe déjà.
- Kit bumpé en v3.3.

## Livrables produits ou modifiés
- `templates/.claude/commands/close.md` : étape 7 (base de connaissances), renumérotation 8→13.
- `templates/.claude/CLAUDE.md`, `.claude/CLAUDE.md` (Moulin du Sud) : section "Base de connaissances" ajoutée.
- `templates/AGENTS.md` : nouveau template.
- `.claude/commands/init_projet.md` : Q7 + copie conditionnelle `AGENTS.md`.
- `.claude/commands/update.md` : étape 7 (AGENTS.md optionnel, jamais écrasé), renumérotation 8→11.
- `ameliorations_create_agent.md`, `AGENTS_REGISTRY.md` (hors git) : entrée agent `documentation`.
- Hors dépôt kit (Moulin du Sud) : agent `documentation` créé (`agent_role.md`, `_contexte/`, `DOCUMENTATION/INDEX.md`), `AGENTS.md` créé, `.claude/close.md`/`CLAUDE.md` alignés sur le kit.

## Hypothèses validées / invalidées
- VALIDE (recherche web/GitHub) : la progressive disclosure (`INDEX.md` + docs ciblés) est le pattern documenté en 2026 pour ce cas d'usage, cohérent avec le principe déjà appliqué par `signals.md`/`contexte.md`.
- EN ATTENTE : aucun test réel — `DOCUMENTATION/INDEX.md` de Moulin du Sud est vide, l'étape 7 de `/close` et la question AGENTS.md de `/update`/`/init_projet` n'ont jamais tourné en conditions réelles.

## Prochaine étape exacte
Remplir `DOCUMENTATION/` de Moulin du Sud via `/start documentation` ; tester `/close` sur une autre zone de Moulin du Sud pour valider l'étape 7 en conditions réelles.

## Question bloquante pour la session suivante
Aucune

# Session du 2026-07-30 (agents MAJUSCULES)

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
