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
Kit v2.6 en production. Règles de roadmap (critères, format, contenu des phases) déplacées dans `CLAUDE.md`, appliquées en permanence sans commande dédiée. 4 projets déployés en v2.3, pas encore mis à jour vers v2.6. Prêt pour propagation via `/update`.

## Décisions structurantes
- 2026-06-29 : JeGeekUtile v2.3 déployé avec support C:\Users\raph6\Documents
- 2026-06-21 : v2.3 release — amélioration robustesse close/start
- 2026-04-10 : Adoption token economy stricte (max 3 sections par file)
- 2026-01-15 : Multizone support implémenté
- 2026-07-03 : Règles de roadmap intégrées à CLAUDE.md (pas de commande /roadmap) pour s'appliquer même hors démarrage de commande explicite
- 2026-07-03 : Contenu des phases de roadmap précisé — tests intégrés à la phase fonctionnelle, refacto en phase dédiée seulement si dette technique visible et trop large pour la suivante
