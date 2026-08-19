# Workflow quotidien

## Objectif
Analyser l'avancement des projets listés dans `DEPLOYMENTS.md`, classés par priorité dans
`ordre_projets.md`, et proposer les actions prioritaires du jour à l'utilisateur.

## Procédure
1. Lire `decisions.md` sans le réinitialiser : c'est une roadmap vivante, jamais effacée ni
   archivée entre deux lancements. Si une section pour la date du jour n'existe pas encore,
   l'ajouter à la suite (ne jamais toucher aux sections précédentes).
2. Exécuter `py -3.11 "<dossier_de_ce_fichier>/avancement.py"`. Le script imprime, pour chaque
   projet de `ordre_projets.md` dans l'ordre de priorité, la section "État actuel" de son
   `_contexte/contexte.md` (ou "état inconnu" si le fichier ou la section est absent). Pour
   SérénIATech_dev, il imprime la liste des actions urgentes réelles (cf. `avancement.py`).
3. Répondre à l'utilisateur via `POST /send` (cf. `com_telephone/README.md`) avec un résumé des
   projets les mieux classés et leur état actuel.
4. Pendant la revue (notamment des actions urgentes SérénIATech_dev), chaque décision prise par
   l'utilisateur ("je m'en occupe", "à faire par toi", "reporté", etc.) doit être ajoutée à
   `decisions.md` sous la section `## <date du jour>`, format :
   `- [ ] **[zone] titre de l'action** — décision prise.`
   Ne jamais attendre la fin de la revue pour écrire : une décision se journalise dès qu'elle est
   prise, pour ne rien perdre si la session s'interrompt. Une entrée réglée sur le champ (rien à
   faire, déjà confirmé par l'utilisateur) peut être cochée `[x]` directement. Une tâche qui
   nécessite un travail effectif reste décochée `[ ]` tant que l'utilisateur n'a pas validé
   explicitement que le travail est terminé — le lui demander avant de cocher, jamais cocher
   d'initiative.
5. Si une décision délègue une action à une session `claude -p` dans un autre projet (ex:
   "à faire par toi" sur une action SérénIATech_dev) : identifier l'alias de zone concerné via
   `AGENTS_REGISTRY.md` (racine du kit) et le `.claude/zones.md` du projet cible, puis encadrer la
   tâche de deux sessions `claude -p` distinctes de la session de travail elle-même :
   1. `/start <alias_zone>` — charge le contexte réel de la zone avant toute action.
   2. La tâche déléguée elle-même.
   3. Une fois la tâche terminée, `/close <alias_zone>` — met à jour `contexte.md`/`signals.md`
      et commite. La session de travail ne se clôture jamais d'elle-même, il faut l'appeler
      explicitement après coup.
   Détail de la convention : `AUTOMATISATIONS/README.md`.

## À faire (phases suivantes de `roadmap_workflow_quotidien.md`)
- Score d'envie par projet et formule de sélection des 3 actions concrètes (Phase 3).
- Sélection effective des 3 actions + boucle de décision vocale avec l'utilisateur (Phase 4).
