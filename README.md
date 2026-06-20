# claude-vibecoding-kit

Kit de protocole pour travailler avec Claude Code sur des projets qui s'étalent dans le temps.

Résout le problème structurel du vibecoding : **le contexte est perdu à chaque nouvelle conversation**. Sans protocole, chaque session repart de zéro, les décisions prises ne sont pas tracées, et l'IA ne sait pas où en est le projet.

## Ce que ça fait

- `/start <zone>` — charge le contexte du projet au démarrage de session
- `/close <zone>` — sauvegarde l'état, met à jour les fichiers de contexte, committe
- `/init` — initialise le protocole dans un nouveau projet en quelques questions
- `CLAUDE.md` — règles permanentes appliquées à toutes les conversations
- Support multi-zones (plusieurs sous-projets dans un même repo)
- Intégration Ollama pour les tâches répétitives sans envoyer de données en cloud

## Démarrage rapide

### 1. Cloner ce repo

```bash
git clone https://github.com/<votre-compte>/claude-vibecoding-kit.git
```

### 2. Ouvrir le projet cible dans Claude Code

Dans Claude Code, ouvrir le dossier du projet à initialiser.

### 3. Lancer l'initialisation

```
/init <chemin vers claude-vibecoding-kit>
```

Claude pose 5 questions (alias, objectif, stack, git, première zone ou supplémentaire), copie les fichiers, remplace les placeholders, committe.

### 4. Démarrer

```
/start <alias>
```

## Structure du kit

```
claude-vibecoding-kit/
├── Protocole_start_close_context_v2.md   # documentation complète
├── CHANGELOG.md                          # historique des versions
└── templates/
    ├── .claude/
    │   ├── CLAUDE.md                     # règles pour l'IA
    │   └── commands/
    │       ├── init.md                   # commande /init
    │       ├── start.md                  # commande /start
    │       └── close.md                  # commande /close
    ├── _contexte/
    │   ├── _manifest.md                  # fichiers à charger au /start
    │   ├── contexte.md                   # contexte stable du projet
    │   └── signals.md                    # actions ouvertes, blocages, dernière session
    ├── ollama_call.sh                    # délégation vers modèle local
    └── roadmap_TEMPLATE.md               # template pour chantiers multi-phases
```

## Documentation

Lire `Protocole_start_close_context_v2.md` pour le détail complet : stratégie de gestion du contexte, table des modèles recommandés, formats canoniques, intégration Ollama.

L'historique des versions est consigné dans `CHANGELOG.md`.

## Prérequis

- [Claude Code](https://claude.ai/code)
- Git
- (Optionnel) [Ollama](https://ollama.com) + `jq` pour la délégation locale
