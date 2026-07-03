# Signals — claude-vibecoding-kit (MAJ 2026-07-03)

## Actions ouvertes
- [P2|ouvert] Vérifier que les 4 projets déployés (v2.3) reçoivent la section Roadmap + le mécanisme "Spécificités projet" via `/update` — fait quand: chaque zone déployée a exécuté `/update` après v2.8 — réf: DEPLOYMENTS.md, templates/.claude/CLAUDE.md, .claude/commands/update.md

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
- Mode batch `/update all` ajouté : met à jour tous les projets de DEPLOYMENTS.md, silencieux sauf pause ciblée si migration "Spécificités projet" nécessaire sur un projet.
- Mécanisme "Spécificités projet" créé (section dédiée CLAUDE.md + marqueurs start.md/close.md) pour survivre à `/update`, avec détection par diff + question utilisateur si zone absente.
- Convention : toute règle de la zone "Spécificités projet" doit référencer explicitement l'étape/section visée (position toujours en fin de fichier, sinon effet perdu).
- `/doc_sync` ajouté comme étape 8bis dans `.claude/commands/close.md` (kit), via sa propre zone "Spécificités projet".

## Livrables produits ou modifiés
- `.claude/commands/update.md` + `templates/.claude/commands/update.md` : mode batch all, préservation/migration spécificités projet
- `.claude/CLAUDE.md` + `templates/.claude/CLAUDE.md` : section "Spécificités projet"
- `.claude/commands/start.md` + `templates/.claude/commands/start.md` : marqueurs SPECIFICITES PROJET
- `.claude/commands/close.md` + `templates/.claude/commands/close.md` : marqueurs SPECIFICITES PROJET ; version kit contient en plus l'appel `/doc_sync`
- `CHANGELOG.md` : entrées v2.7 et v2.8
- `Protocole_start_close_context.md` : section `/update` et changelog interne mis à jour

## Hypothèses validées / invalidées
- VALIDE : diff + question utilisateur (y compris pause ciblée en mode batch) pour ne rien perdre silencieusement
- VALIDE : convention de référencement explicite par étape/section plutôt que marqueurs positionnels multiples (trop fragiles vu l'évolution du kit)

## Prochaine étape exacte
Lancer `/doc_sync`, puis propager v2.8 aux 4 projets déployés via `/update` (ou `/update all`).

## Question bloquante pour la session suivante
Aucune
