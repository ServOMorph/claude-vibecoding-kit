# Propositions d'amélioration — claude-vibecoding-kit

Date : 2026-07-17. Issues de l'analyse transversale (`ANALYSE.md`) de 11 projets déployés + le kit. Chaque proposition référence la friction (F1-F10) ou le pattern terrain qui la motive. Priorisation : P1 = corrige un défaut avéré, P2 = intègre un pattern validé sur le terrain, P3 = amélioration opportuniste.

## P1 — Corrections de défauts avérés

### 1.1 `/update` doit mettre à jour DEPLOYMENTS.md (F1)
Étape 7 actuelle : ajoute une ligne si absente, ne touche jamais une ligne existante. Résultat : 8 versions fausses sur 11.
**Proposition** : si la ligne existe, réécrire ses colonnes version kit et date. En mode `all`, le résumé final affiche l'ancienne → nouvelle version par projet.
Effort : faible (modification de `update.md` seul).

### 1.2 Réconcilier l'état v2.14 réel avant toute propagation (F2)
`ollama_call.py` traîne non commité dans les 11 projets, hors de tout `/update` tracé, pendant que signals.md dit "propagation suspendue".
**Proposition** : ne pas propager par copie manuelle hors protocole ; exécuter le test v2.14 prévu (action ouverte du kit), puis `/update all` qui committera proprement les fichiers déjà présents. Ajouter à `/update` une vérification : si le fichier cible existe déjà non commité, le signaler avant écrasement.
Effort : procédural + une garde dans `update.md`.

