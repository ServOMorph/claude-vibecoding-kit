# claude-vibecoding-kit — Persistance de contexte pour le vibecoding avec Claude Code

Kit de protocole pour travailler avec Claude Code sur des projets qui s'étalent dans le temps.

Stack : **Claude Code** (agent IA), **Markdown** (fichiers de contexte), **Python** (lanceur Ollama en stdlib pur), **Ollama** (délégation locale optionnelle). Zéro infrastructure, zéro dépendance Python — uniquement la bibliothèque standard.

Résout le problème structurel du vibecoding : **le contexte est perdu à chaque nouvelle conversation**. Sans protocole, chaque session repart de zéro, les décisions prises ne sont pas tracées, et l'IA ne sait pas où en est le projet.

## Ce que ça fait

- `/start [zone]` — charge le contexte du projet au démarrage de session (zone implicite si absent)
- `/close [zone]` — sauvegarde l'état, met à jour les fichiers de contexte, committe (zone implicite si absent)
- `/init_projet` — initialise le protocole dans un nouveau projet en quelques questions
- `/update` — met à jour les fichiers de protocole dans un projet déjà initialisé, sans toucher aux données projet
- `/create_memory` — ajoute une entrée dans la mémoire projet persistante (`.claude/memory.md`)
- `CLAUDE.md` — règles permanentes appliquées à toutes les conversations
- Support multi-zones (plusieurs sous-projets dans un même repo)
- Intégration Ollama pour les tâches répétitives sans envoyer de données en cloud

## Démarrage rapide

### 1. Cloner ce repo

```bash
git clone https://github.com/ServOMorph/claude-vibecoding-kit.git
```

### 2. Ouvrir ce kit dans Claude Code

Dans Claude Code, ouvrir le dossier du kit (claude-vibecoding-kit).

### 3. Lancer l'initialisation

```
/init_projet <chemin vers le projet à initialiser>
```

Claude pose 5 questions (alias, objectif, stack, git, première zone ou supplémentaire). La racine du projet cible est l'argument fourni — non demandée. Copie les fichiers, remplace les placeholders, committe dans le projet cible, enregistre le déploiement dans `DEPLOYMENTS.md`.

### 4. Démarrer

```
/start <alias>
```

## Structure du kit

```
claude-vibecoding-kit/
├── Protocole_start_close_context.md   # documentation complète
├── CHANGELOG.md                          # historique des versions
├── DEPLOYMENTS.md                        # registre des projets initialisés (ignoré par git)
├── tests/                                # suite unittest du lanceur Ollama
├── base_connaissances/                   # audit des projets déployés (index, fiches, analyse, propositions)
└── templates/
    ├── .claude/
    │   ├── CLAUDE.md                     # règles pour l'IA
    │   ├── zones.md                      # table alias → dossiers réels
    │   └── commands/
    │       ├── init_projet.md            # commande /init_projet
    │       ├── start.md                  # commande /start
    │       ├── close.md                  # commande /close
    │       ├── update.md                 # commande /update
    │       └── create_memory.md          # commande /create_memory
    ├── _contexte/
    │   ├── contexte.md                   # contexte stable du projet
    │   └── signals.md                    # actions ouvertes, blocages, dernière session
    ├── ollama_call.py                    # délégation vers modèle local
    └── roadmap_TEMPLATE.md               # template pour chantiers multi-phases
```

## Documentation

Lire `Protocole_start_close_context.md` pour le détail complet : stratégie de gestion du contexte, table des modèles recommandés, formats canoniques, intégration Ollama.

L'historique des versions est consigné dans `CHANGELOG.md`.

## Prérequis

- [Claude Code](https://claude.ai/code)
- Git
- (Optionnel) [Ollama](https://ollama.com) + `python`/`python3` pour la délégation locale

## Dépendances

**Aucune dépendance externe Python.** Le lanceur Ollama utilise uniquement la bibliothèque standard (`urllib`, `json`, `os`, `sys`). Aucun `requirements.txt` nécessaire.

## État actuel

Kit v2.19 : la délégation Ollama utilise `python ollama_call.py "<prompt>"`, sans dépendance à Bash ni WSL. Le lanceur gère les délais et réponses API invalides ; sa suite de tests couvre aussi un appel local réel optionnel. `base_connaissances/` contient un audit des 11 projets déployés (frictions, patterns terrain, propositions d'amélioration du kit). `/update` corrigé (DEPLOYMENTS.md fiable, migration automatique du contenu spécifique projet, vérification post-update) et testé sur 2 projets ; propagation aux 9 restants en cours. Nouvelle initiative en conception : `roadmap_agents.md` définit un template de création d'agent (« zone à rôle » pilotable par `/start`/`/close`), expérimenté sur robert-ia.

## Vérifier le lanceur Ollama

La suite est dans `tests/test_ollama_call.py`.

```powershell
python -m unittest discover -s tests -v
$env:OLLAMA_LIVE_TEST = "1"
python -m unittest tests.test_ollama_call.OllamaCallTests.test_live_ollama_returns_a_response -v
```

Le second test appelle réellement Ollama ; il reste désactivé par défaut.

## Licence

MIT — voir [LICENSE](LICENSE).
