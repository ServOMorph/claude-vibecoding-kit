# Protocole de vibecoding — Documentation générique
> **v2.3** — Révision du 2026-06-21. Voir section [Changelog](#changelog) pour le détail des modifications.

## Pourquoi ce fichier

Le vibecoding avec un LLM souffre d'un problème structurel : le contexte est perdu à chaque nouvelle conversation. Sans protocole, chaque session repart de zéro, les décisions prises ne sont pas tracées, et l'IA ne sait pas où en est le projet.

À cela s'ajoute un second problème : le contexte se remplit vite. Sur un travail en plusieurs phases — ajouter une feature, refactorer un module, corriger un lot de bugs — garder toute la conversation active jusqu'à la fin est contre-productif. Le modèle se noie dans l'historique et la qualité baisse.

Ce fichier définit un protocole reproductible pour travailler avec Claude sur des projets qui s'étalent dans le temps. Il couvre quatre niveaux :

1. **Comportement de l'IA** (`CLAUDE.md`) — les règles permanentes qui s'appliquent à toutes les conversations : langue, honnêteté, discipline d'exécution.
2. **Ouverture de session** (`/start`) — charger le bon contexte au démarrage pour que Claude sache immédiatement où en est le projet.
3. **Fermeture de session** (`/close`) — sauvegarder l'état, mettre à jour les fichiers de contexte et committer, pour que la prochaine session puisse reprendre sans friction.
4. **Roadmap de chantier** (`ROADMAP.md`) — pour les features ou modifications multi-phases, découper le travail en phases explicites et forcer un `/compact` entre chacune. Pas systématique : uniquement quand le travail dépasse une session ou comporte plusieurs étapes distinctes.
5. **Délégation Ollama** — pour les tâches répétitives, templated ou impliquant des données sensibles, déléguer à un modèle local via un script standard plutôt que d'utiliser un modèle cloud.

## Comment utiliser ce fichier

Ce fichier est un **template générique**. Pour l'adapter à un projet :

- Remplir les tables `Alias / Dossier` dans `/start` et `/close`
- Coller le contenu de `CLAUDE.md` dans le fichier `CLAUDE.md` à la racine du projet ou dans le system prompt
- Créer une roadmap uniquement quand le chantier est multi-phases : la lister dans le manifest pour qu'elle soit chargée au `/start` suivant

## Stratégie de gestion du contexte

Deux outils, deux usages distincts :

**`/compact`** compresse l'historique de conversation en place. C'est rapide, ça préserve le fil, mais le résumé est automatique et peut contenir du bruit. À utiliser entre les phases d'une même session.

**`/close` + `/start`** extrait explicitement ce qui compte (décisions, livrables, signals), le stocke dans des fichiers courts et curatés, puis recharge uniquement ceux-ci au démarrage suivant. Plus économe en tokens qu'un `/compact` sur une longue session. À utiliser entre sessions.

Faire `/close`+`/start` entre chaque phase serait sur-ingénié. Faire `/compact` uniquement entre sessions laisserait trop de bruit accumulé. Le protocole combine les deux.

## Utilisation des modèles

| Tâche | Modèle |
|-------|--------|
| `/start` | Haiku |
| `/close` | Sonnet |
| Écrire un plan / roadmap | Opus |
| Appliquer un plan | Sonnet |
| Debug | Opus (voir note) |
| Tâche isolée, sans dépendances, sans effet de bord possible | Haiku |

> **Note modèles de debug :** Utiliser **Opus** par défaut pour le debug. Pour les bugs complexes impliquant plusieurs couches, préférer Opus en mode extended thinking si disponible.

**Attention sur Haiku :** le critère n'est pas la taille de la tâche mais la complexité du contexte. Une petite modification dans un codebase avec des dépendances peut introduire un bug subtil qu'Haiku ne détectera pas. Le coût du debug qui suit dépasse l'économie réalisée. Utiliser Haiku uniquement quand la tâche est réellement isolée.

**Ollama (local, ex. gemma3:4b) :** pour les tâches répétitives et templated qui ne nécessitent pas de raisonnement complexe, ou quand les données sont sensibles et ne doivent pas quitter la machine.

| Cas d'usage | Exemple |
|-------------|---------|
| Écriture templated | Post réseaux sociaux, email type, rapport récurrent |
| Commit messages | Depuis un diff ou une description de changement |
| Données de test | Fixtures, mocks, jeux de données factices |
| Release notes | Transformer une liste de commits en changelog formaté |
| Pré-digest de logs | Résumer des logs bruts avant debug avec Sonnet |
| Données sensibles | Tout ce qui ne doit pas quitter la machine |

Dès qu'il y a du contexte non trivial, des dépendances ou de l'incertitude : basculer sur un modèle cloud.

---

# CLAUDE.md
Instructions de conversation

## Langue et style
- Communiquer exclusivement en français
- Adopter un ton professionnel
- Être synthétique et direct
- Optimiser l'utilisation des tokens

## Comportement
- Exécuter uniquement ce qui est demandé, sans initiative ni extrapolation.
- Ne pas ajouter de commentaires non nécessaires.

## Honnêteté (priorité absolue)
- Si une idée, une approche ou une demande est mauvaise, risquée ou inefficace, le dire clairement. Ne jamais valider par complaisance ni capituler face au désaccord.
- Signaler les angles morts, risques et meilleures alternatives, même non sollicités, quand ils sont importants.
- Ne pas affirmer qu'une chose fonctionne sans l'avoir vérifié. Distinguer fait, hypothèse et opinion.
- Ne jamais inventer de faits, chiffres, détails techniques ou contextuels sur l'utilisateur, ses projets, ses clients ou ses actions passées. Si l'information n'est pas explicitement fournie, demander ou laisser un blanc plutôt qu'extrapoler.
- Détecter et signaler le "prompt theater" : les réponses longues et bien structurées qui rassurent sans apporter de valeur réelle.
- Détecter quand on polit la méta (analyser l'analyse, auditer l'audit) au lieu d'avancer : le signaler et recommander de passer à l'action.
- Ne pas justifier son propre travail après l'avoir produit. Si une réponse est bonne, elle se défend seule.

## Code
- Pas d'emojis dans le code
- Code fonctionnel uniquement
- Pas de commentaires décoratifs

## Délégation Ollama
Pour les tâches répétitives et templated (commits, posts, changelogs, données de test, digest de logs), déléguer à Ollama via `./ollama_call.sh` plutôt que de traiter en cloud. Consulter la section Intégration Ollama du protocole pour les templates disponibles. Ne jamais envoyer de données sensibles à un modèle cloud.

---

# Structure `_contexte/`

## Format canonique du manifest

`_manifest.md` est le fichier pivot de chaque zone. Il est lu par `/start` et mis à jour par `/close`. Format strict à respecter — ne pas ajouter de sections libres.

```markdown
# Manifest — <zone>

## Charger au démarrage
- _contexte/signals.md
- _contexte/contexte.md
- roadmap_<sujet>.md   # uniquement si chantier actif
```

> **Note v2.1 :** le champ "Résumé de démarrage" a été supprimé — il était écrit par `/close` mais jamais lu par `/start` (qui le considérait comme potentiellement périmé). Le manifest se réduit à la liste de chargement ; sa seule partie variable est la ligne roadmap.

## Format canonique de `contexte.md`

Structure fixe. Taille maximale par section indiquée — à respecter pour contenir le coût token au fil des sessions.

```markdown
# Contexte — <zone>

## Objectif (immuable sauf décision explicite)
[2 lignes max]

## Stack / contraintes techniques (stable, rarement modifié)
- [item]

## État actuel (réécrit intégralement à chaque /close)
[5 lignes max]

## Décisions structurantes (append only — 10 entrées max, archiver au-delà)
- AAAA-MM-JJ : [décision]
```

> **Règle d'archivage :** quand la liste "Décisions structurantes" dépasse 10 entrées, déplacer les plus anciennes dans un fichier `_contexte/archive_decisions.md` avant d'en ajouter de nouvelles. Ne pas laisser la liste grossir indéfiniment.

## Format canonique de `signals.md`

`signals.md` est le fichier de pilotage actif. Il est le premier lu par `/start` car il contient ce qui est urgent et bloquant.

```markdown
# Signals — <zone>   (MAJ AAAA-MM-JJ)

## Actions ouvertes
- [P1|ouvert] <action concrète>
- [P2|attente] <action en attente d'une dépendance>

## Questions ouvertes
- <question bloquante>

## Échéances
- AAAA-MM-JJ | <objet>

## Blocages
- <obstacle ou dépendance externe>

## Contexte chaud
<!-- Informations volatiles valables quelques sessions. Supprimer quand périmées. -->
- <info technique ou organisationnelle temporaire>

## Dernière session (AAAA-MM-JJ)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->
```

> **Section "Contexte chaud" :** sert à capturer des informations à durée de vie courte qui ne méritent pas `contexte.md` mais qui seraient perdues sinon. Exemples : une lib en beta instable, un endpoint cassé en staging, un interlocuteur absent cette semaine. Supprimer les entrées périmées à chaque `/close`.

> **Section "Dernière session" :** remplace l'ancien fichier `derniere_session.md` (fusionné en v2.1) — un fichier de moins à lire au `/start` et à réécrire au `/close`. Écrasée intégralement par `/close` avec la synthèse de session ; l'historique des sessions reste consultable via git.

---

# /start [zone]

> **Frontmatter (v2.1) :** le fichier `.claude/commands/start.md` porte `model: haiku` et `argument-hint: <zone>`. La ligne "/start → Haiku" de la table des modèles est appliquée automatiquement.

## Zones valides et dossiers réels

La table des alias → dossiers réels est lue depuis `.claude/zones.md` à chaque invocation.


## Procédure

1. Lire l'argument fourni ($ARGUMENTS).
   - Si absent : utiliser le working directory courant comme dossier cible (zone implicite).
   - Si présent mais non reconnu dans la table de `zones.md` :
     répondre "Erreur : zone inconnue. Zones valides : <liste des alias>"
     et s'arrêter.
   - Si présent et reconnu : résoudre le dossier via la table.

2. Résoudre le dossier réel via la table. Vérifier que `<dossier>/_contexte/_manifest.md` existe.
   Si absent : proposer d'initialiser la structure `_contexte/` pour cette zone (créer les fichiers
   vides : `_manifest.md`, `contexte.md`, `signals.md`) et s'arrêter.

