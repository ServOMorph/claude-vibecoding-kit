# JeGeekUtile

## Identité
- Chemin : `C:\Users\raph6\Documents\ServOMorph\JeGeekUtile`
- Zone : jegeekutile
- Version kit : v2.10

## Historique git
- Nombre de commits : 39

- 2026-07-17 7b50b21 update: protocole vibecoding — zone jegeekutile — kit v2.13
- 2026-07-14 a17ee9f update: protocole vibecoding — zone jegeekutile — kit v2.10
- 2026-06-30 4ca07c2 close(jegeekutile): session 2026-06-30 — reformulation des textes et suppression des redondances
- 2026-06-30 bdc5092 close(root): session 2026-06-30 — Ollama intégré dans l'arsenal V4, layout outils 3+4, tuile Présence ajoutée
- 2026-06-29 6c5be4c close(root): session 2026-06-29 — landing page V4 VibeCode Sessions finalisée
- 2026-06-29 ab91c91 update: protocole vibecoding — zone jegeekutile — kit v2.3
- 2026-05-13 a307c49 fix: finalize v3 responsive and test stability
- 2026-05-13 9162782 feat: add AntiSpams module for email RGPD analysis
- 2026-04-27 72b24c9 feat: implement markdown content system and overhaul dashboard UI
- 2026-04-27 3300bfa feat: Phase 3 - Refonte Dashboard UI V3 + Module Info + Port Configurable
- 2026-04-27 061ba53 feat: Phase 2 - Frontend Base & Charte Graphique V3 (100% complétée)
- 2026-04-27 6ca7d8a feat: Phase 5 - Core Dashboard + Auth + Reset MDP (100% complétée)
- 2026-04-27 b592893 feat: init roadmap UI V3 and update documentation to version 3.0.0-dev
- 2026-03-15 e546d41 docs: ajout du guide de contribution
- 2026-03-15 2c1ea0b docs: ajout de la licence MIT et précision de l'auteur
- 2026-03-15 18a93ee docs: ajout du badge GitHub Actions
- 2026-03-15 5147d69 ci: ajout du workflow GitHub Actions
- 2026-03-11 fec1f13 chore(sync): mise a jour generale fichiers et assets
- 2026-03-11 1b91b12 chore(confidentialite): retrait mentions partenariats du repo public
- 2026-03-02 8099cca Mise a jour README : reflet etat reel du projet v2.0
- 2026-02-25 c5ead48 Ajout onglet Projet d actions et refonte UI carte membre
- 2025-12-28 7575fcb Ajout apercu tableau de bord benevole pour admin
- 2025-12-28 ae170c3 Merge branch 'main' of github-servomorph:ServOMorph/JeGeekUtile
- 2025-12-28 c50cf7d Ajout systeme gestion evenements site internet
- 2025-12-27 e003cb1 Ajout conformite RGPD complete et mise a jour communication
- 2025-12-27 fba6404 Ajout agent communication /comia et roadmap
- 2025-12-27 611a728 Ajout synthese complete projet JeGeekUtile
- 2025-12-27 9a3aa2d Ajout tableau de bord personnalise pour benevoles et admins
- 2025-12-26 b91ff0a Ajout systeme benevoles complet avec admin, tracking et monnaie Geekos
- 2025-12-26 4de27a0 Ajout logo image dans le header du site
- 2025-12-25 1b531cc Ajout site internet Je Geek Utile avec optimisation SEO et IA
- 2025-12-23 639f132 Ajout profil utilisateur gaming + 5 modes d'affichage + generateur prompt avatar
- 2025-12-23 f2c17fa Ajout application auto_ia v1.6.3 - Automatisation souris/clavier
- 2025-12-22 e2dceac Application charte graphique v2.0 au Tracker Usage IA
- 2025-12-22 67eb1e5 Mise à jour charte graphique v2.0 avec système de 5 thèmes
- 2025-12-22 0153e2c Ajout système de thèmes éco-responsables et statistiques graphiques interactives
- 2025-12-21 6f2c70e Optimisation éco-responsable template standard
- 2025-12-21 7053f09 Ajout système orchestration IA, application Tracker Usage et modèle standard
- 2025-11-26 a93a0d5 Ajout console gestion agents IA avec système benchmark

