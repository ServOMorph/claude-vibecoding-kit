# robert-ia

## Identité
- Chemin : `D:\ServOMorph\robert-ia`
- Zone : robert-ia
- Version kit : v2.10

## Historique git
- Nombre de commits : 31

- 2026-07-17 7b68b96 update: protocole vibecoding — zone robert-ia — kit v2.13
- 2026-07-14 e1a247c update: protocole vibecoding — zone robert-ia — kit v2.10
- 2026-07-14 6b71a71 backup: avant update protocole vibecoding
- 2026-06-22 747beeb close(robert-ia): session 2026-06-22 — test_rag.py mini RAG + validation P2c prochaine session
- 2026-06-22 1123cfd close(robert-ia): session 2026-06-22 — mini RAG knowledge.txt + protocole Windows→Linux + sync fichiers
- 2026-06-22 bdf0cba close(robert-ia): session 2026-06-22 — SSH automatique dans CLAUDE.md + docs optimisation RAM
- 2026-06-21 4794faf close(robert-ia): session 2026-06-21 — modale inactivité + RustDesk autostart
- 2026-06-21 82863cc update: protocole vibecoding — zone robert-ia — kit v2.3
- 2026-06-21 d6ba3c4 close(robert-ia): session 2026-06-21 — protocole récupération + analyse conversations
- 2026-06-21 cbf247f close(robert-ia): session 2026-06-21 — features avant pilote (analyse conversations + eau économisée)
- 2026-06-21 37f2681 update: protocole vibecoding — zone robert-ia — kit v2.3
- 2026-06-21 b97019a backup: avant update protocole vibecoding
- 2026-06-21 14d59a4 close(robert-ia): session 2026-06-21 — fix lifespan warmup + /api/ready stable
- 2026-06-21 867bd22 close(robert-ia): session 2026-06-21 — écran chargement x2, override dev ?screen=, dev.py
- 2026-06-21 9b7a9fb close(robert-ia): session 2026-06-21 — GNOME détecté (pas XFCE), fond d'écran SérénIA déployé
- 2026-06-20 5b9de12 close(robert-ia): session 2026-06-20 — kiosk validé au reboot, écran chargement à déboguer
- 2026-06-20 cc0548c close(robert-ia): session 2026-06-20 — déploiement USB validé sur PC Linux
- 2026-06-20 bea7dee close(robert-ia): session 2026-06-20 — mémoire 18/20 (tête épinglée + system prompt enrichi)
- 2026-06-19 997cf9e close(robert-ia): session 2026-06-19 — mémoire conversationnelle + pivot gemma3:4b
- 2026-06-18 3ae6075 close(robert-ia): session 2026-06-18 — ajout étape README dans /close + roadmap à jour
- 2026-06-18 0f7e56c close(robert-ia): session 2026-06-18 — Phase 3 complétée (packaging air-gap)
- 2026-06-18 6707912 feat(phase3): déploiement air-gap complet — packaging, systemd, documentation
- 2026-06-18 f184422 close(robert-ia): session 2026-06-18 — streaming NDJSON, logo, keep_alive -1, préchargement modèle
- 2026-06-18 f988572 close(robert-ia): session 2026-06-18 — Phase 2 complete (UI chat + tests)
- 2026-06-18 0d3f646 feat(tests): tests automatiques backend + frontend + doc tests manuels
- 2026-06-18 d99e20b feat(phase2): interface chat complete - Welcome/RGPD, Pseudo, Chat, SQLite
- 2026-06-18 793ab9d feat(backend): setup dev environment — FastAPI + Ollama
- 2026-06-18 4ce8648 docs: mark vibecoding protocol as complete
- 2026-06-18 b982973 feat: Create directory structure (backend, frontend, docs)
- 2026-06-18 1170021 close(robert-ia): session 2026-06-18 — polissage repo public terminé
- 2026-06-18 c4b2b3c Initial: Polish public repo (README, CONTRIBUTING, LICENSE, .gitignore)

## État du working tree (non commité)
```
D frontend/.gitkeep
?? data/
?? "docs/CHARTE_GRAPHIQUE_S\303\251r\303\251nIATech.md"
?? "frontend/public/Fond d'\303\251cran S\303\251r\303\251nIA Tech (1440 x 900 px).png"
?? "frontend/public/Fond d'\303\251cran S\303\251r\303\251nIA Tech.png"
?? ollama_call.py
```

## Contexte stable (_contexte/contexte.md)

# Contexte — robert-ia

