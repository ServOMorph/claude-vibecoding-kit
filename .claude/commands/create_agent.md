---
description: Crée un agent (zone à rôle) dans un projet cible, exécutable depuis le kit
argument-hint: "<chemin_projet_cible>" <dossier> [rôle]
model: sonnet
---

# /create_agent <chemin_projet_cible> <dossier> [rôle]

## Objectif

Créer un agent générique : un sous-dossier d'un projet cible, doté d'une charte
(`agent_role.md`) et de sa propre structure `_contexte/`, enregistré comme zone
dans `<projet_cible>/.claude/zones.md`. Un agent n'est pas un subagent Claude
Code : c'est une zone à rôle pilotée par `/start`/`/close`.

Cette commande vit dans le kit et n'est jamais copiée dans les projets cibles :
elle s'exécute toujours depuis le kit, projet cible en premier argument.

## [PREFLIGHT] — résolution, aucune écriture

1. Parser $ARGUMENTS. Le premier argument (chemin absolu du projet cible) peut
   contenir des espaces : s'il n'est pas entre guillemets, tester les préfixes
   croissants des tokens jusqu'à trouver un chemin dont `.claude/zones.md`
   existe. Extraire ensuite : dossier de l'agent (token suivant), rôle (reste
   de la ligne, optionnel).
   - Chemin introuvable : demander "Chemin absolu du projet cible ?" et
     s'arrêter.
   - Dossier absent : demander "Nom du dossier pour ce nouvel agent ?" et
     s'arrêter.
   - Normaliser le nom du dossier en MAJUSCULES (meilleure reconnaissance
     visuelle dans l'arborescence du projet) — s'applique en mode création
     comme en mode conversion (renommage du dossier existant si sa casse
     diffère). L'alias de zone (dérivé à l'étape 4) reste en minuscules,
     indépendamment de cette normalisation.

2. Vérifier `<projet_cible>/.claude/zones.md`. Absent → s'arrêter, le projet
   n'a pas encore été initialisé via `/init_projet`.

3. Vérifier que `<projet_cible>/.claude/commands/start.md` contient une
   référence à `agent_role.md` (chargement automatique de la charte par
   `start.md`). Absente (projet pas encore passé par `/update` avec cette
   fonctionnalité) : avertir "⚠️ Le `start.md` de ce projet ne charge pas
   automatiquement la charte des agents — l'agent créé n'aura aucun effet
   visible tant que `/update` n'aura pas été lancé sur ce projet." et demander
   confirmation ("Continuer quand même (o/n) ?"). Ne jamais créer l'agent
   silencieusement dans ce cas.

4. Dériver l'alias par défaut = nom du dossier cible en minuscules, puis lire
   `zones.md` et résoudre le **mode** :
   - Alias absent → mode **création**.
   - Alias présent, pointant vers un autre dossier → refuser, proposer une
     variante (suffixe numérique) ou demander un alias explicite. Jamais
     d'écrasement silencieux.
   - Alias présent, pointant vers le dossier demandé → mode **conversion**
     (zone existante à convertir en agent). `zones.md` ne sera jamais modifié
     dans ce mode.
   - `agent_role.md` déjà présent dans le dossier cible → s'arrêter, la zone
     est déjà un agent.

## [COLLECTE] — une seule interaction, puis analyse conditionnelle

5. Si rôle, périmètre d'écriture ou mode conversion restent à confirmer,
   poser une **question unique groupée** :
   - Rôle **durable** de l'agent (raison d'être pérenne, pas la tâche du
     jour). Si absent ou formulé comme une tâche unique (ex. « rédiger le
     message WhatsApp du 25/07 » au lieu de « produire la communication du
     projet ») : redemander précisément ce point, ne jamais inventer de rôle
     générique par défaut.
   - Périmètre d'écriture : par défaut l'agent n'écrit que dans son propre
     dossier ; lister les chemins si extension nécessaire → `{{ECRITURE_ETENDUE}}`.
   - En mode conversion : confirmation explicite du mode.

