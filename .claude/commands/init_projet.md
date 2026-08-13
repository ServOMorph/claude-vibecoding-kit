---
description: Initialise le protocole vibecoding dans le projet cible
argument-hint: <chemin vers le projet à initialiser>
model: sonnet
---

# /init

## Objectif

Initialiser le protocole vibecoding dans le projet cible à partir de ce kit de templates.

## Procédure

### 1. Résoudre les chemins

- Le kit est ce dépôt : dossier de travail actif (working directory) au moment de l'exécution.
- La racine du projet cible est fournie en argument ($ARGUMENTS).
  Si absent : demander "Chemin vers le projet à initialiser ?"
- `templates/` = `<kit>/templates`
- `protocole/` = `<kit>/Protocole_start_close_context.md`
- Racine du projet cible = `$ARGUMENTS` (chemin absolu — résoudre si relatif).

### 2. Poser ces questions avant toute action

1. Alias de la zone (nom court, sans espace) ?
2. Objectif du projet (1-2 phrases) ?
3. Stack technique (liste courte) ?
4. Projet sous git ? (oui/non)
   - Si "non" : proposer "Automatiser un backup du dossier projet vers Google Drive à chaque
     /close (miroir via rclone, dans BackUps/<nom_du_dossier>/) ? (oui/non)" (Q4bis). Un projet
     sans git n'a aucune protection contre la perte de travail ; ce backup en tient lieu.
     Si "oui" à Q4bis : noter le nom du dossier projet (nom de `$ARGUMENTS`) comme destination.
5. Première zone de ce projet, ou zone supplémentaire ?
   - Si supplémentaire : `.claude/commands/start.md` et `close.md` existent déjà.
     Ajouter une ligne `{{ALIAS}} | {{RACINE}}` à leur table des zones au lieu de copier ces fichiers.
6. Des dossiers/fichiers sensibles à déclarer (registre nominatif, credentials, données clients) ?
   Si oui, les lister ; sinon répondre "Aucun".
7. Créer `AGENTS.md` ? C'est l'équivalent de `CLAUDE.md` pour les agents non-Claude (Codex, ChatGPT,
   Gemini...) — utile seulement si le projet est aussi piloté par un autre outil qu'Claude Code.
   Jamais créé automatiquement, toujours demandé. (oui/non)
8. Créer `GEMINI.md` ? Équivalent de `CLAUDE.md` spécifique à Gemini — utile seulement si Gemini
   intervient aussi sur ce projet. Jamais créé automatiquement, toujours demandé. (oui/non)

La racine du projet cible ne doit jamais être demandée si $ARGUMENTS est fourni.

### 3. Copier les fichiers vers la racine du projet cible

- `templates/_contexte/` → `$ARGUMENTS/_contexte/`
- `templates/.claude/CLAUDE.md` → `$ARGUMENTS/.claude/CLAUDE.md`
  (si déjà présent : demander avant d'écraser)
- `templates/.claude/commands/start.md` → `$ARGUMENTS/.claude/commands/start.md`
  (sauf zone supplémentaire, voir Q5)
- `templates/.claude/commands/close.md` → `$ARGUMENTS/.claude/commands/close.md`
  (sauf zone supplémentaire, voir Q5)
- `templates/.claude/commands/create_memory.md` → `$ARGUMENTS/.claude/commands/create_memory.md`
- `templates/.claude/zones.md` → `$ARGUMENTS/.claude/zones.md`
  (sauf zone supplémentaire : ajouter une ligne `| alias | dossier |` à la table existante)
- `templates/ollama_call.py` → `$ARGUMENTS/ollama_call.py`
- `<kit>/Protocole_start_close_context.md` → `$ARGUMENTS/_docs/protocole_vibecoding.md`
- `templates/AGENTS.md` → `$ARGUMENTS/AGENTS.md`
  (seulement si réponse "oui" à Q7 ; si déjà présent : demander avant d'écraser)
- `templates/GEMINI.md` → `$ARGUMENTS/GEMINI.md`
  (seulement si réponse "oui" à Q8 ; si déjà présent : demander avant d'écraser)
- `templates/backup_project.py` → `$ARGUMENTS/backup_project.py`
  (seulement si réponse "oui" à Q4bis)

Ne pas copier `roadmap_TEMPLATE.md` (utilisé uniquement à la création d'un chantier).

### 4. Remplacer les placeholders

Dans tous les fichiers copiés sous `_contexte/`, `.claude/commands/` et `.claude/zones.md` :

| Placeholder | Remplacé par |
|-------------|--------------|
| `{{ALIAS}}` | Alias de la zone (réponse Q1) |
| `{{RACINE}}` | Chemin absolu de la racine du projet ($ARGUMENTS) |
| `{{OBJECTIF}}` | Objectif du projet (réponse Q2) |
| `{{STACK}}` | Stack technique (réponse Q3) |
| `{{DATE}}` | Date du jour (AAAA-MM-JJ) |
| `{{DONNEES_SENSIBLES}}` | Réponse Q6, en liste à puces ; "Aucun déclaré." si réponse négative |

### 4bis. Brancher le backup Google Drive dans close.md (si réponse "oui" à Q4bis)

Uniquement si `backup_project.py` a été copié (Q4bis = "oui") et que `close.md` a été copié à
cette exécution (pas en cas de zone supplémentaire, Q5) :

1. Dans `$ARGUMENTS/.claude/commands/close.md`, ajouter `PowerShell(python *backup_project.py*)`
   à la liste `allowed-tools` du frontmatter (même ligne que les outils `Bash(git ...)`).
2. Insérer, entre les marqueurs `<!-- SPECIFICITES PROJET : DEBUT -->` / `FIN` de ce même fichier,
   l'étape suivante :

   ```
   Sauvegarde du dossier projet vers Google Drive (projet sans git) :
   - Exécuter :
     ```powershell
     python "{{RACINE}}\backup_project.py" "{{RACINE}}" "{{ALIAS}}"
     ```
   - Le dossier sera synchronisé (miroir) vers `googledrive:BackUps/{{ALIAS}}/`.
   - Si rclone échoue : afficher l'erreur telle quelle, ne pas bloquer la clôture.
   ```

### 5. Commit initial (si réponse "oui" à Q4)

Dans le dépôt du projet cible ($ARGUMENTS) :

```bash
git -C "$ARGUMENTS" add .claude/ _contexte/ ollama_call.py _docs/
git -C "$ARGUMENTS" commit -m "init: protocole vibecoding — zone <alias>"
```

### 6. Enregistrer le déploiement dans le kit

Ajouter une ligne dans `<kit>/DEPLOYMENTS.md` :

```
| <nom du projet> | $ARGUMENTS | <alias> | <version du kit> | {{DATE}} |
```

La version du kit est la dernière entrée de `<kit>/CHANGELOG.md` (ex: `v2.2`).

### 7. Lister les fichiers écrits ou modifiés

Avant la confirmation finale, afficher la liste de tous les fichiers créés ou modifiés aux étapes 3 à 4bis et 6, sous forme de liens cliquables (chemin absolu) :

```
- [<fichier>](<chemin absolu>)
```

### 8. Confirmer

Répondre uniquement : "✅ Init <alias> terminé. Lancer /start <alias> pour commencer."
