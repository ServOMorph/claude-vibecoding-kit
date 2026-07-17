# TableauDeBord

## Identité
- Chemin : `C:\Users\raph6\Documents\ServOMorph\TableauDeBord`
- Zone : tableaudebord
- Version kit : v2.10

## Historique git
- Nombre de commits : 51

- 2026-07-17 9ba279a close(tableaudebord): session 2026-07-17 — carte Ollama enrichie (watch ps + gestion modele) + layout 4/3/1
- 2026-07-17 94d5114 close(tableaudebord): session 2026-07-17 — bouton REINSTALL ZCODE (backend + frontend faits, Phase 3 test reel en attente)
- 2026-07-17 cb0cce7 update: protocole vibecoding — zone tableaudebord — kit v2.13
- 2026-07-17 ff57401 close(tableaudebord): session 2026-07-17 — roadmap bouton REINSTALL ZCODE (Outils)
- 2026-07-17 0bd3176 close(tableaudebord): session 2026-07-17 — deplacement du secret Pause/Cafe hors du code, nettoyage FICHIERS_SECURISES du suivi git
- 2026-07-17 da040c2 init: protocole vibecoding — zone tableaudebord
- 2026-07-11 24272a2 fix: AutoClaude lance le python du venv dédié
- 2026-06-27 91f957f Protect Ollama models from disk cleanup
- 2026-06-10 4239dfc fix: Widget Ollama fonctionnel v2.7.2
- 2026-06-10 309c5e2 fix: run_tableau_de_bord.bat tue le port 4000 avant relance
- 2026-06-10 138555c fix: Orga SyntaxError + bouton AutoClaude v2.7.1
- 2026-06-09 4886179 feat: Widget Ollama v2.7.0 — détection HTTP + arrêt tray fiabilisé
- 2026-06-08 29d19ce docs: analyse restauration session Windows au reboot
- 2026-06-07 471579f fix: Click Auto ClaudeCode pointe vers AutoClaude/run.py v2.6.1
- 2026-06-02 0c4e4d6 debut Pause/café
- 2026-05-28 cb5727c feat: Spam Zimbra v2.6.0 - suppression mails + stabilisation timeout
- 2026-05-25 7db1c24 chore: Désactivation bouton Claude: Google v2.5.3
- 2026-05-22 8e51369 feat: Gestion spammeurs Zimbra v2.5.2 - base auto-mark
- 2026-05-22 2892b91 feat: UI améliorée v2.5.1 - widgets 4x2 + bloc-notes
- 2026-05-22 7095e35 feat: Spam Zimbra v2.5.0 + restauration UI classique
- 2026-05-22 4e61b32 feat: P2 Optimisation Avancée + refactorisation server.js modulaire
- 2026-05-22 2fb88da chore: clôture session 2026-05-13 - v2.3.1 persistance prompts + tri UI
- 2026-05-13 2d1f8a1 feat: Dashboard v2.3 - Grid 4x2, bloc-notes, outils de conversion
- 2026-05-11 0edb395 chore: clôture session 2026-05-11 - retour à UI classique v2.2.0
- 2026-05-10 3dbe4b3 feat: redesign UI v2.3.0 - dark theme avec tabs et cartes métriques
- 2026-05-10 c5799a2 chore: cloture session 2026-05-10 - design specs + bugfix
- 2026-05-10 e440d08 chore: clôture session 2026-05-10 - v2.2.0
- 2026-05-10 dc8cf54 feat: bouton 'Copier Commandes' + copie fichiers Claude vers .claude/commands
- 2026-05-08 07f0b40 feat: bouton switch compte Claude Code (Bedrock ↔ Google)
- 2026-03-27 a426f49 feat: portabilité multi-machine via config/paths.json + setup.py
- 2026-03-27 4f8f0ba chore: intégration locale scripts antigravity + click-auto-claudecode
- 2026-03-27 cecdb23 feat: bouton ORGA + lancement D:\ServOMorph\Orga\run.py
- 2026-03-15 b39d1c0 fix+chore: correction bug log replay + run.py npm start + diagnostic numpy
- 2026-03-14 ce75e6b feat(antigravity): ecran complet & maj doc
- 2026-03-11 40dc72e feat: bouton Agents IA V2 + refonte zone boutons
- 2026-03-07 4609a41 feat: bouton Tunnel CloudFlare
- 2026-03-06 813f524 fix: arret securise du bouton ANTIGRAVITY
- 2026-03-02 3da0cc3 feat+chore: bouton Antigravity + charte SérénIATech + suppression Agents IA V2
- 2026-03-01 c576c42 fix+feat: corrections console UI + rapport JSON disk cleaner
- 2026-02-10 6aa57a4 fix: correction ralentissement progressif UI (3 fuites memoire)
- 2026-02-02 e73b289 feat: ajout gestionnaire de prompts avec stockage local
- 2026-01-17 e7a8d94 feat: ajout demarrage auto Windows + bouton Agents IA V2
- 2026-01-12 c984523 feat: streaming logs nettoyage disque + lanceur Python + scripts utils
- 2026-01-08 dab9026 feat: ajout bouton IA V5 + widgets Ollama, Disque D, Reseau
- 2026-01-06 acc868f feat: ajout bouton generation images Flux avec streaming logs
- 2025-12-30 5d2780c feat: ajout bouton Password Manager + UI compacte
- 2025-12-29 bd479d9 refactor: v2.0 minimaliste - RAM uniquement
- 2025-12-29 b6e7e62 perf: reduction charge WMI (GPU/Processes toutes les 10s)
- 2025-12-29 6f59d75 perf: optimisation chargement application
- 2025-12-29 e4ad3cf feat: dashboard monitoring temps reel avec widgets systeme
- 2025-12-29 a585a33 feat: initialisation projet avec architecture modulable