6. Analyse du projet cible pour `{{STACK}}` — **uniquement si le résultat sera
   utilisé** (mode création, ou mode conversion avec `contexte.md` absent ou
   section stack vide/générique). Lire, dans cet ordre, ce qui existe :
   `README.md` racine, fichier de config principal (`package.json`,
   `pyproject.toml`, `project.godot`, `Cargo.toml`, etc.), bloc "Spécificités
   projet" de `AGENTS.md`/`CLAUDE.md`, docs de `_docs/` pertinents pour le
   rôle, arborescence de premier niveau. Produire un bloc `{{STACK}}` filtré
   par le rôle (versions, contraintes, conventions, dossiers cibles) — ne rien
   inventer, ne pas recopier le README. Rien d'exploitable trouvé → "Hérite de
   la stack du projet parent." et le signaler.

## [ECRITURE] — toutes les écritures groupées

7. Mode **création** :
   - Créer `<projet_cible>/<dossier>/agent_role.md` depuis
     `templates/agent_role_TEMPLATE.md` du kit, placeholders remplacés :

     | Placeholder | Remplacé par |
     |-------------|--------------|
     | `{{DOSSIER_AGENT}}` | Nom du dossier cible |
     | `{{ROLE}}` | Rôle collecté en [COLLECTE] |
     | `{{ALIAS_RACINE}}` | Alias racine du projet cible (cf. règle ci-dessous) |
     | `{{ALIAS_AGENT}}` | Alias résolu en [PREFLIGHT] |
     | `{{DATE}}` | Date du jour (AAAA-MM-JJ) |
     | `{{ECRITURE_ETENDUE}}` | Vide, ou `, <chemins déclarés en [COLLECTE]>` |

     Règle `{{ALIAS_RACINE}}` : ne retenir la première ligne de `zones.md`
     que si son chemin correspond à la racine du projet cible elle-même (pas
     un sous-dossier). Si non déterminable, ne pas laisser le champ vide :
     supprimer entièrement la ligne `- Zone parente : ...` de la charte
     générée, plutôt que d'afficher un champ orphelin ou d'affirmer une zone
     parente incorrecte.
   - Créer `<projet_cible>/<dossier>/_contexte/signals.md` et `contexte.md`
     depuis `templates/_contexte/`, placeholders `{{ALIAS}}`/`{{DATE}}` avec
     l'alias de l'agent, `{{OBJECTIF}}` = rôle collecté, `{{STACK}}` = bloc
     produit en [COLLECTE].
   - Ajouter à `<projet_cible>/.claude/zones.md` :
     `| <alias> | <chemin absolu du dossier de l'agent> |`

   Mode **conversion** — ne créer que ce qui manque, ne jamais écraser :
   - `agent_role.md` : le créer (règles ci-dessus).
   - `_contexte/contexte.md`/`signals.md` absents : les créer normalement.
   - `_contexte/contexte.md` présent : ne pas réécrire. Si section stack
     vide/générique, proposer d'y insérer le bloc produit en [COLLECTE] et
     attendre l'accord.
   - `_contexte/signals.md` présent : ne jamais le toucher.
   - `zones.md` : jamais modifié, sauf renommage du dossier (casse) — dans ce
     cas, mettre à jour uniquement le chemin de la ligne existante, l'alias
     ne change pas.
   - Dossier existant dont la casse n'est pas déjà en majuscules : le
     renommer avant toute écriture (`git mv` si le dossier est suivi par
     git), puis répercuter le nouveau chemin dans `zones.md`.

8. Ajouter une ligne à `<racine du kit>/AGENTS_REGISTRY.md` (créer le fichier
   avec son en-tête standard s'il n'existe pas) :
   ```
   | <alias> | <nom du projet cible> | <chemin absolu du dossier agent> | <rôle> | {{DATE}} | à évaluer | Premier lancement, pas encore de retour d'expérience. |
   ```
   Fichier local (hors git) : registre centralisé tous projets confondus,
   colonne "Verdict"/"Retex" mise à jour manuellement ensuite.

9. Ajouter une entrée à `<racine du kit>/ameliorations_create_agent.md` (jamais
   dans le projet cible), sous la section "Historique" :
   ```
   ## {{DATE}} — agent <alias> (<projet_cible>)
   [ce qui a bien fonctionné / ce qui a nécessité une clarification manuelle]
   ```
   Obligatoire — jamais seulement un affichage dans le chat, sous peine
   d'être ignoré après un ou deux usages.

## [SORTIE]

