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
- `/create_agent <chemin_projet_cible> <dossier> [rôle]` — crée un agent (zone à rôle : charte `agent_role.md` + `_contexte/` propre, pilotable par `/start`/`/close`) dans un projet cible ; s'exécute toujours depuis le kit, n'est jamais copiée dans les projets cibles
- `/create_com_agents <chemin_projet_cible>` — installe un mécanisme de communication en étoile agent↔orchestrateur (`_contexte/statut.md` pull écrasé à chaque `/close` d'une zone-agent, `_contexte/messages.md` push purgé à chaque `/start` de la zone destinataire) dans un projet cible déjà initialisé ; s'exécute toujours depuis le kit, ne modifie que `start.md`/`close.md` du projet cible
- `/cherche_meilleure_action [décision]` — commande d'aide à la décision (kit uniquement) : analyse le contexte réel de la zone, évalue les options selon des critères explicites, recommande une action et demande confirmation ; à invoquer quand on ne sait pas quoi faire ensuite
- `/doc_sync` — synchronise toute la documentation du kit (commandes, templates, structure) après une modification
- `CLAUDE.md` — règles permanentes appliquées à toutes les conversations
- `AGENTS.md` / `GEMINI.md` (optionnels, sur confirmation) — équivalents `CLAUDE.md` pour les agents non-Claude (Codex, ChatGPT, Gemini...)
- Base de connaissances `DOCUMENTATION/` (optionnelle, via agent dédié créé par `/create_agent`) — documentation métier du projet en `.md`, consultée par tous les agents (`INDEX.md` catalogue + progressive disclosure)
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
├── Protocole_start_close_context.md   # documentation complète
├── CHANGELOG.md                          # historique des versions
├── DEPLOYMENTS.md                        # registre des projets initialisés (ignoré par git)
├── AGENTS_REGISTRY.md                    # registre des agents créés (ignoré par git)
├── backup_file.py                        # sauvegarde horodatée d'un fichier vers Google Drive (rclone)
├── deploy_create_memory.py               # déploiement massif de create_memory.md sur les projets de DEPLOYMENTS.md
├── tests/                                # suite unittest du lanceur Ollama
├── base_connaissances/                   # audit des projets déployés (index, fiches, analyse, propositions)
├── _docs/                                # documentation générée (ex. vulgarisation de roadmaps)
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
    ├── backup_project.py                 # backup miroir du dossier projet vers Google Drive (rclone), sur confirmation si projet sans git
    ├── agent_role_TEMPLATE.md            # template de charte pour /create_agent
    ├── roadmap_TEMPLATE.md               # template pour chantiers multi-phases
    ├── AGENTS.md                         # équivalent CLAUDE.md pour agents non-Claude (Codex, ChatGPT...), sur confirmation
    └── GEMINI.md                         # équivalent CLAUDE.md spécifique à Gemini, sur confirmation
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

Kit v3.17 : `/init_projet` propose désormais, si le projet cible n'est pas sous git, d'automatiser un backup miroir du dossier vers Google Drive à chaque `/close` (script `backup_project.py`, `rclone sync`, exclusions standard) — accepté, il est copié dans le projet et son étape injectée dans le bloc "Spécificités projet" du `close.md` cible. Jamais testé en conditions réelles. Init de `Capafy_AI` (zone `capafy_ai`) ce même jour, mis sous git a posteriori, commit initial + push effectués.

Kit v3.16 : nouvelle commande `/create_com_agents` — installe un mécanisme de communication en étoile agent↔orchestrateur (`statut.md` pull, `messages.md` push) dans un projet cible, unifiant 3 mécanismes existants non propagés (design `roadmap_messages_zones.md`, `statut.md` ad hoc de Roberto2/MASCOTTE, expérimentation `synthese_agents.md` de jeu_zombies). Pilotée en conditions réelles sur Roberto2 (Phase 2 de `roadmap_com_agents.md`, en cours) : un bug de placement d'étape trouvé et corrigé (une étape conditionnelle placée après un paragraphe de synthèse narrative dans `start.md` est sautée à l'exécution ; corrigée en la plaçant tôt, adjacente à une étape similaire déjà fiable) — reste à retester avant bilan.

