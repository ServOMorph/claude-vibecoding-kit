---
description: Met à jour les fichiers de protocole du kit dans un projet déjà initialisé
argument-hint: <chemin absolu du projet à mettre à jour> | all
model: sonnet
---

# /update

## Objectif

Mettre à jour les fichiers de protocole (`start.md`, `close.md`, `create_memory.md`, `ollama_call.py`, `CLAUDE.md`) d'un projet cible à partir de la dernière version du kit. Se lance depuis le repo du kit. Ne touche pas aux fichiers spécifiques au projet cible (`_contexte/`, `zones.md`, la section "Données sensibles" et la section "Spécificités projet" de `CLAUDE.md`, le bloc `SPECIFICITES PROJET` de `start.md`/`close.md`).

## Procédure

### 0. Mode batch (all)

Si `$ARGUMENTS` vaut `all` (comparaison insensible à la casse) : basculer en mode batch.

1. Le kit = working directory courant. Vérifier que `DEPLOYMENTS.md` existe à cette racine.
   Sinon : répondre "❌ DEPLOYMENTS.md introuvable — /update all doit être lancé depuis le repo du kit." et s'arrêter.
2. Lire `DEPLOYMENTS.md`, extraire chaque ligne du tableau (nom, chemin absolu, alias, version, date).
3. Pour chaque projet, dans l'ordre du tableau :
   a. Vérifier que le chemin existe et contient un `.git`.
      - Si non : noter "❌ <alias> — échec (chemin introuvable ou non-git)" et passer au projet suivant.
   b. Exécuter silencieusement les étapes 1 à 9 de la procédure standard ci-dessous, avec :
      - projet cible = chemin de la ligne
      - kit = working directory courant (celui de l'étape 0)
      - Pas de confirmation intermédiaire, pas d'exécution de l'étape 10 individuelle.
      - Si l'étape 5 ou 6 détecte des lignes ou sections candidates "spécificités projet" non
        migrées, elles sont migrées automatiquement sans interrompre le batch (voir étapes 5 et 6).
      - Toute erreur pendant les étapes 1 à 8 est capturée : noter "❌ <alias> — échec (<raison>)",
        passer au projet suivant sans interrompre le batch.
      - Si l'étape 9 (vérification) détecte un ou plusieurs échecs : noter
        "⚠️ <alias> — mis à jour avec réserves (kit <ancienne version> → <version>) : <détail des échecs>".
      - Sinon, succès : noter "✅ <alias> — mis à jour (kit <ancienne version> → <version>)".
4. Étape finale (remplace l'étape 10 individuelle) : afficher un résumé unique, une ligne par projet,
   dans l'ordre du tableau DEPLOYMENTS.md.

**Ne pas exécuter les étapes 1 à 10 décrites plus bas telles quelles en mode batch** — elles restent
la procédure standard, appelée en interne pour chaque projet à l'étape 0.3.b.

### 1. Résoudre les chemins

- Le kit = working directory courant (là où `/update` est lancé). Vérifier que `templates/` existe à cette racine.
  Sinon : répondre "❌ templates/ introuvable — /update doit être lancé depuis le repo du kit." et s'arrêter.
- Le projet cible est fourni en argument ($ARGUMENTS).
  Si absent : demander "Chemin absolu du projet à mettre à jour ?"
- `templates/` = `templates/` (racine du kit, working directory).

### 2. Détecter l'état du projet

Vérifier que `<cible>/.claude/commands/start.md` et `<cible>/.claude/commands/close.md` existent.

- **Si présents** : continuer la procédure normalement (mise à jour).
- **Si absents** : basculer en mode initialisation — lire avant d'écrire :
  1. Scanner `<cible>/.claude/` et noter tout fichier existant (CLAUDE.md, sous-dossiers, fichiers de contexte). **Ne jamais écraser ce qui existe.**
  2. Demander : "Alias de la zone (nom court, sans espace) ?"
  3. Demander : "Chemin absolu de la racine du projet ?" (par défaut : $ARGUMENTS)
  4. Créer `<cible>/.claude/commands/` s'il n'existe pas.
  5. Pour chaque fichier ci-dessous, **copier depuis le kit uniquement s'il est absent** dans le projet cible :
     - `templates/.claude/commands/start.md` → `<cible>/.claude/commands/start.md`
     - `templates/.claude/commands/close.md` → `<cible>/.claude/commands/close.md`
     - `templates/.claude/commands/create_memory.md` → `<cible>/.claude/commands/create_memory.md`
     - `templates/.claude/zones.md` → `<cible>/.claude/zones.md`
     - `templates/ollama_call.py` → `<cible>/ollama_call.py`
  6. Pour `<cible>/.claude/CLAUDE.md` :
     - Si absent : copier depuis le kit.
     - Si présent : merger — identifier les sections du kit absentes du fichier existant et les ajouter en fin de fichier. Ne jamais supprimer ni modifier les sections existantes.
  7. Ne jamais toucher à `<cible>/_contexte/` ni à aucun fichier de contexte existant.
  8. Passer directement à l'étape 7 (DEPLOYMENTS.md) puis 8 (commit) et 9 (confirmer).
  **Ne pas exécuter les étapes 3 à 6.**

### 3. Commit de sauvegarde

Avant toute modification, effectuer un commit de l'état actuel du projet cible :

```bash
git -C <cible> add .claude/commands/ .claude/CLAUDE.md ollama_call.py
git -C <cible> commit -m "backup: avant update protocole vibecoding"
```

Si le working tree du projet cible est propre (rien à commiter) : passer à l'étape suivante sans commit.

### 4. Lire la configuration existante

- Lire `<cible>/.claude/zones.md` pour vérifier qu'il existe et contient au moins une paire alias → dossier réel.
  - Si la table est vide ou le fichier absent : demander "Alias de la zone ?" et "Chemin absolu de la racine ?", puis créer/compléter `zones.md`.
- `start.md` et `close.md` ne contiennent plus de table figée : ils lisent `zones.md` directement au moment de l'exécution. Aucune substitution n'est donc nécessaire dans ces fichiers.

### 5. Mettre à jour les fichiers de protocole

Pour `start.md` et `close.md`, avant d'écraser, déterminer le contenu à réinjecter :

- **Si les marqueurs `<!-- SPECIFICITES PROJET : DEBUT -->` / `FIN` sont présents** dans le fichier
  existant : extraire leur contenu (chaîne vide si la zone est vide). Passer directement à la copie.
- **Si les marqueurs sont absents** (fichier jamais migré vers ce mécanisme) :
  1. Comparer ligne à ligne le fichier existant avec le fichier kit correspondant
     (`templates/.claude/commands/start.md` ou `close.md`).
  2. Lister les lignes présentes dans le fichier existant et absentes du fichier kit — candidats
     "spécificités projet".
  3. Si la liste est vide : rien à migrer, la zone réinjectée sera vide.
  4. Si la liste est non vide : les migrer automatiquement telles quelles dans la nouvelle zone
     "Spécificités projet", sans demander confirmation. Si une ligne est manifestement liée à une
     étape précise de la Procédure, la reformuler pour référencer explicitement son numéro
     (ex: "Étape 3 : ..."), pour qu'elle ne perde pas son rattachement une fois déplacée. Signaler
     dans la réponse finale les lignes migrées, pour information.

Pour chacun des fichiers suivants, copier tel quel depuis le kit (aucune substitution requise, ces fichiers lisent `zones.md` directement) :

| Fichier kit | Destination |
|-------------|-------------|
| `templates/.claude/commands/start.md` | `<cible>/.claude/commands/start.md` |
| `templates/.claude/commands/close.md` | `<cible>/.claude/commands/close.md` |
| `templates/.claude/commands/create_memory.md` | `<cible>/.claude/commands/create_memory.md` |
| `templates/ollama_call.py` | `<cible>/ollama_call.py` |

Pour `start.md` et `close.md`, une fois le fichier copié : réinjecter le contenu retenu ci-dessus
entre les marqueurs `SPECIFICITES PROJET` du fichier nouvellement copié.

`init_projet.md` et `update.md` ne sont pas copiés dans les projets — ils restent dans le kit.

**Ne pas écraser** `<cible>/_contexte/` ni `<cible>/.claude/zones.md`.

### 6. Mettre à jour CLAUDE.md (partiel)

- Lire `<cible>/.claude/CLAUDE.md` existant et `templates/.claude/CLAUDE.md` du kit.
- **Si la section `## Spécificités projet` est présente** dans le fichier existant : la conserver
  telle quelle.
- **Si elle est absente** (fichier jamais migré vers ce mécanisme) :
  1. Comparer ligne à ligne le fichier existant avec `templates/.claude/CLAUDE.md`, hors section
     "Données sensibles" (déjà traitée séparément).
  2. Lister les lignes présentes dans le fichier existant et absentes du fichier kit — candidats
     "spécificités projet".
  3. Si la liste est vide : la nouvelle section "Spécificités projet" reprend le contenu vide du kit.
  4. Si la liste est non vide : les migrer automatiquement telles quelles dans la nouvelle section
     "Spécificités projet", sans demander confirmation. Si une ligne est manifestement liée à une
     section précise du kit, la reformuler pour référencer explicitement son titre
     (ex: "Section Roadmap : ..."), pour qu'elle ne perde pas son rattachement une fois déplacée.
     Signaler dans la réponse finale les lignes migrées, pour information.
- **Si elle est présente mais que du contenu spécifique existe hors de cette section** (sections
  entières ajoutées après "Spécificités projet", ou lignes ajoutées ailleurs dans le fichier et
  absentes de `templates/.claude/CLAUDE.md`) : déplacer ce contenu à l'intérieur de la section
  "Spécificités projet" (en sous-section `###` si ce sont des sections entières), sans demander
  confirmation. Signaler dans la réponse finale le contenu déplacé, pour information.
- **Conserver** en tout état de cause la section "Données sensibles" du fichier existant.
- **Remplacer** toutes les autres sections par celles du kit.
- Écraser `<cible>/.claude/CLAUDE.md` avec le résultat fusionné.

### 7. Vérifier l'entrée dans DEPLOYMENTS.md

- Lire `DEPLOYMENTS.md` (racine du kit, working directory).
- Chercher une ligne contenant le chemin absolu de `<cible>`.
- La version kit est la dernière entrée de `CHANGELOG.md` (racine du kit).
- Si absente : ajouter une ligne :
  ```
  | <nom du dossier de <cible>> | <chemin absolu de <cible>> | <alias> | <version kit> | <date du jour> |
  ```
- Si présente : réécrire ses colonnes "Version kit" et "Date init" avec la nouvelle version et la date du jour (conserver les autres colonnes telles quelles). Noter l'ancienne version pour l'étape 9 / le résumé batch.

### 8. Commit

```bash
git -C <cible> add .claude/commands/ .claude/CLAUDE.md ollama_call.py
git -C <cible> commit -m "update: protocole vibecoding — zone <alias> — kit <version>"
```

### 9. Vérification post-update

Avant de confirmer, exécuter ces contrôles sur `<cible>` et collecter les échecs éventuels :

1. **Fichiers présents et à jour** : `start.md`, `close.md`, `create_memory.md`, `ollama_call.py` sont
   strictement identiques à leur version dans `templates/` (hors zones `SPECIFICITES PROJET`, qui
   diffèrent normalement).
2. **Marqueurs intacts** : `start.md` et `close.md` contiennent chacun exactement une paire
   `<!-- SPECIFICITES PROJET : DEBUT -->` / `<!-- SPECIFICITES PROJET : FIN -->`.
3. **CLAUDE.md cohérent** :
   - la section `## Spécificités projet` existe et contient tout le contenu spécifique identifié
     aux étapes 5/6 (rien laissé en section orpheline après elle) ;
   - la section `## Données sensibles` du fichier existant a été conservée telle quelle ;
   - la ligne de délégation Ollama référence `python ollama_call.py "<prompt>"` (pas l'ancien
     `./ollama_call.sh` ni une autre forme obsolète).
4. **Fichiers protégés non touchés** : `_contexte/` et `.claude/zones.md` sont identiques à avant
   l'update (`git diff` vide sur ces chemins par rapport au commit de sauvegarde de l'étape 3).
5. **`ollama_call.py` tracké** : `git -C <cible> ls-files ollama_call.py` retourne bien le fichier.
6. **Commit propre** : `git -C <cible> show --stat HEAD` ne contient que des fichiers du protocole
   (`.claude/commands/`, `.claude/CLAUDE.md`, `ollama_call.py`) — aucun fichier de projet non lié
   n'a été inclus par erreur.
7. **DEPLOYMENTS.md** : la ligne de `<cible>` porte bien la nouvelle version et la date du jour.

Si un contrôle échoue : ne pas corriger silencieusement — consigner l'échec précis (contrôle,
raison) pour l'afficher à l'étape 10. En mode batch, un échec de vérification bascule le statut du
projet de "✅" à "⚠️" dans le résumé final, avec le détail du contrôle en échec.

### 10. Confirmer

Répondre uniquement :
"✅ Update <alias> terminé (kit <ancienne version> → <version>). Fichiers mis à jour : start.md, close.md, create_memory.md, CLAUDE.md, ollama_call.py. Sections/blocs "Spécificités projet" préservés."
Si l'étape 9 a détecté un ou plusieurs échecs : remplacer "✅" par "⚠️" et lister chaque échec sur une ligne dédiée après la confirmation.
