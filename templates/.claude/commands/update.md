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

### 2. Détecter l'état du projet

Vérifier que `.claude/commands/start.md` et `.claude/commands/close.md` existent.

- **Si présents** : continuer la procédure normalement (mise à jour).
- **Si absents** : basculer en mode initialisation — lire avant d'écrire :
  1. Scanner `.claude/` et noter tout fichier existant (CLAUDE.md, sous-dossiers, fichiers de contexte). **Ne jamais écraser ce qui existe.**
  2. Demander : "Alias de la zone (nom court, sans espace) ?"
  3. Demander : "Chemin absolu de la racine du projet ?" (par défaut : working directory courant)
  4. Créer `.claude/commands/` s'il n'existe pas.
  5. Pour chaque fichier ci-dessous, **copier depuis le kit uniquement s'il est absent** dans le projet cible :
     - `templates/.claude/commands/start.md` → `.claude/commands/start.md`
     - `templates/.claude/commands/close.md` → `.claude/commands/close.md`
     - `templates/.claude/commands/init.md` → `.claude/commands/init.md`
     - `templates/.claude/commands/update.md` → `.claude/commands/update.md`
     - `templates/.claude/zones.md` → `.claude/zones.md`
  6. Pour `.claude/CLAUDE.md` :
     - Si absent : copier depuis le kit.
     - Si présent : merger — identifier les sections du kit absentes du fichier existant et les ajouter en fin de fichier. Ne jamais supprimer ni modifier les sections existantes.
  7. Substituer `{{ALIAS}}` et `{{RACINE}}` dans les fichiers copiés (pas dans les fichiers existants non touchés).
  8. Ne jamais toucher à `_contexte/` ni à aucun fichier de contexte existant.
  9. Passer directement à l'étape 7 (DEPLOYMENTS.md) puis 8 (commit) et 9 (confirmer).
  **Ne pas exécuter les étapes 3 à 6.**

### 3. Commit de sauvegarde

Avant toute modification, effectuer un commit de l'état actuel du projet cible :

```bash
git add .claude/commands/ .claude/CLAUDE.md
git commit -m "backup: avant update protocole vibecoding"
```

Si le working tree est propre (rien à commiter) : passer à l'étape suivante sans commit.

### 4. Lire la configuration existante

- Lire `.claude/zones.md` pour extraire **toutes** les paires alias → dossier réel.
  - Si la table est vide ou le fichier absent : demander "Alias de la zone ?" et "Chemin absolu de la racine ?"
- Lire `.claude/commands/start.md` et `.claude/commands/close.md` existants pour extraire les substitutions déjà présentes (toutes les lignes alias/racine de la table des zones).
- Construire la liste complète des paires `{{ALIAS}}` / `{{RACINE}}` à partir des deux sources (zones.md + fichiers existants). En cas de conflit : zones.md fait autorité.

### 5. Mettre à jour les fichiers de protocole

Pour chacun des fichiers suivants, copier depuis le kit et réappliquer **toutes** les substitutions de la liste construite à l'étape 4 :

| Fichier kit | Destination | Placeholders à substituer |
|-------------|-------------|--------------------------|
| `templates/.claude/commands/start.md` | `.claude/commands/start.md` | toutes les paires `{{ALIAS}}` / `{{RACINE}}` |
| `templates/.claude/commands/close.md` | `.claude/commands/close.md` | toutes les paires `{{ALIAS}}` / `{{RACINE}}` |
| `templates/.claude/commands/init.md` | `.claude/commands/init.md` | _(aucun)_ |
| `templates/.claude/commands/update.md` | `.claude/commands/update.md` | _(aucun)_ |

**Ne pas écraser** `_contexte/`, `zones.md`, ni `ollama_call.sh`.

### 6. Mettre à jour CLAUDE.md (partiel)

- Lire `.claude/CLAUDE.md` existant.
- Lire `templates/.claude/CLAUDE.md` du kit.
- **Conserver** la section "Données sensibles" du fichier existant.
- **Remplacer** toutes les autres sections par celles du kit.
- Écraser `.claude/CLAUDE.md` avec le résultat fusionné.

### 7. Vérifier l'entrée dans DEPLOYMENTS.md

- Lire `$ARGUMENTS/DEPLOYMENTS.md`.
- Chercher une ligne contenant le chemin absolu du projet courant.
- Si absente : ajouter une ligne :
  ```
  | <nom du dossier courant> | <chemin absolu> | <alias> | <version kit> | <date du jour> |
  ```
  La version kit est la dernière entrée de `$ARGUMENTS/CHANGELOG.md`.

### 8. Commit

```bash
git add .claude/commands/ .claude/CLAUDE.md
git commit -m "update: protocole vibecoding — zone <alias> — kit <version>"
```

### 9. Confirmer

Répondre uniquement :
"✅ Update <alias> terminé (kit <version>). Fichiers mis à jour : start.md, close.md, init.md, update.md, CLAUDE.md."