Kit v3.15 : `create_memory.md` manquait à l'étape 3 d'`init_projet.md` (jamais propagé aux nouveaux projets) — corrigé et déployé sur les 22 projets réels de `DEPLOYMENTS.md` via nouveau script `deploy_create_memory.py` (pattern acté pour tout déploiement massif futur).

Kit v3.14 : sauvegarde automatique de `DEPLOYMENTS.md` vers Google Drive intégrée à `/close` du kit (étape 12bis, optionnelle, confirmation utilisateur requise) — script `backup_file.py` (rclone `copyto`, réutilise la config Google Drive déjà authentifiée), destination `googledrive:BackUps/claude-vibecoding-kit/`, horodatage du fichier sauvegardé. Testé manuellement avec succès ; jamais encore exécuté via le flux réel de `/close`.

Kit v3.13 : commande locale `/create_agent` créée dans `jeu_espace` — donne à l'orchestrateur (zone racine) la capacité de créer lui-même des agents dans son projet, sans passer par le kit. Copie autonome (templates `agent_role_TEMPLATE.md` et `_contexte/` embarqués localement, pas d'écriture dans les fichiers de bookkeeping du kit, pas de phase `[AUDIT]`). Expérimentation isolée à `jeu_espace`, aucun template du kit modifié, jamais testée en conditions réelles ; validation garder/écarter/propager prévue ~2026-08-25.

Kit v3.12 : agent `review` créé dans `jeu_zombies` (revue de code continue) via `/create_agent`. Feature "synthèse agents pour l'orchestrateur" (chaque zone-agent écrit une synthèse à `/close` dans un fichier partagé, la zone racine la lit à `/start` et propose des actions) conçue et implémentée en expérimentation limitée à `jeu_zombies` — `close.md`/`start.md`/`agent_role.md` de ce projet modifiés localement, aucun template du kit touché. Propagation au kit conditionnée au bilan de sa roadmap dédiée (`roadmap_synthese_agents.md`, jeu_zombies).

Kit v3.11 : vérification réelle (fetch + status) des 18 dépôts concernés par le correctif v3.10, au lieu de se fier à l'état déclaré du 2026-08-05 — 13 d'entre eux avaient en réalité un commit local jamais poussé. Poussés sur confirmation utilisateur, action de propagation close. `Lieux_Hybrides` (Moulin du Sud) reste sans upstream configuré, décision antérieure assumée.

Kit v3.10 : correctif de la propagation v3.9 — l'instruction `git push` était restée dans le bloc "Spécificités projet" des 18 close.md concernés (15 propagés le 2026-08-04 + 3 zones test antérieures) au lieu d'une étape native numérotée comme dans le `close.md` du kit. Corrigée et commitée sur les 18 fichiers (étape "Exécuter `git push`" insérée après le commit, renumérotation, bloc "Spécificités projet" revenu au gabarit vide) ; push laissé en attente de confirmation utilisateur. Corruption locale non commitée du `close.md` du kit (étape 11 effacée) détectée et restaurée en début de session.

Kit v3.9 : `git push` automatique après le commit de `/close` — décision "garder" actée après validation en conditions réelles sur 4 zones test, intégré comme étape native (12) de `templates/.claude/commands/close.md` et du `close.md` du kit. Propagé à 15 projets déployés disposant d'un remote git (bloc "Spécificités projet", script one-shot non versionné) ; commité et poussé dans 14 d'entre eux (`Lieux_Hybrides`/Moulin du Sud reste en commit local, sans upstream configuré, sur décision explicite). `SérénIATech_dev` (pas de remote) et `Open_Code_Apprentissage` (chemin introuvable, probable renommage en `OpenCode`) exclus de la propagation.

