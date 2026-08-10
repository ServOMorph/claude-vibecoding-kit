# Améliorations — /create_agent

Journal des frictions et améliorations de la commande `/create_agent` et de la charte `agent_role.md`.
Sortie concrète de l'étape [ECRITURE] de la commande et des rétrospectives de `roadmap_agents.md` (décision 6 du cadrage).

## Propositions ouvertes

- P7 — Enrichir la sous-étape stack pour produire un `contexte.md` réellement pertinent (au-delà
  du stub générique). Partiellement couvert depuis la révision du 2026-07-26 de `create_agent.md`
  (analyse conditionnelle du projet cible), à confirmer sur un prochain test.
- P8 — Garde-fou d'écriture hors dossier : non spécifiable en l'état (pas de portée technique sans
  hook/permission OS), contredirait le périmètre déclaratif. À reclarifier avant tout chiffrage.
- P9 (hors périmètre) — `agent_role.md` comme prompt de spécialisation (tokens, alignement,
  efficacité). Session de conception dédiée.
- P10 (hors périmètre) — Apprentissage automatique des agents au fil de l'usage ; tension directe
  avec la règle du kit (mémoire jamais écrite automatiquement). À concevoir séparément si retenu.
- P11 — [Implémentée le 2026-07-26] `{{ALIAS_RACINE}}` : la commande ne retient plus la première
  ligne de `zones.md` par défaut, seulement si elle correspond effectivement à la racine du projet.
- P12 — [Implémentée le 2026-07-26] Mode conversion explicite pour une zone déjà enregistrée
  (charte seule, sans toucher `zones.md`/`_contexte/` existants) — intégré à l'étape [PREFLIGHT]/[ECRITURE].
- P13 — [Implémentée le 2026-07-26] Analyse du projet cible pour `{{STACK}}`, désormais conditionnée
  au mode et à l'état de `contexte.md` (évite le scan systématique en conversion).

## Historique

## 2026-08-10 — agent review (D:\ServOMorph\jeu_zombies)

Création de l'agent REVIEW (revue de code continue, sans production de code), mode création simple,
alias `review` absent de `zones.md`. `{{ALIAS_RACINE}}` correct (première ligne de `zones.md` =
`jeu_zombies`, vraie racine). `start.md` de jeu_zombies charge déjà `agent_role.md` (pas de warning).
Périmètre par défaut (REVIEW/ uniquement, pas d'extension). Stack filtrée sur le rôle : Godot 4.5,
GDScript typé, `check.py` (QA), dossier `tests/`, roadmaps actives en référence.

## 2026-08-02 — agent opencode (D:\ServOMorph\Roberto)

Création de l'agent OPENCODE (orchestrer les tâches déléguées à l'outil OpenCode), mode création
simple, alias absent de `zones.md`. `{{ALIAS_RACINE}}` correct (première ligne de `zones.md` =
`roberto`, vraie racine). `start.md` de Roberto charge déjà `agent_role.md` (pas de warning).

Friction (pas nouvelle, P1) : rôle initial fourni dans l'argument de la commande formulé de façon
circulaire ("gérer l'agent OPENCODE"), reformulé sur question explicite vers le rôle durable réel.

`{{STACK}}` : projet Roberto (Macrodesk, app Python de macros clavier/souris) sans rapport
technique avec le rôle de l'agent (orchestration d'un outil externe, OpenCode) — aucune information
exploitable trouvée pour filtrer par rôle, "Hérite de la stack du projet parent." signalé tel quel.

## 2026-08-01 — agent orchestrateur (SérénIATech_dev)

