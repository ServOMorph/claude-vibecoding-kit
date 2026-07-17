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
5. Première zone de ce projet, ou zone supplémentaire ?
   - Si supplémentaire : `.claude/commands/start.md` et `close.md` existent déjà.
     Ajouter une ligne dans `zones.md` au lieu de copier ces fichiers.

La racine du projet cible ne doit jamais être demandée si $ARGUMENTS est fourni.

### 3. Copier les fichiers vers la racine du projet cible

- `templates/_contexte/` → `$ARGUMENTS/_contexte/`
- `templates/.claude/CLAUDE.md` → `$ARGUMENTS/.claude/CLAUDE.md`
  (si déjà présent : demander avant d'écraser)
- `templates/.claude/commands/start.md` → `$ARGUMENTS/.claude/commands/start.md`
  (sauf zone supplémentaire, voir Q5)
- `templates/.claude/commands/close.md` → `$ARGUMENTS/.claude/commands/close.md`
  (sauf zone supplémentaire, voir Q5)
- `templates/.claude/zones.md` → `$ARGUMENTS/.claude/zones.md`
  (sauf zone supplémentaire : ajouter une ligne `| alias | dossier |` à la table existante)
- `templates/ollama_call.sh` → `$ARGUMENTS/ollama_call.sh`, puis `chmod +x ollama_call.sh`
- `<kit>/Protocole_start_close_context.md` → `$ARGUMENTS/_docs/protocole_vibecoding.md`

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

### 5. Commit initial (si réponse "oui" à Q4)

Dans le dépôt du projet cible ($ARGUMENTS) :

```bash
git -C "$ARGUMENTS" add .claude/ _contexte/ ollama_call.sh _docs/
git -C "$ARGUMENTS" commit -m "init: protocole vibecoding — zone <alias>"
```

### 6. Enregistrer le déploiement dans le kit

Ajouter une ligne dans `<kit>/DEPLOYMENTS.md` :

```
| <nom du projet> | $ARGUMENTS | <alias> | <version du kit> | {{DATE}} |
```

La version du kit est la dernière entrée de `<kit>/CHANGELOG.md` (ex: `v2.2`).

### 7. Lister les fichiers écrits ou modifiés

Avant la confirmation finale, afficher la liste de tous les fichiers créés ou modifiés aux étapes 3 à 6, sous forme de liens cliquables (chemin absolu) :

```
- [<fichier>](<chemin absolu>)
```

### 8. Confirmer

Répondre uniquement : "✅ Init <alias> terminé. Lancer /start <alias> pour commencer."
