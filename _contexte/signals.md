# Signals — claude-vibecoding-kit (MAJ 2026-07-03)

## Actions ouvertes
- [P2|ouvert] Vérifier que les 4 projets déployés (v2.3) reçoivent la section Roadmap + le mécanisme "Spécificités projet" via `/update` — fait quand: chaque zone déployée a exécuté `/update` après v2.9 — réf: DEPLOYMENTS.md, templates/.claude/CLAUDE.md, .claude/commands/update.md
- [P2|ouvert] Vérifier que les scripts/habitudes de lancement de `/update` sur les 4 projets déployés sont mis à jour suite à l'inversion du sens de la commande (v2.9) — fait quand: chaque zone déployée est mise à jour en lançant `/update <chemin>` depuis le repo du kit — réf: .claude/commands/update.md, CHANGELOG.md v2.9

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
- `/update` inversé : se lance désormais depuis le repo du kit avec le chemin du projet cible en argument (au lieu de l'inverse). Toutes les opérations sur le projet cible référencent explicitement ce chemin (`git -C <cible> ...`).
- `DEPLOYMENTS.md`/`CHANGELOG.md` sont désormais lus à la racine du kit (working directory), plus de préfixe `$ARGUMENTS/`.

## Livrables produits ou modifiés
- `.claude/commands/update.md` + `templates/.claude/commands/update.md` : inversion kit/cible, argument-hint mis à jour
- `Protocole_start_close_context.md` : section `/update` et changelog interne mis à jour (v2.9)
- `CHANGELOG.md` : entrée v2.9

## Hypothèses validées / invalidées
- VALIDE : l'inversion élimine l'incohérence détectée en session (argument pointant vers un dossier non-kit alors que le cwd était déjà le kit)

## Prochaine étape exacte
Propager v2.9 aux 4 projets déployés via `/update <chemin>` (ou `/update all`) depuis le repo du kit.

## Question bloquante pour la session suivante
Aucune