## État du working tree (non commité)
```
M data/disk-cleanup-history.json
 M data/vault.enc
 M data/zimbra-spam-history.json
 M data/zimbra-spammers.json
?? ollama_call.py
```

## Contexte stable (_contexte/contexte.md)

# Contexte — tableaudebord

## Objectif (immuable sauf décision explicite)
Tableau de bord de suivi/pilotage

## Stack / contraintes techniques (stable, rarement modifié)
Node.js + HTML/CSS/JS

## État actuel (réécrit intégralement à chaque /close)
Dashboard v2.8.0. Carte Ollama enrichie : watch ps (état des modèles chargés, VRAM/CPU, expiration), pastille de statut serveur, sélecteur + boutons Charger/Décharger modèle, copiés depuis l'UI SérénIATech. Layout widgets réorganisé en 3 lignes (4/3/1, Ollama pleine largeur). Bouton "REINSTALL ZCODE" (Outils) toujours en Phase 3 [TODO] : test réel après redémarrage serveur (pas de hot-reload).

## Décisions structurantes (append only — 10 entrées max, archiver au-delà)
- 2026-07-17 : Initialisation du protocole vibecoding.
- 2026-07-17 : Les secrets/credentials du dashboard doivent être stockés dans FICHIERS_SECURISES/ (hors git) et servis via API, jamais en dur dans le code client.
- 2026-07-17 : Bouton "REINSTALL ZCODE" (Outils) planifié — cycle winget uninstall/install pour ZhipuAI.ZCode, pattern asynchrone identique à la génération Flux (spawn + logs + polling).
- 2026-07-17 : Polling de statut ZCode branché sur la boucle globale existante (2s) plutôt qu'un setInterval dédié, par cohérence avec Flux/Antigravity/ClickYes/DiskClean.
- 2026-07-17 : Carte Ollama alignée sur le pattern SérénIATech (`service_ollama.py`) : `keep_alive: -1` au chargement, `num_ctx: 16384` pour tenir en VRAM (RTX 4060, 8 Go).
- 2026-07-17 : Toujours relancer le serveur via `run_tableau_de_bord.bat` (console visible) — un lancement sans console fait flasher des fenêtres cmd à chaque `exec()` périodique du polling global.

## Signals (_contexte/signals.md)

# Signals — tableaudebord   (MAJ 2026-07-17)

