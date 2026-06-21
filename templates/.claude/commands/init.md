---
description: Initialise le protocole vibecoding dans le projet courant
argument-hint: <chemin vers le dossier Template_initiailisation_projet_videcoding_ClaudeCode>
model: sonnet
---

# /init

## Objectif

Initialiser le protocole vibecoding dans le projet courant à partir du kit de templates.

## Procédure

### 1. Résoudre les chemins

- Le dossier du kit est fourni en argument ($ARGUMENTS).
  Si absent : demander "Chemin vers le dossier Template_initiailisation_projet_videcoding_ClaudeCode ?"
- `templates/` = `$ARGUMENTS/templates`
- `protocole/` = `$ARGUMENTS/Protocole_start_close_context_v2.md`
- Racine du projet courant = dossier de travail actif (working directory).

### 2. Poser ces questions avant toute action

1. Alias de la zone (nom court, sans espace) ?
2. Objectif du projet (1-2 phrases) ?
3. Stack technique (liste courte) ?
4. Projet sous git ? (oui/non)
5. Première zone de ce projet, ou zone supplémentaire ?
   - Si supplémentaire : `.claude/commands/start.md` et `close.md` existent déjà.
     Ajouter une ligne `{{ALIAS}} | {{RACINE}}` à leur table des zones au lieu de copier ces fichiers.

La racine du projet (chemin absolu) est le working directory courant — ne pas la demander.

### 3. Copier les fichiers vers la racine du projet

- `templates/_contexte/` → `_contexte/`
- `templates/.claude/CLAUDE.md` → `.claude/CLAUDE.md`
  (si déjà présent : demander avant d'écraser)
- `templates/.claude/commands/start.md` → `.claude/commands/start.md`
  (sauf zone supplémentaire, voir Q5)
- `templates/.claude/commands/close.md` → `.claude/commands/close.md`
  (sauf zone supplémentaire, voir Q5)
- `templates/.claude/zones.md` → `.claude/zones.md`
  (sauf zone supplémentaire : ajouter une ligne `| alias | dossier |` à la table existante)
- `templates/ollama_call.sh` → `ollama_call.sh`, puis `chmod +x ollama_call.sh`
- `$ARGUMENTS/Protocole_start_close_context_v2.md` → `_docs/protocole_vibecoding.md`

Ne pas copier `roadmap_TEMPLATE.md` (utilisé uniquement à la création d'un chantier).

### 4. Remplacer les placeholders

Dans tous les fichiers copiés sous `_contexte/`, `.claude/commands/` et `.claude/zones.md` :

| Placeholder | Remplacé par |
|-------------|--------------|
| `{{ALIAS}}` | Alias de la zone (réponse Q1) |
| `{{RACINE}}` | Chemin absolu de la racine du projet (working directory) |
| `{{OBJECTIF}}` | Objectif du projet (réponse Q2) |
| `{{STACK}}` | Stack technique (réponse Q3) |
| `{{DATE}}` | Date du jour (AAAA-MM-JJ) |

### 5. Commit initial (si réponse "oui" à Q4)

```bash
git add .claude/ _contexte/ ollama_call.sh _docs/
git commit -m "init: protocole vibecoding — zone <alias>"
```

### 6. Enregistrer le déploiement dans le kit

Ajouter une ligne dans `$ARGUMENTS/DEPLOYMENTS.md` :

```
| <nom du projet> | <chemin absolu ou URL repo> | <alias> | <version du kit> | {{DATE}} |
```

La version du kit est la dernière entrée de `$ARGUMENTS/CHANGELOG.md` (ex: `v2.2`).

### 7. Confirmer

Répondre uniquement : "✅ Init <alias> terminé. Lancer /start <alias> pour commencer."
