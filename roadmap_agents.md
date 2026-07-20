# Roadmap — Template de création d'agent (zone à rôle)
Objectif : institutionnaliser dans le kit une commande `/create_agent <dossier cible>` qui crée un agent = zone à rôle (dossier + charte + `_contexte/`, piloté par `/start`/`/close`), en se servant de robert-ia (événement du 25/07) comme mise en pratique.
Créée le : 2026-07-20

---

## Cadrage (à lire avant Phase 1, ne pas supprimer)

**Définition retenue de « agent » dans ce kit — décision (a) :**
Un agent est une **zone à rôle** : un sous-dossier du projet contenant
- une **charte** (`agent_role.md`) : rôle, périmètre, dossier de sortie, ce qu'il a le droit de toucher / pas toucher ;
- sa propre structure `_contexte/` (`signals.md` + `contexte.md`) ;
- enregistré comme zone dans `<projet>/.claude/zones.md`, donc lançable par `/start <zone>` et clôturable par `/close <zone>`.

Il ne s'agit **pas** d'un subagent Claude Code (`.claude/agents/*.md`, Task tool, contexte isolé) — option (b). Si ce besoin apparaît, il fera l'objet d'une décision séparée, pas d'un glissement silencieux.

**Ne pas confondre** avec le fichier `AGENTS.md` déjà présent à la racine de robert-ia (fichier multi-agents type Codex). Les chartes vivent **dans** `COM/` et `MEMORY/` (ex. `COM/agent_role.md`), pas à la racine.

**Décisions de conception (issues d'une revue critique par Fable 5, validées ; le prompt utilisé n'a pas été conservé sur disque) :**
1. **Nommage de la charte** : `agent_role.md` (jamais `agent.md`) — évite toute collision lexicale avec le standard `AGENTS.md`. Changement gratuit maintenant, coûteux après propagation sur ~12 projets.
2. **`/update` ne touche jamais les sous-zones** : les `_contexte/` des zones-agents (`COM/_contexte/`, `MEMORY/_contexte/`, etc.) sont hors périmètre de `/update`, exactement comme la zone racine. À écrire noir sur blanc dans `update.md` en Phase 3, avant toute généralisation.
3. **Unicité des alias** : `/create_agent` lit `zones.md` avant d'écrire et refuse si l'alias existe déjà (propose une variante) — jamais d'écrasement silencieux. Appliqué manuellement en Phase 2, codé en Phase 3.
4. **Charte chargée automatiquement** : la charte n'a de valeur que si `/start` la charge et l'affiche avant `signals.md`. Sinon c'est du décor. À trancher/spécifier en Phase 1, implémenter en Phase 3.
5. **Périmètre déclaratif, pas isolé** : rien n'empêche techniquement un agent d'écrire hors de son dossier. Le périmètre est une convention documentée dans la charte + vérifiée a posteriori par `/close` (ex. `git status` limité au dossier de la zone). Ne pas prétendre à une isolation réelle.
6. **Rétrospective à sortie concrète** : l'étape « analyse sur Opus » doit écrire/mettre à jour un fichier versionné (`ameliorations_create_agent.md`), pas seulement s'afficher dans le chat, sinon elle sera ignorée après un ou deux usages.

**Contrainte de calendrier :** l'événement est le samedi 25/07/2026. Les livrables réels (com WhatsApp + ajustement du contexte de robert) sont produits en Phase 2 et doivent être prêts **avant** le 25/07. La généralisation en template (Phases 3-4) peut se faire après l'événement.

**Événement (données fournies, à ne pas réinventer) :**
- Démonstration de robert-ia, samedi 25/07/2026.
- Lieu : Moulin du Sud, 1141 route du Moulin du Sud, 33420 Génissac.
- Organisation : à titre personnel.
- Possibilité de don pour « Le Moulin du Sud ».

---

