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
Kit v2.10 en production. `/update` couvre désormais `ollama_call.sh` (bug de propagation corrigé). Les 6 projets déployés (DEPLOYMENTS.md) sont tous à jour en v2.10 : robert-ia, jeu, Appli_TSA_SDI_TDAH, jegeekutile, SérénIATech_dev, visioaide. Mécanisme "Spécificités projet" opérationnel avec migration assistée par diff.

## Décisions structurantes
- 2026-06-29 : JeGeekUtile v2.3 déployé avec support C:\Users\raph6\Documents
- 2026-06-21 : v2.3 release — amélioration robustesse close/start
- 2026-04-10 : Adoption token economy stricte (max 3 sections par file)
- 2026-01-15 : Multizone support implémenté
- 2026-07-03 : Règles de roadmap intégrées à CLAUDE.md (pas de commande /roadmap) pour s'appliquer même hors démarrage de commande explicite
- 2026-07-03 : Contenu des phases de roadmap précisé — tests intégrés à la phase fonctionnelle, refacto en phase dédiée seulement si dette technique visible et trop large pour la suivante
- 2026-07-03 : `/update all` ajouté (mode batch), pause ciblée par projet uniquement si migration "Spécificités projet" nécessaire
- 2026-07-03 : Mécanisme "Spécificités projet" créé (CLAUDE.md + start.md/close.md) pour protéger les lignes propres à un projet lors de `/update`, avec migration assistée par diff quand la zone est absente
- 2026-07-03 : `/update` inversé — se lance depuis le repo du kit, argument = chemin absolu du projet cible (au lieu de l'inverse)
- 2026-07-14 : `ollama_call.sh` réécrit sans dépendance `jq` (python), modèle par défaut `gemma4:e4b` ; `/update` corrigé pour propager ce fichier ; 6 projets déployés synchronisés en v2.10