Kit v3.6 : `GEMINI.md` intégré au workflow `/init_projet` (nouvelle question 8) et `/update` (étape 7 étendue à `GEMINI.md`, en plus d'`AGENTS.md`) — même logique : jamais créé automatiquement, jamais écrasé s'il existe déjà. Nouveau template `templates/GEMINI.md`. Par ailleurs, l'étape 7 de `/close` (base de connaissances) a été validée en conditions réelles pour la première fois, sur une zone tierce (Moulin du Sud) dont la session a produit une décision transversale ajoutée à `DOCUMENTATION/`.

Kit v3.5 : `.claude/commands/create_agent.md` — nouvelle étape `[SORTIE]` proposant de copier dans le presse-papier un message court de mise à jour pour l'agent racine du projet cible, résumant les agents créés lors de l'appel (jamais écrit dans les fichiers du projet cible). Récapitulatif final renuméroté 10→11, `[AUDIT]` 11→12. Jamais encore testée via un appel réel de la commande.

Kit v3.4 : correctif d'une corruption accidentelle dans `.claude/commands/create_agent.md` (ligne parasite) et rattrapage de commit pour des rétrospectives de sessions antérieures restées non commitées (`ameliorations_create_agent.md`, `note_conception_pause_agents.md`). Aucun changement fonctionnel de commande.

Kit v3.3 : base de connaissances `DOCUMENTATION/` (pattern "progressive disclosure" — `INDEX.md` catalogue + docs individuels, jamais de suppression, archivage à la place) introduite comme feature générale, consultable par toute zone via `CLAUDE.md`/`AGENTS.md` ; étape 7 conditionnelle de `/close` proposant une entrée/MAJ dans `DOCUMENTATION/` en fin de session, jamais automatique. `AGENTS.md` introduit comme équivalent `CLAUDE.md` pour les agents non-Claude (Codex, ChatGPT, Gemini...), jamais créé automatiquement (`/init_projet` Q7, `/update` étape 7, toujours sur confirmation, jamais écrasé s'il existe déjà). v3.2 : `/create_agent` normalise désormais en MAJUSCULES le dossier de l'agent créé ou converti (reconnaissance visuelle dans l'arborescence), alias de zone toujours en minuscules ; en mode conversion, un dossier existant à la casse non conforme est renommé et `zones.md` mis à jour en conséquence. v3.1 : `CLAUDE.md` (kit + template) enrichi de deux sections — "Tests manuels" (`tests_manuels.md` à la racine du projet comme file d'attente exhaustive des contrôles manuels non validés) et "Déclencheurs de vérification" sous "Honnêteté" (règles mécaniques : un fichier nommé doit avoir été lu dans la session, les chiffres de `signals.md`/`contexte.md` sont datés et à revérifier, vocabulaire de vérification réservé à un appel d'outil réel, absence à questionner plutôt qu'affirmer). v3.0 : `/create_agent` réécrite en phases nommées (`[PREFLIGHT]`/`[COLLECTE]`/`[ECRITURE]`/`[SORTIE]`/`[AUDIT]`), mode conversion pour une zone déjà enregistrée, analyse de la stack du projet cible conditionnée à son usage réel, phase `[AUDIT]` (Opus, sur demande explicite) pour analyser à froid la commande elle-même. v2.26 : `AGENTS_REGISTRY.md` (registre local de tous les agents créés tous projets confondus, alimenté par l'étape 10 de `/create_agent`). v2.25 : ajout de `/cherche_meilleure_action` (aide à la décision, kit uniquement — analyse le contexte de la zone et recommande une action quand on hésite). Lot 1 de `base_connaissances/PROPOSITIONS_AMELIORATION.md` entièrement implémenté — `/close` signale les résidus non commités en fin de session, section "Données sensibles" de `CLAUDE.md` activée (question posée par `/init_projet`/`/update`), section "Modèles recommandés" ajoutée à `CLAUDE.md`, benchmark reproductible admis comme gate de phase, `signals.md` compressé (sections vides omises, décisions limitées à 5 lignes). La délégation Ollama utilise `python ollama_call.py "<prompt>"`, sans dépendance à Bash ni WSL. `/update` corrigé (DEPLOYMENTS.md fiable, migration automatique du contenu spécifique projet, vérification post-update) et testé sur 3 projets ; propagation aux 8 restants en cours. `roadmap_agents.md` : les 4 phases sont terminées — commande `/create_agent` s'exécute toujours depuis le kit (projet cible en argument, jamais copiée dans les projets cibles), vérifie que le projet cible sait charger la charte avant de créer l'agent. Premier test end-to-end réel effectué (agent `web` dans La Rev), période de test ouverte et tracée dans `TEST_CREATE_AGENT_RESULTS.md`, frictions et propositions consignées dans `ameliorations_create_agent.md`. `_docs/` héberge de la documentation générée, dont une vulgarisation complète de cette roadmap pour un lecteur novice.

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