10. Demander à l'utilisateur : "Copier dans le presse-papier un message de mise à
    jour pour l'agent racine (`{{ALIAS_RACINE}}`), résumant les agents créés
    cette session (o/n) ?" Ne poser qu'une fois par appel, même si plusieurs
    agents ont été créés en lot. Si oui : générer un message court (5-10 lignes
    max, optimisé tokens — liste des agents créés, alias, rôle en une ligne,
    périmètre étendu le cas échéant) et le copier dans le presse-papier
    (`Set-Clipboard`) — ne rien écrire dans les fichiers du projet cible.
    `{{ALIAS_RACINE}}` non déterminable (cf. règle de l'étape 7) : poser la
    question sans résoudre automatiquement la cible, demander le nom de la zone
    racine à mentionner dans le message.

11. Un seul récapitulatif :
    - Fichiers créés / laissés intacts (liens cliquables, chemin absolu).
    - Rappel : le périmètre défini dans `agent_role.md` est déclaratif, pas
      une isolation technique — `/close` en vérifie a posteriori le respect
      (`git status`/`git diff --name-only` limité au dossier de la zone),
      rien n'empêche techniquement d'écrire ailleurs.
    - Confirmation : "✅ Agent <alias> créé dans <projet_cible>/<dossier>.
      Lancer /start <alias> depuis <projet_cible> pour commencer." (mode
      conversion : "complété (zone existante convertie en agent)".)
    - Recommandation : passer sur Opus pour une analyse à froid du
      déroulement de cette création (frictions, informations manquantes,
      ambiguïtés de la charte générée) si l'utilisateur souhaite creuser au-
      delà de l'entrée déjà écrite en [ECRITURE].

## [AUDIT] — analyse de la commande elle-même, jamais automatique

12. Cette phase ne s'exécute **pas** dans le flux normal d'une création
    d'agent. Elle ne se déclenche que si l'utilisateur la demande
    explicitement, après une modification de `create_agent.md` ou après une
    création qui a mal tourné.

    Si l'utilisateur la demande alors que le modèle courant n'est pas Opus :
    répondre "Cette analyse demande Opus (`/model opus`) — sur un modèle plus
    léger elle produira une validation de complaisance plutôt qu'un audit."
    et s'arrêter. Ne pas la mener malgré tout.

    Sur Opus, auditer le fichier `create_agent.md` — pas l'agent produit —
    sur quatre axes, dans cet ordre :

    - **Pertinence** : chaque ajout récent répond-il à une friction réellement
      observée (tracée dans `ameliorations_create_agent.md` ou
      `TEST_CREATE_AGENT_RESULTS.md`) ou à une friction supposée ? Signaler
      tout ajout sans cas d'usage constaté, et proposer sa suppression.
    - **Économie de tokens** : identifier ce qui est lu ou écrit sans être
      utilisé (analyses non conditionnées, fichiers ouverts pour rien,
      redites entre phases), et ce qui déclenche plus d'un aller-retour avec
      l'utilisateur là où une question groupée suffirait.
    - **Construction** : cohérence des renvois (ancres de phase, pas de
      numéros d'étape), placeholders de la commande ↔ placeholders réellement
      présents dans `templates/agent_role_TEMPLATE.md` et
      `templates/_contexte/`, absence de branche morte ou de cas non couvert
      entre modes création et conversion.
    - **Régression** : une règle antérieure a-t-elle disparu sans décision
      explicite ? Comparer avec `git log`/`git diff` sur ce fichier.

    Sortie obligatoire : mettre à jour `<racine du kit>/ameliorations_create_agent.md`
    — verdict par axe, propositions numérotées (P<n>) pour ce qui reste à
    trancher, et marquage `[Implémentée le {{DATE}}]` pour ce qui est corrigé
    dans la foulée. Un audit qui ne laisse qu'un message dans le chat ne
    compte pas.

    Ne pas modifier `create_agent.md` pendant l'audit sans accord explicite de
    l'utilisateur : l'audit constate, l'utilisateur arbitre.

<!-- SPECIFICITES PROJET : DEBUT (préservé par /update, ne pas toucher hors de ce bloc) -->
<!-- Convention : toute règle liée à une phase précise de la Procédure ci-dessus doit la
     référencer explicitement par son ancre ([PREFLIGHT]/[COLLECTE]/[ECRITURE]/[SORTIE]/[AUDIT]),
     plutôt que par un numéro d'étape ou la position physique de cette zone. -->
<!-- SPECIFICITES PROJET : FIN -->
