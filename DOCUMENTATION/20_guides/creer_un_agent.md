---
type: guide
description: Créer un agent (zone à rôle) avec /create_agent
tags: guide, agent, create_agent
maj: 2026-08-21
---

# Créer un agent

Commande : `/create_agent <chemin_projet_cible> <dossier> [rôle]` — s'exécute toujours depuis le kit, jamais copiée dans les projets cibles. Référence : [`../../_docs/protocole_vibecoding.md`](../../_docs/protocole_vibecoding.md) (section /create_agent).

## Ce que c'est

Un agent = une zone à rôle : charte `agent_role.md` (rôle, périmètre d'écriture, invariants) + `_contexte/` propre, enregistrée dans `zones.md` du projet cible, pilotable par /start et /close.

## Phases

| Phase | Contenu |
|---|---|
| [PREFLIGHT] | Résout l'argument et vérifie que start.md du projet cible charge la charte automatiquement (sinon avertit et demande confirmation, plutôt que de créer un agent silencieusement inopérant) |
| [COLLECTE] | Une question groupée unique : rôle durable (jamais inventé par défaut), périmètre d'écriture, confirmation du mode ; analyse la stack du projet cible si le résultat sera utilisé |
| [ECRITURE] | Écrit tous les fichiers d'un coup — mode création (nouvel alias, contrôle d'unicité avant écriture dans zones.md) ou conversion (alias déjà présent : complète sans toucher zones.md ni un signals.md existant) |
| [SORTIE] | Propose une seule fois de copier dans le presse-papier un message de mise à jour pour l'agent racine du projet cible — jamais écrit dans les fichiers du projet cible ; récapitule et recommande Opus pour [AUDIT] |
| [AUDIT] | Analyse à froid de la commande elle-même — jamais automatique, Opus imposé, sur demande explicite seulement |

## Effets de bord

- Charte générée depuis `templates/agent_role_TEMPLATE.md`
- Chaque création alimente `ameliorations_create_agent.md` (racine du kit) et `AGENTS_REGISTRY.md` (hors git)
- Les commandes kit-only restent dans `.claude/commands/` du kit, absentes de `templates/`

## Après création

L'agent est une zone : il se pilote via `/start <alias>` / `/close <alias>`. Son verdict évolue dans AGENTS_REGISTRY.md selon le retour d'expérience. Cas particulier : agent dont le dossier est la racine du projet (alias sans ligne dans zones.md) — signalé au registre, ligne "Zone parente" omise de la charte.