## Objectif (immuable sauf décision explicite)
Déployer une IA locale conversationnelle dans des espaces associatifs (air-gap, sessions anonymes, données 100 % locales). Modèle économique : revenus sur services (déploiement, maintenance, ateliers), code MIT open source.

## Stack / contraintes techniques (stable, rarement modifié)
- OS cible : Ubuntu 24.04.1 LTS (GNOME Shell / Wayland), machine air-gap (i3-4130, 4 Go RAM, 120 Go)
- IA : Ollama, modèle gemma3:4b (remplace 1b jugé non viable — sous réserve RAM 4 Go)
- Backend : Python + FastAPI
- Base de données : SQLite
- Frontend : React + Vite (build statique)
- Affichage : navigateur kiosk (mono-onglet)
- Déploiement : disque dur (pas de réseau sur site)
- Backup code : GitHub public MIT

## État actuel (réécrit intégralement à chaque /close)
Phases 1–3 complètes. Phase 4 en cours. Démarrage automatique validé : GDM3 auto-login + Chromium kiosk + backend systemd. Feature inactivité déployée. Optimisations RAM appliquées. Mini RAG déployé : knowledge.txt (infos L'Invariable) injecté dans system prompt — 3 niveaux de réponse (culture générale / association / pas d'internet). Protocole Windows→Linux établi. Avant déploiement Bistrot : test mini RAG (P2c), feature eau économisée (P2b), retrait accès root SSH (P3).

## Décisions structurantes (append only — 10 entrées max, archiver au-delà)
- 2026-06-20 : GDM3 auto-login robert-ia + accès root SSH temporaire Windows→Linux (192.168.137.85) pour dev
- 2026-06-21 : OS réel = GNOME Shell / Wayland (Ubuntu 24.04 par défaut, pas XFCE) — fond d'écran via gsettings
- 2026-06-21 : Dev frontend Windows : override ?screen=<nom> en mode DEV (import.meta.env.DEV) + python dev.py
- 2026-06-21 : Lifespan warmup via /api/generate + num_predict:0 (charge modèle en RAM sans génération) — /api/ready via /api/ps
- 2026-06-21 : Feature inactivité — modale après 10 min sans message, countdown 30s, retour accueil automatique
- 2026-06-21 : RustDesk autostart via rustdesk.service (enabled, multi-user.target) — daemon-reload requis après màj fichier service
- 2026-06-21 : Frontend déployé dans /opt/robert-ia/app/frontend/dist/ (pas /opt/robert-ia/frontend/dist/)
- 2026-06-22 : Claude Code prend le contrôle SSH du Linux automatiquement (instruction dans .claude/CLAUDE.md) — clé robert-ia_ed25519, IP 192.168.137.85, user root
- 2026-06-22 : Protocole Windows→Linux — toute modification fichier applicatif faite sur Windows d'abord, puis déployée via scp (instruction dans .claude/CLAUDE.md)
- 2026-06-22 : Mini RAG — knowledge.txt injecté dans system prompt au démarrage, 3 niveaux de réponse (culture générale / association / refus météo+internet)

## Signals (_contexte/signals.md)

# Signals — robert-ia   (MAJ 2026-06-22)

## Actions ouvertes
- [P1] Phase 4 — Déploiement pilote Bistrot de Nérigean (en cours)
  fait quand: installation terminée sur PC association + animateurs formés
  réf: roadmap_robert-ia.md (Phase 4), _contexte/contexte.md
- [P2] TESTER protocole récupération + analyse conversations (end-to-end)
  fait quand: test réalisé sur PC Windows avec un vrai robert.db exporté depuis Linux via USB — CSV généré et lisible dans Excel
  réf: scripts/analyse_conversations.py, docs/GUIDE_RECUPERATION_ANALYSE.md, docs/PROTOCOLE_ANALYSE_CONVERSATIONS.md
- [P2b] AVANT DÉPLOIEMENT : feature affichage eau économisée (Robert IA locale vs IA cloud) — mise en lumière aspect éco-responsable
  fait quand: compteur eau visible dans l'UI (ex: fin de session ou écran accueil)
  réf: frontend/src/, à préciser (calcul liters/request cloud vs local)
- [P2c] AVANT DÉPLOIEMENT : valider manuellement les résultats du test mini RAG
  fait quand: utilisateur confirme que les 3 réponses du test_rag.py sont conformes (culture générale / association / refus internet)
  réf: scripts/test_rag.py, log Linux : /opt/robert-ia/app/logs/test_rag_20260622_205007.txt
