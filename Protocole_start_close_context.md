# Protocole de vibecoding — Documentation générique
> **v3.39** — Révision du 2026-08-20. Voir [`CHANGELOG.md`](CHANGELOG.md) pour l'historique complet des versions.

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
| Phase de refacto ou migration structurelle | Opus |
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

> **Rotation des sessions (Phase 4) :** Pour éviter l'accumulation d'historique mort, `signals.md` ne conserve que la **dernière session** (seuil = 1 bloc `# Session du`). Les sessions précédentes sont automatiquement déplacées vers `_contexte/archive_sessions.md` (format append-only, séparées par `---`). Le fichier `archive_sessions.md` n'est **jamais** chargé par `/start` — il sert uniquement de stockage historique pour consultation manuelle.

---

# /start [zone]

> **Frontmatter :** le fichier `.claude/commands/start.md` porte `model: haiku` — la ligne "/start → Haiku" de la table des modèles est appliquée automatiquement.

Charge `signals.md`, `contexte.md`, et `roadmap*.md` si présente — sans fichier manifest intermédiaire.
Étape 2b : si `<dossier>/agent_role.md` existe (zone-agent créée via `/create_agent`), la charger et
l'afficher intégralement avant `signals.md`. Absent pour une zone racine classique.

Voir `templates/.claude/commands/start.md`.


# /close [zone]

> **Frontmatter :** le fichier `.claude/commands/close.md` porte `model: sonnet` et `allowed-tools` autorisant `git status/diff/add/commit/push` — plus de prompts de permission au commit ni au push de clôture.

Voir `templates/.claude/commands/close.md`.


# /create_agent <chemin_projet_cible> <dossier> [rôle]

> **Frontmatter :** `.claude/commands/create_agent.md` porte `model: sonnet`. Commande volontairement
> **jamais copiée** dans les projets cibles — elle reste dans le kit et s'exécute toujours depuis lui,
> le projet cible étant fourni en premier argument (chemin absolu).

