# jeux_vibecoder

## Identité
- Chemin : `D:\ServOMorph\jeux_vibecoder`
- Zone : jeux_vibecoder
- Version kit : v2.13

## Historique git
- Nombre de commits : 10

- 2026-07-17 7c0c6a7 close(jeux_vibecoder): session 2026-07-17 — J2 validé
- 2026-07-17 ec83a18 close(jeux_vibecoder): session 2026-07-17 — niveaux pédagogiques implémentés
- 2026-07-17 7274441 close(jeux_vibecoder): session 2026-07-17 — J1 et interface validés
- 2026-07-17 6ab52d4 close(jeux_vibecoder): session 2026-07-17 — sauvegarde et score livrés
- 2026-07-17 4324e48 close(jeux_vibecoder): session 2026-07-17 -- vague et mecanique de dette livrees
- 2026-07-17 c3066fa close(jeux_vibecoder): session 2026-07-17 -- dashboard console complet livre (sous-phase 1b)
- 2026-07-17 0d61ae5 close(jeux_vibecoder): session 2026-07-17 -- Phase 1 lancee, sous-phase 1a terminee (modele d'etat + boucle generalisee)
- 2026-07-17 74cb356 close(jeux_vibecoder): session 2026-07-17 -- Jalon J0 tranche, hot-reload continu retenu
- 2026-07-17 72009c0 close(jeux_vibecoder): session 2026-07-17 — concept Vaisseau-Écosystème validé, plan de dev et roadmap créés
- 2026-07-17 6083ee3 init: protocole vibecoding — zone jeux_vibecoder

## État du working tree (non commité)
```
M .claude/CLAUDE.md
?? AGENTS.md
?? ollama_call.py
```

## Contexte stable (_contexte/contexte.md)

# Contexte — jeux_vibecoder

## Objectif (immuable sauf décision explicite)
Vaisseau-Écosystème : jeu Python où le joueur pilote son propre agent de codage IA (Claude Code, Cursor, Copilot…) par des prompts pour réparer, construire et défendre un vaisseau-écosystème dont les systèmes sont un vrai chantier de code inachevé. Le jeu n'a pas d'interface autonome : le jeu, c'est le code lui-même. Objectif pédagogique : enseigner le vibecoding compétence par compétence, par niveaux progressifs (prompts directs, contexte, découpage, lecture de code legacy, validation, itération sous pression, dette technique).

## Stack / contraintes techniques (stable, rarement modifié)
Projet Python local, point d'entrée unique `run.py`. Architecture pensée pour le hot-reload (modification de code par l'agent → effet observable en relançant/rechargeant). Tableau de bord Tkinter natif ; la boucle console est conservée comme fallback moteur. Aucun LLM intégré : jeu 100 % déterministe et scripté, agnostique à l'agent utilisé. Critères de victoire/progression lisibles dans le code.

## État actuel (réécrit intégralement à chaque /close)
Les phases 0 à 2 sont terminées ; les jalons J0, J1 et J2 sont validés. Le parcours des niveaux 1 à 4 a été réalisé avec un agent de codage, sans modification manuelle, et la progression `[1, 2, 3, 4]` est persistée. Le journal contient quatre briefs de deux lignes et la suite moteur/UI compte 31 tests réussis. La phase 3 de playtest et d’équilibrage reste à commencer.

## Décisions structurantes (append only — 10 entrées max, archiver au-delà)
- 2026-07-17 : Rôle de l'IA tranché — agent de codage réel du joueur (pas de LLM intégré au jeu), agnostique à l'outil.
- 2026-07-17 : MVP scopé — 1 module + 1 vague, niveaux pédagogiques 1 à 4. Extension "Mission & Audit" repoussée en post-MVP.
- 2026-07-17 : Plan de développement validé — 4 phases (spike hot-reload, moteur, contenu pédagogique, playtest) suivies dans ROADMAP.md.
- 2026-07-17 : Jalon J0 tranché — hot-reload continu validé par spike, pas de repli sur "reprise d'état".
- 2026-07-17 : Phase 1 découpée en sous-phases (1a-1f) dans `roadmap_phase1.md`, avec checkpoint `/compact` après chacune.
- 2026-07-17 : Vague initiale déterministe retenue : ticks 20 à 22, charge progressive et conditions dégradées sans altération de l'état réel.
- 2026-07-17 : `run.py` est déplacé à la racine ; le rechargeur résout les modules sans dépendre du dossier courant.
- 2026-07-17 : Le tableau de bord Tkinter devient l'interface par défaut ; J1 est validé manuellement et le mode développeur peut déclencher une vague immédiate.
- 2026-07-17 : Les niveaux 1 à 4 utilisent des critères déterministes, une progression persistée et des tests anti-paresse.
- 2026-07-17 : Jalon J2 validé — les quatre niveaux sont terminables avec un agent de codage, leurs déblocages sont persistés et la suite de 31 tests est verte.

