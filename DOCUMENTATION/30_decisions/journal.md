---
type: journal
description: Journal append-only des décisions structurantes de la base de documentation
tags: decisions, journal
maj: 2026-08-21
---

# Journal des décisions

Append-only : ajouter en bas, ne jamais réécrire une entrée. Format : `AAAA-MM-JJ — <décision> — <rationale 1-2 lignes>`.

## 2026

- 2026-08-21 — Création de la zone DOCUMENTATION (agent documentation) — le kit appliquait déjà le pattern base_connaissances/ (fiches projets) ; la documentation du kit lui-même manquait.
- 2026-08-21 — Architecture de la base : sources canoniques (read-only) / DOCUMENTATION/ (docs compilées) / INDEX.md (schéma + conventions) — alignée sur le LLM Wiki (Karpathy 2026) et OKF v0.1 (Google) : synthèse à l'écriture, fetch markdown bon marché à la lecture, pas de RAG à cette échelle.
- 2026-08-21 — Articulation complémentaire avec base_connaissances/ : fiches projets ≠ documentation du kit ; renvoi croisé par liens, jamais de recopie.
- 2026-08-21 — Écriture limitée à DOCUMENTATION/ ; alimentation double : signaux des /close des autres zones (mécanisme à implémenter côté kit) + sessions dédiées /start documentation.
- 2026-08-21 — Bootstrap : INDEX.md + 10_concepts/ + 20_guides/ + 30_decisions/, frontmatter minimal (type, description, tags, maj), documents ≤ ~200 lignes.
