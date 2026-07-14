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

### 2. Ouvrir le projet cible dans Claude Code

Dans Claude Code, ouvrir le dossier du projet Ã  initialiser.

### 3. Lancer l'initialisation

```
/init <chemin vers claude-vibecoding-kit>
```

Claude pose 5 questions (alias, objectif, stack, git, premiÃ¨re zone ou supplÃ©mentaire). La racine est le working directory courant â€” non demandÃ©e. Copie les fichiers, remplace les placeholders, committe, enregistre le dÃ©ploiement dans `DEPLOYMENTS.md`.

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
    â”œâ”€â”€ ollama_call.sh                    # dÃ©lÃ©gation vers modÃ¨le local
    â””â”€â”€ roadmap_TEMPLATE.md               # template pour chantiers multi-phases
```

## Documentation

Lire `Protocole_start_close_context.md` pour le dÃ©tail complet : stratÃ©gie de gestion du contexte, table des modÃ¨les recommandÃ©s, formats canoniques, intÃ©gration Ollama.

L'historique des versions est consignÃ© dans `CHANGELOG.md`.

## PrÃ©requis

- [Claude Code](https://claude.ai/code)
- Git
- (Optionnel) [Ollama](https://ollama.com) + `python`/`python3` pour la dÃ©lÃ©gation locale