## Signals (_contexte/signals.md)

# Signals — jeux_vibecoder (MAJ 2026-07-17)

## Actions ouvertes
- [P1|ouvert] Réaliser l’auto-playtest de la phase 3 avec Claude Code — fait quand: un parcours complet des niveaux 1 à 4 est réalisé avec Claude Code et les observations de friction sont consignées ; réf: `ROADMAP.md` (phase 3), `docs/PLAN_DEVELOPPEMENT.md`, `vaisseau/JOURNAL_DE_BORD.md`

## Questions ouvertes

## Échéances

## Blocages

## Contexte chaud
- Les jalons J0, J1 et J2 sont validés.
- J2 a été réalisé avec un agent de codage : les quatre niveaux ont été réparés sans modification manuelle.
- La sauvegarde confirme `niveaux_termines: [1, 2, 3, 4]` et `niveau_debloque: 4`.
- La suite moteur et UI compte 31 tests réussis.
- La phase 3 n’est pas commencée ; son premier travail est l’auto-playtest avec Claude Code.

## Dernière session (2026-07-17)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->
# Session du 2026-07-17

## Décisions prises
- Le jalon J2 est validé après un parcours complet des quatre niveaux avec un agent de codage.

## Livrables produits ou modifiés
- `vaisseau/JOURNAL_DE_BORD.md` : quatre briefs de niveau, chacun en deux lignes.
- `vaisseau/modules/` : balise, énergie, serre et défense réparées pour le parcours J2.
- `vaisseau/tests/test_journal_de_bord.py` : contrôle de la structure des briefs.
- `roadmap_phase2.md`, `ROADMAP.md`, `README.md` : état aligné sur J2 validé.

## Hypothèses validées / invalidées
- VALIDE : le parcours agent → hot-reload → déblocage fonctionne pour les quatre niveaux.
- VALIDE : la progression est persistée avec les niveaux `[1, 2, 3, 4]` et le déblocage `4`.
- EN ATTENTE : robustesse du parcours avec Claude Code, un second agent et des joueurs externes.

## Prochaine étape exacte
Réaliser l’auto-playtest complet de phase 3 avec Claude Code et consigner les frictions observées.

## Question bloquante pour la session suivante
Aucune

## Archive des décisions (_contexte/archive_decisions.md)

# Archive des décisions structurantes — jeux_vibecoder

- 2026-07-17 : Concept retenu — Vaisseau-Écosystème (hybride Usine à Robots + Tour de Garde), univers vaisseau-écosystème vivant à la dérive, hot-reload permanent.
- 2026-07-17 : Initialisation du protocole vibecoding.

## Roadmaps (titres et statuts de phases)

### ROADMAP.md

# Roadmap — Vaisseau-Écosystème

### roadmap_phase1.md

# Roadmap — Phase 1 : Moteur de jeu minimal
## 1a — Modèle d'état du vaisseau [FAIT]
## 1b — Dashboard console complet [FAIT]
## 1c — Système de vagues [FAIT]
## 1d — Mécanique de dette [FAIT]
## 1e — Sauvegarde / reprise [FAIT]
## 1f — Score de clarté [FAIT]
**🏁 Jalon J1 [FAIT]** — Partie complète jouable : panne sous vague, dégâts, correction hot-reload et fin de vague validées manuellement.

### roadmap_phase2.md

# Roadmap — Phase 2 : Contenu pédagogique
## 2a — Format des niveaux et niveau 1 [FAIT]
## 2b — Niveau 2 : Contexte [FAIT]
## 2c — Niveau 3 : Découpage [FAIT]
## 2d — Niveau 4 : Lecture de code [FAIT]
## 2e — Narration et recette J2 [FAIT]

### roadmap_ui.md

# Roadmap — Interface graphique
## Interface de jeu locale [FAIT]

## Sessions Claude Code (transcripts)

- Dossier : `d--ServOMorph-jeux-vibecoder`
- Nombre de sessions : 5
- Période : 2026-07-17 → 2026-07-17