3. Lire `<dossier>/_contexte/_manifest.md`.

4. Charger les fichiers listés dans "Charger au démarrage" dans l'ordre suivant, indépendamment
   de leur ordre dans le manifest :
   1. `signals.md` — actions ouvertes, blocages, dernière session (priorité absolue)
   2. `contexte.md` — contexte stable
   3. roadmap active si présente

   > **Économie tokens :** si `signals.md` suffit à répondre à la question immédiate,
   > `contexte.md` peut être chargé à la demande plutôt que systématiquement.
   > En cas de doute : le charger.

5. Afficher le contenu intégral de `signals.md` (sans résumé ni reformulation).

5b. Pour chaque action listée dans `signals.md` qui contient un champ `réf:`, lire les fichiers
    référencés avant d'afficher la synthèse. Si une action semble ambiguë mais qu'une `réf:` existe,
    lire la référence en priorité plutôt que de demander des précisions.

    Ajouter ensuite, à partir des autres fichiers chargés : la phase en cours si roadmap active,
    et le point d'attention immédiat.

6. Afficher en fin de réponse : 🎉🎉🎉


# /close [zone]

> **Frontmatter (v2.1) :** le fichier `.claude/commands/close.md` porte `model: sonnet`, `argument-hint: <zone>` et `allowed-tools` autorisant `git status/diff/add/commit` — plus de prompts de permission au commit de clôture.

