# VisioAide

## Identité
- Chemin : `D:\ServOMorph\VisioAide`
- Zone : visioaide
- Version kit : v2.10

## Historique git
- Nombre de commits : 12

- 2026-07-17 6658c60 update: protocole vibecoding — zone visioaide — kit v2.13
- 2026-07-15 a7fbb26 close(visioaide): session 2026-07-15 - maquette phase 2 consolidee
- 2026-07-15 a47d764 docs(visioaide): ajouter le README
- 2026-07-15 3689ed6 close(visioaide): session 2026-07-15 — phase 1 validée
- 2026-07-15 5b681cc close(visioaide): session 2026-07-15 — ADR et qualification finalisées
- 2026-07-15 1f3f5e8 close(visioaide): session 2026-07-15 — loopback réel confirmé
- 2026-07-14 1ef0f4c close(visioaide): session 2026-07-14 — valider le loopback réel
- 2026-07-14 92dc36f close(visioaide): session 2026-07-14 — baseline logicielle contrôlée
- 2026-07-14 e0edcaa close(visioaide): session 2026-07-14 — décisions produit V1 validées
- 2026-07-14 67315d9 update: protocole vibecoding — zone visioaide — kit v2.10
- 2026-07-13 cddac69 close(visioaide): session 2026-07-13 — cadrer la refonte et protéger l'historique
- 2026-07-13 7a75c9b init: protocole vibecoding — zone visioaide

## État du working tree (non commité)
```
M GUIDE_TEST_UI.md
 M frontend/mockup/app.js
 M frontend/mockup/index.html
 M frontend/mockup/styles.css
?? _legacy/aide_visio/src/__pycache__/
?? ollama_call.py
```

## Contexte stable (_contexte/contexte.md)

# Contexte — visioaide

## Objectif (immuable sauf décision explicite)
Assistant IA temps réel pour accompagner Raphaël pendant une visio : capture le son de l'ordinateur (interlocuteur + micro), le transcrit en continu (Whisper local), et fait produire à une IA des remarques utiles (reformulations, alertes, angles de réponse, relances) sans casser le rythme de l'échange. Fonctionne entièrement en local (audio, transcription, IA) pour rester robuste et confidentiel, indépendamment de la plateforme de visio utilisée.

## Stack / contraintes techniques (stable, rarement modifié)
- Python 3.13 (Windows) — deux process parallèles (`pipeline_audio.py`, `watcher.py`) communiquant par fichiers (`data/input.txt`, `output.jsonl`, `state.json`), sans IPC direct.
- Capture audio : `pyaudiowpatch` (WASAPI, loopback + micro), résolution auto avec override `.env`. Traitement signal : `numpy` + `scipy.signal`.
- STT : `faster-whisper` (modèle `small`), GPU CUDA avec fallback CPU (`int8`).
- IA : providers interchangeables (`src/ia_provider.py`) — Ollama local (HTTP, `gemma4:e4b`, GPU RTX 4060) par défaut ; Claude CLI (Haiku) utilisé uniquement pour le mode Entrainement, à remplacer prochainement par Ollama.
- Backend UI : Flask (blueprint `aide_visio_bp`), intégré à l'app SérénIA Tech UI existante (`sys.path`, pas de packaging séparé).
- Frontend : HTML/CSS/JS vanilla, polling HTTP (pas de WebSocket), TTS via `speechSynthesis` navigateur.
- Persistance : aucune base de données, fichiers texte/JSON dans `data/` puis archivés dans `archive/<interlocuteur>/<date>/` (exclu de Git, donnée sensible).
- Tests : `pytest`, `pytest-benchmark` pour la latence.

## État actuel (réécrit intégralement à chaque /close)
- `D:\ServOMorph\VisioAide` est le projet principal ; le projet historique reste strictement en lecture seule.
- 38 fichiers historiques sont copiés sous `_legacy/` ; les suites isolées passent (118 outil, 14 UI, 5 tests du script de baseline) avec fixtures synthétiques.
- La baseline matérielle valide WASAPI, le signal loopback réel, faster-whisper CPU/CUDA, Ollama local et une qualification STT positive sur voix réelle.
- La maquette phase 2 couvre les parcours V1, les scénarios dégradés, les thèmes clair/sombre, un guide de test et un lanceur local.
- Les phases 0 et 1 sont closes ; la phase 2 reste en cours car la confirmation simulée de suppression d'archive est encore absente.

## Décisions structurantes (append only — 10 entrées max, archiver au-delà)
- 2026-07-13 : `D:\ServOMorph\VisioAide` est le projet principal ; le projet historique est protégé en lecture seule et seuls les éléments nécessaires seront copiés.
- 2026-07-13 : La refonte suit les blocs B0 à B12 et conserve l’ordre maquette, backend validé, puis front final.
- 2026-07-14 : P-001 à P-008 valident le contrat produit V1 : préparation modifiable, analyse qualitative versionnée, notes séparées, pas d’épinglage ni purge automatique, confirmation unique de démarrage et accessibilité de base.
- 2026-07-14 : Toute validation UI de la copie historique passe par le harnais isolé local ; les fixtures de baseline sont synthétiques.
- 2026-07-14 : La preuve d’un signal loopback réel est un prérequis avant toute nouvelle avancée et avant les ADR techniques.
- 2026-07-15 : Le signal loopback réel est confirmé ; le prérequis des ADR techniques est levé.
- 2026-07-15 : ADR-001 à ADR-004 fixent l'application autonome, le transport local, la supervision centralisée et les contrats d'archives versionnés.
- 2026-07-15 : Les critères d’évaluation et la matrice matérielle sont définis ; les seuils chiffrés seront fixés après mesures.
- 2026-07-15 : La baseline de phase 1 est jugée reproductible : STT sur voix réelle qualifié, fixtures d'archives anonymes en place et environnement minimal documenté.
- 2026-07-15 : La phase 2 utilise une maquette HTML/CSS/JS autonome avec scénarios simulés et un thème clair/sombre persistant localement.

