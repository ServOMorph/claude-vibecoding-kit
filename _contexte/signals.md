# Signals — claude-vibecoding-kit (MAJ 2026-08-12)

## Actions ouvertes
- [P2|ouvert] Valider l'étape 12bis de `/close` (sauvegarde `DEPLOYMENTS.md` vers `googledrive:BackUps/claude-vibecoding-kit/`) sur un prochain `/close` réel du kit — cette clôture est la première exécution de l'étape telle qu'écrite dans `close.md`. fait quand: un `/close` réel du kit propose la sauvegarde, la confirmation déclenche l'upload et le fichier horodaté apparaît dans `googledrive:BackUps/claude-vibecoding-kit/`. réf: `.claude/commands/close.md` (étape 12bis), `backup_file.py`
- [P2|ouvert] Valider ou invalider la commande locale `/create_agent` de `jeu_espace` (permet à l'orchestrateur de créer des agents lui-même, sans passer par le kit — cf. `D:\ServOMorph\jeu_espace\.claude\commands\create_agent.md`). Créée le 2026-08-11, jamais testée en conditions réelles à ce stade. fait quand: retour d'expérience après usage réel, décision garder/écarter/propager au kit actée (échéance indicative ~2026-08-25). réf: `D:\ServOMorph\jeu_espace\.claude\commands\create_agent.md`
- [P2|ouvert] Expérimentation "synthèse agents pour l'orchestrateur" (chaque zone-agent écrit sa synthèse à `/close` dans un fichier partagé, la zone racine la lit à `/start` et propose des actions) implémentée uniquement dans `jeu_zombies` (hors dépôt kit) — `close.md`/`start.md`/`agent_role.md` de ce projet modifiés localement, roadmap dédiée créée. Pas encore testée en conditions réelles (Phase 2 de sa roadmap), pas propagée au kit. fait quand: bilan de Phase 3 de `roadmap_synthese_agents.md` (jeu_zombies) tranché (retenue → propager au kit, écartée → documenter pourquoi). réf: `D:\ServOMorph\jeu_zombies\roadmap_synthese_agents.md`
- [P2|ouvert] Trancher l'ajout d'une phase de code review dans le modèle de roadmap (`CLAUDE.md`, section Roadmap). Discussion ouverte le 2026-08-10 : proposition initiale "gate systématique en fin de phase" écartée par l'utilisateur (coût token trop élevé sur phases triviales), reformulée en "seuil conditionnel" (revue déclenchée seulement au-delà d'une taille de diff, sinon skip annoncé explicitement) + "tri des findings par sévérité" (bloquant = correction immédiate, mineur = reporté en action `signals.md`). Aucune validation finale, aucune modification de fichier faite. fait quand: utilisateur valide une combinaison, `.claude/CLAUDE.md` et `templates/.claude/CLAUDE.md` modifiés en miroir. réf: cette session (pas de fichier écrit)
- [P2|ouvert] Le correctif du 2026-08-05 a été commité sur la branche courante de chaque dépôt sans vérifier qu'il s'agissait de `main` — `jeu_zombies` (`feat/insertion-designs`) et `Appli_TSA_SDI_TDAH` (`v5.1`, était `v5.0` le 2026-08-05) sont toujours sur des branches non-main ; les deux sont néanmoins synchronisés avec leur remote (vérifié le 2026-08-08). À vérifier que ce n'est pas gênant pour la propagation du correctif. fait quand: statut de ces deux branches (merge prévu vers main ou branche de travail durable) clarifié. réf: dépôts `jeu_zombies`, `Appli_TSA_SDI_TDAH`
- [P2|ouvert] `DEPLOYMENTS.md` indique `Open_Code_Apprentissage` au chemin `D:\ServOMorph\Open_Code_Apprentissage`, introuvable lors d'un contrôle le 2026-08-04 — seuls `D:\ServOMorph\OpenCode` et `D:\ServOMorph\Test_OpenCode` existent. Probable renommage non répercuté dans `DEPLOYMENTS.md`, pas d'investigation faite au-delà du constat. fait quand: chemin réel confirmé et `DEPLOYMENTS.md` corrigé si besoin. réf: `DEPLOYMENTS.md`
- [P2|ouvert] Trancher les points ouverts de `note_conception_pause_agents.md` (position exacte dans `/init_projet`, contenu de la question, enchaînement ou non sur `/create_agent`, persistance de l'échange, articulation avec Q5) puis implémenter si retenu. Cadrage initial acté le 2026-07-31 : nouvelle étape dans `/init_projet` (pas `/create_agent`), déclenchement systématique, cette note est un document seul, aucune implémentation faite. fait quand: chaque point tranché, `/init_projet` modifié si retenu. réf: `note_conception_pause_agents.md`
- [P1|ouvert] Tester en conditions réelles la question AGENTS.md/GEMINI.md de `/update`/`/init_projet` (étape 7 de `/close` déjà validée le 2026-08-01, voir Contexte chaud). fait quand: un `/update`/`/init_projet` réel pose la question AGENTS.md et/ou GEMINI.md et le comportement (jamais automatique, jamais écrasé) est conforme. réf: `.claude/commands/update.md`, `.claude/commands/init_projet.md`
- [P1|ouvert] Test 3 réel de `/create_agent` en mode conversion, sur la version réécrite (phases ancrées). Aucun test n'a encore exercé cette branche telle qu'écrite : l'agent `design` (jeu_zombies) était un cas de conversion mais traité manuellement, pas via la procédure. fait quand: `/create_agent` lancée sur un alias déjà enregistré et le comportement conforme à `[PREFLIGHT]`/`[ECRITURE]` (pas de modif `zones.md`/`signals.md` existant) vérifié en conditions réelles. réf: `.claude/commands/create_agent.md`, `TEST_CREATE_AGENT_RESULTS.md`
- [P2|ouvert] Tester l'étape 10 de `/create_agent` (message presse-papier pour l'agent racine, ajoutée le 2026-07-31) via un appel réel de la commande — cette session, le message a été généré et copié manuellement (`Set-Clipboard`) hors du flux de la commande, jamais via `[SORTIE]` tel qu'écrit. fait quand: `/create_agent` lancée en conditions réelles, question presse-papier posée et exécutée par la commande elle-même. réf: `.claude/commands/create_agent.md` (étape 10)
- [P2|ouvert] Tester le renommage automatique du dossier d'agent en mode conversion (règle MAJUSCULES ajoutée le 2026-07-30) : aucun agent existant actuellement en minuscules pour exercer cette branche. fait quand: `/create_agent` lancée en mode conversion sur un dossier à la casse non conforme, renommage + mise à jour de `zones.md` vérifiés en conditions réelles. réf: `.claude/commands/create_agent.md`, `ameliorations_create_agent.md`
- [P2|ouvert] Propositions P7-P10 sur `/create_agent`/`agent_role.md` restant à trancher (P11/P12/P13 implémentées le 2026-07-26) : P7 (partiellement couvert par l'analyse stack conditionnelle, confirmé sur l'agent `explo` et l'agent `editeur`), P8 (garde-fou d'écriture, non spécifiable en l'état), P9 (charte comme prompt de spécialisation), P10 (apprentissage automatique des agents, tension avec la règle mémoire). fait quand: chaque proposition tranchée (retenue/écartée), implémentée si retenue. réf: `ameliorations_create_agent.md`
- [P2|ouvert] Décider quelles propositions des Lots 2-4 de `base_connaissances/PROPOSITIONS_AMELIORATION.md` mettre en œuvre (Lot 1 clos). Lot 3 = 1.4+2.2, 1.5, 1.6 ; Lot 4 = 2.1, 2.3, 3.2-A, 3.4. fait quand: décision actée pour chaque proposition restante, implémentée si retenue. réf: `base_connaissances/PROPOSITIONS_AMELIORATION.md`
- [P2|ouvert] `jeu_zombies` (déployé v2.26, `D:\ServOMorph\jeu_zombies`) en retard sur le kit (v3.6) — n'a pas encore la section "Tests manuels" ni "Déclencheurs de vérification" de `CLAUDE.md`, ni la base de connaissances. Propagation reportée par l'utilisateur le 2026-07-28. fait quand: `/update` lancé sur jeu_zombies et `.claude/CLAUDE.md` du projet reflète le contenu à jour. réf: `DEPLOYMENTS.md`, `.claude/CLAUDE.md`

## Contexte chaud
- Agent `review` créé dans `jeu_zombies` via `/create_agent` (mode création, rôle : revue de code continue, sans production de code, périmètre par défaut `REVIEW/` uniquement).
- `README.md` : corruption d'encodage pré-existante (double UTF-8) — à traiter si gênant.

## Dernière session (2026-08-12)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->

# Session du 2026-08-12 (propagation create_memory.md — clôture a posteriori après /clear accidentel)

## Décisions prises
- Gap corrigé : `create_memory.md` manquait à l'étape 3 d'`init_projet.md` (fichier jamais propagé aux nouveaux projets).
- Déploiement massif effectué via nouveau script `deploy_create_memory.py` (lecture de `DEPLOYMENTS.md`, copie si absent) plutôt que manuellement — pratique actée pour tout déploiement massif futur.
- Session clôturée a posteriori : l'utilisateur a fait `/clear` avant `/close`, conversation perdue. Reconstruction de la synthèse à partir du commit `57a3522` et de l'état réel des fichiers/dépôts, sans les détails fins de la conversation d'origine.

## Livrables produits ou modifiés
- `.claude/commands/init_projet.md` : ligne ajoutée à l'étape 3.
- `deploy_create_memory.py` (nouveau, racine du kit).
- `create_memory.md` propagé et committé dans les 22 projets réels de `DEPLOYMENTS.md` (18 déjà committés par la session d'origine ; 4 recommis lors de cette clôture — `site_internet_Sereniatech_V2`, `jeu_espace`, `Participation_GitHub`, `Roberto2` — où le fichier était présent sur disque mais non commité dans leur dépôt respectif).
- 2 projets sans dépôt git (`Moulin du Sud`, `Nettoyage_PC`) : fichier présent sur disque, commit non applicable.
- `Open_Code_Apprentissage` : toujours chemin introuvable (gap déjà connu, voir action ouverte `DEPLOYMENTS.md`).

## Hypothèses validées / invalidées
- INVALIDE : l'entrée `signals.md` écrite par la session d'origine décrivait un déploiement "en cours" (test sur Roberto2) alors que le commit montrait un déploiement déjà terminé sur 25 projets — incohérence corrigée par cette clôture.

## Prochaine étape exacte
Aucune sur ce sujet — propagation `create_memory.md` considérée close.

## Question bloquante pour la session suivante
Aucune

# Session du 2026-08-12 (sauvegarde automatique DEPLOYMENTS.md vers Google Drive)

## Décisions prises
- Système de sauvegarde automatique de `DEPLOYMENTS.md` vers Google Drive créé, intégré à `/close` du kit (étape 12bis, optionnelle, confirmation utilisateur requise).
- Réutilisation du pattern rclone existant (SérénIATech_dev) plutôt que réécriture complète.
- Destination fixée sur `googledrive:BackUps/claude-vibecoding-kit/` (compte Google inchangé, confirmé par l'utilisateur).

## Livrables produits ou modifiés
- `backup_file.py` (nouveau) : script générique de sauvegarde horodatée via rclone (`copyto`).
- `.claude/commands/close.md` : étape 12bis ajoutée, corruption "e" isolé (ligne 122) corrigée, `allowed-tools` étendu.

## Hypothèses validées / invalidées
- VALIDE : `rclone copyto` nécessaire au lieu de `rclone copy` — `copy` ignorait le nom horodaté et écrasait avec le nom du fichier source (bug détecté et corrigé en session).
- VALIDE : rclone déjà configuré et authentifié avec le compte Google actuel, aucune reconfiguration nécessaire.

## Prochaine étape exacte
Observer le comportement de l'étape 12bis lors des prochains `/close` réels du kit ; envisager une rotation si le dossier grossit.

## Question bloquante pour la session suivante
Aucune

# Session du 2026-08-11 (commande locale /create_agent pour jeu_espace)

## Décisions prises
- Nouvelle commande locale `/create_agent` créée dans `jeu_espace` (projet externe) : permet à l'orchestrateur (zone racine) de créer lui-même des agents dans son propre projet, sans passer par le kit. Copie autonome (templates embarqués localement), inspirée de `/create_agent` du kit mais adaptée : pas d'argument chemin projet cible, pas d'écriture dans les fichiers de bookkeeping du kit (`AGENTS_REGISTRY.md`, `ameliorations_create_agent.md`), pas de phase `[AUDIT]`.
- Portée limitée à un test isolé sur `jeu_espace` — aucun template du kit modifié, propagation à décider après retour d'expérience.
- Rappel de validation à échéance ~2026-08-25 ajouté aux actions ouvertes du kit, sur demande explicite.

## Livrables produits ou modifiés
- Hors dépôt kit (`jeu_espace`) : `.claude/commands/create_agent.md`, `.claude/templates/agent_role_TEMPLATE.md`, `.claude/templates/_contexte/signals.md`, `.claude/templates/_contexte/contexte.md` créés.
- `_contexte/signals.md` (kit) : action de rappel de validation ajoutée.

## Hypothèses validées / invalidées
- EN ATTENTE : la commande n'a jamais tourné en conditions réelles — aucun agent créé via ce flux à ce stade.

## Prochaine étape exacte
Lancer `/create_agent <dossier> [rôle]` réellement depuis `jeu_espace` pour valider le flux ; trancher garder/écarter/propager au kit d'ici ~2026-08-25.

## Question bloquante pour la session suivante
Aucune.

# Session du 2026-08-10 (agent review + expérimentation synthèse agents)

## Décisions prises
- Agent `review` créé dans `jeu_zombies` via `/create_agent` (rôle : revue de code continue, périmètre par défaut).
- Feature "synthèse agents pour l'orchestrateur" conçue et implémentée en expérimentation, limitée à `jeu_zombies` : les zones-agents écrivent une synthèse à `/close` dans un fichier partagé, la zone racine la lit à `/start` et propose des actions. Propagation au kit explicitement différée à un bilan positif (Phase 3 de sa roadmap dédiée).

## Livrables produits ou modifiés
- `ameliorations_create_agent.md` : entrée agent `review` ajoutée.
- `AGENTS_REGISTRY.md` (hors git) : entrée `review` ajoutée.
- Hors dépôt kit (`jeu_zombies`) : `REVIEW/agent_role.md`, `REVIEW/_contexte/{signals,contexte}.md`, `_contexte/synthese_agents.md`, `roadmap_synthese_agents.md` créés ; `.claude/zones.md` (ligne review), `.claude/commands/close.md` (étape 7 + renumérotation), `.claude/commands/start.md` (étape 4c), `REVIEW/agent_role.md`, `DESIGN/agent_role.md` (exception de périmètre), `_contexte/signals.md` modifiés.

## Hypothèses validées / invalidées
- EN ATTENTE : la feature "synthèse agents" n'a pas encore tourné en conditions réelles (Phase 2 de `roadmap_synthese_agents.md`, jeu_zombies) — aucune validation empirique à ce stade.

## Prochaine étape exacte
Sur jeu_zombies : exécuter Phase 2 de `roadmap_synthese_agents.md` (`/close review`, `/close design`, `/start` racine réels). Sur le kit : décider la propagation après le bilan de Phase 3.

## Question bloquante pour la session suivante
Aucune.

# Session du 2026-08-10 (discussion code review dans les roadmaps, sans conclusion)

## Décisions prises
- Aucune décision actée. Discussion exploratoire sur l'ajout d'une phase de code review dans le modèle de roadmap, interrompue avant validation finale.

## Livrables produits ou modifiés
- Aucun (échange uniquement, aucun fichier de commande/template modifié).

## Hypothèses validées / invalidées
- INVALIDE (reconsidérée en séance) : ma proposition initiale de gate systématique en fin de phase — jugée trop coûteuse en tokens sur les phases triviales par l'utilisateur, remplacée par une proposition de seuil conditionnel.
- EN ATTENTE : validation utilisateur de "seuil conditionnel + tri des findings par sévérité" avant toute modification de `CLAUDE.md`.

## Prochaine étape exacte
Si validation : rédiger la modification de la section Roadmap dans `.claude/CLAUDE.md` et `templates/.claude/CLAUDE.md` (miroir), définissant le seuil de déclenchement et la règle de tri des findings.

## Question bloquante pour la session suivante
L'utilisateur valide-t-il "seuil conditionnel + tri par sévérité" pour la revue de code dans les roadmaps, ou souhaite-t-il une autre combinaison ?

# Session du 2026-08-08 (vérification et push réel des 18 dépôts en attente)

## Décisions prises
- Vérification effective (fetch + status) des 18 dépôts + le kit, au lieu de se fier à l'état daté du 2026-08-05 : seuls 5 (kit, VisioAide, crea_zik, Appli_TSA_SDI_TDAH, jeu_zombies) étaient déjà poussés. Les 13 restants avaient chacun 1 commit local en avance — poussés cette session sur demande explicite de l'utilisateur.
- `Lieux_Hybrides` confirmé sans upstream configuré : cohérent avec la décision antérieure de ne pas l'auto-configurer, action considérée close sans relance.

## Livrables produits ou modifiés
- 13 dépôts externes poussés vers leur remote : robert-ia, Jeu pour Nino, JeGeekUtile, TableauDeBord, IA-TSA, La Rev, IA_V7, jeux_vibecoder, AutoClaude, Projet_de_reve, site_internet_Sereniatech_V2, jeu_espace, Roberto.
- `_contexte/signals.md`, `_contexte/contexte.md` (kit) : mis à jour, action P1 close.

## Hypothèses validées / invalidées
- INVALIDE : l'hypothèse implicite que "commit local = probablement poussé depuis" — faux pour 13 des 18 dépôts, confirmée par vérification directe plutôt que par la mémoire de session antérieure.

## Prochaine étape exacte
Trancher le statut des branches non-main (`jeu_zombies`, `Appli_TSA_SDI_TDAH`) si besoin ; aucune urgence, action P2 existante inchangée.

## Question bloquante pour la session suivante
Aucune

# Session du 2026-08-05 (correctif étape push native sur 18 projets + corruption close.md kit)

## Décisions prises
- Bug confirmé : sur les 18 close.md où le push automatique avait été activé (15 propagés le 2026-08-04 + 3 zones test antérieures), l'instruction restait dans le bloc "Spécificités projet" au lieu d'être une étape native, contrairement au close.md du kit. Corrigé sur les 18 fichiers, chacun commité isolément (seul close.md stagé, pas les autres fichiers en attente propres à chaque projet).
- Corruption locale (non commitée, sans impact sur l'historique git) détectée dans `.claude/commands/close.md` du kit — étape 11 remplacée par un caractère isolé "é" — restaurée via `git checkout` avant toute autre action.

## Livrables produits ou modifiés
- 18 `close.md` externes corrigés et commités (push non fait, en attente confirmation) : robert-ia, Jeu pour Nino, Appli_TSA_SDI_TDAH, VisioAide, crea_zik, JeGeekUtile, TableauDeBord, IA-TSA, La Rev, IA_V7, jeux_vibecoder, AutoClaude, Projet_de_reve, jeu_zombies, site_internet_Sereniatech_V2, Lieux_Hybrides (Moulin du Sud), jeu_espace, Roberto.
- `.claude/commands/close.md` (kit) : corruption locale restaurée (aucun diff résiduel, rien à commiter dessus).
- `CHANGELOG.md`, `README.md` : bump v3.10.

## Hypothèses validées / invalidées
- VALIDE : les 18 fichiers partageaient exactement le même défaut, correction uniforme applicable sans cas particulier.
- À NOTER (ni validé ni invalidé) : `jeu_zombies` commité sur `feat/insertion-designs`, `Appli_TSA_SDI_TDAH` sur `v5.0` — branches courantes de ces dépôts, non `main`, non modifiées par la session mais à surveiller.

## Prochaine étape exacte
Pousser les 18 commits locaux si l'utilisateur confirme (action P1 ouverte) ; sinon les laisser en attente.

## Question bloquante pour la session suivante
Aucune

# Session du 2026-08-04 (décision garder + propagation git push à 15 projets)

## Décisions prises
- `git push` automatique après `/close` : décision "garder" actée (les 4 zones test ont bien poussé). Promu en étape native (12) du template et du `close.md` du kit, retrait de l'ancien hack "Spécificités projet".
- Propagation faite aux 15 projets déployés avec remote git (sur 17 : `SérénIATech_dev` sans remote, `Open_Code_Apprentissage` introuvable, exclus). Commit dans les 15, push dans 14 — `Lieux_Hybrides` laissé en commit local sur refus explicite de configurer l'upstream.

## Livrables produits ou modifiés
- `templates/.claude/commands/close.md`, `.claude/commands/close.md` (kit) : étape push native, renumérotation 12→13→14.
- 15 `close.md` externes modifiés + commités (`robert-ia`, `Jeu pour Nino`, `JeGeekUtile`, `TableauDeBord`, `IA-TSA`, `La Rev`, `IA_V7`, `jeux_vibecoder`, `AutoClaude`, `Projet_de_reve`, `jeu_zombies`, `site_internet_Sereniatech_V2`, `Moulin du Sud`/`Lieux_Hybrides`, `jeu_espace`, `Roberto`).
- `README.md`, `CHANGELOG.md` (v3.9) mis à jour.

## Hypothèses validées / invalidées
- VALIDE : le push automatique fonctionne en conditions réelles (4/4 zones test).
- INVALIDE (corrigée en session) : le script de propagation initial corrompait les accents insérés — bug de lecture d'encodage PowerShell, corrigé avant tout commit.

## Prochaine étape exacte
Configurer l'upstream de `Lieux_Hybrides` si le push y est souhaité (décision utilisateur en attente) ; vérifier au fil des prochains `/close` de chaque projet propagé que l'étape 12 fonctionne dans leur flux réel.

## Question bloquante pour la session suivante
Aucune

# Session du 2026-08-04 (propagation git push crea_zik + correctif doc_sync.md)

## Décisions prises
- `git push` automatique (étape 11bis) propagé à un 4ème projet, `crea_zik`, sur demande explicite utilisateur — même patron que les 3 zones test existantes (allowed-tools + étape complémentaire dans le bloc "Spécificités projet"). Décision garder/écarter toujours en attente.
- Corruption pré-existante corrigée dans `.claude/commands/doc_sync.md` (`a---` → `---` en tête de frontmatter) après confirmation utilisateur, plutôt que commitée telle quelle ou laissée en résidu.

## Livrables produits ou modifiés
- Hors dépôt kit : `D:\ServOMorph\crea_zik\.claude\commands\close.md` modifié (`allowed-tools` + étape 10bis git push).
- `.claude/commands/doc_sync.md` (kit) : frontmatter corrigé.
- `_contexte/signals.md`, `_contexte/contexte.md` : mis à jour.

## Hypothèses validées / invalidées
- EN ATTENTE : toujours aucune décision garder/écarter sur le push automatique — 4 zones en test désormais au lieu de 3.

## Prochaine étape exacte
Observer le résultat de ce `/close` (première exécution réelle de l'étape 11bis sur le kit) ; trancher garder/écarter d'ici quelques temps.

## Question bloquante pour la session suivante
Aucune

# Session du 2026-08-02 (test git push après /close)

## Décisions prises
- `git push` automatique après le commit de `/close` ajouté en test sur 3 zones : le kit lui-même, `Appli_TSA_SDI_TDAH`, `VisioAide` — décision utilisateur confirmée (push, pas pull) via question explicite.
- Ajout fait directement dans chaque `close.md` (bloc "Spécificités projet"), pas dans le template — la propagation reste à trancher après observation.

## Livrables produits ou modifiés
- `.claude/commands/close.md` (kit) : `allowed-tools` + étape 11bis (git push) ajoutés.
- `_contexte/signals.md` : action ouverte P2 ajoutée pour trancher garder/écarter/propager.
- Hors dépôt kit : `D:\ServOMorph\Appli_TSA_SDI_TDAH\.claude\commands\close.md`, `D:\ServOMorph\VisioAide\.claude\commands\close.md` modifiés à l'identique.

## Hypothèses validées / invalidées
- EN ATTENTE : ce `/close` est la première exécution réelle du `git push` (kit) — comportement à observer dans le bilan de fin de commande.

## Prochaine étape exacte
Observer les prochains `/close` sur les 3 zones test ; trancher garder/écarter d'ici quelques temps et, si retenu, propager au template + `/update` sur les projets avec remote git.

## Question bloquante pour la session suivante
Aucune

# Session du 2026-08-01 (workflow GEMINI.md + rattrapage Moulin du Sud)

## Décisions prises
- `/init_projet` et `/update` : ajout de la question de création de `GEMINI.md`, sur le même modèle qu'`AGENTS.md` (jamais automatique, jamais écrasé) — résout l'action P1 gap GEMINI.md.
- Analyse d'un `/close` réel sur `moulin_du_sud` (projet externe) : étape 7 (base de connaissances) validée en conditions réelles pour la première fois — première moitié de l'action P1 test réel `DOCUMENTATION/` close.
- Rattrapage de 3 commits sur le dépôt externe Moulin du Sud (résidus non commités de sessions antérieures) : lot `DOCUMENTATION/`, déplacement `Accueil Handicap` vers la racine (rename propre vérifié par diff avant commit), alignement protocole v3.3.
- `DEPLOYMENTS.md` (kit, hors git) : version Moulin du Sud corrigée v3.1 → v3.3, non commitée (fichier gitignored du kit).

## Livrables produits ou modifiés
- `templates/GEMINI.md` : nouveau template (calqué sur `templates/AGENTS.md`).
- `.claude/commands/init_projet.md`, `templates/.claude/commands/init_projet.md` : Q8 + copie conditionnelle `GEMINI.md`.
- `.claude/commands/update.md`, `templates/.claude/commands/update.md` : étape 7 renommée et étendue à `GEMINI.md` (symétrique à `AGENTS.md`).
- `DEPLOYMENTS.md` (hors git) : version Moulin du Sud corrigée.
- Hors dépôt kit (Moulin du Sud) : 3 commits de rattrapage (voir Décisions prises).

## Hypothèses validées / invalidées
- VALIDE : l'étape 7 de `/close` (base de connaissances) fonctionne en conditions réelles sur une zone tierce.
- VALIDE : fusionner GEMINI.md dans l'étape 7 existante d'`/update` (au lieu de renuméroter) évite toute casse de numérotation.
- EN ATTENTE : la question GEMINI.md n'a jamais été posée via un appel réel d'`/init_projet`/`/update`.

## Prochaine étape exacte
Tester `/init_projet`/`/update` en conditions réelles pour valider la question GEMINI.md ; actions P1 restantes : Test 3 conversion `/create_agent`, test presse-papier étape 10.

## Question bloquante pour la session suivante
Aucune

# Session du 2026-07-31 (étape presse-papier /create_agent + agents dev/design jeu_espace)

## Décisions prises
- `/create_agent` : nouvelle étape `[SORTIE]` proposant de copier dans le presse-papier un message de mise à jour pour l'agent racine, plutôt que de l'écrire dans `signals.md` du projet cible (demande explicite de l'utilisateur, revert de la première approche).
- Agents `dev`/`design` créés dans jeu_espace (projet externe), question groupée sur le périmètre d'écriture (dev étendu au code Godot racine, design restreint à son dossier).
- Kit bumpé en v3.5 (minor) via `/doc_sync`.

## Livrables produits ou modifiés
- `.claude/commands/create_agent.md` : étape 10 (presse-papier) ajoutée, renumérotation 10→11/11→12.
- `CHANGELOG.md`, `Protocole_start_close_context.md` : entrées v3.5 ajoutées (miroir vérifié).
- `ameliorations_create_agent.md` : entrée agents dev/design (jeu_espace).
- `AGENTS_REGISTRY.md` (hors git) : entrées dev/design ajoutées.
- Hors dépôt kit (jeu_espace) : agents `dev`/`design` créés (agent_role.md + `_contexte/`), `zones.md` mis à jour ; modification initiale de `_contexte/signals.md` (message pour l'orchestrateur) annulée sur demande utilisateur.

## Hypothèses validées / invalidées
- VALIDE : l'ajout de l'étape presse-papier n'a pas nécessité de bump major (structure `_contexte/` inchangée).
- EN ATTENTE : l'étape 10 n'a jamais été exercée via un appel réel de `/create_agent` — message généré et copié manuellement, hors du flux de la commande.

## Prochaine étape exacte
Tester l'étape 10 (presse-papier) lors d'un prochain appel réel de `/create_agent` ; trancher les actions P1 en attente (GEMINI.md, test réel base de connaissances, Test 3 conversion).

## Question bloquante pour la session suivante
Aucune

# Session du 2026-07-31 (init jeu_espace + rattrapage commits)

## Décisions prises
- `/init_projet` exécuté sur `D:\ServOMorph\jeu_espace` (zone `orchestrateur`, repo sous git, `AGENTS.md` créé sur confirmation) d'après `_DOCS/idée de base.txt`.
- Corruption accidentelle (`" pl"` parasite avant un commentaire) corrigée dans `.claude/commands/create_agent.md`, détectée lors du contrôle `git status` avant clôture.
- Décision utilisateur : inclure dans le commit de clôture les changements non commités de sessions antérieures (`ameliorations_create_agent.md`, `note_conception_pause_agents.md`) plutôt que les laisser en suspens.

## Livrables produits ou modifiés
- Hors dépôt kit (`jeu_espace`) : `.claude/CLAUDE.md`, `.claude/zones.md`, `.claude/commands/start.md`, `.claude/commands/close.md`, `_contexte/contexte.md`, `_contexte/signals.md`, `ollama_call.py`, `_docs/protocole_vibecoding.md`, `AGENTS.md`. Commit initial fait dans ce repo.
- `DEPLOYMENTS.md` (hors git) : entrée ajoutée pour jeu_espace / orchestrateur / v3.3.
- `.claude/commands/create_agent.md` : corruption corrigée.
- `ameliorations_create_agent.md`, `note_conception_pause_agents.md` : commités cette session (contenu de sessions antérieures, non modifié).
- `CHANGELOG.md` : entrée v3.4.

## Hypothèses validées / invalidées
- EN ATTENTE : gap `GEMINI.md` (action P1) toujours ouvert, non retraité — jeu_espace n'en avait pas besoin.
- INVALIDE : les clôtures précédentes n'avaient pas réellement tout commité malgré leur message — `create_agent.md`/`ameliorations_create_agent.md` restaient en souffrance.

## Prochaine étape exacte
Sur jeu_espace : décider si `/create_agent` est lancé pour `codeur` et `design`. Sur le kit : surveiller les résidus non commités aux prochaines clôtures.

## Question bloquante pour la session suivante
Aucune

# Session du 2026-07-31 (init Open_Code_Apprentissage)

## Décisions prises
- `/init_projet` exécuté sur `D:\ServOMorph\Open_Code_Apprentissage` (zone `orchestrateur`, repo déjà sous git) — reformulation + questions préalables avant lancement, conformément à la demande explicite de l'utilisateur dans le fichier `but du projet.txt` du projet cible.
- 3 agents validés pour ce projet après discussion (pas de création lancée cette session) : `notes`, `NARRATEUR`, `data`.
- `GEMINI.md` créé manuellement sur demande explicite, hors procédure standard `/init_projet` (qui ne gère qu'`AGENTS.md`) — gap consigné en action ouverte.

## Livrables produits ou modifiés
- Hors dépôt kit (`Open_Code_Apprentissage`) : `.claude/CLAUDE.md`, `.claude/zones.md`, `.claude/commands/start.md`, `.claude/commands/close.md`, `_contexte/contexte.md`, `_contexte/signals.md`, `ollama_call.py` (modèle par défaut `gemma4:12b`), `AGENTS.md`, `GEMINI.md`, `_DOCS/protocole_vibecoding.md`. Commit initial fait dans ce repo.
- `DEPLOYMENTS.md` (hors git) : entrée ajoutée pour Open_Code_Apprentissage / orchestrateur / v3.3.
- `README.md` : section "État actuel" corrigée — restait bloquée à v3.2, ne mentionnait pas les ajouts v3.3 (base de connaissances, AGENTS.md) de la session précédente. Correction documentaire, pas de bump (aucun template/commande déployé modifié).
- Aucun fichier de commande/template du kit modifié cette session.

## Hypothèses validées / invalidées
- VALIDE : la procédure de reformulation + questions avant lancement (demandée par l'utilisateur pour ce projet précis) s'intègre sans friction dans `/init_projet` tel qu'il existe.
- EN ATTENTE : la pause de réflexion sur le nombre d'agents avant `/create_agent` n'est pour l'instant qu'un pattern ad hoc suivi manuellement dans cette session, pas une étape formalisée du kit.

## Prochaine étape exacte
Sur Open_Code_Apprentissage : lancer `/create_agent` pour les 3 agents validés (notes, NARRATEUR, data). Sur le kit : session dédiée pour formaliser GEMINI.md dans `/init_projet` et documenter le pattern "pause réflexion agents".

## Question bloquante pour la session suivante
Aucune

# Session du 2026-07-30 (base de connaissances)

## Décisions prises
- Système de base de connaissances `.md` (pattern "progressive disclosure" : `INDEX.md` catalogue + docs individuels, jamais de suppression, archivage à la place) validé — d'abord implémenté dans Moulin du Sud (agent `documentation`), puis généralisé au kit.
- `/close` (template) : nouvelle étape 7 conditionnelle proposant une entrée/MAJ dans `DOCUMENTATION/` en fin de session, jamais automatique (confirmation utilisateur requise, la zone fermée n'a pas la main sur le dossier d'une autre zone).
- `AGENTS.md` introduit comme équivalent `CLAUDE.md` pour agents non-Claude — jamais créé automatiquement : `/init_projet` (Q7) et `/update` (étape 7) posent la question à chaque fois, sautée en mode batch, jamais écrasé s'il existe déjà.
- Kit bumpé en v3.3.

## Livrables produits ou modifiés
- `templates/.claude/commands/close.md` : étape 7 (base de connaissances), renumérotation 8→13.
- `templates/.claude/CLAUDE.md`, `.claude/CLAUDE.md` (Moulin du Sud) : section "Base de connaissances" ajoutée.
- `templates/AGENTS.md` : nouveau template.
- `.claude/commands/init_projet.md` : Q7 + copie conditionnelle `AGENTS.md`.
- `.claude/commands/update.md` : étape 7 (AGENTS.md optionnel, jamais écrasé), renumérotation 8→11.
- `ameliorations_create_agent.md`, `AGENTS_REGISTRY.md` (hors git) : entrée agent `documentation`.
- Hors dépôt kit (Moulin du Sud) : agent `documentation` créé (`agent_role.md`, `_contexte/`, `DOCUMENTATION/INDEX.md`), `AGENTS.md` créé, `.claude/close.md`/`CLAUDE.md` alignés sur le kit.

## Hypothèses validées / invalidées
- VALIDE (recherche web/GitHub) : la progressive disclosure (`INDEX.md` + docs ciblés) est le pattern documenté en 2026 pour ce cas d'usage, cohérent avec le principe déjà appliqué par `signals.md`/`contexte.md`.
- EN ATTENTE : aucun test réel — `DOCUMENTATION/INDEX.md` de Moulin du Sud est vide, l'étape 7 de `/close` et la question AGENTS.md de `/update`/`/init_projet` n'ont jamais tourné en conditions réelles.

## Prochaine étape exacte
Remplir `DOCUMENTATION/` de Moulin du Sud via `/start documentation` ; tester `/close` sur une autre zone de Moulin du Sud pour valider l'étape 7 en conditions réelles.

## Question bloquante pour la session suivante
Aucune

# Session du 2026-07-30 (agents MAJUSCULES)

## Décisions prises
- `/create_agent` : dossier de l'agent (créé ou converti) normalisé en MAJUSCULES pour la reconnaissance visuelle dans l'arborescence ; l'alias de zone reste en minuscules.
- Mode conversion : si le dossier existant a une casse non conforme, il est renommé (`git mv` si suivi par git) et le chemin mis à jour dans `zones.md` (alias inchangé).
- Kit bumpé en v3.2.

## Livrables produits ou modifiés
- `.claude/commands/create_agent.md` : règle MAJUSCULES ajoutée en [PREFLIGHT], cas de renommage documenté en [ECRITURE] (mode conversion).
- `ameliorations_create_agent.md` : entrée 2026-07-30 (agent `editeur`, crea_zik) — premier test de la règle en mode création.
- Agent `editeur` créé dans `D:\ServOMorph\crea_zik\EDITEUR` (hors dépôt kit), périmètre étendu à `frontend/`/`backend/` sur décision utilisateur.
- `AGENTS_REGISTRY.md` (hors git) : entrée `editeur`.
- `CHANGELOG.md`, `Protocole_start_close_context.md`, `README.md` : synchronisés via `/doc_sync`.

## Hypothèses validées / invalidées
- VALIDE : la règle MAJUSCULES fonctionne en mode création (dossier `EDITEUR` créé directement en majuscules, alias `editeur` dérivé correctement).
- EN ATTENTE : le renommage en mode conversion (dossier existant à la casse non conforme) n'a pas été exercé en conditions réelles — aucun agent minuscule actuel à convertir.

## Prochaine étape exacte
Tester le renommage en mode conversion dès qu'un agent existant à la casse non conforme se présente ; sinon trancher les actions P2 en attente (P7-P10, Lots 2-4, jeu_zombies).

## Question bloquante pour la session suivante
Aucune

# Session du 2026-07-28

## Décisions prises
- README.md : ligne `/doc_sync` ajoutée dans "Ce que ça fait" (omission préexistante comblée).
- Nouvelle section "Tests manuels" dans `CLAUDE.md` (kit + template) : chemin relatif générique `tests_manuels.md`, décision utilisateur après signalement que le chemin absolu jeu_zombies proposé cassait la généricité du template.
- Nouvelle sous-section "Déclencheurs de vérification" dans `CLAUDE.md` (kit + template), suite à une affirmation non vérifiée en session (jeu_zombies déclaré absent de `DEPLOYMENTS.md` sans l'avoir lu).
- Kit bumpé en v3.1.

## Livrables produits ou modifiés
- `README.md` : ligne `/doc_sync` ajoutée.
- `.claude/CLAUDE.md`, `templates/.claude/CLAUDE.md` : sections "Tests manuels" + "Déclencheurs de vérification" ajoutées (miroir vérifié identique).
- `CHANGELOG.md`, `Protocole_start_close_context.md` : entrées v3.1.
- `/doc_sync` exécuté deux fois dans la session, aucun conflit ni asymétrie détecté.

## Hypothèses validées / invalidées
- INVALIDE : affirmation "jeu_zombies n'est pas dans `DEPLOYMENTS.md`" — faux, il y figure (v2.26) ; fichier non lu avant l'affirmation. Corrigé par les nouvelles règles de vérification.

## Prochaine étape exacte
`/update` sur jeu_zombies pour le faire passer de v2.26 à v3.1, reporté par l'utilisateur.

## Question bloquante pour la session suivante
Aucune

# Session du 2026-07-26

## Décisions prises
- `/create_agent` réécrite en phases nommées ancrées, avec mode conversion explicite (P12), analyse `{{STACK}}` conditionnelle (P13) et règle `{{ALIAS_RACINE}}` durcie (P11) — implémentées et documentées (bump majeur v3.0).
- Nouvelle phase `[AUDIT]` ajoutée sur demande utilisateur : analyse à froid de `create_agent.md` elle-même, jamais automatique, Opus imposé, sortie écrite obligatoire.
- Agent `design` créé dans `jeu_zombies/DESIGN` (cas de conversion, traité manuellement) pour couvrir le design artistique/UX du jeu.
- `roadmap_agents.md` Phase 2 : statut corrigé (incohérence pré-existante, sans lien avec cette session).

## Livrables produits ou modifiés
- `.claude/commands/create_agent.md` : réécriture complète (phases + mode conversion + [AUDIT]).
- `templates/agent_role_TEMPLATE.md` : placeholder `{{NOM_AGENT}}`→`{{DOSSIER_AGENT}}`.
- `CHANGELOG.md` (v3.0), `Protocole_start_close_context.md`, `README.md` : synchronisés via `/doc_sync`.
- `ameliorations_create_agent.md` : P11/P12/P13 marquées implémentées, entrée agent `design` ajoutée.
- `AGENTS_REGISTRY.md` (hors git) : entrée `design`.
- `jeu_zombies/DESIGN/agent_role.md`, `_contexte/contexte.md`, `_contexte/signals.md` (hors dépôt kit).
- `roadmap_agents.md` : Phase 2 `[EN COURS]`→`[FAIT]`.

## Hypothèses validées / invalidées
- EN ATTENTE : le mode conversion réécrit n'a jamais tourné tel qu'écrit — l'agent `design` était un cas de conversion mais géré manuellement, pas via la procédure `[PREFLIGHT]`/`[ECRITURE]`.

## Prochaine étape exacte
Lancer un Test 3 réel de `/create_agent` en mode conversion pour valider le comportement de la version réécrite, ou trancher P7-P10 restantes.

## Question bloquante pour la session suivante
Aucune
