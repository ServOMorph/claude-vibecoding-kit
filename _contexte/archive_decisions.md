# Archive des décisions — claude-vibecoding-kit

## Décisions archivées le 2026-08-19 (session assistant vocal com_telephone)

- 2026-08-17 : `templates/discord_com/` débloqué et validé de bout en bout. Cause du `403 Forbidden` confirmée : bot jamais invité sur le serveur — résolu via URL OAuth2 (`SETUP.md`/`README_DISCORD_COM.md` mis à jour avec l'étape concrète, Application ID + URL). Message Content Intent activé côté portail (le toggle a tenu cette fois, cause de la non-persistance antérieure toujours non identifiée). Deux bugs réels trouvés et corrigés dans `bot.py` (template + copie de test) : (1) `CHANNEL_ID` comparé en `str` vs `int` — tout message entrant silencieusement ignoré ; (2) ordre de priorité dans `on_message` — `commands.json == idle` court-circuitait `queue.json == waiting`, cassant `claude_bridge.envoyer()` dès que `commands.json` était au repos (état normal), reproduit puis corrigé (queue vérifiée en premier). Flux entrant/sortant complet (`!ping`, `!help`, commande libre, `notify`, `notifier()`, `envoyer()`) et cycle de vie `bot_manager.py` testés en conditions réelles. Kit v3.28.
- 2026-08-17 : template `templates/notification/` créé (template 2, alternative à `overlay` = template 1) : notification systray (icône + bulle Windows) au lieu d'un overlay plein écran, focus automatique de la fenêtre de l'agent au clic (remontée de la chaîne des processus parents), fermeture auto désactivée par défaut (`-DurationSeconds` = 0, portée limitée à ce template). Bug constaté et corrigé (bulle non affichée, `ShowBalloonTip` appelé trop tôt) mais correctif et comportement de disparition de la bulle pas encore validés par l'utilisateur. Kit v3.27.

## Décisions archivées le 2026-08-18 (session réorientation ROBERTO + agent roberto)

- 2026-08-16 : corruption d'encodage de `control_pc.sqlite` corrigée. Cause confirmée : insertion manuelle via CLI shell (codepage non-UTF8), `discover_right_window.py` n'écrit jamais en base (vérifié par lecture du script). 6 lignes `discoveries` corrompues supprimées (irrécupérables), 5 ré-observées en conditions réelles sur `appli_tsa_sdi_tdah` ouverte et réinsérées via `sqlite3` Python. Règle retenue : toute écriture future en base passe par le module Python, jamais par un `INSERT` shell. Onboarding restant (nécessite `Reset DB`). Kit v3.24.

## Décisions archivées le 2026-08-18 (session roadmap multi-compte + délégation ROBERTO)

- 2026-08-15 : `roadmap_template_roberto.md` close (5/5 phases FAIT). Commande `/insert_template <chemin_projet_cible> <nom_template> [dossier_destination]` créée (générique, réutilisable pour `control_PC` et futurs templates). Template `roberto` extrait et généricisé (30 fichiers hors `analysis/`). Écart détecté vs l'inventaire Phase 1 : deux scripts `MACROS/tester_*_opencode.py` avaient un chemin absolu en dur, corrigés par résolution relative. Testé de bout en bout sur un projet cible de test : idempotence, placeholders, code Python compilable, aucun chemin résiduel vers `Roberto2` — bilan garder tel quel. Kit v3.23.
- 2026-08-15 : `roadmap_template_roberto.md` créée — aucune commande n'automatise actuellement l'insertion d'un template (`control_PC` copié manuellement, vérifié par grep). Portée : commande générique `.claude/commands/` d'insertion de `templates/<nom>/` dans un projet cible + template `roberto` extrait de `D:\ServOMorph\Roberto2` comme cas d'usage. Traçage dans `templates/roberto/` (décidé par l'utilisateur). Phase 1 (inventaire de Roberto2) FAIT : noyau fonctionnel identifié (`MACROS/`, `UI_WEB/`, `MASCOTTE/`), aucun chemin absolu en dur dans le code Python, dépendances `pywin32`/`pyautogui`/`pywebview` sans `requirements.txt` source. Kit v3.22.

