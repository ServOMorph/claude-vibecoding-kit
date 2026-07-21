# Améliorations — /create_agent

Journal des frictions et améliorations de la commande `/create_agent` et de la charte `agent_role.md`.
Sortie concrète de l'étape 10 de la commande et des rétrospectives de `roadmap_agents.md` (décision 6 du cadrage).

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
