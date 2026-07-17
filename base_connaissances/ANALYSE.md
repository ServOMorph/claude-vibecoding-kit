# Analyse transversale — base de connaissances vibecoding

Date : 2026-07-17. Sources : 12 fichiers de `base_connaissances/` (kit + 11 projets déployés), soit 795 commits, ~395 sessions Claude Code, contextes/signals/roadmaps/mémoires.

## 1. Ce qui fonctionne (preuves terrain)

### Le cycle /start → /close est massivement adopté
- ~80 % des commits de l'ensemble des projets sont des `close(zone): session ...`. Le rythme une-session-un-commit est devenu le mode de travail par défaut, y compris sur des projets intensifs (SérénIATech_dev : 439 commits, 215 sessions ; Appli_TSA : 81 commits, 60 sessions).
- Les sections "Prochaine étape exacte" et "fait quand:" des signals sont remplies avec précision dans les projets récents — la reprise de session est effectivement outillée.

### Le multi-zones dans un même repo est validé
- SérénIATech_dev fait tourner ~10 zones (aide_visio, business, linkedin, alfie, orga, interim...) dans un seul repo sans collision de contexte.
- Jeu pour Nino fait cohabiter deux zones (`jeu` / `game_art`) avec un canal de handoff explicite (`backlog_art.md`) — pattern né sur le terrain, pas dans le kit.

### Patterns gagnants nés dans les projets (absents du kit)
| Pattern | Projet d'origine | Valeur observée |
|---------|------------------|-----------------|
| `questions.md` : décisions de design tranchées en lot (77+1), source de vérité pour tout arbitrage ambigu | Jeu pour Nino | Élimine les re-discussions, référencé dans signals |
| Gate de phase : tests unitaires + `tsc`/lint + plan de test manuel écrit et passé avant de clore | Appli_TSA | 374/374 tests, régressions attrapées avant close |
| `backlog_art.md` : canal unique de handoff entre deux zones | Jeu pour Nino | Découple deux flux de travail parallèles |
| Commande projet `/analyse_visio` : transcription visio → constats → roadmap versionnée générée | Appli_TSA | Boucle testeur → roadmap automatisée |
| Benchmark comme garde-fou de non-régression (26 cas `/rgpd`) | IA_V7 | Verrouillage de comportement critique |
| Règle "basculer sur Opus avant toute phase de refacto" | Appli_TSA | Actée après expérience réelle |
| `_docs/REFERENCE_PROJET.md` source de vérité documentaire | VisioAide | Résout les conflits de docs |

## 2. Frictions et incohérences détectées

### F1 — DEPLOYMENTS.md est faux
Tous les projets ont reçu `update: ... kit v2.13` le 2026-07-17 (visible dans chaque log git), mais DEPLOYMENTS.md affiche encore v2.10/v2.12 pour 8 projets sur 11. Cause : l'étape 7 de `/update` ne fait qu'*ajouter* une ligne si absente — elle ne met jamais à jour la version ni la date d'une ligne existante.

### F2 — L'état réel contredit l'état documenté pour la v2.14
`ollama_call.py` est présent **non commité** (`??`) dans les 11 projets, alors que signals.md du kit affirme "la propagation v2.14 est suspendue, tester d'abord sur un projet". La propagation de fichier a de facto déjà eu lieu (sans commit, sans mise à jour des CLAUDE.md), hors de tout `/update` tracé.

### F3 — Working trees sales chroniques
Quasi tous les projets portent des fichiers non commités durablement : suppressions massives en attente (JeGeekUtile : tout `v3/` supprimé non commité), assets binaires (robert-ia, Jeu pour Nino), données modifiées (TableauDeBord), bytecode (IA-TSA). `/close` committe la session mais ne signale pas les résidus, qui s'accumulent en angle mort.

### F4 — Projets dormants invisibles
robert-ia : signals MAJ 2026-06-22, P1 "déploiement pilote Bistrot" ouvert depuis 25 jours, aucune session depuis le 2026-06-25. Rien ne distingue un projet dormant d'un projet actif — ni dans DEPLOYMENTS.md ni au `/start`.

### F5 — Dérive de format entre générations de projets
- JeGeekUtile : signals/contexte au format pré-v2 (pas de sections Questions/Échéances/Blocages, pas de "fait quand:" structuré, pas d'archive_decisions).
- robert-ia et IA-TSA portent encore `_manifest.md`, supprimé du kit le 2026-06-21.
- Titres de "Dernière session" incohérents (`## Dernière session` vs `# Session du ...`) selon les projets.
- `/update` remplace les fichiers de commandes mais ne migre jamais la *structure* des fichiers `_contexte/`.

### F6 — Le motif "livré côté code, jamais validé" est le blocage n°1
Le même état revient dans 6 projets : Jeu pour Nino (jalon J1 non joué), TableauDeBord (Phase 3 test réel en attente), IA_V7 (2 validations manuelles en attente), IA-TSA (4 tests en séance jamais faits, reportés depuis 2 sessions), robert-ia (test RAG à valider depuis le 2026-06-22), Appli_TSA (4 points en attente de Marie). Le protocole pousse à clore des phases "côté code" mais ne donne aucun statut ni relance pour la dette de validation.

### F7 — Multi-agents subi, pas géré
`AGENTS.md` (Codex) et `GEMINI.md` non trackés apparaissent dans 5 projets ; VisioAide et La Rev n'ont *aucun* transcript Claude Code (sessions menées avec un autre agent). Le protocole est de fait multi-agents, mais le kit est mono-agent : les autres agents ne lisent pas CLAUDE.md, et leurs fichiers d'instruction dérivent sans synchronisation.

### F8 — Économie de tokens dégradée par les sections vides
Questions ouvertes / Échéances / Blocages sont vides dans ~80 % des signals lus, mais chargées à chaque `/start`. À l'inverse, certaines "Décisions structurantes" d'Appli_TSA dépassent 30 lignes par entrée (la limite "10 entrées max" existe, aucune limite de taille par entrée).

### F9 — Sécurité : la section "Données sensibles" est inerte
TableauDeBord a eu des credentials Zimbra committés dans l'historique git (action P2 ouverte). La Rev est le seul projet ayant réellement rempli une frontière de données sensibles. La section CLAUDE.md existe partout mais vide — aucune étape de `/init_projet` ne force à se poser la question.

### F10 — Délégation Ollama : instruction présente, usage invisible
L'instruction de délégation existe dans tous les CLAUDE.md, mais aucune trace d'usage réel de `ollama_call` n'apparaît dans les livrables ou décisions des 11 projets. Le seul usage attesté d'Ollama est applicatif (robert-ia, VisioAide, IA_V7), pas de la délégation de tâches du protocole.

## 3. Synthèse

Le cœur du kit (cycle start/close, signals, zones, roadmaps à checkpoints) est validé par un usage intensif et régulier sur 11 projets et ~400 sessions. Les faiblesses ne sont pas dans le concept mais dans :
1. **la boucle de retour kit ← projets** : les meilleurs patterns (questions.md, gates de test, handoff inter-zones) restent locaux à un projet ;
2. **la maintenance de la flotte** : DEPLOYMENTS.md faux, formats dérivés, projets dormants, working trees sales — l'outillage de propagation écrit des fichiers mais n'audite pas l'état réel ;
3. **la dette de validation manuelle**, motif dominant de stagnation inter-sessions, non modélisée par le protocole ;
4. **l'ouverture multi-agents**, déjà réelle sur le terrain, non prise en charge.

Ces constats alimentent le fichier de propositions d'amélioration (à produire).
