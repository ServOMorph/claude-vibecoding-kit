# claude-vibecoding-kit — Persistance de contexte pour le vibecoding avec Claude Code

Kit de protocole pour travailler avec Claude Code sur des projets qui s'étalent dans le temps.

Stack : **Claude Code** (agent IA), **Markdown** (fichiers de contexte), **Python** (lanceur Ollama en stdlib pur), **Ollama** (délégation locale optionnelle). Zéro infrastructure, zéro dépendance Python — uniquement la bibliothèque standard.

Résout le problème structurel du vibecoding : **le contexte est perdu à chaque nouvelle conversation**. Sans protocole, chaque session repart de zéro, les décisions prises ne sont pas tracées, et l'IA ne sait pas où en est le projet.

## Ce que ça fait

- `/start [zone]` — charge le contexte du projet au démarrage de session (zone implicite si absent)
- `/close [zone]` — sauvegarde l'état, met à jour les fichiers de contexte, committe (zone implicite si absent)
- `/init_projet` — initialise le protocole dans un nouveau projet en quelques questions
- `/update` — met à jour les fichiers de protocole dans un projet déjà initialisé, sans toucher aux données projet
- `/create_memory [alias_zone] [contenu]` — ajoute une entrée dans la mémoire projet persistante (`.claude/memory.md`) ou, si un alias de zone est reconnu, dans la mémoire de cette zone (`<dossier_zone>/_contexte/memory.md`, chargée par `/start`)
- `/create_agent <chemin_projet_cible> <dossier> [rôle]` — crée un agent (zone à rôle : charte `agent_role.md` + `_contexte/` propre, pilotable par `/start`/`/close`) dans un projet cible ; s'exécute toujours depuis le kit, n'est jamais copiée dans les projets cibles
- `/create_com_agents <chemin_projet_cible>` — installe un mécanisme de communication en étoile agent↔orchestrateur (`_contexte/statut.md` pull écrasé à chaque `/close` d'une zone-agent, `_contexte/messages.md` push purgé à chaque `/start` de la zone destinataire) dans un projet cible déjà initialisé ; s'exécute toujours depuis le kit, ne modifie que `start.md`/`close.md` du projet cible
- `/insert_template <chemin_projet_cible> <nom_template> [dossier_destination]` — insère un template (`templates/<nom>/`) dans un projet cible, résout les placeholders génériques (`{{NOM_PROJET}}`/`{{ALIAS_PROJET}}`/`{{DATE}}`) et ne jamais écraser un fichier déjà présent ; s'exécute toujours depuis le kit, jamais copiée dans les projets cibles
- `/init_discord_mode <chemin_projet_cible>` — insère le template `discord_com` dans un projet cible et guide la configuration jusqu'à un bot opérationnel (token, channel_id, invitation OAuth2, Message Content Intent, dépendances) ; kit uniquement, s'exécute toujours depuis le kit
- `/cherche_meilleure_action [décision]` — commande d'aide à la décision (kit uniquement) : analyse le contexte réel de la zone, évalue les options selon des critères explicites, recommande une action et demande confirmation ; à invoquer quand on ne sait pas quoi faire ensuite
- `/doc_sync` — synchronise toute la documentation du kit (commandes, templates, structure) après une modification
- `/cherche_fonction <description>` — recherche une fonctionnalité déjà codée dans d'anciens projets à partir d'une description ; les dossiers cibles sont toujours redemandés à chaque appel (kit uniquement)
- `CLAUDE.md` — règles permanentes appliquées à toutes les conversations
- `AGENTS.md` / `GEMINI.md` (optionnels, sur confirmation) — équivalents `CLAUDE.md` pour les agents non-Claude (Codex, ChatGPT, Gemini...)
- Base de connaissances `DOCUMENTATION/` (optionnelle, via agent dédié créé par `/create_agent`) — documentation métier du projet en `.md`, consultée par tous les agents (`INDEX.md` catalogue + progressive disclosure)
- `skills/chatgpt-orchestrateur/` — skill Claude Code (déclenché automatiquement, pas une commande) : pilote une boucle où une IA en session web gratuite (ChatGPT, généricisé pour en accueillir d'autres) sert d'orchestrateur donnant des instructions à Claude Code ; persistance de l'état par fichiers Markdown, journal des échanges, envoi automatique presse-papier (clic + collage + Entrée) vers la fenêtre de l'orchestrateur
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

Claude pose 5 questions (alias, objectif, stack, git, première zone ou supplémentaire — si le projet n'est pas sous git, une question complémentaire propose d'automatiser un backup miroir du dossier vers Google Drive à chaque `/close`). La racine du projet cible est l'argument fourni — non demandée. Copie les fichiers, remplace les placeholders, committe dans le projet cible, enregistre le déploiement dans `DEPLOYMENTS.md`.

### 4. Démarrer

```
/start <alias>
```

## Structure du kit

```
claude-vibecoding-kit/
├── README.md                             # ce fichier
├── Protocole_start_close_context.md      # documentation complète
├── CHANGELOG.md                          # historique des versions
├── llms.txt                              # description du dépôt pour agents IA tiers
├── LICENSE                               # MIT
├── DEPLOYMENTS.md                        # registre des projets initialisés (ignoré par git)
├── AGENTS_REGISTRY.md                    # registre des agents créés (ignoré par git)
├── roadmap_*.md                          # chantiers multi-phases en cours (kit lui-même)
├── note_conception_*.md                  # notes de conception non encore tranchées
│
├── .claude/                              # instance du protocole appliquée au kit lui-même
│   ├── CLAUDE.md                         # règles permanentes
│   └── commands/                         # /start /close /update /init_projet /create_memory
│       │                                 #   + kit uniquement : /create_agent /create_com_agents
│       └───────────────────────────────  #                     /cherche_meilleure_action /doc_sync
│                                          #                     /cherche_fonction
├── _contexte/                            # contexte du kit (contexte, signals, archive_decisions)
├── skills/
│   └── chatgpt-orchestrateur/            # skill : boucle orchestrateur IA gratuite ↔ Claude Code
│       └── scripts/                      # init_agent, maj_etat, log_echange, generer_reprise, coller_et_envoyer (.ps1)
├── scripts/
│   ├── backup_file.py                    # sauvegarde horodatée d'un fichier vers Google Drive (rclone)
│   └── deploy_create_memory.py           # déploiement massif d'un fichier sur les projets de DEPLOYMENTS.md
├── tests/                                # suite unittest du lanceur Ollama
├── base_connaissances/                   # audit des projets déployés + journaux de retex /create_agent
├── _archives/                            # roadmaps closes et documents historiques
└── templates/                            # patron copié dans les projets cibles par /init_projet
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
    ├── backup_project.py                 # backup miroir du dossier projet vers Google Drive (rclone), sur confirmation si projet sans git
    ├── agent_role_TEMPLATE.md            # template de charte pour /create_agent
    ├── roadmap_TEMPLATE.md               # template pour chantiers multi-phases
    ├── AGENTS.md                         # équivalent CLAUDE.md pour agents non-Claude (Codex, ChatGPT...), sur confirmation
    └── GEMINI.md                         # équivalent CLAUDE.md spécifique à Gemini, sur confirmation
    ├── control_PC/                       # template local de contrôle visuel, macros et workflows par application
    ├── roberto/                          # template extrait de Roberto2 (UI PC + mascotte), testé de bout en bout
    ├── discord_com/                      # intégration Discord ↔ Claude Code, généricisée depuis Agents_IA_V2
    ├── overlay/                          # overlay néon plein écran, signal de fin de tâche d'agent
    └── notification/                     # notification systray (icône + bulle Windows), alternative à overlay
```

Les commandes `/create_agent`, `/create_com_agents`, `/insert_template`, `/cherche_meilleure_action`
et `/doc_sync` vivent uniquement dans `.claude/commands/` du kit : elles s'exécutent depuis le kit
et ne sont jamais copiées dans les projets cibles, donc absentes de `templates/`.

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

Kit **v3.39** (2026-08-20) : prototype d'assistant vocal distant pour Claude Code (`templates/roberto/com_telephone/`) fonctionnel de bout en bout, réponses reformulées courtes/orales, débit TTS ralenti, arrêt complet via `/com_stop`, UI mobile désormais protégée par token (`AUTH_TOKEN`). Workflow `quotidien` : `decisions.md` devient une roadmap persistante à cases à cocher, jamais réinitialisée. Reste à faire : boucle de déclenchement micro rapproché à diagnostiquer, allègement de `/start` (kit jugé surchargé). Mission ROBERTO (`Appli_TSA_SDI_TDAH`, hors dépôt kit) toujours en pause depuis le 2026-08-18. Voir [`CHANGELOG.md`](CHANGELOG.md) pour l'historique complet.

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