### 1.3 `/close` signale les résidus du working tree (F3)
Suppressions massives, assets et données restent non commités pendant des semaines sans que personne ne les voie.
**Proposition** : en fin de `/close`, après le commit de session, afficher un bilan `git status --short` des fichiers restants non commités, avec une ligne "résidus non commités : N fichiers (dont X depuis plus d'une session)" dans la synthèse. Pas d'action automatique — juste rendre visible.
Effort : faible (ajout d'une étape dans `close.md`).

### 1.4 Statut explicite "livré, non validé" (F6 — friction n°1 du terrain)
6 projets sur 11 stagnent sur le même motif : code livré, validation manuelle jamais faite.
**Proposition** :
- Dans les roadmaps : une phase ne passe `[FAIT]` que si sa validation manuelle est faite ; sinon statut intermédiaire `[LIVRÉ — À VALIDER]`.
- Dans signals.md : section dédiée `## Validations en attente` (au lieu de les noyer dans Actions ouvertes), affichée en tête par `/start` avec leur âge ("en attente depuis N sessions").
- `/close` refuse de marquer une phase `[FAIT]` si le gate de validation n'est pas consigné.
Effort : moyen (CLAUDE.md section Roadmap + start.md + close.md + template signals).

### 1.5 Détection des projets dormants (F4)
**Proposition** : ajouter une colonne "dernier close" dans DEPLOYMENTS.md, mise à jour par `/update` (lecture du dernier commit `close(...)` du projet). Une commande légère `/flotte` (ou une étape de `/update all`) liste les projets triés par ancienneté du dernier close et signale ceux avec un P1 ouvert + aucun close depuis plus de 14 jours.
Effort : moyen.

### 1.6 Migration de structure `_contexte/` par `/update` (F5)
`/update` remplace les commandes mais laisse dériver les formats de contexte (JeGeekUtile en format pré-v2, `_manifest.md` résiduels).
**Proposition** : ajouter à `/update` une étape d'audit non destructive : vérifier la présence des sections attendues dans signals.md/contexte.md, signaler les fichiers obsolètes (`_manifest.md`, `derniere_session.md`) et proposer la migration (jamais automatique — le contenu appartient au projet).
Effort : moyen.

### 1.7 Activer la section "Données sensibles" (F9)
Un incident réel (credentials Zimbra dans l'historique git de TableauDeBord) et une section vide dans 10 projets sur 11.
**Proposition** : `/init_projet` et `/update` posent une question unique quand la section est vide : "Des dossiers/fichiers sensibles à déclarer ? (registre nominatif, credentials, données clients)". La Rev sert de modèle de rédaction. Ajouter au template CLAUDE.md un rappel : jamais de secret en dur, stockage hors git + service par API (décision TableauDeBord réutilisable).
Effort : faible.

## P2 — Intégrer les patterns validés sur le terrain

### 2.1 `questions.md` généralisé (Jeu pour Nino)
Un fichier de décisions de conception tranchées en lot, source de vérité pour tout arbitrage ambigu — a éliminé les re-discussions sur 77 questions.
**Proposition** : template `questions_TEMPLATE.md` dans le kit + règle CLAUDE.md (section Roadmap) : "si un arbitrage de design revient deux fois, le consigner dans `questions.md` et y renvoyer".
Effort : faible.

### 2.2 Gate de phase standard (Appli_TSA)
Le gate le plus rigoureux observé : tests unitaires verts + typecheck/lint + plan de test manuel écrit puis passé + doc à jour.
**Proposition** : formaliser dans CLAUDE.md (section Roadmap, Contenu des phases) le gate minimal de clôture de phase : tests automatisés verts + test manuel consigné (fichier `plan_test_manuel_<phase>.md` ou section de `tests_manuels.md`). Se combine avec 1.4.
Effort : faible.

### 2.3 Canal de handoff inter-zones (Jeu pour Nino)
`backlog_art.md` : statuts `à produire → livré → intégré`, seul point de contact entre deux zones parallèles.
**Proposition** : documenter le pattern dans le protocole (Protocole_start_close_context.md) comme convention recommandée dès qu'un projet a 2 zones qui échangent des livrables : un fichier de backlog unique, propriété de la zone consommatrice, statuts explicites.
Effort : faible (documentation seule).

### 2.4 Règle "modèle fort avant refacto" (Appli_TSA)
Actée sur le terrain après expérience ("basculer sur Opus avant toute phase de refacto").
**Proposition** : remonter dans le template CLAUDE.md du kit, à côté des modèles recommandés existants (Haiku start / Sonnet close / Opus plans-debug) : "phase de refacto ou migration structurelle → Opus".
Effort : trivial.

### 2.5 Benchmark de non-régression comme livrable de phase (IA_V7)
**Proposition** : mentionner dans la section Roadmap de CLAUDE.md : quand une phase produit un comportement critique difficile à tester unitairement (anonymisation, prompt système, pipeline), le gate peut être un benchmark reproductible à N cas verrouillés plutôt que des tests unitaires classiques.
Effort : trivial.

## P3 — Améliorations opportunistes

### 3.1 Compression des signals (F8)
**Proposition** : les sections vides (Questions ouvertes, Échéances, Blocages) sont omises du fichier plutôt qu'affichées vides ; `/close` les recrée seulement si non vides. Limite de taille par entrée de "Décisions structurantes" (5 lignes max, le détail va dans archive_decisions.md ou le commit).
Effort : faible.

### 3.2 Position multi-agents explicite (F7)
La pratique est déjà multi-agents (Codex sur VisioAide/La Rev, GEMINI.md présents), le kit est mono-agent. Deux options — trancher plutôt que subir :
- **Option A (minimale)** : `/close` et `/update` traitent `AGENTS.md`/`GEMINI.md` comme des fichiers du projet (commités, jamais écrasés) ; le protocole documente que `_contexte/` est la mémoire partagée inter-agents, quel que soit l'agent.
- **Option B (complète)** : le kit génère un `AGENTS.md` minimal pointant vers CLAUDE.md et le protocole `_contexte/`, propagé par `/update`, pour que tout agent applique le même cycle start/close.
Recommandation : Option A d'abord (zéro maintenance), B si l'usage Codex/Gemini se confirme.
Effort : A faible, B moyen.

### 3.3 Délégation Ollama : mesurer avant d'investir (F10)
Aucun usage réel constaté en 11 projets malgré l'instruction. Soit le besoin n'existe pas, soit le frein est le manque d'exemples.
**Proposition** : ne rien développer de plus ; ajouter 2-3 exemples concrets d'appel dans l'instruction CLAUDE.md (message de commit, données de test) et réévaluer à la prochaine analyse. Si toujours inutilisé, retirer l'instruction (économie de tokens sur chaque session de chaque projet).
Effort : trivial.

### 3.4 Collecteur de base de connaissances réutilisable
Le script de collecte de cette session (git + _contexte + roadmaps + transcripts) a produit la matière de cette analyse en une passe.
**Proposition** : l'intégrer au kit comme `scripts/collect_kb.py` + commande `/audit_flotte` qui régénère `base_connaissances/` à la demande — rend l'analyse transversale répétable (trimestrielle par exemple).
Effort : faible (le script existe, à nettoyer).

## Ordre de mise en œuvre suggéré

1. **Lot 1 (une session)** : 1.1, 1.3, 1.7, 2.4, 2.5, 3.1 — modifications légères de `update.md`/`close.md`/templates, propagées ensemble en une version de kit.
2. **Lot 2 (une session)** : 1.2 (test v2.14 + `/update all` de réconciliation) — c'est déjà l'action P1 ouverte du kit, enrichie de la garde 1.1.
3. **Lot 3 (une à deux sessions)** : 1.4 + 2.2 (statut LIVRÉ/À VALIDER + gate de phase, indissociables), puis 1.5, 1.6.
4. **Lot 4 (au fil de l'eau)** : 2.1, 2.3, 3.2-A, 3.4.
