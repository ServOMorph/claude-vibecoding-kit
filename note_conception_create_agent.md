# Note de conception — `/create_agent` (Phase 1 de `roadmap_agents.md`)

Créée le : 2026-07-20. Livrable de la Phase 1 (analyse + conception), avant toute création dans robert-ia (Phase 2).

## 1. Mécanique existante analysée

- **`/start [zone]`** : résout l'alias via `zones.md`, vérifie `_contexte/{signals,contexte}.md`, charge signals.md (priorité) puis contexte.md puis roadmap, affiche signals.md intégralement, résout les `réf:`. Rien de spécifique aux agents à ce jour.
- **`/close <zone>`** : résout l'alias, produit une synthèse, met à jour `_contexte/`, roadmap, README, CHANGELOG, commit git limité au dossier de zone. Mécanisme directement réutilisable pour une zone-agent, à condition que l'alias soit dans `zones.md`.
- **`/init_projet <chemin>`** : crée une première zone (ou une zone supplémentaire via Q5) en copiant `templates/_contexte/`, `start.md`/`close.md` (si première zone), et en ajoutant une ligne à `zones.md`. `/create_agent` est un cas particulier de "zone supplémentaire" : pas besoin de recopier `start.md`/`close.md` (déjà présents à la racine du projet), seulement `_contexte/` + charte + ligne `zones.md`.
- **`/update <cible>` / `all`** : copie `start.md`, `close.md`, `create_memory.md`, `ollama_call.py`, `CLAUDE.md` (fusion partielle) depuis le kit vers la racine `.claude/` du projet cible. Ne touche jamais à `_contexte/` ni `zones.md` de la racine. **Point de vigilance (décision 2 de la roadmap)** : `/update` ne doit pas non plus toucher aux `_contexte/` des zones-agents (`COM/_contexte/`, `MEMORY/_contexte/`) ni à leur `agent_role.md` — aucun mécanisme actuel de `/update` ne les cible (il ne connaît que `<cible>/.claude/` et `<cible>/_contexte/` à la racine), donc rien à corriger dans `update.md` : le risque est déjà nul tant que `/create_agent` ne place jamais de charte à la racine. À vérifier explicitement en Phase 3 lors de l'écriture de `create_agent.md`.

## 2. Arborescence d'un agent (décision)

```
<projet>/<dossier_agent>/
  agent_role.md
  _contexte/
    signals.md
    contexte.md
```

- `<dossier_agent>` = nom du sous-dossier à la racine du projet (ex. `COM/`, `MEMORY/`), fourni en argument de `/create_agent`.
- Pas de `roadmap*.md` par défaut : un agent peut en créer une si son propre travail le justifie (même critère que pour une zone racine).
- Pas de `.claude/commands/` propre à l'agent : il réutilise `start.md`/`close.md` de la racine du projet, qui résolvent l'alias via le `zones.md` unique du projet.

## 3. Format de la charte `agent_role.md` (spécification)

```markdown
# Rôle — <nom agent>

## Rôle
[1-3 phrases : pourquoi cet agent existe, ce qu'il produit]

## Périmètre
- Dossier de sortie : <dossier_agent>/
- Peut lire : [dossiers/fichiers autorisés en lecture, y compris hors de son dossier si nécessaire]
- Peut écrire : <dossier_agent>/ et ses sous-dossiers (par défaut)
- Ne doit pas toucher : [dossiers explicitement interdits, ex. racine du projet, _contexte/ d'autres zones]

## Invariants
- [contraintes déclaratives stables, ex. "ne jamais committer hors de <dossier_agent>/"]

## Méta
- Zone parente : <alias racine du projet>
- Alias zones.md : <alias de cet agent>
- Créé le : AAAA-MM-JJ
```

Rappel décision 5 (roadmap) : ce périmètre est **déclaratif**, pas une isolation technique. `/close` vérifie a posteriori (ex. `git status`/`git diff --name-only` limité au dossier de la zone lors de l'étape 10) plutôt que d'empêcher l'écriture en amont.

## 4. Chargement automatique de la charte par `/start` (décision tranchée)

Insertion dans `start.md`, entre l'étape 2 (vérification `_contexte/`) et l'étape 3 (chargement) :

> **2b.** Si `<dossier>/agent_role.md` existe : le charger et l'afficher intégralement, avant `signals.md`.

Condition : ce fichier n'existe que pour les zones-agents (une zone racine classique n'en a pas) — aucune ambiguïté, pas de flag supplémentaire nécessaire dans `zones.md`. À coder dans `templates/.claude/commands/start.md` en Phase 3 (impacte donc tous les projets via `/update`, y compris ceux sans agent : effet neutre car `agent_role.md` n'existe que si présent).

## 5. Enregistrement dans `zones.md` avec contrôle d'unicité (décision tranchée)

`/create_agent <dossier_cible>` :
1. Dérive un alias par défaut = nom du dossier cible en minuscules (ex. `COM` → `com`).
2. Lit `zones.md` du projet courant (déduit du working directory, comme `/start`/`/close`).
3. Si l'alias existe déjà dans la table : refuser l'écriture, proposer une variante (ex. `com2`, ou demander un alias explicite à l'utilisateur) — jamais d'écrasement silencieux.
4. Si libre : ajouter une ligne `| <alias> | <chemin absolu du dossier agent> |` à `zones.md`.

## 6. Ce qui reste à faire en Phase 2 (rappel, pas remis en cause ici)

Créer concrètement `COM/` et `MEMORY/` dans robert-ia en appliquant les décisions 2 à 5 ci-dessus manuellement (la commande `/create_agent` elle-même n'est écrite qu'en Phase 3).
