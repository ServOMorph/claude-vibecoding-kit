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
- Kit v3.15 : gap corrigé — `create_memory.md` manquait à l'étape 3 d'`init_projet.md` (jamais propagé aux nouveaux projets). Propagé et committé dans les 22 projets réels de `DEPLOYMENTS.md` (2 sans dépôt git, `Open_Code_Apprentissage` toujours introuvable). Script `deploy_create_memory.py` créé, pratique actée pour tout déploiement massif futur.
- Kit v3.14 : sauvegarde automatique de `DEPLOYMENTS.md` vers Google Drive intégrée à `/close` du kit (étape 12bis, optionnelle) via `backup_file.py` (rclone) — destination `googledrive:BackUps/claude-vibecoding-kit/`, jamais exécutée dans le flux réel de `/close` à ce stade (seulement en test manuel).
- Kit v3.13 : commande locale `/create_agent` créée dans `jeu_espace` (permet à l'orchestrateur de créer lui-même des agents, sans passer par le kit) — expérimentation isolée, jamais testée en conditions réelles, validation prévue ~2026-08-25.
- `/create_agent` : mode conversion pas encore validé end-to-end (Test 3 à faire).
- `jeu_zombies` (v2.26 déployé) toujours en retard sur le kit — `/update` à lancer.

## Décisions structurantes
_Décisions antérieures au 2026-07-31 (`/init_projet` Open_Code_Apprentissage) archivées dans `_contexte/archive_decisions.md`._
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
- 2026-08-11 : commande locale `/create_agent` créée dans `jeu_espace` — donne à l'orchestrateur (zone racine) la capacité de créer lui-même des agents dans son projet, sans passer par le kit. Copie autonome (templates embarqués localement, pas de bookkeeping kit, pas de phase `[AUDIT]`). Test isolé, aucun template du kit modifié ; propagation à trancher après retour d'expérience (~2026-08-25). Kit v3.13.
- 2026-08-12 : sauvegarde automatique de `DEPLOYMENTS.md` vers Google Drive ajoutée à `/close` du kit (étape 12bis, optionnelle) — script `backup_file.py` (rclone `copyto`, réutilise la config déjà authentifiée), destination `googledrive:BackUps/claude-vibecoding-kit/`. Kit v3.14.
- 2026-08-12 : étape 12bis de `/close` (sauvegarde `DEPLOYMENTS.md` vers Google Drive) validée en conditions réelles pour la première fois — confirmation demandée, upload déclenché via `backup_file.py`, fichier horodaté déposé dans `googledrive:BackUps/claude-vibecoding-kit/`.
- 2026-08-12 : `create_memory.md` ajouté à l'étape 3 d'`init_projet.md` (gap : fichier jamais propagé aux nouveaux projets) et déployé sur les 22 projets réels de `DEPLOYMENTS.md` via nouveau script `deploy_create_memory.py`. Clôture faite a posteriori après un `/clear` accidentel avant `/close` — synthèse reconstruite depuis le commit `57a3522` et l'état réel des dépôts (4 projets recommis lors de la clôture : `site_internet_Sereniatech_V2`, `jeu_espace`, `Participation_GitHub`, `Roberto2`). Kit v3.15.