Création d'une zone-agent à la **racine du projet** (l'agent EST la zone racine, pas un
sous-dossier) — cas de figure : conversion de la racine en agent orchestrateur. Traité en
procédure manuelle sur place : `agent_role.md` à la racine, `_contexte/` racine complété
(objectif + stack), alias `orchestrateur` ajouté dans `zones.md` pointant vers la racine,
ligne "Zone parente" supprimée (pas de parent : l'agent est la racine elle-même).

Périmètre : recommandation "racine + Orga/" retenue (équilibre entre efficacité et respect
des périmètres des zones-agents). `start.md` du projet chargeait déjà `agent_role.md` (étape 2b)
— aucune modification nécessaire. Friction notée : `{{DOSSIER_AGENT}}`/`{{ALIAS_RACINE}}` du
template pensés pour un sous-dossier, non adaptés au cas "agent = racine".

## 2026-07-31 — agents dev, design (jeu_espace)

Deuxième création en lot de plusieurs agents dans un même appel (après notes/narrateur/data).
Mode création simple pour les 2, alias absents de `zones.md`, alias racine correct
(`orchestrateur`, première ligne de `zones.md` = racine réelle du projet, vérifié).

Périmètre : question groupée unique posée pour les 2 agents (une sous-question par agent,
un seul appel) plutôt que 2 questions séparées — réponse : `dev` étendu aux dossiers de code
Godot à la racine (scripts/, scenes/, project.godot — aucun de ces dossiers n'existe encore,
extension déclarative anticipée), `design` restreint au périmètre par défaut.

`{{STACK}}` filtré par rôle à partir de `_contexte/contexte.md` de la zone racine et de
`_DOCS/idée de base.txt` (pas de `project.godot` ni de `README.md` à la racine du projet à ce
stade) : bloc technique (Godot 4, résolution, contrôle caméra, mécaniques cockpit/coupole,
orbite) pour `dev` ; bloc visuel (assets 2D Codex, low poly, environnement réaliste, coupole)
pour `design` — deux blocs distincts plutôt que le même stack brut pour les deux agents.

## 2026-07-31 — agents notes, narrateur, data (Open_Code_Apprentissage)

Première création en lot de 3 agents dans un même appel (jusqu'ici toujours un agent par
session). Mode création simple pour les 3, alias absents de `zones.md`, alias racine correct
(`orchestrateur`, première ligne de `zones.md` = racine réelle du projet). Rôles déjà validés
avec l'utilisateur en amont (décision consignée dans `contexte.md` de la zone orchestrateur
avant même l'appel de `/create_agent`) — aucune reformulation nécessaire à [COLLECTE].

Périmètre : question groupée unique posée pour les 3 agents à la fois plutôt que 3 questions
séparées (économie de tokens) — réponse : périmètre par défaut pour les 3, aucune extension.

`{{STACK}}` limité : projet jeune, pas de README ni de fichier de config type `package.json`
à la racine, seul `ollama_call.py` exploitable. Bloc stack réduit à "Python, Ollama local
(gemma4:12b) via ollama_call.py à la racine" plutôt que le stub générique "Hérite de la stack
du projet parent" — jugé plus utile pour l'agent `data` en particulier.

Anomalie hors périmètre de la commande, signalée mais non corrigée ici : `signals.md` de la
zone orchestrateur et `.claude/CLAUDE.md` du projet affirment que `ollama_call.py` utilise
`gemma4:e4b` par défaut ; le code réel (ligne 17) utilise `gemma4:12b`. Renvoyé à l'action P3
déjà ouverte dans `signals.md` de la zone orchestrateur.

## 2026-07-30 — agent documentation (crea_zik)
Création directe, sans friction. Rôle durable clair dès la demande initiale (doc du projet, priorité inventaire des styles musicaux en lien avec l'éditeur). Périmètre resserré à `DOCUMENTATION/` uniquement sur choix explicite de l'utilisateur, malgré la présence d'un `_docs/` existant à la racine — signalé dans `contexte.md` comme référence hors périmètre d'écriture. `{{ALIAS_RACINE}}` correctement résolu (`crea_zik`, première ligne de `zones.md` = racine du projet).

## 2026-07-21 — Rétrospective Phases 1-3 (bootstrap, agents COM + MEMORY de robert-ia)

### Constat central
La commande `/create_agent` n'a jamais été exécutée. Les agents COM et MEMORY ont été créés
manuellement en Phase 2, avant que la commande existe (Phase 3). Le template est donc validé sur
le principe, pas sur l'exécution end-to-end. Validation réelle = créer un 3e agent avec la commande.

### Frictions observées (création manuelle)
- Conflit périmètre/rôle (MEMORY) : rôle = ajuster le contexte de robert (code dans `backend/`),
  charte par défaut interdit `backend/`. Détecté en cours de route, résolu par pivot manuel
  (prompt de passation `MEMORY/prompt_multi_contexte_knowledge.md`).
- Charte trop centrée sur la tâche (COM) : premier jet = tâche WhatsApp ; corrigé vers le rôle
  durable (com générale). L'étape 1 capte le besoin immédiat, pas le rôle pérenne.
- Incohérence cosmétique : template mentionne `AGENTS.md/CLAUDE.md`, instances `AGENTS.md` seul.

### Propositions
- P1 [retenue] — Étape 1 : distinguer rôle durable / tâche courante dans la question posée.
- P2 [retenue] — Étape 1 : demander si l'agent doit écrire hors de son dossier (code applicatif),
  répercuter dans `Peut écrire`/`Ne doit pas toucher` de la charte.
- P3 [retenue] — Créer un agent test end-to-end avec la commande (valide l'étape 10).
- P4 [écartée] — `contexte.md` dédié agent : faible valeur, différé.
- P5 [retenue] — Corriger l'incohérence `AGENTS.md/CLAUDE.md` du template (trivial).

### État d'implémentation (2026-07-21)
- P1 implémentée : étape 1 de `create_agent.md` capte le rôle **durable**, rejette une formulation
  en tâche unique.
- P2 implémentée : étape 1 demande si l'agent écrit hors de son dossier ; nouveau placeholder
  `{{ECRITURE_ETENDUE}}` dans `agent_role_TEMPLATE.md` (ligne `Peut écrire`) + tableau de
  substitution étape 5.
- P3 retenue mais non exécutée cette session (validation end-to-end reportée).
- P5 abandonnée à l'implémentation : sans objet. Le template est générique, `AGENTS.md/CLAUDE.md`
  (les deux cas possibles) est correct ; l'incohérence était côté instance robert-ia, pas côté template.

## 2026-07-21 — agent web (La Rev) — premier test end-to-end réel (P3)

Détail complet du déroulé dans `TEST_CREATE_AGENT_RESULTS.md` (Test 1). Ce qui a bien fonctionné :
la commande, réécrite pour prendre un projet cible en argument et s'exécuter toujours depuis le
kit, résout correctement un projet externe, vérifie l'unicité de l'alias, écrit l'arborescence et
enregistre la zone.

Frictions marquantes de ce premier run réel :
- `create_agent.md` (kit) prenait en argument uniquement `<dossier> [rôle]`, en supposant une
  exécution depuis le projet cible. Réécrite pour accepter `<chemin_projet_cible> <dossier>
  [rôle]` et s'exécuter depuis le kit — décision utilisateur : la commande ne doit jamais être
  copiée dans les projets cibles. La copie miroir `templates/.claude/commands/create_agent.md`
  (destinée à l'usage local) a été supprimée en conséquence, `doc_sync.md`/`update.md` mis à jour.
- `agent_role_TEMPLATE.md` ne mentionnait pas explicitement le droit d'écrire dans son propre
  `_contexte/`, alors que ce cycle est nécessaire à `/start`/`/close`. Ligne ajoutée au template.
- **Friction majeure** : le bénéfice principal de la charte (chargement automatique par `/start`,
  décision 4 du cadrage) est silencieusement absent si le projet cible n'a pas reçu `/update`
  depuis la Phase 3 du kit (étape 2b de `start.md`). `/create_agent` ne le vérifie pas. Constaté
  concrètement sur La Rev (kit v2.13) : `/start web` n'affichait pas la charte. Corrigé en
  lançant `/update` sur La Rev avant de retester — fonctionne après coup.
- Le `contexte.md` généré par le template reste un stub générique ; une vraie valeur nécessite une
  analyse manuelle du projet cible (faite hors procédure sur demande explicite pour cet agent).

Propositions ouvertes (non implémentées, à trancher dans une session dédiée) :
- P6 — `/create_agent` devrait vérifier que le projet cible a un `start.md` à jour (étape 2b
  présente) avant de créer l'agent, ou au minimum avertir si ce n'est pas le cas.
- P7 — Enrichir l'étape 5 d'une sous-étape d'analyse du projet cible pour produire un `contexte.md`
  réellement pertinent, au lieu du stub générique actuel.
- P8 — Mécanisme de garde-fou pour l'écriture hors dossier : validation écrite dans un fichier
  tenu en lecture seule pour le LLM, plutôt que la simple liste de chemins actuelle
  (`{{ECRITURE_ETENDUE}}`). Idée soulevée par l'utilisateur, non spécifiée.
- P9 (hors périmètre de `/create_agent`) — Travail dédié sur `agent_role.md` comme "prompt de
  spécialisation" de l'agent (au-delà du champ Rôle), testé sur trois axes : économie de tokens,
  alignement, rapidité/efficacité.
- P10 (hors périmètre) — Idée d'un système d'apprentissage automatique des agents au fil de leur
  usage (accès à `/create_memory` ou équivalent) ; tension avec la règle actuelle du kit
  (mémoire jamais écrite automatiquement, uniquement via `/create_memory` déclenché par
  l'utilisateur). À concevoir séparément si retenu.

### Arbitrage du 2026-07-21 sur P6-P10
P6 retenue et implémentée immédiatement (faible effort, risque faible, corrige directement la
friction majeure observée). P7 retenue mais différée (valeur moyenne, alourdit chaque création).
P8 non spécifiable en l'état : un fichier "lecture seule pour le LLM" n'a pas de portée technique
réelle sans hook/permission OS, ce qui contredirait la décision 5 du cadrage (périmètre déclaratif,
pas isolé) — à clarifier avant tout chiffrage. P9 et P10 renvoyées à des sessions de conception
dédiées, hors périmètre incrémental de `/create_agent` (P10 entre en tension directe avec la règle
du kit sur la mémoire jamais écrite automatiquement).

- P6 [implémentée] — `create_agent.md` (kit) : nouvelle étape 2b, vérifie que
  `<projet_cible>/.claude/commands/start.md` contient le chargement automatique de la charte avant
  de créer l'agent ; sinon avertit et demande confirmation explicite plutôt que de créer
  silencieusement un agent inopérant.

## 2026-07-21 — agent linkedin (SérénIATech_dev) — Test 2, conversion d'une zone existante

Détail complet dans `TEST_CREATE_AGENT_RESULTS.md` (Test 2). Différence majeure avec Test 1 : la
zone `linkedin` (`Communication/Linkedin`) était **déjà enregistrée** dans `zones.md`, avec un
`_contexte/` réel et mature (pas un stub). La procédure `/create_agent` ne couvre pas ce cas
(étape 4 refuse par principe un alias déjà pris ; étape 5 écraserait `_contexte/` avec le
template générique). Décisions utilisateur ad hoc pour ce test : ne pas toucher `zones.md` ni
`signals.md`/`contexte.md` existants, ajouter uniquement `agent_role.md` + une section de renvoi
en fin de `contexte.md`.

Étape 2b déclenchée normalement : `start.md` de SérénIATech_dev (v2.13) n'avait pas le chargement
de charte. Corrigé par un `/update` individuel du projet (v2.13 → v2.24) avant de créer l'agent —
confirme que la friction P6 est bien détectée par la vérification, pas seulement documentée après
coup comme sur La Rev.

Friction nouvelle observée : `{{ALIAS_RACINE}}` (« première ligne de zones.md ») n'a de sens que
si cette première ligne est la zone racine du projet. Ici la première ligne est `administratif`
(une zone parmi d'autres, le projet n'a pas d'alias racine explicite) — le champ "Zone parente"
de la charte générée est donc trompeur. Non corrigé pour ce test, à trancher :

- P11 — Clarifier `{{ALIAS_RACINE}}` : soit exiger qu'un projet ait un alias racine explicite
  avant d'utiliser `/create_agent`, soit reformuler le champ "Zone parente" de la charte pour ne
  plus supposer que la première ligne de `zones.md` est forcément la racine.
- P12 — Ajouter un chemin explicite dans `/create_agent` pour convertir une zone déjà enregistrée
  en agent (charte seule, sans toucher `zones.md`/`_contexte/` existants), au lieu de traiter ce
  cas uniquement par déviation manuelle comme ici.

## 2026-07-26 — agent design (D:\ServOMorph\jeu_zombies)

Création d'un agent DESIGN (design artistique et UX de Nox Protocol), périmètre limité à `DESIGN/`.

A bien fonctionné : étape 2b OK (le `start.md` de jeu_zombies charge bien `agent_role.md`),
template `agent_role_TEMPLATE.md` directement exploitable, `{{ALIAS_RACINE}}` correct ici
(première ligne de `zones.md` = `jeu_zombies`, vraie racine).

Frictions :
- P12 rencontrée à nouveau : l'alias `design` existait déjà dans `zones.md` et pointait sur un
  dossier `DESIGN/` vide (zone déclarée sans charte ni `_contexte/`). L'étape 4 ne prévoit que
  "refuser / renommer" ; ici la bonne action était de compléter la zone existante sans toucher
  `zones.md`. Traité par question explicite à l'utilisateur. Confirme la nécessité de P12.
- P13 — `{{STACK}}` est figé à "Hérite de la stack du projet parent." (étape 5). Insuffisant :
  l'utilisateur a dû demander explicitement d'analyser le projet cible pour renseigner la stack
  réelle dans `contexte.md`. Or c'est précisément ce qui rend l'agent économe en tokens ensuite
  (pas besoin de re-scanner le projet à chaque session). Proposition : ajouter à l'étape 5 une
  analyse du projet cible (README, fichiers de config type `project.godot`/`package.json`,
  arborescence, docs de cadrage) pour produire un `{{STACK}}` réel, filtré par le rôle de l'agent.

## 2026-07-30 — agent explo (D:\ServOMorph\crea_zik)

Création d'un agent explo (recherches/explorations sonores : synthèse, DSP, composition
algorithmique), périmètre limité à `explo/`. Mode création, alias absent de `zones.md`.

A bien fonctionné : [PREFLIGHT] a résolu le chemin cité entre guillemets sans ambiguïté, `start.md`
de crea_zik charge déjà `agent_role.md` (pas de warning), `{{ALIAS_RACINE}}` correct (première
ligne de `zones.md` = `crea_zik`, vraie racine du projet). Le rôle fourni par l'utilisateur était
déjà formulé de façon durable (pas de tâche unique) — aucune reformulation nécessaire.

L'analyse [COLLECTE] du projet cible (README.md, `_docs/index_recherches_audio.md`, AGENTS.md) a
produit un bloc `{{STACK}}` réellement exploitable dès la création (contrainte "pas de son externe",
moteurs Csound 7/pyo/Faust, recherches déjà produites à consulter) — confirme la valeur de P13
implémentée le 2026-07-26. Aucune friction nouvelle observée.

## 2026-07-30 — agent editeur (D:\ServOMorph\crea_zik)

Création de l'agent EDITEUR (éditeur de son et de musique du projet : Sound Designer, Music
Composer, Adaptive Lab, Analyse & Export), premier test de la règle « dossier agent en
MAJUSCULES » ajoutée le jour même à `create_agent.md`.

A bien fonctionné : dossier `EDITEUR` créé directement en majuscules (mode création, pas de
renommage à tester ici) ; alias dérivé en minuscules (`editeur`) sans confusion. [COLLECTE] a
identifié `_docs/specification_ui_studio_audio.md` en plus du README pour produire un `{{STACK}}`
détaillé (architecture UI/backend, navigation cible, packaging).

Friction confirmée (pas nouvelle) : le rôle « créer l'éditeur » impliquait d'écrire dans le code
applicatif existant (`frontend/`, `backend/`), hors du dossier de l'agent — la question groupée de
l'étape [COLLECTE] sur le périmètre d'écriture a correctement capté ce besoin plutôt que de
supposer par défaut un périmètre limité à `EDITEUR/`. `{{ECRITURE_ETENDUE}}` et la liste "Ne doit
pas toucher" de la charte mis à jour en conséquence.

Non testé ici : le cas de renommage d'un dossier existant à la casse non conforme (mode
conversion) — aucun projet actuel n'a de dossier d'agent en minuscules à convertir pour vérifier
cette branche ajoutée à `create_agent.md`.

## 2026-07-30 — agent documentation (Moulin du Sud)

Création de l'agent DOCUMENTATION (centraliser/structurer la doc du projet en .md, base de
connaissance interne façon RAG léger), mode création simple, aucun `_docs`/README exploitable
pour `{{STACK}}` (projet vibecoding pur, pas de code applicatif) → "Hérite de la stack du projet
parent." signalé sans forcer un contenu.

Friction nouvelle : l'argument passé à la commande contenait, en plus du rôle durable, une
demande de recherche web/GitHub sur les systèmes de doc type RAG et une demande d'implémentation
ultérieure comme template dans le kit — deux tâches hors périmètre de `/create_agent`. Traité par
question groupée : rôle durable extrait et confirmé séparément, recherche explicitement reportée
à une session `/start documentation` dédiée plutôt qu'enchaînée dans le même appel de commande.
Aucune ligne de la commande n'a besoin de changer pour ce cas — c'est un usage détourné de
l'argument, pas une lacune de la procédure.

Point à surveiller (pas encore une proposition P<n>, pas assez d'occurrences) : le template
`agent_role.md` limite la lecture à « dossier agent + racine (README, AGENTS.md/CLAUDE.md) »,
alors que le rôle même d'un agent documentaliste est de lire l'ensemble du projet pour agréger.
La charte générée reste donc silencieuse sur ce point — periscope déclaratif, pas bloquant
techniquement, mais à corriger si un deuxième agent de ce type confirme le besoin.

## 2026-07-30 — agent communication (Moulin du Sud)

Création de l'agent COMMUNICATION (gérer toute la communication du projet), mode création simple.
Dossier `COMMUNICATION/` existait déjà (vide, créé en amont par l'utilisateur) mais l'alias
`communication` était absent de `zones.md` — traité en mode création normale, pas en conversion
(la conversion ne s'applique qu'à un alias déjà enregistré).

A bien fonctionné : `{{ALIAS_RACINE}}` correct (première ligne de `zones.md` = `moulin_du_sud`,
vraie racine). L'analyse [COLLECTE] a exploité l'agent `documentation` déjà en place (son
`agent_role.md` et `DOCUMENTATION/INDEX.md`) pour produire un `{{STACK}}` réel : identité du lieu,
huit axes, règle de signature de charte, deux exclusions de périmètre à ne pas communiquer comme
actives (accueil handicap hors V1, association/partenariats pas encore en place), et les sources
canoniques (VISION/CHARTE/PRESENTATION/DECISIONS_METIER) à consulter avant toute production.
Aucune friction nouvelle observée.
