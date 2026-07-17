# claude-vibecoding-kit

Kit de protocole pour travailler avec Claude Code sur des projets qui s'Ã©talent dans le temps.

RÃ©sout le problÃ¨me structurel du vibecoding : **le contexte est perdu Ã  chaque nouvelle conversation**. Sans protocole, chaque session repart de zÃ©ro, les dÃ©cisions prises ne sont pas tracÃ©es, et l'IA ne sait pas oÃ¹ en est le projet.

## Ce que Ã§a fait

- `/start [zone]` â€” charge le contexte du projet au dÃ©marrage de session (zone implicite si absent)
- `/close [zone]` â€” sauvegarde l'Ã©tat, met Ã  jour les fichiers de contexte, committe (zone implicite si absent)
- `/init_projet` â€” initialise le protocole dans un nouveau projet en quelques questions
- `/update` â€” met Ã  jour les fichiers de protocole dans un projet dÃ©jÃ  initialisÃ©, sans toucher aux donnÃ©es projet
- `/create_memory` â€” ajoute une entrÃ©e dans la mÃ©moire projet persistante (`.claude/memory.md`)
- `CLAUDE.md` â€” rÃ¨gles permanentes appliquÃ©es Ã  toutes les conversations
- Support multi-zones (plusieurs sous-projets dans un mÃªme repo)
- IntÃ©gration Ollama pour les tÃ¢ches rÃ©pÃ©titives sans envoyer de donnÃ©es en cloud

## DÃ©marrage rapide

### 1. Cloner ce repo

```bash
git clone https://github.com/<votre-compte>/claude-vibecoding-kit.git
```

### 2. Ouvrir ce kit dans Claude Code

Dans Claude Code, ouvrir le dossier du kit (claude-vibecoding-kit).

### 3. Lancer l'initialisation

```
/init_projet <chemin vers le projet Ã  initialiser>
```

Claude pose 5 questions (alias, objectif, stack, git, premiÃ¨re zone ou supplÃ©mentaire). La racine du projet cible est l'argument fourni â€” non demandÃ©e. Copie les fichiers, remplace les placeholders, committe dans le projet cible, enregistre le dÃ©ploiement dans `DEPLOYMENTS.md`.

### 4. DÃ©marrer

```
/start <alias>
```

## Structure du kit

```
claude-vibecoding-kit/
â”œâ”€â”€ Protocole_start_close_context.md   # documentation complÃ¨te
â”œâ”€â”€ CHANGELOG.md                          # historique des versions
â”œâ”€â”€ DEPLOYMENTS.md                        # registre des projets initialisÃ©s (ignorÃ© par git)
â”œâ”€â”€ tests/                                # suite unittest du lanceur Ollama
â”œâ”€â”€ base_connaissances/                   # audit des projets dÃ©ployÃ©s (index, fiches, analyse, propositions)
â””â”€â”€ templates/
    â”œâ”€â”€ .claude/
    â”‚   â”œâ”€â”€ CLAUDE.md                     # rÃ¨gles pour l'IA
    â”‚   â”œâ”€â”€ zones.md                      # table alias â†’ dossiers rÃ©els
    â”‚   â””â”€â”€ commands/
    â”‚       â”œâ”€â”€ init_projet.md            # commande /init_projet
    â”‚       â”œâ”€â”€ start.md                  # commande /start
    â”‚       â”œâ”€â”€ close.md                  # commande /close
    â”‚       â”œâ”€â”€ update.md                 # commande /update
    â”‚       â””â”€â”€ create_memory.md          # commande /create_memory
    â”œâ”€â”€ _contexte/
    â”‚   â”œâ”€â”€ contexte.md                   # contexte stable du projet
    â”‚   â””â”€â”€ signals.md                    # actions ouvertes, blocages, derniÃ¨re session
    â”œâ”€â”€ ollama_call.py                    # dÃ©lÃ©gation vers modÃ¨le local
    â””â”€â”€ roadmap_TEMPLATE.md               # template pour chantiers multi-phases
```

## Documentation

Lire `Protocole_start_close_context.md` pour le dÃ©tail complet : stratÃ©gie de gestion du contexte, table des modÃ¨les recommandÃ©s, formats canoniques, intÃ©gration Ollama.

L'historique des versions est consignÃ© dans `CHANGELOG.md`.

## PrÃ©requis

- [Claude Code](https://claude.ai/code)
- Git
- (Optionnel) [Ollama](https://ollama.com) + `python`/`python3` pour la dÃ©lÃ©gation locale

## État actuel

Kit v2.17 : la délégation Ollama utilise `python ollama_call.py "<prompt>"`, sans dépendance à Bash ni WSL. Le lanceur gère les délais et réponses API invalides ; sa suite de tests couvre aussi un appel local réel optionnel. `base_connaissances/` contient un audit des 11 projets déployés (frictions, patterns terrain, propositions d'amélioration du kit).

## Vérifier le lanceur Ollama

La suite est dans `tests/test_ollama_call.py`.

```powershell
python -m unittest discover -s tests -v
$env:OLLAMA_LIVE_TEST = "1"
python -m unittest tests.test_ollama_call.OllamaCallTests.test_live_ollama_returns_a_response -v
```

Le second test appelle réellement Ollama ; il reste désactivé par défaut.
