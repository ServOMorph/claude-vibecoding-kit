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

Ce fichier est un **document de référence**. Les fichiers opérationnels (commandes, templates, CLAUDE.md) sont dans `templates/` — ce document explique les choix de conception et les règles qui ne figurent pas dans les templates eux-mêmes.

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

**Ollama (local, ex. gemma4:e4b) :** pour les tâches répétitives et templated qui ne nécessitent pas de raisonnement complexe, ou quand les données sont sensibles et ne doivent pas quitter la machine.

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

# Structure `_contexte/`

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

> **Frontmatter :** le fichier `.claude/commands/start.md` porte `model: haiku` — la ligne "/start → Haiku" de la table des modèles est appliquée automatiquement.

Charge `signals.md`, `contexte.md`, et `roadmap*.md` si présente — sans fichier manifest intermédiaire.

Voir `templates/.claude/commands/start.md`.


# /close [zone]

> **Frontmatter :** le fichier `.claude/commands/close.md` porte `model: sonnet` et `allowed-tools` autorisant `git status/diff/add/commit` — plus de prompts de permission au commit de clôture.

Voir `templates/.claude/commands/close.md`.


# ROADMAP.md

> **Règle appliquée automatiquement :** les critères de création, le format et les règles ci-dessous
> sont dupliqués dans `templates/.claude/CLAUDE.md` (section "Roadmap"), donc chargés en permanence
> dans toute conversation — pas seulement en cas d'appel à une commande dédiée. Choix fait pour que la
> règle s'applique même quand la demande de roadmap est formulée de façon informelle en cours de
> session, pas uniquement au lancement d'une commande explicite.

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
- Le fichier est mis à jour par `/close` : statuts des tâches et phases reflètent l'état réel après session, jamais en cours de session.
- Tant qu'une roadmap est active, `/start` la charge automatiquement (`roadmap*.md` dans le dossier de zone).
- Quand toutes les phases sont `[FAIT]` : la conserver dans le dossier comme archive.
- Tests : intégrés à la phase fonctionnelle (dernière tâche = tests exécutés et verts), pas une phase séparée sauf volume important.
- Refacto : phase dédiée uniquement si dette technique visible en fin de phase précédente et trop large pour la phase suivante — sinon signaler sans imposer de phase.

Modèle détaillé (structure de fichier complète) : voir `templates/roadmap_TEMPLATE.md` — sert de référence humaine ; l'agent applique directement les règles ci-dessus via CLAUDE.md.


# Intégration Ollama

## Prérequis

```bash
curl -fsSL https://ollama.com/install.sh | sh   # installation
ollama pull gemma4:e4b                           # modèle par défaut
ollama serve                                     # démarrer le service (si non automatique)
```

Dépendance : `python` ou `python3` sur le PATH (utilisé par le script pour le JSON, pas de `jq` requis).

Script : voir `templates/ollama_call.sh`.

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

```
claude-vibecoding-kit/
├── Protocole_start_close_context.md   <- ce document, copié dans _docs/
├── DEPLOYMENTS.md                      <- registre local des déploiements (ignoré par git)
└── templates/
    ├── .claude/
    │   ├── CLAUDE.md
    │   ├── zones.md                    <- table alias → dossiers réels
    │   └── commands/
    │       ├── start.md
    │       ├── close.md
    │       └── create_memory.md
    ├── _contexte/
    │   ├── contexte.md
    │   └── signals.md
    ├── ollama_call.sh
    └── roadmap_TEMPLATE.md
```

## Placeholders

| Placeholder | Remplacé par |
|-------------|--------------|
| `{{ALIAS}}` | Alias court de la zone (ex: backend) |
| `{{RACINE}}` | Chemin absolu de la racine du projet (argument fourni à `/init_projet`) |
| `{{OBJECTIF}}` | Objectif du projet, 1-2 phrases |
| `{{STACK}}` | Stack technique, liste courte |
| `{{DATE}}` | Date du jour, AAAA-MM-JJ |

Les placeholders apparaissent dans `templates/_contexte/*.md`, `templates/.claude/commands/*.md` et `templates/.claude/zones.md`. `CLAUDE.md`, `ollama_call.sh` et `roadmap_TEMPLATE.md` sont génériques, copiés tels quels.

Procédure : voir `templates/.claude/commands/init_projet.md`.

## Notes

**Cas multi-zones :** `.claude/commands/start.md`, `close.md` et `zones.md` sont partagés — une ligne par zone dans `zones.md`, pas de duplication de fichiers.

**Projet sans git :** ignorer l'étape commit. La traçabilité repose alors uniquement sur la section "Dernière session" de `_contexte/signals.md`.

**`roadmap_TEMPLATE.md`** n'est pas copié à l'init. Il est utilisé uniquement à la création d'un chantier multi-phases.


# /update — Mise à jour des fichiers de protocole

Lancée depuis le repo du kit, avec en argument le chemin absolu du projet cible (ou `all`). Met à jour `start.md`, `close.md`, `CLAUDE.md` et `ollama_call.sh` dans ce projet à partir de la dernière version du kit. Ne touche pas à `_contexte/`, `zones.md`, ni à la section "Données sensibles" et la section "Spécificités projet" de `CLAUDE.md`, ni au bloc `SPECIFICITES PROJET` de `start.md`/`close.md`. Un commit de sauvegarde est effectué dans le repo du projet cible avant toute modification.

`init_projet.md` et `update.md` ne sont pas déployés dans les projets — ils restent dans le kit.

**Mode batch (`/update all`)** : met à jour tous les projets listés dans `DEPLOYMENTS.md`, sans confirmation intermédiaire. Un projet dont le chemin est introuvable ou n'est plus un repo git est ignoré (échec noté) sans interrompre le batch. Un résumé final liste le statut de chaque projet.

