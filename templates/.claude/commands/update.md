---
description: Met à jour les fichiers de protocole du kit dans un projet déjà initialisé
argument-hint: <chemin vers le dossier Template_initiailisation_projet_videcoding_ClaudeCode>
model: sonnet
---

# /update

## Objectif

Mettre à jour les fichiers de protocole (`start.md`, `close.md`, `init.md`) dans le projet courant à partir de la dernière version du kit. Ne touche pas aux fichiers spécifiques au projet (`_contexte/`, `zones.md`, la section "Données sensibles" de `CLAUDE.md`).

## Procédure

### 1. Résoudre les chemins

- Le dossier du kit est fourni en argument ($ARGUMENTS).
  Si absent : demander "Chemin vers le dossier Template_initiailisation_projet_videcoding_ClaudeCode ?"
- `templates/` = `$ARGUMENTS/templates`
- Racine du projet courant = dossier de travail actif (working directory).

### 2. Vérifier que le projet est initialisé

Vérifier que `.claude/commands/start.md` et `.claude/commands/close.md` existent.
Si absents : répondre "Ce projet n'a pas encore été initialisé. Utiliser /init."
et s'arrêter.

### 3. Lire la configuration existante

- Lire `.claude/zones.md` pour extraire l'alias et le dossier réel courant.
  - Si la table est vide ou le fichier absent : demander "Alias de la zone ?" et "Chemin absolu de la racine ?"
  - Si une seule ligne dans la table : utiliser cet alias et ce dossier sans demander.
  - Si plusieurs lignes : demander "Quelle zone mettre à jour ?" (lister les alias).

### 4. Mettre à jour les fichiers de protocole

Pour chacun des fichiers suivants, copier depuis le kit et réappliquer les substitutions :

| Fichier kit | Destination | Placeholders à substituer |
|-------------|-------------|--------------------------|
| `templates/.claude/commands/start.md` | `.claude/commands/start.md` | `{{ALIAS}}`, `{{RACINE}}` |
| `templates/.claude/commands/close.md` | `.claude/commands/close.md` | `{{ALIAS}}`, `{{RACINE}}` |
| `templates/.claude/commands/init.md` | `.claude/commands/init.md` | _(aucun)_ |
| `templates/.claude/commands/update.md` | `.claude/commands/update.md` | _(aucun)_ |

Substitutions :
| Placeholder | Remplacé par |
|-------------|--------------|
| `{{ALIAS}}` | Alias extrait à l'étape 3 |
| `{{RACINE}}` | Dossier réel extrait à l'étape 3 |

**Ne pas écraser** `_contexte/`, `zones.md`, ni `ollama_call.sh`.

### 5. Mettre à jour CLAUDE.md (partiel)

- Lire `.claude/CLAUDE.md` existant.
- Lire `templates/.claude/CLAUDE.md` du kit.
- **Conserver** la section "Données sensibles" du fichier existant.
- **Remplacer** toutes les autres sections par celles du kit.
- Écraser `.claude/CLAUDE.md` avec le résultat fusionné.

### 6. Vérifier l'entrée dans DEPLOYMENTS.md

- Lire `$ARGUMENTS/DEPLOYMENTS.md`.
- Chercher une ligne contenant le chemin absolu du projet courant.
- Si absente : ajouter une ligne :
  ```
  | <nom du dossier courant> | <chemin absolu> | <alias> | <version kit> | <date du jour> |
  ```
  La version kit est la dernière entrée de `$ARGUMENTS/CHANGELOG.md`.

### 7. Commit

```bash
git add .claude/commands/ .claude/CLAUDE.md
git commit -m "update: protocole vibecoding — zone <alias> — kit <version>"
```

### 8. Confirmer

Répondre uniquement :
"✅ Update <alias> terminé (kit <version>). Fichiers mis à jour : start.md, close.md, init.md, update.md, CLAUDE.md."
