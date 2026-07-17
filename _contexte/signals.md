# Signals — claude-vibecoding-kit (MAJ 2026-07-17)

## Actions ouvertes
- Aucune

## Questions ouvertes
- Aucune

## Échéances
- Aucune

## Blocages
- Aucun

## Contexte chaud
- `processus-base-connaissances-markdown.md` : fichier non tracké présent à la racine, origine inconnue — non touché cette session, à clarifier si pertinent
- `README.md` : corruption d'encodage pré-existante (double UTF-8) sur l'ensemble du fichier hors les lignes corrigées ces dernières sessions — à traiter dans une session dédiée si gênant

## Dernière session (2026-07-17)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->

# Session du 2026-07-17

## Décisions prises
- `/close` : création automatique du `README.md` du projet cible s'il n'existe pas encore (au lieu de demander confirmation).
- `/update` : correction de plusieurs incohérences documentaires — suppression des références obsolètes au mécanisme `{{ALIAS}}`/`{{RACINE}}` (start.md/close.md lisent `zones.md` directement depuis une version antérieure), et correction de l'objectif/étape 2/étape 9 qui listaient à tort `init_projet.md`/`update.md` comme copiés vers les projets cibles.
- Asymétrie Q5 (`init_projet.md`) : déjà résolue avant cette session, les deux copies étaient identiques — action clôturée sans intervention.
- `/update all` exécuté sur les 9 projets déployés vers kit v2.13, dont migration complète d'IA-TSA vers le mécanisme "Spécificités projet" (jamais fait auparavant ; section RGPD migrée sur décision utilisateur).

## Livrables produits ou modifiés
- `.claude/commands/close.md` + `templates/` : étape README (n°7) modifiée
- `.claude/commands/update.md` + `templates/` : étapes 2, 4, 5, 9 et objectif corrigés
- `CHANGELOG.md`, `Protocole_start_close_context.md` : entrée v2.13 ajoutée
- 9 projets déployés (voir `DEPLOYMENTS.md`) mis à jour et committés individuellement dans leurs propres dépôts : robert-ia, jeu, Appli_TSA_SDI_TDAH, jegeekutile, SérénIATech_dev, visioaide, tableaudebord, ia-tsa, larev

## Hypothèses validées / invalidées
- VALIDE : `/update.md` contenait des références obsolètes à un mécanisme de substitution de placeholders retiré du kit depuis que `start.md`/`close.md` lisent `zones.md` directement — corrigé.
- VALIDE : IA-TSA n'avait jamais migré vers le mécanisme "Spécificités projet" — migration effectuée, une seule section (RGPD) à reporter.

## Prochaine étape exacte
Aucune action ouverte — session de maintenance clôturée.

## Question bloquante pour la session suivante
Aucune