## État du working tree (non commité)
```
M .gitignore
 D ROADMAP.md
 D v3/.gitignore
 D v3/PHASE2_COMPLETION.md
 D v3/PHASE5_COMPLETION.md
 D v3/README.md
 D v3/app.py
 D v3/backend/apps.py
 D v3/backend/auth.py
 D v3/backend/models.py
 D v3/backend/routes.py
 D v3/backend/services/email.py
 D v3/config.py
 D v3/pytest.ini
 D v3/requirements.txt
 D v3/scratch/register_app.py
 D v3/scratch/remove_app.py
 D v3/src/content/presentation.md
 D v3/src/content/projects.md
 D v3/src/static/css/charte.css
 D v3/src/templates/admin.html
 D v3/src/templates/base.html
 D v3/src/templates/dashboard.html
 D v3/src/templates/error.html
 D v3/src/templates/forgot_password.html
 D v3/src/templates/login.html
 D v3/src/templates/reset_password.html
 D v3/tests/conftest.py
 D v3/tests/test_apps.py
 D v3/tests/test_auth.py
 D v3/tests/test_routes.py
?? GEMINI.md
?? ollama_call.py
?? "site internet/V3/"
```

## Contexte stable (_contexte/contexte.md)

# Contexte stable

## Objectif
JeGeekUtile — boîte à outils open source pour associations. La technologie au service de l'humain.

## État actuel
- V4 landing page restructurée : suppression des sections concept et étapes, intégration des textes ciblés sur les étudiants en informatique.
- V3 (Flask) stable : dashboard responsive, tests 74/74, coverage 91.67%
- Nettoyage agents IA à faire (P1 — voir signals.md)
- Éléments V4 restants : lien Discord réel + jour de la semaine à définir (P2 — voir signals.md)

## Décisions structurantes
- Charte graphique : neon #00ff88 / bg #050705 / magenta #ff2d95 — obligatoire sur toutes les surfaces
- Éco-responsabilité : thème sombre, pixels blancs < 5%, zéro dépendance externe inutile
- IA locale (Ollama) = valeur de base, pas option — mentionner systématiquement aux côtés des outils cloud
- Flux V4 : Discord uniquement, sans formulaire ni inscription
- V4 = fichier HTML standalone (pas de backend)
- Simplification du contenu : élimination systématique des redondances pour privilégier une page concise.

## Stack
- Site V3 : Python 3.8+, Flask, SQLAlchemy, SQLite, Jinja2
- Landing V4 : HTML/CSS standalone, Google Fonts uniquement
- Agents : Claude Code (`.claude/commands/`)
- Applications satellites : Vanilla JS + Flask

## Signals (_contexte/signals.md)

# Signaux - Actions ouvertes et blocages

## [P1] Nettoyage projet — suppression système agents IA

Supprimer toute la partie agents IA du projet :
- `AGENTS/`
- `donnees/agents.json`, `donnees/sessions.json`
- `sessions/` (archives sessions agents)
- `console-agents/`
- `trace_workflow.py`
- `.claude/commands/` : robert.md, halu.md, promptparfait.md, adminia.md, comia.md, partenaires-integrateur.md
- Mettre à jour `README.md` et `CHANGELOG.md` en conséquence

fait quand: ces dossiers/fichiers sont absents du repo et README ne les mentionne plus
réf: README.md section "Vue d'ensemble" + "Agents IA", CHANGELOG.md

## [P2] Compléter la landing page V4

- Remplacer le placeholder `https://discord.gg/` par le vrai lien Discord
- Définir le jour fixe de la semaine pour les sessions (actuellement "à définir ensemble")

fait quand: aucun placeholder dans site internet/V4/index.html
réf: site internet/V4/index.html — occurrences "discord.gg/" et "à définir ensemble"

---

## Dernière session — 2026-06-30

### Décisions prises
- Reformulation des textes au futur puis au présent partiel pour cibler précisément les étudiants et valoriser leurs études.
- Simplification des redondances : suppression des sections concept et étapes, simplification de la carte outil 05 et du bouton "Voir le projet" en bas de page.

### Livrables produits ou modifiés
- `site internet/V4/index.html` : modifié

### Hypothèses validées / invalidées
- VALIDE : alléger la page en enlevant les doublons fluidifie le parcours de lecture.

### Prochaine étape exacte
Nettoyer le projet : supprimer les répertoires et fichiers liés aux agents IA (AGENTS/, console-agents/, etc.).

### Question bloquante pour la session suivante
Aucune

## Sessions Claude Code (transcripts)

- Dossier : `c--Users-raph6-Documents-ServOMorph-JeGeekUtile`
- Nombre de sessions : 2
- Période : 2026-06-30 → 2026-06-30

