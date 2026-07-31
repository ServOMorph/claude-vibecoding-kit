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
- Kit v3.4 : correctif d'une corruption accidentelle dans `create_agent.md` + rattrapage de commit pour des retros de sessions antérieures restées non commitées.
- `/init_projet` exercé sur `jeu_espace` (zone `orchestrateur`, jeu 3D Godot en orbite terrestre) — seule la zone racine créée, 3 agents prévus (orchestrateur/codeur/design) non encore créés.
- Gap `GEMINI.md` toujours ouvert (P1) : pas retraité cette session, `jeu_espace` n'en a pas eu besoin.
- `/create_agent` : mode conversion pas encore validé end-to-end (Test 3 à faire).
- `jeu_zombies` (v2.26 déployé) toujours en retard sur le kit — `/update` à lancer.

## Décisions structurantes
_Décisions antérieures au 2026-07-31 (session `/init_projet` jeu_espace) archivées dans `_contexte/archive_decisions.md`._
- 2026-07-21 : Test 2 `/create_agent` — conversion d'une zone déjà mature (`linkedin`, SérénIATech_dev) en agent, cas non couvert par la procédure standard ; traité par déviation manuelle validée par l'utilisateur (charte seule, `_contexte/`/`zones.md` existants préservés). Frictions P11/P12 consignées, non tranchées.
- 2026-07-21 : nouvelle commande `/cherche_meilleure_action` créée (kit uniquement, modèle Opus) — décision utilisateur : sortie = recommandation unique + question de confirmation, jamais de décision tranchée seule par la commande.
- 2026-07-21 : `AGENTS_REGISTRY.md` créé pour centraliser agents + retex — décision utilisateur : un seul fichier, hors git (paths locaux, repo public MIT), au prix de ne pas partager les retex si le kit s'ouvre un jour à d'autres contributeurs.
- 2026-07-26 : `/create_agent` réécrite en phases nommées ancrées (au lieu de numéros d'étape) par un agent externe, relue et corrigée. P11/P12/P13 implémentées. Décision utilisateur : ajouter une phase `[AUDIT]` dédiée à l'analyse à froid de la commande elle-même, jamais automatique, Opus imposé.
- 2026-07-26 : agent `design` créé dans `jeu_zombies/DESIGN` (design artistique/UX complet du jeu) — cas de conversion d'une zone déjà enregistrée, traité manuellement ; `contexte.md` alimenté avec la stack réelle du projet (Godot 4.5, GDD) plutôt que le stub générique.
- 2026-07-28 : `CLAUDE.md` (kit + template) enrichi de deux sections — "Tests manuels" (`tests_manuels.md`, chemin relatif générique après refus d'un chemin absolu jeu_zombies-spécifique) et "Déclencheurs de vérification" sous "Honnêteté" (règles mécaniques suite à une affirmation non vérifiée en session sur le contenu de `DEPLOYMENTS.md`). Kit v3.1.
- 2026-07-30 : `/create_agent` — dossier de l'agent normalisé en MAJUSCULES (création et conversion), alias inchangé (minuscules) — décision utilisateur pour la reconnaissance visuelle dans l'arborescence. Testé en mode création sur l'agent `editeur` (crea_zik, périmètre étendu à `frontend/`/`backend/`). Kit v3.2.
- 2026-07-30 : base de connaissances `DOCUMENTATION/` (pattern progressive disclosure, validé par recherche web) adoptée comme feature générale du kit — d'abord implémentée dans Moulin du Sud (agent `documentation`), puis dans `templates/.claude/commands/close.md` (étape 7 conditionnelle) et `templates/.claude/CLAUDE.md`. `AGENTS.md` introduit en parallèle comme équivalent CLAUDE.md pour agents non-Claude, jamais créé automatiquement (`/init_projet` Q7, `/update` étape 7, toujours sur confirmation). Kit v3.3.
- 2026-07-31 : `/init_projet` exécuté sur Open_Code_Apprentissage (zone `orchestrateur`) avec reformulation + questions préalables demandées explicitement par l'utilisateur avant tout lancement. 3 agents validés par échange (notes, NARRATEUR, data) avant toute création — pattern noté comme piste de feature kit. Gap découvert : `/init_projet` ne gère pas `GEMINI.md` (créé manuellement sur demande).
- 2026-07-31 : `/init_projet` exécuté sur `jeu_espace` (zone `orchestrateur`) — jeu 3D Godot, orbite terrestre réaliste, 3 agents envisagés (orchestrateur/codeur/design), `AGENTS.md` créé (Codex mentionné pour les assets). Corruption accidentelle (`" pl"` parasite) corrigée dans `create_agent.md` ; rattrapage de commit pour des retros de sessions antérieures (agents notes/narrateur/data, communication) restées non commitées malgré des clôtures précédentes.