## Décisions archivées le 2026-08-18 (session mémoire scopée par zone)

- 2026-08-15 : template `control_PC` validé en conditions réelles sur la fenêtre LinkedIn — journal vivant confirmé, reconnaissance par empreinte confirmée (titre de fenêtre vs signature `control_pc.sqlite`), macro `linkedin.planifier_un_post` déroulée jusqu'à l'écran de confirmation sans déclencher l'action finale, statut passé à `validée`. Corruption d'encodage détectée en marge (accents perdus, lignes `discoveries` du 2026-08-14), non corrigée. Kit v3.21.
- 2026-08-14 : template `control_PC` ajouté : halo de fenêtre violet avec arrêt `Esc`, journal de session affiché dans la barre basse, détection visuelle prudente, base SQLite locale et macros indexées par application. Parcours LinkedIn de planification documenté jusqu'avant programmation finale ; aucune donnée personnelle ni publication enregistrée. Kit v3.20.
- 2026-08-13 : `roadmap_refacto_kit.md` close (6/6 phases FAIT), exécutée en autonomie par un agent devstral puis relue et clôturée par Claude (l'agent n'a pas pu lancer `/close` lui-même, problème de connexion). Kit v3.19, `check_kit.py` au vert.
- 2026-08-13 : audit structurel du kit (9 défauts identifiés) — vérité dupliquée sur 5 emplacements (`.claude/commands/`, `templates/.claude/commands/`, `README.md`, `CHANGELOG.md`, `Protocole_start_close_context.md`) sans aucun contrôle mécanique. Racine nettoyée (16→10 fichiers, `git mv` vers `scripts/`/`_archives/`/`base_connaissances/`, références réparées, `README.md` § Structure réécrit). `roadmap_refacto_kit.md` créée : normalisation LF, `check_kit.py` (contrôle mécanique), rotation `signals.md`, correctifs de divergence kit/template, dé-duplication doc. Kit v3.18.
- 2026-08-13 : `/init_projet` propose un backup Google Drive automatique (`backup_project.py`, rclone sync) pour les projets sans git — Q4bis, injection conditionnelle de l'étape dans le `close.md` du projet cible. Init de `Capafy_AI` (zone `capafy_ai`), mis sous git a posteriori par l'utilisateur, commit initial + push faits. Kit v3.17.
- 2026-08-13 : commande `create_com_agents` créée (mécanisme en étoile agent↔orchestrateur, `statut.md`/`messages.md`) et installée en pilote réel sur Roberto2. Bug trouvé en conditions réelles : étape conditionnelle placée après une synthèse narrative dans `start.md` est sautée à l'exécution — corrigée par un placement adjacent à une étape courte déjà fiable, appliquée dans Roberto2 et dans la commande source du kit. Kit v3.16.
- 2026-08-12 : étape 12bis de `/close` (sauvegarde `DEPLOYMENTS.md` vers Google Drive) validée en conditions réelles pour la première fois — confirmation demandée, upload déclenché via `backup_file.py`, fichier horodaté déposé dans `googledrive:BackUps/claude-vibecoding-kit/`.
- 2026-08-11 : commande locale `/create_agent` créée dans `jeu_espace` — donne à l'orchestrateur (zone racine) la capacité de créer lui-même des agents dans son projet, sans passer par le kit. Copie autonome (templates embarqués localement, pas de bookkeeping kit, pas de phase `[AUDIT]`). Test isolé, aucun template du kit modifié ; propagation à trancher après retour d'expérience (~2026-08-25). Kit v3.13.

## Décisions archivées le 2026-08-15 (session clôture roadmap_template_roberto)

