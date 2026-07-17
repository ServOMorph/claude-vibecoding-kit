# claude-vibecoding-kit (le kit)

## Identité
- Chemin : `d:\ServOMorph\claude-vibecoding-kit`
- Zone : -
- Version kit : v2.14

## Historique git
- Nombre de commits : 21

- 2026-07-17 4dc9e7b close(claude-vibecoding-kit): session 2026-07-17 - launcher Ollama Python
- 2026-07-17 dd498ea close(kit): session 2026-07-17 — /close auto-crée README manquant + /update corrigé (v2.13) + update all sur 9 projets
- 2026-07-17 d78593e close(claude-vibecoding-kit): session 2026-07-17 — /init_projet inversé (v2.12) + init TableauDeBord
- 2026-07-14 2cae2eb close(kit): session 2026-07-14 — ollama_call.sh sans jq, propagation v2.10 sur 6 projets
- 2026-07-14 da80c79 fix(kit): ollama_call.sh sans dépendance jq, /update propage désormais ce script — v2.10
- 2026-07-03 85cda7e close(claude-vibecoding-kit): session 2026-07-03 — inversion sens /update (v2.9)
- 2026-07-03 e750af1 close(claude-vibecoding-kit): session 2026-07-03 — /update all + zone Spécificités projet (v2.8)
- 2026-07-03 b3726e1 close(claude-vibecoding-kit): session 2026-07-03 — règles roadmap intégrées à CLAUDE.md (v2.6)
- 2026-07-03 00e4bdf close: session 2026-07-03 — garde-fou pre-commit /close + nouvelle commande /doc_sync
- 2026-06-29 be86637 close(kit): session 2026-06-29 — unification pattern roadmap + update JeGeekUtile v2.3
- 2026-06-23 5845567 rename: init.md -> init_projet.md, mise a jour des references
- 2026-06-21 adfc021 refactor: supprimer _manifest.md, /start charge directement signals+contexte+roadmap_*
- 2026-06-21 d009e1f fix(CLAUDE.md): supprimer référence à _docs/protocole_vibecoding.md
- 2026-06-21 2cc23f5 rename: memory.md -> create_memory.md, /memory -> /create_memory
- 2026-06-21 697fc55 refactor(protocole): supprimer redondances avec les templates, init/update réservés au kit
- 2026-06-21 5b52f26 docs(v2.3): mise à jour complète de la documentation
- 2026-06-21 9774ee3 feat(update): add /update command and zones.md template
- 2026-06-21 156a4c4 refactor(close): use implicit current dir when zone argument absent (like start)
- 2026-06-21 3976b5a build: ignore local DEPLOYMENTS.md registry
- 2026-06-20 f27371d feat(start): affichage intégral de signals.md au démarrage
- 2026-06-19 04562e2 Initial commit: project setup

## État du working tree (non commité)
```
M .claude/commands/doc_sync.md
 M CHANGELOG.md
 M Protocole_start_close_context.md
 M README.md
 M _contexte/signals.md
 M templates/ollama_call.py
?? processus-base-connaissances-markdown.md
?? tests/
```

## Contexte stable (_contexte/contexte.md)

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
- Kit v2.14 : la délégation Ollama utilise désormais `ollama_call.py`, compatible Windows sans Bash ni WSL.
- Les commandes `/init_projet` et `/update`, les templates et la documentation propagent ce lanceur Python.
- Onze projets sont enregistrés dans `DEPLOYMENTS.md` ; leur propagation v2.14 reste à effectuer explicitement.
- `jeux_vibecoder` reçoit déjà le lanceur, sans commit car son dépôt contenait des travaux non liés.
- Le README reste affecté par une corruption d'encodage historique hors les lignes corrigées.