**Zone "Spécificités projet"** (section `CLAUDE.md` + bloc marqueur `start.md`/`close.md`) : préserve les lignes propres à un projet à travers les updates successifs. Si la zone est absente (fichier jamais migré vers ce mécanisme), `/update` compare le fichier existant au fichier kit correspondant, liste les lignes candidates et pose une question à l'utilisateur (migrer / ignorer / décider ligne par ligne) — y compris en mode `/update all`, qui se met alors en pause ciblée sur ce projet sans interrompre le reste du batch. Convention : toute règle liée à une étape/section précise doit la référencer explicitement par son numéro/titre, car la zone est toujours physiquement en fin de fichier.

Procédure : voir `templates/.claude/commands/update.md`.


# /create_memory — Mémoire projet persistante

Gère `.claude/memory.md` : décisions et préférences explicitement enregistrées, relues au démarrage de chaque session.

Procédure : voir `templates/.claude/commands/create_memory.md`.

## Règle d'utilisation

Ne jamais écrire directement dans `.claude/memory.md` — passer uniquement par `/create_memory`. Ne jamais y écrire des informations éphémères (état courant, session en cours) : réserver aux décisions, préférences et contexte persistants.

---

# Changelog

## v2.13 — 2026-07-17

**`/close`**
- Si le `README.md` du projet cible n'existe pas encore : création automatique (objectif, stack, structure, état actuel) au lieu de demander confirmation.

**`/update`**
- Suppression des références obsolètes au mécanisme de substitution `{{ALIAS}}`/`{{RACINE}}` dans `start.md`/`close.md` (ces fichiers lisent `zones.md` directement depuis une version antérieure du kit). Correction de l'objectif, du message de confirmation et de la liste de fichiers copiés en mode initialisation, qui mentionnaient à tort `init_projet.md`/`update.md` comme fichiers propagés vers les projets cibles.

## v2.12 — 2026-07-17

**`/init_projet`**
- Nouvelle étape (avant la confirmation finale) listant tous les fichiers créés ou modifiés au cours de l'initialisation, sous forme de liens cliquables (chemin absolu).

## v2.11 — 2026-07-17

**`/init_projet`**
- Inversion du sens de lancement : se lance désormais depuis le repo du kit, argument = chemin absolu du projet cible à initialiser (au lieu de l'inverse). Opérations de copie référencées explicitement via ce chemin ; `DEPLOYMENTS.md`/`CHANGELOG.md` lus à la racine du kit.

## v2.10 — 2026-07-14

- `ollama_call.sh` : suppression de la dépendance `jq`, encodage/décodage JSON via `python`/`python3`, remontée explicite des erreurs HTTP Ollama. Modèle par défaut changé de `gemma3:4b` à `gemma4:e4b`.
- `/update` : ajout de `ollama_call.sh` à la table des fichiers propagés vers les projets cibles (absent jusqu'ici — bug corrigé).

## v2.9 — 2026-07-03

**`/update`**
- Inversion du sens de lancement : se lance désormais depuis le repo du kit, argument = chemin absolu du projet cible (au lieu de l'inverse). Opérations sur le projet cible référencées explicitement (`git -C <cible> ...`) ; `DEPLOYMENTS.md`/`CHANGELOG.md` lus à la racine du kit.

## v2.8 — 2026-07-03

**`CLAUDE.md`, `start.md`, `close.md`**
- Nouvelle zone "Spécificités projet" (section CLAUDE.md, bloc marqueur start.md/close.md) préservée intégralement par `/update`, au même titre que "Données sensibles". Convention de référencement explicite par étape/section pour limiter la perte de position logique (la zone est toujours en fin de fichier).

**`/update`**
- Si la zone "Spécificités projet" est absente (fichier jamais migré) : détection par diff contre le fichier kit, question à l'utilisateur (migrer/ignorer/décider ligne par ligne), y compris en mode `/update all` (pause ciblée sur le projet concerné, sans interrompre le batch).

**`.claude/commands/close.md` (kit)**
- Lancement de `/doc_sync` ajouté entre l'étape 8 et l'étape 9, via sa propre zone "Spécificités projet" (non répercuté dans le template déployé, spécifique au repo du kit).

## v2.7 — 2026-07-03

**`/update`**
- Nouveau mode batch `/update all` : lancé depuis le repo du kit, applique la procédure standard à tous les projets listés dans `DEPLOYMENTS.md`, sans confirmation intermédiaire. Chemin introuvable ou non-git → échec noté, batch non interrompu. Résumé final par projet.

## v2.6 — 2026-07-03

**`CLAUDE.md`**
- Nouvelle section "Roadmap" : critères de création, format canonique, et règle "Contenu des phases" (tests intégrés à la phase fonctionnelle sauf volume important ; refacto en phase dédiée uniquement si dette technique visible et trop large pour la phase suivante). Choix de la localiser dans `CLAUDE.md` (chargé en permanence) plutôt qu'une commande `/roadmap` dédiée, pour couvrir les demandes formulées de façon informelle en cours de session.
- Section "ROADMAP.md" de ce document mise à jour en conséquence ; référence obsolète au "manifest" supprimée.

## v2.5 — 2026-07-03

**`/close`**
- Nouvelle étape 9 : avant le commit, relire les étapes 3 à 8 et confirmer explicitement leur exécution. Toute commande de génération/build associée à une étape et pas encore lancée doit l'être immédiatement, avant le commit. Étapes 9-10 deviennent 10-11.

## v2.3 — 2026-06-21

**Nouvelles commandes**
- `/update` : met à jour les fichiers de protocole dans un projet déjà initialisé sans toucher aux données projet.
- `/create_memory` : gestion de la mémoire projet persistante dans `.claude/memory.md`.

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
