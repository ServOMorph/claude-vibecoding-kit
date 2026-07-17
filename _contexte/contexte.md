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
- Kit v2.17 : `ollama_call.py` durci (timeout 60s, erreurs JSON/réponse explicites) et couvert par une suite `unittest` (dont un test d'intégration réel opt-in) ; `/doc_sync` ignore désormais les blocs "Spécificités projet" lors de la comparaison des miroirs.
- `base_connaissances/` créé : audit des 11 projets déployés (git, `_contexte/`, roadmaps, mémoire, transcripts Claude Code) + `ANALYSE.md` (10 frictions, 7 patterns terrain) + `PROPOSITIONS_AMELIORATION.md` (16 propositions priorisées) — aucune proposition mise en œuvre à ce stade.
- Onze projets sont enregistrés dans `DEPLOYMENTS.md` (registre local, hors git) ; leur propagation vers la dernière version du kit reste à effectuer explicitement via `/update`.
- `jeux_vibecoder` reçoit déjà le lanceur Ollama, sans commit car son dépôt contenait des travaux non liés.
- Le README reste affecté par une corruption d'encodage historique hors les lignes corrigées.

## Décisions structurantes
- 2026-07-14 : `ollama_call.sh` réécrit sans dépendance `jq` (python), modèle par défaut `gemma4:e4b` ; `/update` corrigé pour propager ce fichier ; 6 projets déployés synchronisés en v2.10
- 2026-07-17 : `/init_projet` inversé — même logique que `/update` (lancement depuis le kit, argument = projet cible) ; ajout d'une étape de liste des fichiers modifiés avant confirmation ; TableauDeBord initialisé comme 7e projet déployé
- 2026-07-17 : `/close` crée automatiquement le README du projet cible s'il est absent (au lieu de demander confirmation)
- 2026-07-17 : `/update` corrigé — suppression du mécanisme de substitution `{{ALIAS}}`/`{{RACINE}}` obsolète dans la doc (start.md/close.md lisent `zones.md` directement) ; correction des mentions erronées d'`init_projet.md`/`update.md` comme fichiers copiés vers les projets cibles
- 2026-07-17 : `/update all` exécuté sur les 9 projets déployés (kit v2.13), IA-TSA migré vers le mécanisme "Spécificités projet" (jamais fait auparavant)
- 2026-07-17 : `ollama_call.py` remplace le lanceur Bash pour une délégation Ollama compatible Windows sans Bash ni WSL.
- 2026-07-17 : `ollama_call.py` durci (timeout 60s, gestion JSON invalide/réponse inattendue) + suite `unittest` dédiée ; `/doc_sync` exclut les blocs "Spécificités projet" de la comparaison start.md/close.md.
- 2026-07-17 : `base_connaissances/` créé comme audit reproductible de la flotte de projets déployés (git + `_contexte/` + roadmaps + transcripts) ; `PROPOSITIONS_AMELIORATION.md` priorise 16 correctifs/évolutions du kit, en attente de décision sur la mise en œuvre.
