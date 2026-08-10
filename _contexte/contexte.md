# Contexte — claude-vibecoding-kit

## Objectif (immuable sauf décision explicite)
Fournir un kit reproductible pour gérer le vibecoding sur des projets multi-sessions, avec contexte persistant via `/start`/`/close` et support multi-zones.

## Stack / contraintes techniques
- **Langage** : Markdown + Bash/PowerShell pour scripts
- **Framework** : Claude Code CLI + Agent SDK
- **Gestion git** : commits automatiques depuis `/close`
- **Modèles recommandés** : Haiku (start), Sonnet (close), Opus (plans/debug)
- **Intégration** : Ollama pour tâches sensibles/templated
- **Déploiement** : copie template vers projets via `/init`, tracking dans DEPLOYMENTS.md

## État actuel
- Kit v3.12 : agent `review` créé dans `jeu_zombies` (revue de code continue). Feature "synthèse agents pour l'orchestrateur" conçue et implémentée en expérimentation, limitée à `jeu_zombies` (pas propagée au kit, propagation conditionnée au bilan de Phase 3 de `roadmap_synthese_agents.md`).
- Étape 7 de `/close` (base de connaissances) validée en conditions réelles pour la première fois, sur Moulin du Sud.
- `/create_agent` : mode conversion pas encore validé end-to-end (Test 3 à faire).
- `jeu_zombies` (v2.26 déployé) toujours en retard sur le kit — `/update` à lancer.
- `DEPLOYMENTS.md` à vérifier pour `Open_Code_Apprentissage` (chemin introuvable, probable renommage).

## Décisions structurantes
_Décisions antérieures au 2026-07-30 (`/create_agent` MAJUSCULES) archivées dans `_contexte/archive_decisions.md`._
- 2026-07-30 : `/create_agent` — dossier de l'agent normalisé en MAJUSCULES (création et conversion), alias inchangé (minuscules) — décision utilisateur pour la reconnaissance visuelle dans l'arborescence. Testé en mode création sur l'agent `editeur` (crea_zik, périmètre étendu à `frontend/`/`backend/`). Kit v3.2.
- 2026-07-30 : base de connaissances `DOCUMENTATION/` (pattern progressive disclosure, validé par recherche web) adoptée comme feature générale du kit — d'abord implémentée dans Moulin du Sud (agent `documentation`), puis dans `templates/.claude/commands/close.md` (étape 7 conditionnelle) et `templates/.claude/CLAUDE.md`. `AGENTS.md` introduit en parallèle comme équivalent CLAUDE.md pour agents non-Claude, jamais créé automatiquement (`/init_projet` Q7, `/update` étape 7, toujours sur confirmation). Kit v3.3.
- 2026-07-31 : `/init_projet` exécuté sur Open_Code_Apprentissage (zone `orchestrateur`) avec reformulation + questions préalables demandées explicitement par l'utilisateur avant tout lancement. 3 agents validés par échange (notes, NARRATEUR, data) avant toute création — pattern noté comme piste de feature kit. Gap découvert : `/init_projet` ne gère pas `GEMINI.md` (créé manuellement sur demande).
- 2026-07-31 : `/init_projet` exécuté sur `jeu_espace` (zone `orchestrateur`) — jeu 3D Godot, orbite terrestre réaliste, 3 agents envisagés (orchestrateur/codeur/design), `AGENTS.md` créé (Codex mentionné pour les assets). Corruption accidentelle (`" pl"` parasite) corrigée dans `create_agent.md` ; rattrapage de commit pour des retros de sessions antérieures (agents notes/narrateur/data, communication) restées non commitées malgré des clôtures précédentes.
- 2026-07-31 : Agents `dev`/`design` créés dans jeu_espace via `/create_agent` (question groupée périmètre : dev étendu au code Godot racine, design restreint à son dossier). `/create_agent` étape `[SORTIE]` enrichie d'un message presse-papier pour l'agent racine (demande explicite utilisateur, après annulation d'une première approche écrivant directement dans `signals.md` du projet cible). Kit v3.5.
- 2026-08-01 : `GEMINI.md` intégré à `/init_projet` (Q8) et `/update` (étape 7 étendue), sur le même modèle qu'`AGENTS.md` — gap ouvert depuis le 2026-07-31 résolu. Étape 7 de `/close` (base de connaissances) validée en conditions réelles pour la première fois sur Moulin du Sud (zone tierce). Kit v3.6.
- 2026-08-02 : `git push` automatique (étape 11bis de `/close`) ajouté en test sur 3 zones avec remote GitHub (kit, `Appli_TSA_SDI_TDAH`, `VisioAide`), hors template. Kit v3.7.
- 2026-08-04 : `git push` automatique étendu à une 4ème zone, `crea_zik`. Corruption pré-existante de `.claude/commands/doc_sync.md` (frontmatter `a---`) corrigée. Kit v3.8.
- 2026-08-04 : décision "garder" actée pour `git push` automatique après validation réelle sur les 4 zones test. Promu en étape native (12) de `templates/.claude/commands/close.md` et `.claude/commands/close.md` (kit). Propagé à 15 projets déployés avec remote git (commit + push dans 14, `Lieux_Hybrides` en commit local sur décision explicite de ne pas configurer l'upstream). Kit v3.9.
- 2026-08-05 : correctif de la propagation v3.9 — l'instruction `git push` était restée dans le bloc "Spécificités projet" des 18 close.md concernés au lieu d'une étape native, corrigée et commitée dans les 18 (push en attente). Corruption locale non commitée du `close.md` du kit restaurée. Kit v3.10.
- 2026-08-08 : vérification réelle (fetch + status) des 18 dépôts + le kit — 13 dépôts avaient un commit local jamais poussé malgré l'apparence de clôture du 2026-08-05. Poussés sur confirmation utilisateur, action P1 close. `Lieux_Hybrides` reste sans upstream, assumé. Kit v3.11.
- 2026-08-10 : agent `review` créé dans `jeu_zombies` (revue de code continue) via `/create_agent`. Feature "synthèse agents pour l'orchestrateur" (agents écrivent à `/close`, racine lit à `/start` et propose des actions) conçue et implémentée en expérimentation limitée à `jeu_zombies` uniquement — pas de modification des templates du kit, propagation différée au bilan de sa roadmap dédiée. Kit v3.12.