- 2026-08-08 : vérification réelle (fetch + status) des 18 dépôts + le kit — 13 dépôts avaient un commit local jamais poussé malgré l'apparence de clôture du 2026-08-05. Poussés sur confirmation utilisateur, action P1 close. `Lieux_Hybrides` reste sans upstream, assumé. Kit v3.11.
- 2026-08-10 : agent `review` créé dans `jeu_zombies` (revue de code continue) via `/create_agent`. Feature "synthèse agents pour l'orchestrateur" (agents écrivent à `/close`, racine lit à `/start` et propose des actions) conçue et implémentée en expérimentation limitée à `jeu_zombies` uniquement — pas de modification des templates du kit, propagation différée au bilan de sa roadmap dédiée. Kit v3.12.

## Décisions archivées le 2026-08-15 (session validation control_PC)

- 2026-08-12 : sauvegarde automatique de `DEPLOYMENTS.md` vers Google Drive ajoutée à `/close` du kit (étape 12bis, optionnelle) — script `backup_file.py` (rclone `copyto`, réutilise la config déjà authentifiée), destination `googledrive:BackUps/claude-vibecoding-kit/`. Kit v3.14.
- 2026-08-12 : `create_memory.md` ajouté à l'étape 3 d'`init_projet.md` (gap : fichier jamais propagé aux nouveaux projets) et déployé sur les 22 projets réels de `DEPLOYMENTS.md` via nouveau script `deploy_create_memory.py`. Clôture faite a posteriori après un `/clear` accidentel avant `/close` — synthèse reconstruite depuis le commit `57a3522` et l'état réel des dépôts (4 projets recommis lors de la clôture : `site_internet_Sereniatech_V2`, `jeu_espace`, `Participation_GitHub`, `Roberto2`). Kit v3.15.

## Décisions archivées le 2026-08-13 (session audit + refacto racine du kit)

- 2026-08-04 : décision "garder" actée pour `git push` automatique après validation réelle sur les 4 zones test. Promu en étape native (12) de `close.md` (kit + template). Propagé à 15 projets déployés avec remote git. Kit v3.9.
- 2026-08-05 : correctif de la propagation v3.9 — l'instruction `git push` était restée dans le bloc "Spécificités projet" des 18 close.md concernés au lieu d'une étape native, corrigée. Corruption locale du `close.md` du kit restaurée. Kit v3.10.

**Note (2026-08-13) :** la décision 2026-08-04 (`crea_zik`, Kit v3.8) présente à la fois dans "Décisions structurantes" actives de `contexte.md` et déjà archivée ci-dessous (session backup Google Drive) — doublon pré-existant, non recréé ici, retiré de la liste active sans nouvelle copie.

## Décisions archivées le 2026-08-13 (session backup Google Drive projets sans git)

- 2026-08-04 : `git push` automatique (étape 11bis) propagé à une 4ème zone, `crea_zik`. Corruption pré-existante corrigée dans `.claude/commands/doc_sync.md` (frontmatter `a---`). Kit v3.8.

## Décisions archivées le 2026-08-12 (session conception messages kit→zone)

- 2026-07-31 : `/init_projet` exécuté sur Open_Code_Apprentissage (zone `orchestrateur`) avec reformulation + questions préalables demandées explicitement par l'utilisateur avant tout lancement. 3 agents validés par échange (notes, NARRATEUR, data) avant toute création. Gap découvert : `/init_projet` ne gère pas `GEMINI.md` (créé manuellement sur demande).
- 2026-07-31 : `/init_projet` exécuté sur `jeu_espace` (zone `orchestrateur`) — jeu 3D Godot, `AGENTS.md` créé. Corruption accidentelle corrigée dans `create_agent.md` ; rattrapage de commits de sessions antérieures restées non commitées.
- 2026-07-31 : Agents `dev`/`design` créés dans jeu_espace via `/create_agent`. `/create_agent` étape `[SORTIE]` enrichie d'un message presse-papier pour l'agent racine. Kit v3.5.
- 2026-08-01 : `GEMINI.md` intégré à `/init_projet` (Q8) et `/update` (étape 7 étendue), sur le même modèle qu'`AGENTS.md`. Étape 7 de `/close` (base de connaissances) validée en conditions réelles pour la première fois sur Moulin du Sud. Kit v3.6.
- 2026-08-02 : `git push` automatique (étape 11bis de `/close`) ajouté en test sur 3 zones avec remote GitHub (kit, `Appli_TSA_SDI_TDAH`, `VisioAide`), hors template. Kit v3.7.