## Signals (_contexte/signals.md)

# Signals — visioaide (MAJ 2026-07-15)

## Actions ouvertes

- [P1|ouvert] Finaliser la phase 2 de maquette front-end. fait quand: la suppression d'archive affiche une confirmation simulée et la revue utilisateur valide tous les parcours, y compris les thèmes clair et sombre. réf: `frontend/mockup/` ; `GUIDE_TEST_UI.md` ; `roadmap_visioaide.md`, phase 2
- [P2|ouvert] Remplacer Claude CLI dans le mode Entrainement par un LLM Ollama local. fait quand: la génération des questions et le parcours Entrainement utilisent exclusivement Ollama avec leurs tests verts. réf: `roadmap_visioaide.md`, phase 7 et bloc B7

## Questions ouvertes

## Échéances

## Blocages

## Contexte chaud

- Le projet historique est consultable uniquement en lecture seule ; toute exécution ou modification doit partir d’une copie dans le projet principal.
- 38 fichiers historiques ont été copiés sous `_legacy/` avec des empreintes SHA-256 identiques à la source au moment de la copie ; les archives, données de session et contextes réels restent exclus.
- Les suites isolées passent : 118 tests outil, 14 tests UI et 5 tests sur le script de baseline matérielle.
- Le signal loopback réel est confirmé lors de deux lectures contrôlées : RMS maximal `Interlocuteur` à 0,165275 puis 0,048892, sans persistance audio.
- Le STT sur voix réelle est qualifié sur une phrase de référence : couverture `100,0 %`, transcription non vide, sans persistance audio.
- Les ADR-001 à ADR-004 sont confirmées ; elles fixent le backend autonome, le polling HTTP local, les flux JSON/JSONL, la supervision et les contrats d'archives versionnés.
- Les critères d’évaluation et la matrice matérielle sont définis ; les seuils chiffrés restent conditionnés aux campagnes de mesure.
- L'environnement reproductible minimal, le verrou de dépendances de baseline et l'inventaire des contrats/archives observés sont documentés.
- La maquette phase 2 est navigable sous `frontend/mockup/`, avec scénarios simulés, guide de test et lanceur `run.py`.
- Le choix de thème clair ou sombre est conservé localement ; le contraste des boutons principaux est explicite dans les deux thèmes.
- La suppression d'archive reste une maquette incomplète : son bouton n'ouvre pas encore de confirmation.
- Une collecte UI antérieure a importé un module historique par erreur ; aucune modification récente n’a été détectée après coup. Les exécutions suivantes sont isolées.

## Dernière session

# Session du 2026-07-15

## Décisions prises
- La maquette de phase 2 reste statique et sans backend jusqu'à la phase 3.
- La phase 2 reste ouverte tant que l'interaction de confirmation de suppression n'est pas représentée.

## Livrables produits ou modifiés
- `frontend/mockup/` : maquette statique navigable des parcours V1, scénarios dégradés et thèmes clair/sombre.
- `GUIDE_TEST_UI.md` et `run.py` : procédure de test et lanceur local de la maquette.
- `_docs/specifications/parcours_ui.md` et `_docs/specifications/messages_et_erreurs.md` : parcours et messages de la maquette documentés.

## Hypothèses validées / invalidées
- VALIDE : les parcours et scénarios de la maquette sont navigables ; la validation manuelle a été signalée comme positive.
- EN ATTENTE : interaction simulée de confirmation de suppression, seuils chiffrés issus des campagnes de mesure et remplacement de Claude CLI en Entrainement.

## Prochaine étape exacte
Ajouter la confirmation simulée de suppression d'archive, puis rejouer la revue UI en clair et sombre avant de clôturer la phase 2.

## Question bloquante pour la session suivante
Aucune

## Archive des décisions (_contexte/archive_decisions.md)

# Archive des décisions structurantes — visioaide

- 2026-07-13 : Initialisation du protocole vibecoding.
- 2026-07-13 : `_docs/REFERENCE_PROJET.md` devient la source de vérité en cas de conflit documentaire.

## Roadmaps (titres et statuts de phases)

### roadmap_visioaide.md

# Roadmap de développement — VisioAide
### Phase 0 [FAIT] — Cadrage exécutable et décisions structurantes — V1
### Phase 1 [FAIT] — Baseline de l’existant et environnement reproductible — V1
### Phase 2 [EN COURS] — Maquette front-end complète et validée — V1
### Phase 3 [TODO] — Fondations backend autonome et migration progressive — V1
### Phase 4 [TODO] — Sessions, préparation et archives — V1
### Phase 5 [TODO] — Assistant temps réel Réel et robustesse — V1
### Phase 6 [TODO] — Benchmarks STT/LLM et validation de la pertinence temps réel — V1
### Phase 7 [TODO] — Mode Entrainement entièrement local — V1
### Phase 8 [TODO] — Analyse qualitative avant/après session — V1
### Phase 9 [TODO] — Refactorisation, sécurité locale et stabilisation backend — V1
### Phase 10 [TODO] — Front-end final par Claude Design — V1
### Phase 11 [TODO] — Qualification système et bêta Windows — V1
### Phase 12 [TODO] — Distribution et exploitation commerciale — V1.1
### Phase 13 [TODO] — Évolutions confirmées — V2

## Sessions Claude Code (transcripts)

- Aucun transcript trouvé pour ce chemin.
