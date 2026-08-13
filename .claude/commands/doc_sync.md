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

### 1. Contrôle d'intégrité mécanique

Avant toute synchronisation, exécuter le contrôle d'intégrité :
```bash
python scripts/check_kit.py
```

**Règle :** un écart signalé bloque la synchronisation tant qu'il n'est pas traité ou explicitement écarté.

Si le contrôle passe (exit code 0) : continuer à l'étape 2.
Si le contrôle échoue (exit code 1) : 
- Lister les écarts détectés
- Traiter chaque écart ou le consigner explicitement comme "écart connu à corriger en Phase X"
- Ne pas continuer la synchronisation tant que des écarts non consignés persistent

### 2. Identifier ce qui a changé

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

Ces fichiers doivent être identiques dans les deux emplacements **après exclusion des lignes contenant des placeholders `{{...}}`** (ex: `{{DONNEES_SENSIBLES}}` dans `CLAUDE.md`).
Les placeholders sont des marqueurs de personnalisation pour les projets cibles et ne doivent pas bloquer la synchronisation :

| `.claude/...` | `templates/.claude/...` |
|----------------|--------------------------|
| `commands/start.md` | `commands/start.md` |
| `commands/close.md` | `commands/close.md` |
| `commands/create_memory.md` | `commands/create_memory.md` |
| `commands/init_projet.md` | `commands/init_projet.md` |
| `commands/update.md` | `commands/update.md` |
| `CLAUDE.md` | `CLAUDE.md` |

> **Note :** Les fichiers suivants ne font pas partie des paires miroir et ne doivent pas être synchronisés :
> - `llms.txt` : description du kit pour les LLM (fichier racine uniquement, pas de miroir)
> - `templates/ollama_call.py`, `templates/backup_project.py` : scripts templates pour les projets cibles, pas des miroirs de `scripts/`
> - `scripts/backup_file.py`, `scripts/deploy_create_memory.py`, `scripts/check_kit.py` : scripts internes du kit (pas de miroir dans `templates/`)

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
- **Note :** `Protocole_start_close_context.md` ne duplique plus le changelog — il renvoie désormais à `CHANGELOG.md`.

### 5. Vérifier `DEPLOYMENTS.md`

- Ne pas modifier ce fichier ici (il ne reflète pas des changements du kit mais des déploiements dans
  des projets tiers, gérés par `/init` et `/update`).

### 6. Rapport final

Lister, en une ligne par fichier, ce qui a été modifié à cette étape :
```
Doc synchronisée :
- <fichier> : <ce qui a changé>
```
Si un conflit ou une asymétrie a été signalé sans être corrigé (étape 2), le rappeler explicitement ici.
Ne pas committer — laisser l'utilisateur relire et committer via `/close` ou manuellement.