## Phase 1 — Analyse du kit + conception du modèle d'agent [FAIT]
- [x] Analyser la mécanique existante zones / `start.md` / `close.md` / `init_projet.md` / `update.md` et consigner comment un agent s'y greffe sans casser l'existant.
- [x] Spécifier le format de la charte `agent_role.md` (rôle, périmètre, dossier de sortie, permissions déclaratives, invariants).
- [x] Décider l'arborescence d'un agent : `<dossier>/agent_role.md` + `<dossier>/_contexte/{signals,contexte}.md`.
- [x] Trancher le chargement automatique de la charte par `/start` (décision 4) : étape à ajouter dans `start.md` pour charger et afficher `agent_role.md` avant `signals.md`.
- [x] Décider comment `/create_agent` enregistre la zone dans `<projet>/.claude/zones.md` (ajout de ligne, alias = nom du dossier), **avec contrôle d'unicité de l'alias** (décision 3).
- [x] Livrable : note de conception courte (`base_connaissances/` ou racine kit) validée avant de coder quoi que ce soit. → `note_conception_create_agent.md` (racine du kit).

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 2 — Mise en pratique : les 2 agents dans robert-ia + livrables événement [EN COURS]
- [ ] Créer `D:\ServOMorph\robert-ia\COM\` : `agent_role.md` (rôle = communication événement) + `_contexte/`.
- [ ] Créer `D:\ServOMorph\robert-ia\MEMORY\` : `agent_role.md` (rôle = gestion du contexte/mémoire de robert) + `_contexte/`.
- [ ] Enregistrer les 2 zones dans `robert-ia\.claude\zones.md` (alias `com`, `memory`), après vérification que ces alias ne sont pas déjà pris (décision 3).
- [ ] Vérifier concrètement : `/start com`, `/start memory`, `/close com`, `/close memory` fonctionnent.
- [ ] Agent COM : produire la communication WhatsApp de l'événement (lieu, date, don Moulin du Sud), stockée dans `COM/`.
- [ ] Agent MEMORY : ajuster le contexte de robert-ia pour la démo, artefacts dans `MEMORY/`.
- [ ] Vérifier que rien hors périmètre de chaque agent n'a été touché.

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 3 — Généralisation : commande `/create_agent` + template dans le kit [TODO]
- [ ] Écrire `templates/.claude/commands/create_agent.md` (argument = dossier cible ; crée dossier + charte + `_contexte/` + enregistre la zone), **avec contrôle d'unicité de l'alias avant écriture dans `zones.md`** (décision 3).
- [ ] Créer le template de charte `templates/agent_role_TEMPLATE.md` à partir de ce qui a marché sur robert-ia.
- [ ] Ajouter dans `start.md` (kit + template) l'étape de chargement automatique de `agent_role.md` avant `signals.md` (décision 4).
- [ ] Écrire explicitement dans `update.md` que les `_contexte/` des sous-zones ne sont jamais touchés par `/update` (décision 2), avant tout `/update all`.
- [ ] Intégrer dans la commande l'**étape finale obligatoire** : recommander à l'utilisateur de passer sur **Opus**, analyser le workflow qui vient de se dérouler, et **écrire/mettre à jour `ameliorations_create_agent.md`** (sortie concrète, décision 6) — pas seulement un affichage chat.
- [ ] Copier la commande dans le kit lui-même (`.claude/commands/create_agent.md`) pour qu'elle soit utilisable ici.
- [ ] Décider si `/update` propage `create_agent.md` aux projets (cohérence avec start/close/create_memory).
- [ ] `/doc_sync`, mise à jour `CHANGELOG.md` / `DEPLOYMENTS.md` si impacté.

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 4 — Rétrospective du workflow + propositions d'amélioration [TODO]
- [ ] (Sur Opus) Analyser l'ensemble du workflow bootstrap (Phases 1-3) : ce qui a friction, ce qui a bien marché.
- [ ] Proposer des améliorations concrètes du template `/create_agent` et de la charte.
- [ ] Consigner les propositions retenues/écartées ; implémenter celles retenues ou les renvoyer à une session dédiée.
