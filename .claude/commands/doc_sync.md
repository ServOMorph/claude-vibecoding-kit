---
description: Synchronise toute la documentation du kit après une modification (commandes, templates, structure)
model: sonnet
allowed-tools: Bash(git status:*), Bash(git diff:*)
---

# /doc_sync

## Objectif

Après une modification du kit (fichier de commande, template, structure de dossier), mettre à jour
tous les documents qui doivent refléter ce changement, sans en oublier aucun. Ne touche pas au code
fonctionnel — uniquement la documentation et les copies miroir.

## Procédure

### 1. Identifier ce qui a changé

```bash
git status --short
git diff --stat
```

Repérer les fichiers modifiés/ajoutés/supprimés depuis le dernier commit, en particulier sous :
- `.claude/commands/`
- `.claude/CLAUDE.md`
- `templates/`

Si rien n'a changé (working tree propre) : répondre "Rien à synchroniser — aucune modification détectée." et s'arrêter.

### 2. Synchroniser les paires miroir

Ces fichiers doivent être identiques dans les deux emplacements (aucun placeholder `{{ALIAS}}`/`{{RACINE}}`
ne s'applique à eux, car ce sont des définitions de commande, pas des instances) :

| `.claude/...` | `templates/.claude/...` |
|----------------|--------------------------|
| `commands/start.md` | `commands/start.md` |
| `commands/close.md` | `commands/close.md` |
| `commands/create_memory.md` | `commands/create_memory.md` |
| `commands/init_projet.md` | `commands/init_projet.md` |
| `commands/update.md` | `commands/update.md` |
| `commands/create_agent.md` | `commands/create_agent.md` |
| `CLAUDE.md` | `CLAUDE.md` |

Pour chaque paire :
- Pour `start.md` et `close.md`, comparer uniquement le contenu situé hors des marqueurs
  `SPECIFICITES PROJET`. Le contenu de ce bloc est propre à chaque instance et peut donc différer
  légitimement ; ne jamais le recopier dans le miroir.
- Si les deux fichiers existent et diffèrent : celui modifié dans le diff de l'étape 1 est la source ;
  répercuter son contenu intégral sur l'autre.
- Si les deux ont changé de façon divergente (rare) : signaler le conflit à l'utilisateur et demander
  lequel fait autorité plutôt que de trancher seul.
- Si un fichier n'existe que d'un côté : signaler l'asymétrie sans la corriger seul (peut être volontaire).

### 3. Vérifier `README.md`

- Section "Structure du kit" (arborescence) : doit lister tous les fichiers réellement présents dans
  `templates/` et à la racine. Ajouter les fichiers manquants, retirer ceux qui n'existent plus.
- Section "Ce que ça fait" (liste des commandes) : doit correspondre exactement aux commandes présentes
  dans `templates/.claude/commands/`. Ajouter/retirer une ligne si une commande a été ajoutée/supprimée.

### 4. Vérifier `CHANGELOG.md`

- Comparer la dernière entrée à la nature du changement détecté à l'étape 1.
- Si le changement n'est pas encore documenté (aucune entrée ne le mentionne) : ajouter une nouvelle
  entrée en tête, au format existant :
  ```
  ## vX.Y — AAAA-MM-JJ

  ### [Ajouté / Modifié / Corrigé]
  - [description du changement identifié à l'étape 1]
  ```
  - **major** si : structure de `_contexte/` modifiée, placeholder renommé/supprimé, commande supprimée
  - **minor** dans tous les autres cas
- Ne jamais modifier une entrée existante.

### 5. Vérifier `Protocole_start_close_context.md`

- Sa propre section "# Changelog" (en fin de fichier) doit avoir une entrée miroir de celle ajoutée à
  l'étape 4 (même version, format court propre à ce fichier — voir entrées précédentes).
- Si le changement touche le nombre ou le contenu des étapes d'une commande (`/start`, `/close`,
  `/update`, `/init`, `/create_memory`) documentée en détail dans ce fichier : mettre à jour la
  description correspondante pour qu'elle reste fidèle au fichier de commande réel.
- Si le changement touche la table des modèles recommandés, les formats canoniques (`_manifest.md`,
  `contexte.md`, `signals.md`) ou la stratégie de gestion du contexte : vérifier que la description
  reste exacte.

### 6. Vérifier `DEPLOYMENTS.md`

- Ne pas modifier ce fichier ici (il ne reflète pas des changements du kit mais des déploiements dans
  des projets tiers, gérés par `/init` et `/update`).

### 7. Rapport final

Lister, en une ligne par fichier, ce qui a été modifié à cette étape :
```
Doc synchronisée :
- <fichier> : <ce qui a changé>
```
Si un conflit ou une asymétrie a été signalé sans être corrigé (étape 2), le rappeler explicitement ici.
Ne pas committer — laisser l'utilisateur relire et committer via `/close` ou manuellement.
