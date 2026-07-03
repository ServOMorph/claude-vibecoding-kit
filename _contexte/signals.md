# Signals — claude-vibecoding-kit (MAJ 2026-07-03)

## Actions ouvertes
- [P2|ouvert] Vérifier que les 4 projets déployés (v2.3) reçoivent la section Roadmap de CLAUDE.md via `/update` — fait quand: chaque zone déployée a exécuté `/update` après v2.6 — réf: DEPLOYMENTS.md, templates/.claude/CLAUDE.md

## Questions ouvertes
- Aucune

## Échéances
- Aucune

## Blocages
- Aucun

## Contexte chaud
- `processus-base-connaissances-markdown.md` : fichier non tracké présent à la racine, origine inconnue — non touché cette session, à clarifier si pertinent

## Dernière session (2026-07-03)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->

# Session du 2026-07-03

## Décisions prises
- Règles de création de roadmap déplacées dans `CLAUDE.md` (chargé en permanence) plutôt qu'une commande `/roadmap` dédiée, pour couvrir les demandes formulées en cours de session.
- Tests intégrés à la phase fonctionnelle (dernière tâche = tests exécutés/verts), pas de phase séparée sauf volume important.
- Refacto en phase dédiée uniquement si dette technique visible en fin de phase précédente et trop large pour la suivante.

## Livrables produits ou modifiés
- `.claude/CLAUDE.md`, `templates/.claude/CLAUDE.md` : nouvelle section "Roadmap" (critères, format, contenu des phases)
- `Protocole_start_close_context.md` : section "ROADMAP.md" et changelog interne mis à jour (v2.6)
- `CHANGELOG.md` : entrée v2.6 ajoutée

## Hypothèses validées / invalidées
- INVALIDE : commande `/roadmap` dédiée -> pivot vers règle permanente dans CLAUDE.md
- VALIDE : format canonique de roadmap (nommage, phase EN COURS unique, checkpoint /compact) inchangé, seulement enrichi

## Prochaine étape exacte
Propager v2.6 aux 4 projets déployés via `/update` si la section Roadmap doit s'y appliquer.

## Question bloquante pour la session suivante
Aucune
