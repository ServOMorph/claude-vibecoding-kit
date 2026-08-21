---
type: guide
description: Initialiser le protocole vibecoding dans un projet avec /init_projet
tags: guide, init, init_projet
maj: 2026-08-21
---

# Initialiser un projet

Commande : `/init_projet <chemin vers le projet>` — s'exécute depuis le kit. Références : [`../../README.md`](../../README.md) (démarrage rapide) et [`../../_docs/protocole_vibecoding.md`](../../_docs/protocole_vibecoding.md) (section /init).

## Déroulé

1. Claude pose 5 questions : alias, objectif, stack, git, première zone ou zone supplémentaire
2. Projet sans git : question complémentaire sur le backup miroir Google Drive (rclone) à chaque /close
3. Copie les templates, remplace les placeholders, committe dans le projet cible
4. Enregistre le déploiement dans `DEPLOYMENTS.md` (registre hors git)

La racine du projet cible est l'argument — jamais demandée.

## Placeholders remplacés

| Placeholder | Valeur |
|---|---|
| `{{ALIAS}}` | Alias court de la zone |
| `{{RACINE}}` | Chemin absolu de la racine du projet |
| `{{OBJECTIF}}` | Objectif du projet, 1-2 phrases |
| `{{STACK}}` | Stack technique, liste courte |
| `{{DATE}}` | Date du jour, AAAA-MM-JJ |

## Fichiers déployés

Depuis `templates/` : `.claude/CLAUDE.md`, `zones.md`, commands/ (start, close, create_memory), `_contexte/` (contexte.md, signals.md), `ollama_call.py`, `agent_role_TEMPLATE.md`. Sur confirmation : `AGENTS.md`, `GEMINI.md` (agents non-Claude). `roadmap_TEMPLATE.md` n'est pas copié à l'init.

## Cas particuliers

- **Projet sans git** : pas de commit ; la traçabilité repose sur la section "Dernière session" de signals.md
- **Multi-zones** : start.md, close.md, zones.md partagés — une ligne par zone, pas de duplication de fichiers
- **Init d'une zone supplémentaire** : ajout d'une ligne dans zones.md, pas de re-copie du protocole

## Mise à jour ultérieure

`/update <chemin>` ou `/update all` : met à jour les fichiers de protocole d'un projet déjà initialisé sans toucher `_contexte/`, `zones.md`, ni la section "Spécificités projet" de CLAUDE.md. `init_projet.md` et `update.md` ne sont pas déployés dans les projets — ils restent dans le kit.