## Décisions archivées le 2026-08-12 (session sauvegarde automatique DEPLOYMENTS.md)

- 2026-07-30 : `/create_agent` — dossier de l'agent normalisé en MAJUSCULES (création et conversion), alias inchangé (minuscules) — décision utilisateur pour la reconnaissance visuelle dans l'arborescence. Testé en mode création sur l'agent `editeur` (crea_zik, périmètre étendu à `frontend/`/`backend/`). Kit v3.2.
- 2026-07-30 : base de connaissances `DOCUMENTATION/` (pattern progressive disclosure, validé par recherche web) adoptée comme feature générale du kit — d'abord implémentée dans Moulin du Sud (agent `documentation`), puis dans `templates/.claude/commands/close.md` (étape 7 conditionnelle) et `templates/.claude/CLAUDE.md`. `AGENTS.md` introduit en parallèle comme équivalent CLAUDE.md pour agents non-Claude, jamais créé automatiquement (`/init_projet` Q7, `/update` étape 7, toujours sur confirmation). Kit v3.3.

## Décisions archivées le 2026-08-05 (session correctif étape push native + corruption close.md kit)

- 2026-07-28 : `CLAUDE.md` (kit + template) enrichi de deux sections — "Tests manuels" (`tests_manuels.md`, chemin relatif générique après refus d'un chemin absolu jeu_zombies-spécifique) et "Déclencheurs de vérification" sous "Honnêteté" (règles mécaniques suite à une affirmation non vérifiée en session sur le contenu de `DEPLOYMENTS.md`). Kit v3.1.

## Décisions archivées le 2026-08-04 (session décision garder + propagation git push à 15 projets)

- 2026-07-26 : agent `design` créé dans `jeu_zombies/DESIGN` (design artistique/UX complet du jeu) — cas de conversion d'une zone déjà enregistrée, traité manuellement ; `contexte.md` alimenté avec la stack réelle du projet (Godot 4.5, GDD) plutôt que le stub générique.

## Décisions archivées le 2026-08-04 (session propagation git push crea_zik + correctif doc_sync.md)

- 2026-07-21 : nouvelle commande `/cherche_meilleure_action` créée (kit uniquement, modèle Opus) — décision utilisateur : sortie = recommandation unique + question de confirmation, jamais de décision tranchée seule par la commande.
- 2026-07-21 : `AGENTS_REGISTRY.md` créé pour centraliser agents + retex — décision utilisateur : un seul fichier, hors git (paths locaux, repo public MIT), au prix de ne pas partager les retex si le kit s'ouvre un jour à d'autres contributeurs.
- 2026-07-26 : `/create_agent` réécrite en phases nommées ancrées (au lieu de numéros d'étape) par un agent externe, relue et corrigée. P11/P12/P13 implémentées. Décision utilisateur : ajouter une phase `[AUDIT]` dédiée à l'analyse à froid de la commande elle-même, jamais automatique, Opus imposé.

## Décisions archivées le 2026-07-31 (session étape presse-papier /create_agent + agents dev/design jeu_espace)

- 2026-07-21 : Test 2 `/create_agent` — conversion d'une zone déjà mature (`linkedin`, SérénIATech_dev) en agent, cas non couvert par la procédure standard ; traité par déviation manuelle validée par l'utilisateur (charte seule, `_contexte/`/`zones.md` existants préservés). Frictions P11/P12 consignées, non tranchées.

## Décisions archivées le 2026-07-31 (session /init_projet jeu_espace)

- 2026-07-21 : Lot 1 de `PROPOSITIONS_AMELIORATION.md` implémenté (1.3, 1.7, 2.4, 2.5, 3.1) — décision utilisateur de tout retenir, aucune n'a justifié d'être écartée. Kit v2.24.

## Décisions archivées le 2026-07-31 (session init Open_Code_Apprentissage)

- 2026-07-21 : premier test end-to-end réel de `/create_agent` (agent `web`, La Rev) — friction majeure trouvée (charte silencieusement non chargée si `start.md` cible obsolète) et corrigée (P6). Ouverture d'une période de test tracée dans `TEST_CREATE_AGENT_RESULTS.md`.

## Décisions archivées le 2026-07-30 (session base de connaissances)

- 2026-07-21 : décision utilisateur — `/create_agent` ne se copie plus jamais dans les projets cibles, elle s'exécute toujours depuis le kit avec le projet cible en argument. Revient sur la décision Phase 3 (copie manuelle projet par projet).

## Décisions archivées le 2026-07-30 (session /create_agent MAJUSCULES + agent editeur)

- 2026-07-21 : Phase 3 de `roadmap_agents.md` close — `/create_agent` généralisée (kit + template), charte générique `agent_role_TEMPLATE.md`, étape 2b dans `start.md`, `update.md` documente l'exclusion des zones-agents. Décision utilisateur : `/create_agent` n'est pas propagée par `/update`, copie manuelle projet par projet.
- 2026-07-21 : Phase 4 de `roadmap_agents.md` close (rétrospective sur Opus) — constat que `/create_agent` n'a jamais tourné réellement ; P1 (rôle durable) et P2 (question périmètre d'écriture, `{{ECRITURE_ETENDUE}}`) implémentées suite à des frictions observées sur COM/MEMORY ; validation end-to-end reportée. Sortie écrite dans `ameliorations_create_agent.md`.

## Décisions archivées le 2026-07-26 (session create_agent v3.0 + agent design)

- 2026-07-20 : dossier `_docs/` introduit à la racine du kit, à la demande de l'utilisateur, comme emplacement pour la documentation générée (première pièce : `roadmap_agents_explained.html`).
- 2026-07-21 : Phase 2 de `roadmap_agents.md` close — agents COM et MEMORY créés manuellement dans robert-ia (avant l'existence de `/create_agent`) ; MEMORY a produit un prompt de passation (`prompt_multi_contexte_knowledge.md`) plutôt que de modifier `backend/` directement, périmètre déclaratif préservé.

## Décisions archivées le 2026-07-21 (session /cherche_meilleure_action + AGENTS_REGISTRY)

- 2026-07-20 : nouvelle initiative « template de création d'agent » — un agent = une zone à rôle (dossier + charte `agent_role.md` + `_contexte/` propre, enregistrée dans `zones.md`, pilotée par `/start`/`/close`), explicitement pas un subagent Claude Code. Expérimentée d'abord sur robert-ia (agents COM et MEMORY pour la démo du 25/07/2026), généralisée ensuite en commande `/create_agent`.
- 2026-07-20 : revue critique du plan par un second modèle (Fable 5) avant tout code, 6 décisions de conception actées : charte `agent_role.md` (anti-collision `AGENTS.md`), `/update` n'touche jamais les `_contexte/` de sous-zones, unicité d'alias contrôlée dans `zones.md`, charte chargée automatiquement par `/start`, périmètre déclaratif, rétrospective de fin de commande avec sortie écrite obligatoire.
- 2026-07-20 : Phase 1 de `roadmap_agents.md` close — note de conception écrite, arborescence d'agent et format de charte figés, insertion de l'étape 2b dans `start.md` actée pour la Phase 3.

## Décisions archivées le 2026-07-21 (session Lot 1 PROPOSITIONS_AMELIORATION)

- 2026-07-17 : `/update` migre désormais automatiquement tout contenu "Spécificités projet" détecté (lignes ou sections orphelines) sans poser de question — décision actée après un cas réel sur robert-ia (sections opérationnelles placées hors de la zone dédiée).
- 2026-07-17 : `/update` intègre une étape de vérification post-update (7 contrôles) avant confirmation ; échec → statut `⚠️` avec détail, en individuel comme en mode batch.

## Décisions archivées le 2026-07-21 (session test create_agent)

- 2026-07-17 : proposition 1.1 (F1) implémentée — `/update` réécrit désormais version/date d'une ligne `DEPLOYMENTS.md` existante au lieu de l'ignorer.

## Décisions archivées le 2026-07-21

- 2026-07-14 : `ollama_call.sh` réécrit sans dépendance `jq` (python), modèle par défaut `gemma4:e4b` ; `/update` corrigé pour propager ce fichier ; 6 projets déployés synchronisés en v2.10
- 2026-07-17 : `/init_projet` inversé — même logique que `/update` (lancement depuis le kit, argument = projet cible) ; ajout d'une étape de liste des fichiers modifiés avant confirmation ; TableauDeBord initialisé comme 7e projet déployé
- 2026-07-17 : `/close` crée automatiquement le README du projet cible s'il est absent (au lieu de demander confirmation)
- 2026-07-17 : `/update` corrigé — suppression du mécanisme de substitution `{{ALIAS}}`/`{{RACINE}}` obsolète dans la doc (start.md/close.md lisent `zones.md` directement) ; correction des mentions erronées d'`init_projet.md`/`update.md` comme fichiers copiés vers les projets cibles
- 2026-07-17 : `/update all` exécuté sur les 9 projets déployés (kit v2.13), IA-TSA migré vers le mécanisme "Spécificités projet" (jamais fait auparavant)
- 2026-07-17 : `ollama_call.py` remplace le lanceur Bash pour une délégation Ollama compatible Windows sans Bash ni WSL.
- 2026-07-17 : `ollama_call.py` durci (timeout 60s, gestion JSON invalide/réponse inattendue) + suite `unittest` dédiée ; `/doc_sync` exclut les blocs "Spécificités projet" de la comparaison start.md/close.md.
- 2026-07-17 : `base_connaissances/` créé comme audit reproductible de la flotte de projets déployés (git + `_contexte/` + roadmaps + transcripts) ; `PROPOSITIONS_AMELIORATION.md` priorise 16 correctifs/évolutions du kit, en attente de décision sur la mise en œuvre.

## Décisions archivées le 2026-07-17 (session base_connaissances)

- 2026-07-03 : Règles de roadmap intégrées à CLAUDE.md (pas de commande /roadmap) pour s'appliquer même hors démarrage de commande explicite.
- 2026-07-03 : Contenu des phases de roadmap précisé — tests intégrés à la phase fonctionnelle, refacto en phase dédiée seulement si dette technique visible et trop large pour la suivante.
- 2026-07-03 : `/update all` ajouté (mode batch), pause ciblée par projet uniquement si migration "Spécificités projet" nécessaire.
- 2026-07-03 : Mécanisme "Spécificités projet" créé (CLAUDE.md + start.md/close.md) pour protéger les lignes propres à un projet lors de `/update`, avec migration assistée par diff quand la zone est absente.
- 2026-07-03 : `/update` inversé — se lance depuis le repo du kit, argument = chemin absolu du projet cible (au lieu de l'inverse).

## Décisions archivées le 2026-07-17

- 2026-01-15 : Multizone support implémenté.
- 2026-04-10 : Adoption token economy stricte (max 3 sections par file).
- 2026-06-21 : v2.3 release — amélioration robustesse close/start.
- 2026-06-29 : JeGeekUtile v2.3 déployé avec support C:\Users\raph6\Documents.
