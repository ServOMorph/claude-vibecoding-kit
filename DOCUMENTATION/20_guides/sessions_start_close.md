---
type: guide
description: Travailler en session : /start, /close, /compact, roadmap et modèles recommandés
tags: guide, session, start, close, compact
maj: 2026-08-21
---

# Travailler en session

Référence : [`../../_docs/protocole_vibecoding.md`](../../_docs/protocole_vibecoding.md) (sections /start, /close, ROADMAP).

## Cycle d'une session

1. **`/start [zone]`** (Haiku) — charge le contexte : `agent_role.md` si zone-agent (affiché intégralement), puis `signals.md` (priorité absolue : actions ouvertes, blocages, dernière session), puis `contexte.md` et `roadmap*.md` si présente
2. **Travail** — traiter d'abord les actions ouvertes de signals.md ; les actions avec champ `réf:` : lire la référence avant de demander des précisions
3. **`/close [zone]`** (Sonnet) — sauvegarde l'état : contexte.md (état actuel réécrit, décisions ajoutées), signals.md (dernière session écrasée), roadmap mise à jour, commit

Zone implicite si l'argument est absent (working directory courant). Zone inconnue : erreur listant les alias valides de `zones.md`.

## Entre phases : /compact

Compression de l'historique en place. Usage normal entre phases d'une même session ; `/close` + `/start` entre sessions. Ne pas inverser les deux mécanismes.

## Roadmap

Chantier multi-phases : une seule phase `[EN COURS]` à la fois, checkpoint /compact obligatoire entre phases — ne pas commencer la phase suivante sans confirmation écrite. Statuts mis à jour par /close, jamais en cours de session. Chargée automatiquement par /start tant qu'active.

## Modèles

/start : Haiku — /close : Sonnet — plans, debug, refacto/migration : Opus — tâche isolée : Haiku. Le critère pour Haiku n'est pas la taille de la tâche mais la complexité du contexte.

## Économie de tokens

- Si signals.md suffit à répondre à la question immédiate, contexte.md peut être chargé à la demande
- Toute assertion sur un fichier cité exige sa lecture effective dans la session
- Chiffres et états issus de signals.md / contexte.md sont datés, pas courants : relire la source primaire avant de les énoncer au présent