Crée un agent (« zone à rôle » : `agent_role.md` + `_contexte/` propre, enregistrée dans
`<projet_cible>/zones.md`, pilotable par `/start`/`/close`) dans un projet cible externe. Procédure en
phases ancrées : `[PREFLIGHT]` résout l'argument et vérifie que le `start.md` du projet cible charge
bien la charte automatiquement (sinon avertit et demande confirmation, plutôt que de créer un agent
silencieusement inopérant) ; `[COLLECTE]` pose une question unique groupée (rôle durable — jamais
inventé par défaut, périmètre d'écriture, confirmation du mode) puis analyse la stack du projet cible
si le résultat sera utilisé ; `[ECRITURE]` écrit tous les fichiers d'un coup, en distinguant mode
**création** (nouvel alias, contrôle d'unicité avant écriture dans `zones.md`) et mode **conversion**
(alias déjà présent pointant vers le dossier demandé : complète sans jamais toucher `zones.md` ni un
`signals.md` existant) ; `[SORTIE]` propose (une seule fois par appel) de copier dans le presse-papier
un message court de mise à jour pour l'agent racine du projet cible, résumant les agents créés — jamais
écrit dans les fichiers du projet cible —, puis récapitule et recommande Opus pour la phase `[AUDIT]`.
Charte générée depuis `templates/agent_role_TEMPLATE.md`. Étape `[ECRITURE]` alimente aussi
`ameliorations_create_agent.md` (racine du kit, jamais dans le projet cible) à chaque création.
`[AUDIT]` : analyse à froid de la commande elle-même (jamais automatique, Opus imposé) sur demande
explicite seulement.

Voir `.claude/commands/create_agent.md` et `templates/agent_role_TEMPLATE.md` (aucune copie dans
`templates/.claude/commands/` : la commande n'est pas destinée à être copiée dans un projet).


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

Script : voir `templates/ollama_call.py`.

> **Test de sanité :** avant d'intégrer Ollama dans un workflow, vérifier que le script répond :
> ```bash
> python ollama_call.py "Réponds uniquement : OK"
> # Attendu : OK
> ```

> **Suite de tests :** depuis la racine du kit, exécuter les contrôles sans service local :
> ```powershell
> python -m unittest discover -s tests -v
> ```
> Pour vérifier un appel réel à Ollama, activer explicitement le test d’intégration :
> ```powershell
> $env:OLLAMA_LIVE_TEST = "1"
> python -m unittest tests.test_ollama_call.OllamaCallTests.test_live_ollama_returns_a_response -v
> ```
> Le lanceur impose un délai maximal de 60 secondes et affiche une erreur lisible si l’API renvoie un JSON invalide ou une réponse inattendue.

## Appel depuis Claude

Dans Claude Code, Claude construit le prompt et délègue directement :

```bash
python ollama_call.py "Génère un commit message conventionnel pour : ajout validation email"
```

Claude récupère le résultat et l'intègre. Il ne traite pas lui-même la tâche.

## Templates par cas d'usage

### Post réseaux sociaux
```bash
python ollama_call.py "Tu es rédacteur [RÉSEAU]. Écris un post sur : [SUJET]. Ton : [TON]. Contraintes : [LONGUEUR, FORMAT]."
```

### Commit message
```bash
python ollama_call.py "Génère un commit message au format conventionnel (type(scope): description) pour ce changement : [DIFF OU DESCRIPTION]"
```

### Changelog / release notes
```bash
python ollama_call.py "Transforme ces commits en release notes lisibles, sans jargon technique : [LISTE DE COMMITS]"
```

### Données de test
```bash
python ollama_call.py "Génère 10 entrées JSON valides pour ce schéma : [SCHÉMA]. Retourne uniquement le JSON brut, sans commentaire."
```

### Pré-digest de logs
```bash
python ollama_call.py "Résume ces logs en 5 lignes max. Identifie le type d'erreur et sa fréquence : [LOGS]"
```

### Email type / rapport récurrent
```bash
python ollama_call.py "Rédige un email [CONTEXTE] à partir de ces éléments : [POINTS CLÉS]. Ton : [TON]. Sois concis."
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
    ├── ollama_call.py
    ├── agent_role_TEMPLATE.md
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

Les placeholders apparaissent dans `templates/_contexte/*.md`, `templates/.claude/commands/*.md` et `templates/.claude/zones.md`. `CLAUDE.md`, `ollama_call.py` et `roadmap_TEMPLATE.md` sont génériques, copiés tels quels.

Procédure : voir `templates/.claude/commands/init_projet.md`.

## Notes

**Cas multi-zones :** `.claude/commands/start.md`, `close.md` et `zones.md` sont partagés — une ligne par zone dans `zones.md`, pas de duplication de fichiers.

**Projet sans git :** ignorer l'étape commit. La traçabilité repose alors uniquement sur la section "Dernière session" de `_contexte/signals.md`.

**`roadmap_TEMPLATE.md`** n'est pas copié à l'init. Il est utilisé uniquement à la création d'un chantier multi-phases.


# /update — Mise à jour des fichiers de protocole

Lancée depuis le repo du kit, avec en argument le chemin absolu du projet cible (ou `all`). Met à jour `start.md`, `close.md`, `CLAUDE.md` et `ollama_call.py` dans ce projet à partir de la dernière version du kit, et propose (sur confirmation, jamais automatique) de créer `AGENTS.md` si absent. Ne touche pas à `_contexte/`, `zones.md`, ni à la section "Données sensibles" et la section "Spécificités projet" de `CLAUDE.md`, ni au bloc `SPECIFICITES PROJET` de `start.md`/`close.md`, ni à un `AGENTS.md` déjà présent. Un commit de sauvegarde est effectué dans le repo du projet cible avant toute modification.

`init_projet.md` et `update.md` ne sont pas déployés dans les projets — ils restent dans le kit.

**Mode batch (`/update all`)** : met à jour tous les projets listés dans `DEPLOYMENTS.md`, sans confirmation intermédiaire. Un projet dont le chemin est introuvable ou n'est plus un repo git est ignoré (échec noté) sans interrompre le batch. Un résumé final liste le statut de chaque projet.

**Zone "Spécificités projet"** (section `CLAUDE.md` + bloc marqueur `start.md`/`close.md`) : préserve les lignes propres à un projet à travers les updates successifs. Si la zone est absente (fichier jamais migré vers ce mécanisme) ou si du contenu spécifique existe hors de la zone (sections orphelines ajoutées après elle), `/update` migre automatiquement ce contenu dans la zone "Spécificités projet", sans poser de question — y compris en mode `/update all`, qui ne se met donc plus en pause pour ce cas. Convention : toute règle liée à une étape/section précise doit la référencer explicitement par son numéro/titre, car la zone est toujours physiquement en fin de fichier.

**Vérification post-update** : avant de confirmer, `/update` contrôle que les fichiers de protocole sont à jour, les marqueurs intacts, `CLAUDE.md` cohérent (section Spécificités projet complète, Données sensibles préservée, délégation Ollama à jour), `_contexte/`/`zones.md` non touchés, `ollama_call.py` tracké par git, le commit propre (pas de fichier étranger), et `DEPLOYMENTS.md` correct. Un échec fait passer le statut du projet de "✅" à "⚠️" (avec détail), en individuel comme en mode batch.

Procédure : voir `templates/.claude/commands/update.md`.


# /create_memory [alias_zone] [contenu] — Mémoire projet persistante

Gère deux niveaux : `.claude/memory.md` (mémoire globale, tout le projet) et, si le premier mot de l'argument correspond à un alias de `.claude/zones.md`, `<dossier_zone>/_contexte/memory.md` (mémoire propre à cette zone). Les deux sont relus au démarrage de session (`.claude/memory.md` systématiquement, `_contexte/memory.md` de la zone résolue via l'étape 2c de `/start`).

Procédure : voir `templates/.claude/commands/create_memory.md`.

## Règle d'utilisation

Ne jamais écrire directement dans ces fichiers — passer uniquement par `/create_memory`. Ne jamais y écrire des informations éphémères (état courant, session en cours) : réserver aux décisions, préférences et contexte persistants.

---

# Changelog

> **Source unique :** L'historique complet des versions est consigné dans [`CHANGELOG.md`](CHANGELOG.md).
> Ce fichier ne duplique pas le changelog — voir `CHANGELOG.md` pour le détail des modifications par version.
