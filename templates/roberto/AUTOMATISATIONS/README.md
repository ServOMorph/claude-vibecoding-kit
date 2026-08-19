# AUTOMATISATIONS

## Objectif
Dossier de workflows déclenchables par commande vocale depuis `com_telephone`, sans passer par
une commande slash classique (le téléphone ne tape pas `/`, il parle).

## Structure
- `workflows/<nom>.md` : workflow simple, un seul fichier.
- `workflows/<nom>/<nom>.md` : workflow avec fichiers annexes (données, UI de configuration...),
  placés dans son propre dossier `<nom>/`. Les instructions à exécuter restent dans
  `<nom>/<nom>.md`.

## Convention de déclenchement
Quand un message reçu via `messages.log` correspond au motif `workflow <nom>` (ex: "workflow
quotidien"), l'agent qui surveille le fichier doit :
1. Ouvrir `AUTOMATISATIONS/workflows/<nom>.md` ou `AUTOMATISATIONS/workflows/<nom>/<nom>.md`
   selon la structure du workflow.
2. Exécuter les instructions qu'il contient.
3. Répondre à l'utilisateur via `POST /send` (cf. `com_telephone/README.md`).

Si `<nom>.md` n'existe pas, répondre que le workflow demandé n'existe pas.

## Invocation de `claude` en CLI dans un autre projet
Quand un workflow délègue une tâche à une session `claude -p` dans un autre projet (ex:
`SérénIATech_dev`), cette session de travail ne charge ni ne clôture le contexte de zone
d'elle-même — encadrer systématiquement la tâche de deux sessions `claude -p` séparées, dans ce
même projet, sur la zone réellement concernée :
1. `/start <alias_zone>` avant de déléguer la tâche, pour que la session travaille sur l'état réel
   connu du projet (signals.md/contexte.md/roadmap) plutôt que sur les seuls éléments mentionnés
   dans le prompt de délégation.
2. `/close <alias_zone>` une fois la tâche terminée, pour que `contexte.md`/`signals.md` soient
   mis à jour correctement et que le travail soit commité.
Utiliser `AGENTS_REGISTRY.md` (racine du kit) et le `.claude/zones.md` du projet cible pour
identifier le bon alias de zone.

## Workflows disponibles
- `quotidien/` : analyse l'avancement des projets de `DEPLOYMENTS.md` (par ordre de priorité) et
  passe en revue les actions urgentes avec l'utilisateur.
  - `quotidien.md` : instructions du workflow.
  - `ordre_projets.md` : ordre de priorité des projets de `DEPLOYMENTS.md`, édité à la main ou
    via l'UI de `UI/`.
  - `avancement.py` : imprime l'état actuel de chaque projet (section "État actuel" de
    `_contexte/contexte.md`) ; cas particulier pour SérénIATech_dev, dont les actions urgentes
    viennent de `urgences_sereniatech.py` (Orga/data/orga.json + etiquettes.json).
  - `decisions.md` : roadmap vivante des décisions prises pendant les revues, jamais réinitialisée
    ni archivée — chaque lancement ajoute une section datée. Case cochée `[x]` seulement après
    validation explicite de l'utilisateur que la tâche est terminée.
  - `UI/` : interface de réordonnancement par glisser-déposer. Lancement : `py -3.11 UI/server.py`
    (ouvre `http://127.0.0.1:5100` dans le navigateur par défaut). Bouton "VALIDER" pour
    enregistrer l'ordre dans `ordre_projets.md`.