- [P3] AVANT DÉPLOIEMENT SITE : retirer l'accès root SSH du PC Linux (accès root accordé temporairement pour la phase dev)
  fait quand: `PermitRootLogin no` dans sshd_config + service redémarré + accès root vérifié refusé
  réf: contexte.md (accès SSH root actif, clé robert-ia_ed25519)

## Questions ouvertes

## Échéances

## Blocages

## Contexte chaud
- PC Linux tourne sous GNOME Shell (Wayland)
- Accès SSH root actif (clé C:\Users\raph6\.ssh\robert-ia_ed25519, IP 192.168.137.85, user root)
- Claude Code prend le contrôle Linux automatiquement via SSH (instructions dans .claude/CLAUDE.md)
- Optimisations RAM appliquées : OLLAMA_NO_MMAP=false + KEEP_ALIVE=5m + Chromium + RustDesk désactivé
- Protocole récupération : robert.db récupéré via SSH + CSV généré — test USB + vérification Excel restants
- Lenteur 1er prompt (~5 min sur i3-4130) = contrainte matérielle, gérée par formation
- Mini RAG déployé : knowledge.txt injecté dans system prompt — knowledge.txt à enrichir si nouvelles infos association
- test_rag.py déployé sur Linux — log test du 2026-06-22 : /opt/robert-ia/app/logs/test_rag_20260622_205007.txt

## Dernière session (2026-06-22 — session 17)

### Décisions prises
- test_rag.py : script de test automatique mini RAG créé et déployé sur Linux

### Livrables produits ou modifiés
- `scripts/test_rag.py` : créé — test 3 niveaux mini RAG via Ollama, log dans logs/

### Hypothèses validées / invalidées
- EN ATTENTE : résultats du test_rag.py à valider manuellement par l'utilisateur (session suivante)
- VALIDE (technique) : script exécuté sur Linux sans erreur, 3 réponses obtenues

### Prochaine étape exacte
Valider manuellement les 3 réponses du test_rag.py (log : /opt/robert-ia/app/logs/test_rag_20260622_205007.txt).
Si OK → P2c fermé → passer à P2b (feature eau économisée).

### Question bloquante pour la session suivante
Aucune

## Archive des décisions (_contexte/archive_decisions.md)

# Archive — Décisions structurantes robert-ia

Archivé le 2026-06-22 (dépassement seuil 10 entrées dans contexte.md)

- 2026-06-20 : Architecture mémoire — tête épinglée K=4 + fenêtre glissante 16 + system prompt enrichi → 18/20
- 2026-06-20 : FastAPI sert le frontend statique (StaticFiles) — file:// abandonné, tout sur port 8001
- 2026-06-20 : Architecture split backend (systemd) / kiosk (GNOME autostart) — Wayland incompatible avec DISPLAY depuis service système

Archivé le 2026-06-21 (dépassement seuil 10 entrées dans contexte.md)

- 2026-06-18 : Ollama keep_alive -1 + préchargement lifespan — modèle en RAM dès le démarrage du serveur
- 2026-06-19 : Mémoire conversationnelle intra-session — /api/chat, fenêtre 8 messages, num_ctx 2048
- 2026-06-19 : gemma3:1b non viable (mémoire contextuelle insuffisante) → pivot gemma3:4b (RAM à valider)

Archivé le 2026-06-21 (session 14)

- 2026-06-18 : Stack Python+FastAPI / SQLite / React+Vite / Ollama gemma3:1b / kiosk browser
- 2026-06-18 : Licence MIT
- 2026-06-18 : v1 sessions anonymes (pseudo, pas de mot de passe) — comptes complets reportés v2
- 2026-06-18 : _contexte/ public dans le repo GitHub
- 2026-06-18 : Backup code = GitHub uniquement (pas de ZIP Drive)
- 2026-06-18 : Protocole d'export données air-gap (SQLite par disque dur) à développer en Phase 3
- 2026-06-18 : Fonts Google exclues de l'UI (air-gap) — fallback système uniquement
- 2026-06-18 : Navigation par machine d'état React (pas de router) — interface verrouillée par design

## Roadmaps (titres et statuts de phases)

### roadmap_robert-ia.md

# Roadmap — Robert-IA
## Phase 4 — Déploiement pilote [TODO]

## Sessions Claude Code (transcripts)

- Dossier : `d--ServOMorph-robert-ia`
- Nombre de sessions : 20
- Période : 2026-06-18 → 2026-06-25

