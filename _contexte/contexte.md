# Contexte — claude-vibecoding-kit

## Objectif (immuable sauf décision explicite)
Fournir un kit reproductible pour gérer le vibecoding sur des projets multi-sessions, avec contexte persistant via `/start`/`/close` et support multi-zones.

## Stack / contraintes techniques
- **Langage** : Markdown + Bash/PowerShell pour scripts
- **Framework** : Claude Code CLI + Agent SDK
- **Gestion git** : commits automatiques depuis `/close`
- **Modèles recommandés** : Haiku (start), Sonnet (close), Opus (plans/debug)
- **Intégration** : Ollama pour tâches sensibles/templated
- **Déploiement** : copie template vers projets via `/init`, tracking dans DEPLOYMENTS.md

## État actuel
- Kit v2.20 (à confirmer par le bump de cette session). `roadmap_agents.md` : Phase 1 (analyse + conception) terminée, livrable `note_conception_create_agent.md`. Phase 2 (agents COM/MEMORY dans robert-ia) en cours, à finaliser avant le 25/07/2026.
- `_docs/` créé à la racine du kit : premier fichier `roadmap_agents_explained.html`, vulgarisation de la roadmap agents pour un lecteur novice.
- 9 projets restent à propager vers la dernière version du kit : Appli_TSA_SDI_TDAH, JeGeekUtile, SérénIATech_dev, VisioAide, TableauDeBord, IA-TSA, La Rev, IA_V7, jeux_vibecoder.
- `base_connaissances/` créé : audit des 11 projets déployés + `ANALYSE.md` (10 frictions, 7 patterns terrain) + `PROPOSITIONS_AMELIORATION.md` (16 propositions priorisées) — Lot 1 partiellement mis en œuvre (F1 fait), reste à trancher.
- Le README reste affecté par une corruption d'encodage historique hors les lignes corrigées.

## Décisions structurantes
- 2026-07-14 : `ollama_call.sh` réécrit sans dépendance `jq` (python), modèle par défaut `gemma4:e4b` ; `/update` corrigé pour propager ce fichier ; 6 projets déployés synchronisés en v2.10
- 2026-07-17 : `/init_projet` inversé — même logique que `/update` (lancement depuis le kit, argument = projet cible) ; ajout d'une étape de liste des fichiers modifiés avant confirmation ; TableauDeBord initialisé comme 7e projet déployé
- 2026-07-17 : `/close` crée automatiquement le README du projet cible s'il est absent (au lieu de demander confirmation)
- 2026-07-17 : `/update` corrigé — suppression du mécanisme de substitution `{{ALIAS}}`/`{{RACINE}}` obsolète dans la doc (start.md/close.md lisent `zones.md` directement) ; correction des mentions erronées d'`init_projet.md`/`update.md` comme fichiers copiés vers les projets cibles
- 2026-07-17 : `/update all` exécuté sur les 9 projets déployés (kit v2.13), IA-TSA migré vers le mécanisme "Spécificités projet" (jamais fait auparavant)
- 2026-07-17 : `ollama_call.py` remplace le lanceur Bash pour une délégation Ollama compatible Windows sans Bash ni WSL.
- 2026-07-17 : `ollama_call.py` durci (timeout 60s, gestion JSON invalide/réponse inattendue) + suite `unittest` dédiée ; `/doc_sync` exclut les blocs "Spécificités projet" de la comparaison start.md/close.md.
- 2026-07-17 : `base_connaissances/` créé comme audit reproductible de la flotte de projets déployés (git + `_contexte/` + roadmaps + transcripts) ; `PROPOSITIONS_AMELIORATION.md` priorise 16 correctifs/évolutions du kit, en attente de décision sur la mise en œuvre.
- 2026-07-17 : proposition 1.1 (F1) implémentée — `/update` réécrit désormais version/date d'une ligne `DEPLOYMENTS.md` existante au lieu de l'ignorer.
- 2026-07-17 : `/update` migre désormais automatiquement tout contenu "Spécificités projet" détecté (lignes ou sections orphelines) sans poser de question — décision actée après un cas réel sur robert-ia (sections opérationnelles placées hors de la zone dédiée).
- 2026-07-17 : `/update` intègre une étape de vérification post-update (7 contrôles) avant confirmation ; échec → statut `⚠️` avec détail, en individuel comme en mode batch.
- 2026-07-20 : nouvelle initiative « template de création d'agent » — un agent = une zone à rôle (dossier + charte `agent_role.md` + `_contexte/` propre, enregistrée dans `zones.md`, pilotée par `/start`/`/close`), explicitement pas un subagent Claude Code. Expérimentée d'abord sur robert-ia (agents COM et MEMORY pour la démo du 25/07/2026), généralisée ensuite en commande `/create_agent`.
- 2026-07-20 : revue critique du plan par un second modèle (Fable 5) avant tout code (prompt utilisé ponctuellement, non conservé sur disque), 6 décisions de conception actées : charte `agent_role.md` (anti-collision `AGENTS.md`), `/update` n'touche jamais les `_contexte/` de sous-zones, unicité d'alias contrôlée dans `zones.md`, charte chargée automatiquement par `/start`, périmètre déclaratif (pas d'isolation technique réelle), rétrospective de fin de commande avec sortie écrite obligatoire.
- 2026-07-20 : Phase 1 de `roadmap_agents.md` close — note de conception écrite (`note_conception_create_agent.md`), arborescence d'agent et format de charte figés, insertion de l'étape 2b dans `start.md` (chargement de `agent_role.md` avant `signals.md`) actée pour la Phase 3.
- 2026-07-20 : dossier `_docs/` introduit à la racine du kit, à la demande de l'utilisateur, comme emplacement pour la documentation générée (première pièce : `roadmap_agents_explained.html`).
