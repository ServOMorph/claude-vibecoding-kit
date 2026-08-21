---
type: concept
description: Synthèse du protocole vibecoding : contexte entre sessions, modèles recommandés, _contexte/, roadmap, délégation Ollama
tags: protocole, contexte
maj: 2026-08-21
---

# Protocole vibecoding

Synthèse. Source canonique : [`../../_docs/protocole_vibecoding.md`](../../_docs/protocole_vibecoding.md) (détail complet) et [`../../README.md`](../../README.md).

## Problème résolu

Le contexte est perdu à chaque nouvelle conversation, et le contexte se remplit vite. Le protocole extrait explicitement ce qui compte (décisions, livrables, signaux) dans des fichiers courts et curatés, rechargés uniquement au démarrage de session.

## Les deux mécanismes de contexte

| Mécanisme | Usage | Caractéristiques |
|---|---|---|
| `/compact` | Entre phases d'une même session | Compression en place, préserve le fil, résumé automatique |
| `/close` + `/start` | Entre sessions | Extraction explicite dans fichiers curatés, plus économe en tokens |

Ne pas inverser : compact seul entre sessions = bruit ; close/start entre chaque phase = sur-ingénierie.

## Modèles recommandés

| Tâche | Modèle |
|---|---|
| /start | Haiku |
| /close | Sonnet |
| Plans, debug, refacto / migration structurelle | Opus |
| Appliquer un plan | Sonnet |
| Tâche isolée, sans dépendances, sans effet de bord | Haiku |
| Répétitif, templated, données sensibles | Ollama local |

Attention Haiku : le critère est la complexité du contexte, pas la taille de la tâche. Une petite modification dans un codebase avec dépendances peut cacher un bug subtil que le debug coûtera plus cher que l'économie.

## Structure `_contexte/` (par zone)

- `contexte.md` : objectif (2 lignes), stack, état actuel (5 lignes, réécrit à chaque /close), décisions structurantes (append-only, 10 entrées max, archiver au-delà)
- `signals.md` : fichier de pilotage actif, lu en premier par /start — actions ouvertes, questions, échéances, blocages, contexte chaud (volatile), dernière session (< 25 lignes, écrasée par /close)
- `archive_decisions.md`, `archive_sessions.md` : stockage historique, jamais chargés par /start

## Zones et multi-zones

Un projet peut avoir plusieurs zones : alias → dossier réel (table `zones.md`). Une zone-agent ajoute `agent_role.md` (charte : rôle, périmètre, invariants), chargée et affichée par /start avant signals.md.

## Roadmap

Chantier multi-phases uniquement (phases distinctes, plusieurs sessions, risque de perte de fil) : une phase `[EN COURS]` à la fois, checkpoint `/compact` entre phases, statuts mis à jour par /close, jamais en cours de session. Tests intégrés à chaque phase.

## Délégation Ollama

Tâches répétitives / templated / sensibles : `python ollama_call.py "<prompt>"`. Ne jamais envoyer de données sensibles à un modèle cloud. Ne pas déléguer si le résultat est intégré sans relecture ou implique des dépendances applicatives.

## Commandes du kit

`/start`, `/close`, `/init_projet`, `/update`, `/create_memory` (déployées dans les projets) ; kit uniquement : `/create_agent`, `/create_com_agents`, `/insert_template`, `/init_discord_mode`, `/cherche_meilleure_action`, `/doc_sync`, `/cherche_fonction`. Détails : README et guides 20_.
