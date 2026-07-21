---
description: Crée un agent (zone à rôle) dans le projet courant
argument-hint: <dossier> [rôle]
model: sonnet
allowed-tools: Bash(git status:*)
---

# /create_agent <dossier> [rôle]

## Objectif

Créer un agent générique : un sous-dossier du projet courant, doté d'une charte
(`agent_role.md`) et de sa propre structure `_contexte/`, enregistré comme zone
dans `.claude/zones.md`. Un agent n'est pas un subagent Claude Code : c'est une
zone à rôle pilotée par `/start`/`/close`, au même titre que la zone racine.

## Procédure

1. Lire l'argument $ARGUMENTS : premier token = nom du dossier cible à créer
   (ex. `COM`), reste de la ligne = description du rôle (optionnel).
   - Si le nom du dossier est absent : demander "Nom du dossier pour ce nouvel
     agent ?" et s'arrêter dans l'attente de la réponse.
   - Rôle : capter le **rôle durable** de l'agent (sa raison d'être pérenne),
     jamais la tâche ponctuelle du moment. Si le rôle est absent, ou s'il est
     formulé comme une tâche unique (ex. « rédiger le message WhatsApp du 25/07 »
     au lieu de « produire la communication du projet ») : demander "Quel est le
     rôle durable de cet agent — ce qu'il produira de façon récurrente, pas la
     tâche du jour (1-3 phrases) ?" et s'arrêter dans l'attente de la réponse.
     Ne jamais inventer un rôle générique par défaut.
   - Périmètre d'écriture : par défaut un agent n'écrit que dans son propre
     dossier. Demander "Cet agent doit-il écrire hors de son dossier (code
     applicatif, config, etc.) ? Si oui, lister les chemins ; sinon répondre
     non." Conserver la réponse pour l'étape 5 (`{{ECRITURE_ETENDUE}}`). Ne pas
     élargir le périmètre sans réponse explicite.

2. Résoudre la racine du projet courant (working directory) et vérifier que
   `.claude/zones.md` y existe. Si absent : s'arrêter, ce projet n'a pas encore
   été initialisé via `/init`.

3. Dériver un alias par défaut = nom du dossier cible en minuscules.

4. Lire `.claude/zones.md` :
   - Si l'alias existe déjà dans la table : refuser l'écriture, proposer une
     variante (ex. suffixe numérique) ou demander un alias explicite à
     l'utilisateur. Jamais d'écrasement silencieux d'une ligne existante.

5. Créer l'arborescence de l'agent :
   ```
   <dossier>/agent_role.md
   <dossier>/_contexte/signals.md
   <dossier>/_contexte/contexte.md
   ```
   - `agent_role.md` : copié depuis `templates/agent_role_TEMPLATE.md` (ou
     `<kit>/templates/agent_role_TEMPLATE.md` si la commande s'exécute hors du
     kit), avec les placeholders remplacés :

     | Placeholder | Remplacé par |
     |-------------|--------------|
     | `{{NOM_AGENT}}` | Nom du dossier cible |
     | `{{ROLE}}` | Rôle fourni à l'étape 1 |
     | `{{DOSSIER_AGENT}}` | Nom du dossier cible |
     | `{{ALIAS_RACINE}}` | Alias de la zone racine du projet (première ligne de `zones.md`) |
     | `{{ALIAS_AGENT}}` | Alias résolu à l'étape 3-4 |
     | `{{DATE}}` | Date du jour (AAAA-MM-JJ) |
     | `{{ECRITURE_ETENDUE}}` | Vide si l'agent n'écrit que dans son dossier ; sinon `, <chemins déclarés à l'étape 1>` |

   - `_contexte/signals.md` et `_contexte/contexte.md` : copiés depuis
     `templates/_contexte/`, placeholders `{{ALIAS}}`/`{{DATE}}` remplacés avec
     l'alias de l'agent. `{{OBJECTIF}}` = rôle fourni à l'étape 1,
     `{{STACK}}` = "Hérite de la stack du projet parent."

6. Ajouter une ligne à `.claude/zones.md` :
   ```
   | <alias> | <chemin absolu du dossier cible> |
   ```

7. Rappeler explicitement à l'utilisateur que le périmètre défini dans
   `agent_role.md` est déclaratif, pas une isolation technique : `/close` en
   vérifie a posteriori le respect (`git status`/`git diff --name-only` limité
   au dossier de la zone), rien n'empêche techniquement d'écrire ailleurs.

8. Lister les fichiers créés ou modifiés (liens cliquables, chemin absolu).

9. Confirmer : "✅ Agent <alias> créé dans <dossier>. Lancer /start <alias> pour commencer."

10. Étape finale obligatoire : recommander à l'utilisateur de passer sur le
    modèle Opus pour analyser à froid le déroulement de cette création d'agent
    (frictions rencontrées, informations manquantes, ambiguïtés de la charte
    générée). Que l'utilisateur donne suite ou non dans l'immédiat, écrire ou
    mettre à jour `<racine du projet>/ameliorations_create_agent.md` avec au
    moins une ligne datée résumant l'usage qui vient d'être fait de la
    commande — jamais seulement un affichage dans le chat, sous peine d'être
    ignoré après un ou deux usages. Format d'entrée :
    ```
    ## {{DATE}} — agent <alias>
    [ce qui a bien fonctionné / ce qui a nécessité une clarification manuelle]
    ```

<!-- SPECIFICITES PROJET : DEBUT (préservé par /update, ne pas toucher hors de ce bloc) -->
<!-- Convention : toute règle liée à une étape précise de la Procédure ci-dessus doit la
     référencer explicitement par son numéro, plutôt que compter sur la position physique
     de cette zone (toujours en fin de fichier). -->
<!-- SPECIFICITES PROJET : FIN -->