## Zones valides et dossiers réels

La table des alias → dossiers réels est lue depuis `.claude/zones.md` à chaque invocation.


## Procédure

1. Lire l'argument fourni ($ARGUMENTS).
   - Si absent : utiliser le working directory courant comme dossier cible (zone implicite).
   - Si présent mais non reconnu dans la table de `zones.md` :
     répondre "Erreur : zone inconnue. Zones valides : <liste des alias>"
     et s'arrêter.
   - Si présent et reconnu : résoudre le dossier via la table.

2. Résoudre le dossier réel via la table (ou utiliser le working directory si pas d'argument).

3. Produire une synthèse de session (< 25 lignes) au format suivant :

```
# Session du AAAA-MM-JJ

## Décisions prises
- [décision actée, 1 ligne]

## Livrables produits ou modifiés
- [fichier] : [statut]

## Hypothèses validées / invalidées
- VALIDE : ...
- INVALIDE : ... -> pivot vers ...
- EN ATTENTE : ...

## Prochaine étape exacte
[1-3 lignes]

## Question bloquante pour la session suivante
[1 question, ou "Aucune"]
```

4. Mettre à jour `<dossier>/_contexte/signals.md` :
   - Lire le fichier existant. Reporter tout élément non résolu.
   - Écraser la section "Dernière session" avec la synthèse de l'étape 3 (date du jour dans le titre).
   - Mettre à jour les priorités [P1/P2] sur les actions ouvertes.
   - Supprimer les entrées "Contexte chaud" périmées. Ajouter les nouvelles informations volatiles.
   - Sections sans contenu : laisser le titre sans puce.
   - **Invariant :** chaque action ouverte doit comporter :
     - `fait quand: <critère observable en 1 ligne>` — condition concrète permettant de clore l'action
     - `réf: <fichier(s) ou contexte clé>` — où trouver le contexte nécessaire
     Si le contexte est introuvable dans la session, écrire `réf: [à préciser]` plutôt qu'omettre le champ.

5. Mettre à jour `<dossier>/_contexte/contexte.md` :
   - Réécrire intégralement la section "État actuel" (5 lignes max).
   - Ajouter les décisions actées à "Décisions structurantes" (append only).
   - Si la liste dépasse 10 entrées : archiver les plus anciennes dans `_contexte/archive_decisions.md`.
   - Ne pas toucher à "Objectif" sauf décision explicite. Ne pas toucher à "Stack" sauf changement technique.
   - Si rien n'a changé : ne pas toucher au fichier.

6. Mettre à jour `<dossier>/_contexte/_manifest.md` :
   - Ajouter ou retirer la roadmap de "Charger au démarrage" si son statut a changé.
   - Sinon : ne pas toucher au fichier.

7. Lire la section "Charger au démarrage" du manifest.
   Pour chaque autre fichier listé (hors fichiers déjà traités aux étapes 4-6), vérifier qu'il reflète
   fidèlement l'état après session. Mettre à jour ceux qui sont périmés.
   Invariant : ce que lira le prochain `/start` doit être vrai.

8. Mettre à jour `README.md` à la racine du projet :
   - Refléter l'état actuel du projet (section "État actuel" de `contexte.md`).
   - Ne pas modifier les sections stables (objectif, stack, structure) sauf changement explicite.
   - Si le README n'existe pas encore : ne pas le créer sans demander.

9. Bumper la version dans `CHANGELOG.md` :
   - Lire la dernière entrée pour extraire la version actuelle.
   - Déterminer le type de bump : **major** si structure de `_contexte/` modifiée ou commande supprimée ; **minor** dans tous les autres cas.
   - Calculer la prochaine version et ajouter en tête une nouvelle entrée avec les livrables de l'étape 3.
   - Ne pas modifier les entrées existantes.

10. Effectuer un commit git :
   ```bash
   git diff --name-only          # vérifier tous les fichiers modifiés pendant la session
   git status                    # confirmer l'état du repo
   git add <dossier>/_contexte/ CHANGELOG.md [autres fichiers modifiés identifiés ci-dessus]
   git commit -m "close(<alias>): session AAAA-MM-JJ — <résumé 1 ligne>"
   ```
   - Le résumé reprend la première décision actée, ou la prochaine étape si aucune décision.
   - En cas de doute sur ce qu'il faut stager : préférer un commit légèrement trop large
     plutôt qu'un commit partiel laissant le repo dans un état incohérent.
   - Ne pas inclure de fichiers sans lien avec la session.

11. Afficher en fin de réponse en grand format : ✌️😎


# ROADMAP.md

## Quand créer une roadmap

Pas à chaque session. Une roadmap se justifie quand :
- la feature ou la modification comporte plusieurs phases distinctes
- le travail va s'étaler sur plusieurs sessions
- le risque de perdre le fil entre deux `/compact` est réel

## Format

Nommage : `roadmap_<sujet>.md` dans le dossier de zone.

## Règles

- Une seule phase `[EN COURS]` à la fois.
- Le checkpoint `/compact` est intégré dans le modèle après chaque phase — ne pas le supprimer.
- Le fichier est mis à jour par `/close` : statuts des tâches et phases reflètent l'état réel après session.
- La roadmap est listée dans la section "Charger au démarrage" du manifest pendant toute la durée du chantier.
- Quand toutes les phases sont `[FAIT]` : retirer la roadmap du manifest. La conserver dans le dossier comme archive.

## Modèle

À chaque création, copier ce modèle, renommer en `roadmap_<sujet>.md`, remplir les phases.

```markdown
# Roadmap — <titre>
Objectif : <1 ligne>
Créée le : AAAA-MM-JJ

---

## Phase 1 — <titre> [TODO]
- [ ] tâche
- [ ] tâche
- [ ] tâche

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 2 — <titre> [TODO]
- [ ] tâche
- [ ] tâche
- [ ] tâche

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase N — <titre> [TODO]
- [ ] tâche
- [ ] tâche
```


# Intégration Ollama

## Prérequis

```bash
curl -fsSL https://ollama.com/install.sh | sh   # installation
ollama pull gemma3:4b                            # modèle par défaut
ollama serve                                     # démarrer le service (si non automatique)
apt install jq  # ou brew install jq             # dépendance du script
```

## Script générique

Placer `ollama_call.sh` à la racine du projet :

```bash
#!/bin/bash
# Usage : ./ollama_call.sh "prompt"
# Override modèle : OLLAMA_MODEL=autre:tag ./ollama_call.sh "prompt"
MODEL="${OLLAMA_MODEL:-gemma3:4b}"

# Vérification que le service est disponible
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
  echo "ERREUR: Ollama n'est pas démarré. Lancer 'ollama serve' puis réessayer." >&2
  exit 1
fi

jq -n --arg model "$MODEL" --arg prompt "$1" \
  '{model:$model, prompt:$prompt, stream:false}' \
  | curl -s http://localhost:11434/api/generate \
      -H "Content-Type: application/json" \
      -d @- \
  | jq -r '.response // "ERREUR: réponse vide ou inattendue du modèle"'
```

```bash
chmod +x ollama_call.sh
```

> **Test de sanité :** avant d'intégrer Ollama dans un workflow, vérifier que le script répond :
> ```bash
> ./ollama_call.sh "Réponds uniquement : OK"
> # Attendu : OK
> ```

## Appel depuis Claude

Dans Claude Code, Claude construit le prompt et délègue directement :

```bash
./ollama_call.sh "Génère un commit message conventionnel pour : ajout validation email"
```

Claude récupère le résultat et l'intègre. Il ne traite pas lui-même la tâche.

## Templates par cas d'usage

### Post réseaux sociaux
```bash
./ollama_call.sh "Tu es rédacteur [RÉSEAU]. Écris un post sur : [SUJET]. Ton : [TON]. Contraintes : [LONGUEUR, FORMAT]."
```

### Commit message
```bash
./ollama_call.sh "Génère un commit message au format conventionnel (type(scope): description) pour ce changement : [DIFF OU DESCRIPTION]"
```

### Changelog / release notes
```bash
./ollama_call.sh "Transforme ces commits en release notes lisibles, sans jargon technique : [LISTE DE COMMITS]"
```

### Données de test
```bash
./ollama_call.sh "Génère 10 entrées JSON valides pour ce schéma : [SCHÉMA]. Retourne uniquement le JSON brut, sans commentaire."
```

### Pré-digest de logs
```bash
./ollama_call.sh "Résume ces logs en 5 lignes max. Identifie le type d'erreur et sa fréquence : [LOGS]"
```

### Email type / rapport récurrent
```bash
./ollama_call.sh "Rédige un email [CONTEXTE] à partir de ces éléments : [POINTS CLÉS]. Ton : [TON]. Sois concis."
```

## Règle de délégation

Déléguer à Ollama quand :
- la tâche correspond à un template ci-dessus
- les données sont sensibles (ne pas envoyer en cloud)
- la tâche est purement mécanique, sans raisonnement sur le codebase

Ne pas déléguer à Ollama quand :
- le résultat sera intégré directement sans relecture
- la tâche implique des dépendances ou du contexte applicatif

---

# /init — Initialisation à partir du kit de templates

## Contenu du kit

Ce protocole est livré avec un dossier `templates/` contenant les fichiers prêts à copier dans un projet. Initialiser une zone ne consiste pas à générer du contenu depuis zéro : Claude pose quelques questions, copie les fichiers, remplace les placeholders.

```
claude-vibecoding-kit/
├── Protocole_start_close_context.md   <- ce document, copié dans _docs/
├── DEPLOYMENTS.md                      <- registre local des déploiements (ignoré par git)
└── templates/
    ├── .claude/
    │   ├── CLAUDE.md
    │   ├── zones.md                    <- table alias → dossiers réels
    │   └── commands/
    │       ├── init.md
    │       ├── start.md
    │       ├── close.md
    │       ├── update.md
    │       └── memory.md
    ├── _contexte/
    │   ├── _manifest.md
    │   ├── contexte.md
    │   └── signals.md
    ├── ollama_call.sh
    └── roadmap_TEMPLATE.md
```

## Placeholders

| Placeholder | Remplacé par |
|-------------|--------------|
| `{{ALIAS}}` | Alias court de la zone (ex: backend) |
| `{{RACINE}}` | Chemin absolu de la racine du projet (working directory courant) |
| `{{OBJECTIF}}` | Objectif du projet, 1-2 phrases |
| `{{STACK}}` | Stack technique, liste courte |
| `{{DATE}}` | Date du jour, AAAA-MM-JJ |

Les placeholders apparaissent dans `templates/_contexte/*.md`, `templates/.claude/commands/*.md` et `templates/.claude/zones.md`. `CLAUDE.md`, `ollama_call.sh` et `roadmap_TEMPLATE.md` sont génériques, copiés tels quels.

## Procédure

La commande `/init <chemin-vers-le-kit>` automatise l'initialisation. Claude :

1. Pose 5 questions : alias de la zone, objectif, stack, git (oui/non), première zone ou supplémentaire.
   La racine du projet est le working directory courant — non demandée.

2. Copie les fichiers :
   - `templates/_contexte/` → `_contexte/`
   - `templates/.claude/CLAUDE.md` → `.claude/CLAUDE.md`
   - `templates/.claude/zones.md` → `.claude/zones.md`
   - `templates/.claude/commands/` → `.claude/commands/`
   - `templates/ollama_call.sh` → `ollama_call.sh` (+ `chmod +x`)
   - `Protocole_start_close_context.md` → `_docs/protocole_vibecoding.md`

   Pour une zone supplémentaire : ne pas copier `start.md`, `close.md` ni `zones.md` — ajouter une ligne `| alias | dossier |` à la table existante dans `zones.md`.

3. Remplace les placeholders dans les fichiers copiés sous `_contexte/`, `.claude/commands/` et `.claude/zones.md`.

4. Commit initial (si git = oui) :
   ```bash
   git add .claude/ _contexte/ ollama_call.sh _docs/
   git commit -m "init: protocole vibecoding — zone <alias>"
   ```

5. Enregistre le déploiement dans `DEPLOYMENTS.md` du kit (nom projet, chemin, alias, version, date).

## Notes

**Cas multi-zones :** `.claude/commands/start.md`, `close.md` et `zones.md` sont partagés — une ligne par zone dans `zones.md`, pas de duplication de fichiers.

**Projet sans git :** ignorer l'étape commit. La traçabilité repose alors uniquement sur la section "Dernière session" de `_contexte/signals.md`.

**`roadmap_TEMPLATE.md`** n'est pas copié à l'init. Il est utilisé uniquement à la création d'un chantier multi-phases.


# /update — Mise à jour des fichiers de protocole

Met à jour les fichiers de protocole (`start.md`, `close.md`, `init.md`, `update.md`, `CLAUDE.md`) dans un projet déjà initialisé à partir de la dernière version du kit. Ne touche pas aux fichiers spécifiques au projet (`_contexte/`, `zones.md`, section "Données sensibles" de `CLAUDE.md`).

## Procédure

1. **Argument** : chemin vers le dossier du kit (`$ARGUMENTS`). Si absent : demander.

2. **Si start.md et close.md sont absents** : basculer en mode initialisation partielle — copier uniquement les fichiers manquants, substituer `{{ALIAS}}` / `{{RACINE}}`, ne jamais écraser ce qui existe.

3. **Commit de sauvegarde** avant toute modification :
   ```bash
   git add .claude/commands/ .claude/CLAUDE.md
   git commit -m "backup: avant update protocole vibecoding"
   ```
   Si working tree propre : passer directement.

4. **Lire la configuration existante** : extraire toutes les paires alias → dossier depuis `zones.md` et les fichiers existants. En cas de conflit : `zones.md` fait autorité.

5. **Copier et réappliquer les substitutions** pour chaque fichier :

| Fichier kit | Destination |
|-------------|-------------|
| `templates/.claude/commands/start.md` | `.claude/commands/start.md` |
| `templates/.claude/commands/close.md` | `.claude/commands/close.md` |
| `templates/.claude/commands/init.md` | `.claude/commands/init.md` |
| `templates/.claude/commands/update.md` | `.claude/commands/update.md` |

   Ne pas écraser `_contexte/`, `zones.md`, `ollama_call.sh`.

6. **Mettre à jour CLAUDE.md** (partiel) : conserver la section "Données sensibles" du fichier existant ; remplacer toutes les autres sections par celles du kit.

7. **Enregistrer dans DEPLOYMENTS.md** si le projet n'y figure pas encore.

8. **Commit** :
   ```bash
   git add .claude/commands/ .claude/CLAUDE.md
   git commit -m "update: protocole vibecoding — zone <alias> — kit <version>"
   ```


# /memory — Mémoire projet persistante

Gère la mémoire projet dans `.claude/memory.md`. Ce fichier est lu au démarrage de chaque session (voir section CLAUDE.md → Mémoire projet) et contient les décisions et préférences explicitement enregistrées par l'utilisateur.

## Procédure

- **Sans argument** : afficher le contenu actuel de `.claude/memory.md` (ou "Aucune mémoire enregistrée." si absent).
- **Avec argument** : ajouter une entrée datée au format :
  ```
  ## YYYY-MM-DD — [sujet en 3-5 mots]
  [contenu mémorisé, reformulé pour être compréhensible hors contexte]
  ```
  Confirmer en une ligne : "Mémorisé : [sujet]".

## Règle d'utilisation

Ne jamais écrire directement dans `.claude/memory.md` — passer uniquement par `/memory`. Ne jamais y écrire des informations éphémères (état courant, session en cours) : réserver aux décisions, préférences et contexte persistants.

---

# Changelog

## v2.3 — 2026-06-21

**Nouvelles commandes**
- `/update` : met à jour les fichiers de protocole dans un projet déjà initialisé sans toucher aux données projet.
- `/memory` : gestion de la mémoire projet persistante dans `.claude/memory.md`.

**`zones.md`**
- Table centralisée `alias → dossier réel`, copiée par `/init` dans `.claude/zones.md`. `start.md` et `close.md` lisent ce fichier au lieu d'embarquer la table statiquement.

**`/start` et `/close`**
- Argument absent = zone implicite (working directory courant) — plus d'erreur si omis.
- `/start` étape 5b : lecture des `réf:` des actions ouvertes avant affichage de la synthèse.
- `/close` étape 4 : invariant `fait quand:` / `réf:` sur chaque action ouverte dans `signals.md`.
- `/close` : nouvelle étape 9 (bump `CHANGELOG.md`) ; étapes 9-10 deviennent 10-11.

**`DEPLOYMENTS.md`**
- Registre des projets initialisés via `/init`, stocké dans le dossier du kit (ignoré par git pour permettre un registre local par clone).

## v2.2 — 2026-06-20

**Affichage de `/start`**
- Étape 5 de `/start` : `signals.md` est désormais affiché **intégralement** (sans résumé ni reformulation) au lieu d'être synthétisé. La synthèse pouvait omettre des actions ouvertes, échéances ou blocages ; l'affichage intégral garantit qu'aucun signal de pilotage n'est perdu au démarrage. Les autres fichiers (roadmap, contexte) restent résumés en complément.

## v2.1 — 2026-06-12

**Corrections**
- `ollama_call.sh` : correction du bug d'échappement JSON. Le prompt était interpolé directement dans la chaîne JSON (`\"prompt\":\"$1\"`) — tout prompt contenant des guillemets ou des sauts de ligne (diffs, logs, listes de commits) cassait la requête. Le payload est désormais construit avec `jq -n --arg` et passé à curl via `-d @-`.

**Simplification de la structure `_contexte/`**
- Suppression du champ "Résumé de démarrage" du manifest : écrit par `/close` mais jamais lu par `/start` (qui le considérait comme potentiellement périmé). Le manifest se réduit à la liste "Charger au démarrage".
- Fusion de `derniere_session.md` dans `signals.md` (nouvelle section "Dernière session", écrasée à chaque `/close`) : un fichier de moins à lire au `/start` et à réécrire au `/close`. L'historique des sessions reste consultable via git.
- `/close` passe de 10 à 9 étapes ; `/start` charge 2 fichiers au lieu de 3 (hors roadmap).

**Frontmatter des commandes**
- `start.md` : `model: haiku`, `argument-hint: <zone>` — la ligne "/start → Haiku" de la table des modèles est appliquée automatiquement.
- `close.md` : `model: sonnet`, `argument-hint: <zone>`, `allowed-tools` autorisant `git status/diff/add/commit` — supprime les prompts de permission au commit de clôture.

## v2 — AAAA-MM-JJ

**Nouvelles sections**
- `Structure _contexte/` : formats canoniques stricts pour `_manifest.md`, `contexte.md` et `signals.md`. Élimine l'ambiguïté sur ce que `/start` doit charger et ce que `/close` doit produire.
- `/init` : initialisation basée sur un kit de templates (`templates/`). Claude pose 6 questions, copie les fichiers, remplace 5 placeholders (`{{ALIAS}}`, `{{RACINE}}`, `{{OBJECTIF}}`, `{{STACK}}`, `{{DATE}}`). Pas de génération de contenu — uniquement copie + substitution.

**Modifications `/start`**
- Ordre de lecture hiérarchisé : `signals.md` → `derniere_session.md` → `contexte.md` → roadmap. Priorité aux informations urgentes, économie de tokens si le contexte stable n'est pas nécessaire.
- Le résumé de démarrage est maintenant produit à partir des fichiers lus, pas depuis le champ manifest (qui peut être périmé).

**Modifications `/close`**
- Étape 6 (signals) : ajout de la gestion des priorités [P1/P2] et de la section "Contexte chaud".
- Étape 7 (manifest) : `/close` écrase désormais explicitement le "Résumé de démarrage" du manifest.
- Étape 5 (contexte) : structure fixe avec tailles max par section et règle d'archivage à 10 décisions.
- Étape 9 (git) : remplacement de `git status` seul par `git diff --name-only` + `git status` pour ne pas rater de fichiers. Ajout d'une règle explicite sur les commits partiels.

**Modifications table modèles**
- "Debug → Fable" remplacé par "Debug → Sonnet" avec note explicative. Fable n'est pas un modèle disponible publiquement.

**Modifications Ollama**
- Script `ollama_call.sh` : ajout d'une vérification de disponibilité du service au démarrage et d'une gestion d'erreur sur la réponse (`// "ERREUR: ..."` dans le pipe jq).
- Ajout d'un test de sanité documenté.
- Correction de la référence au modèle (`gemma3:4b` au lieu de `gemma4`).