## Décisions structurantes
- 2026-07-03 : Règles de roadmap intégrées à CLAUDE.md (pas de commande /roadmap) pour s'appliquer même hors démarrage de commande explicite
- 2026-07-03 : Contenu des phases de roadmap précisé — tests intégrés à la phase fonctionnelle, refacto en phase dédiée seulement si dette technique visible et trop large pour la suivante
- 2026-07-03 : `/update all` ajouté (mode batch), pause ciblée par projet uniquement si migration "Spécificités projet" nécessaire
- 2026-07-03 : Mécanisme "Spécificités projet" créé (CLAUDE.md + start.md/close.md) pour protéger les lignes propres à un projet lors de `/update`, avec migration assistée par diff quand la zone est absente
- 2026-07-03 : `/update` inversé — se lance depuis le repo du kit, argument = chemin absolu du projet cible (au lieu de l'inverse)
- 2026-07-14 : `ollama_call.sh` réécrit sans dépendance `jq` (python), modèle par défaut `gemma4:e4b` ; `/update` corrigé pour propager ce fichier ; 6 projets déployés synchronisés en v2.10
- 2026-07-17 : `/init_projet` inversé — même logique que `/update` (lancement depuis le kit, argument = projet cible) ; ajout d'une étape de liste des fichiers modifiés avant confirmation ; TableauDeBord initialisé comme 7e projet déployé
- 2026-07-17 : `/close` crée automatiquement le README du projet cible s'il est absent (au lieu de demander confirmation)
- 2026-07-17 : `/update` corrigé — suppression du mécanisme de substitution `{{ALIAS}}`/`{{RACINE}}` obsolète dans la doc (start.md/close.md lisent `zones.md` directement) ; correction des mentions erronées d'`init_projet.md`/`update.md` comme fichiers copiés vers les projets cibles
- 2026-07-17 : `/update all` exécuté sur les 9 projets déployés (kit v2.13), IA-TSA migré vers le mécanisme "Spécificités projet" (jamais fait auparavant)
- 2026-07-17 : `ollama_call.py` remplace le lanceur Bash pour une délégation Ollama compatible Windows sans Bash ni WSL.

## Signals (_contexte/signals.md)

# Signals — claude-vibecoding-kit (MAJ 2026-07-17)

## Actions ouvertes
- [P1|en attente de test] Tester la mise à jour v2.14 sur un projet dédié avant toute propagation. fait quand: un `/update <chemin absolu>` a mis à jour un projet de test, les fichiers `ollama_call.py` et `CLAUDE.md` sont vérifiés, et le résultat est consigné. réf: `.claude/commands/update.md` ; `DEPLOYMENTS.md`
- [P1|ouvert après test] Propager le lanceur Ollama v2.14 aux projets déployés. prérequis: test de mise à jour v2.14 concluant. fait quand: chaque projet concerné utilise `ollama_call.py` et son `CLAUDE.md` appelle `python ollama_call.py "<prompt>"`. réf: `DEPLOYMENTS.md` ; `.claude/commands/update.md`

## Questions ouvertes
- Aucune

## Échéances
- Aucune

## Blocages
- Aucun

## Contexte chaud
- `processus-base-connaissances-markdown.md` : fichier non tracké présent à la racine, origine inconnue — non touché cette session, à clarifier si pertinent
- `README.md` : corruption d'encodage pré-existante (double UTF-8) sur l'ensemble du fichier hors les lignes corrigées ces dernières sessions — à traiter dans une session dédiée si gênant
- `jeux_vibecoder` : le lanceur Python et son instruction ont été ajoutés, mais le dépôt contient aussi des modifications utilisateur non liées ; aucun commit n’y a été créé.
- La propagation v2.14 est suspendue : tester d’abord `/update` sur un seul projet avant d’exécuter `/update all`.

## Dernière session (2026-07-17)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->

# Session du 2026-07-17

## Décisions prises
- `ollama_call.py` remplace le lanceur Bash : le protocole doit fonctionner sous Windows sans Bash ni WSL.
- La propagation v2.14 reste volontairement séparée : aucun autre projet déployé n’est modifié sans exécution explicite de `/update`.

## Livrables produits ou modifiés
- `templates/ollama_call.py` : lanceur local Python ajouté ; template Bash retiré.
- `.claude/commands/`, `templates/.claude/`, `README.md`, `CHANGELOG.md`, `Protocole_start_close_context.md` : références synchronisées vers v2.14.
- `.gitignore` : bytecode Python ignoré.

## Hypothèses validées / invalidées
- VALIDE : Ollama répond localement depuis PowerShell via le nouveau lanceur Python, sans Bash ni WSL.
- EN ATTENTE : propagation du lanceur v2.14 dans les autres projets déployés.

## Prochaine étape exacte
Choisir un projet de test et exécuter `/update <chemin absolu>` depuis ce kit ; vérifier ensuite `ollama_call.py` et l’instruction associée avant toute propagation globale.

## Question bloquante pour la session suivante
Aucune

## Archive des décisions (_contexte/archive_decisions.md)

# Archive des décisions — claude-vibecoding-kit

## Décisions archivées le 2026-07-17

- 2026-01-15 : Multizone support implémenté.
- 2026-04-10 : Adoption token economy stricte (max 3 sections par file).
- 2026-06-21 : v2.3 release — amélioration robustesse close/start.
- 2026-06-29 : JeGeekUtile v2.3 déployé avec support C:\Users\raph6\Documents.

## Sessions Claude Code (transcripts)

- Dossier : `d--ServOMorph-claude-vibecoding-kit`
- Nombre de sessions : 26
- Période : 2026-06-21 → 2026-07-17