## Actions ouvertes
- [P2|ouvert] Vérifier si les credentials Zimbra exposés dans l'historique git doivent être régénérés (dépôt distant ou partagé) — fait quand: confirmation que le dépôt est resté local, ou credentials Zimbra changés — réf: FICHIERS_SECURISES/zimbra_credentials.json, historique git avant ce commit
- [P1|ouvert] Relancer le serveur (run_tableau_de_bord.bat) pour activer les routes /api/pause-cafe ET /api/zcode-reinstall/* (pas de hot-reload), puis exécuter le test réel de bout en bout Phase 3 — fait quand: bouton Pause/Café ET bouton REINSTALL ZCODE testés en conditions réelles, winget list confirme ZCode 3.3.6+ — réf: roadmap_bouton_reinstall_zcode.md (Phase 3), server.js:124, src/components/dashboard/actions-classic.js:228

## Questions ouvertes

## Échéances

## Blocages

## Contexte chaud
- Secret Pause/Café déplacé de actions-classic.js vers FICHIERS_SECURISES/pause_cafe.txt, servi via GET /api/pause-cafe
- ZCode = ZhipuAI.ZCode (winget), version locale 3.2.5 constatée le 2026-07-17, 3.3.6 disponible — Phase 1 (backend) et Phase 2 (frontend) faites, reste Phase 3 (test réel, nécessite redémarrage serveur)
- Nom de processus ZCode confirmé : ZCode.exe (D:\ZCode\ZCode.exe, 11 instances), kill via taskkill /IM ZCode.exe /F /T
- Toujours relancer ce serveur via run_tableau_de_bord.bat (console visible) — un lancement sans console (ex: node en arrière-plan caché) fait flasher une fenêtre cmd à chaque exec() périodique (ClickYes/Antigravity/DiskClean/ZCode pollent toutes les 2s)

## Dernière session (2026-07-17)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->

### Décisions prises
- Carte Ollama enrichie avec le contenu du Watch Ollama PS et de la topbar IA de SérénIATech, fusionnés dans une seule carte (au lieu de rester séparés) — copie fonctionnelle via l'API HTTP Ollama (`/api/ps`, `/api/tags`, `/api/generate`) plutôt qu'un appel shell au `ollama ps` CLI, pour éviter tout `exec()` supplémentaire
- Layout des cartes monitoring réorganisé : ligne 1 = RAM/CPU/Disque C/Disque D (4), ligne 2 = GPU/Temp GPU/Réseau (3), ligne 3 = carte Ollama seule, pleine largeur

### Livrables produits ou modifiés
- lib/metrics.js : ollamaGet/ollamaPost + getOllamaPs, getOllamaModels, loadOllamaModel, unloadOllamaModel ; fix startOllama (polling 5s -> 10s, faux échec au démarrage)
- server.js : routes GET /api/ollama/ps, GET /api/ollama/models, POST /api/ollama/load, POST /api/ollama/unload
- index.html : carte Ollama refondue (pastille statut, modèle chargé, watch ps, sélecteur modèle, boutons Charger/Décharger) + réorganisation des 3 lignes de widgets
- src/components/dashboard/monitoring-classic.js : updateOllamaPs, updateOllamaModels, loadOllamaModel, unloadOllamaModel
- ROADMAP.md : entrée v2.8.0 ajoutée

### Hypothèses validées / invalidées
- VALIDE : les routes Ollama testées en HTTP direct (cycle start/ps/models/stop) fonctionnent
- INVALIDE : redémarrer le serveur via `Start-Process -WindowStyle Hidden` -> cause des flashs de fenêtres cmd (pas de console pour les exec() périodiques) -> pivot vers relance systématique via run_tableau_de_bord.bat

### Prochaine étape exacte
Vérifier visuellement la nouvelle carte Ollama et le layout 4/3/1 dans le navigateur après rechargement de la page.

### Question bloquante pour la session suivante
Aucune

## Roadmaps (titres et statuts de phases)

### ROADMAP.md

# ROADMAP — TableauDeBord ServOMorph

### roadmap_bouton_reinstall_zcode.md

# Roadmap — Bouton REINSTALL ZCODE (section Outils)
## Phase 1 — Backend : réinstallation ZCode [FAIT]
## Phase 2 — Frontend : bouton et suivi console [FAIT]
## Phase 3 — Test réel de bout en bout [TODO]

## Sessions Claude Code (transcripts)

- Dossier : `c--Users-raph6-Documents-ServOMorph-TableauDeBord`
- Nombre de sessions : 6
- Période : 2026-06-27 → 2026-07-17

