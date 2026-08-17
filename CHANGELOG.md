# Changelog — claude-vibecoding-kit

Toutes les modifications notables du kit sont consignées ici.
Le détail complet par version reste documenté dans `CHANGELOG.md` (ce fichier).

## v3.28 — 2026-08-17

### Corrigé
- `templates/discord_com/bot.py` : `CHANNEL_ID` comparé en `str` vs `int` (tout message entrant silencieusement ignoré, quel que soit l'état de l'intent) — corrigé par `int(CONFIG["channel_id"])`.
- `templates/discord_com/bot.py` : ordre de priorité dans `on_message` — la vérification `commands.json == idle` court-circuitait `queue.json == waiting`, cassant `claude_bridge.envoyer()`/`discord_loop.py send` dès que `commands.json` était au repos (état normal). Inversé : `queue.json waiting` vérifié en premier.
- Blocage `403 Forbidden — Missing Access` résolu : cause confirmée, bot jamais invité sur le serveur.

### Modifié
- `templates/discord_com/SETUP.md`, `README_DISCORD_COM.md` : étape d'invitation du bot rendue concrète (Application ID + URL OAuth2), dépannage enrichi (`403`, intent, mismatch `channel_id`).

## v3.27 — 2026-08-17

### Ajouté
- `templates/notification/` : notification systray (icône + bulle Windows), alternative à `templates/overlay/` (template 2) — affiche le nom de l'agent/zone et le message, focus automatique de la fenêtre de l'agent au clic (remontée de la chaîne des processus parents jusqu'au premier disposant d'une fenêtre principale), fermeture au clic. Fermeture auto désactivée par défaut (`-DurationSeconds` = 0). Inclut `_commands/afficher_notification.md`.

### Corrigé
- `templates/notification/start_notification.ps1` : bulle non affichée lorsque `ShowBalloonTip` était appelé immédiatement après création de l'icône (ignoré par l'Explorateur Windows) — appel désormais différé de 300ms.

## v3.26 — 2026-08-17

### Ajouté
- `templates/overlay/` : overlay plein écran, opacité réduite, contour néon bleu foncé animé — affiche le nom de l'agent/zone qui l'a déclenché puis « J'ai fini !!! ». Fermeture par `Esc`/clic ou automatique (5s par défaut). Même stack WinForms/PowerShell que `templates/control_PC/`. Inclut `_commands/afficher_overlay.md`.
- `tests_manuels.md` : file d'attente des contrôles manuels non validés (validation de la nouvelle destination `ROBERTO/` d'`/insert_template`, test du template `overlay` en conditions réelles).

### Modifié
- `.claude/commands/insert_template.md` : sans `dossier_destination` fourni, la destination par défaut devient `<projet_cible>/ROBERTO/` (nom fixe, centralise tous les templates insérés) au lieu de la racine du projet cible.

## v3.25 — 2026-08-16

### Ajouté
- `.claude/commands/cherche_fonction.md` : recherche générique d'une fonctionnalité déjà codée dans d'anciens projets, dossiers cibles toujours redemandés à chaque appel.
- `templates/discord_com/` : intégration Discord ↔ Claude Code généricisée depuis `Agents_IA_V2\Templates\_discord_integration\` (bot.py, bot_manager.py, claude_bridge.py, discord_loop.py, docs, commande `/discord_loop`). Commandes autonomes spécifiques au projet source retirées de `bot.py`.

### Corrigé
- Trois incidents de sécurité traités pendant le test du template (token réel affiché en chat puis régénéré par l'utilisateur, token écrit par erreur dans le fichier `.example.json` du template puis restauré en placeholder, token placé hors du dossier gitignored puis déplacé) — aucun n'a atteint l'historique git. `.gitignore` complété (`discord_com/config_bot_discord.json`, `discord_com/bot.pid`).

## v3.24 — 2026-08-16

### Corrigé
- Corruption d'encodage de `templates/control_PC/database/control_pc.sqlite` (table `discoveries`, 6 lignes `appli_tsa_sdi_tdah` du 2026-08-14, accents remplacés par des `?` littéraux). Cause confirmée : insertion manuelle via CLI shell (codepage non-UTF8) — `discover_right_window.py` n'écrit jamais en base (vérifié par lecture du script). 6 lignes irrécupérables supprimées, 5 ré-observées en conditions réelles sur l'application ouverte (captures + clics confirmés) et réinsérées via le module `sqlite3` Python (encodage vérifié correct). Écran Onboarding restant, non ré-observable sans `Reset DB` assumé.

## v3.23 — 2026-08-15

### Ajouté
- `.claude/commands/insert_template.md` : commande générique d'insertion d'un template (`templates/<nom>/`) dans un projet cible — résolution des placeholders `{{NOM_PROJET}}`/`{{ALIAS_PROJET}}`/`{{DATE}}`, jamais d'écrasement silencieux d'un fichier déjà présent, blocage explicite sur token inconnu.
- `templates/roberto/` : template extrait et généricisé depuis `D:\ServOMorph\Roberto2` (MACROS, MASCOTTE, UI_WEB, scripts racine) — écart détecté vs l'inventaire Phase 1 corrigé (deux scripts `MACROS/tester_*_opencode.py` avaient un chemin absolu en dur, remplacé par une résolution relative `Path(__file__)`).

### Corrigé
- Testé de bout en bout sur un projet cible de test : idempotence vérifiée (fichier déjà présent laissé intact), placeholders résolus sans reste, code Python compilable, aucun chemin résiduel vers `Roberto2`. `roadmap_template_roberto.md` close (5/5 phases FAIT).

## v3.22 — 2026-08-15

### Ajouté
- `roadmap_template_roberto.md` : commande générique d'insertion de template + template `roberto` extrait de `D:\ServOMorph\Roberto2` comme cas d'usage. Phase 1 (inventaire fichier par fichier) FAIT : `templates/roberto/analysis/inventaire.md` produit (noyau fonctionnel identifié, dépendances `pywin32`/`pyautogui`/`pywebview`, aucun chemin absolu en dur dans le code Python source).

## v3.21 — 2026-08-15

### Corrigé
- Template `control_PC` validé en conditions réelles sur la fenêtre LinkedIn : journal vivant confirmé (log ajouté visible immédiatement dans le halo), reconnaissance par empreinte confirmée (titre de fenêtre vs signature `control_pc.sqlite`), macro `linkedin.planifier_un_post` déroulée jusqu'à l'écran de confirmation sans déclencher l'action finale — statut passé à `validée` en base.

### Ajouté
- Signal ouvert : corruption d'encodage détectée dans `control_pc.sqlite` (accents perdus sur des lignes `discoveries` du 2026-08-14), à corriger.

## v3.20 — 2026-08-14

### Ajouté
- Template `control_PC` : halo violet autour de la fenêtre contrôlée, arrêt global `Esc`, journal vivant et détection visuelle prudente.
- Organisation de macros par application, workflows composés et schéma SQLite local pour conserver les applications, constats vérifiés et macros validées.
- Macro LinkedIn de préparation d'un post planifié, arrêtée volontairement avant la confirmation finale.

## v3.19 — 2026-08-13

### Phase 6 — Dé-duplication documentaire (FAIT)
- **Défaut ⑥** : `Protocole_start_close_context.md` : 316 lignes de changelog dupliqué (47 % du fichier) remplacées par un renvoi à `CHANGELOG.md`. Version mise à jour (v2.3 → v3.18).
- **Défaut ⑧** : `README.md` § "État actuel" : réduit de 29 lignes (8 versions empilées) à 5 lignes max, aligné sur `contexte.md`, avec renvoi à `CHANGELOG.md`.
- **Défaut ⑦** : `llms.txt` : ajouté les 4 commandes kit-only (`/create_agent`, `/create_com_agents`, `/cherche_meilleure_action`, `/doc_sync`) et le dossier `scripts/` (`backup_file.py`, `deploy_create_memory.py`).
- **Défaut ⑨** : `base_connaissances/INDEX.md` : mention explicite de la date de gel (2026-07-17, 12 projets) + renvoi à `DEPLOYMENTS.md` pour la liste complète (~22 projets).

## v3.18 — 2026-08-13

### Modifié
- Racine du kit nettoyée (16→10 fichiers) suite à un audit structurel : `scripts/` (`backup_file.py`, `deploy_create_memory.py`) et `_archives/` (`roadmap_agents.md`, `note_conception_create_agent.md`, `roadmap_agents_explained.html`) créés ; `TEST_CREATE_AGENT_RESULTS.md` et `ameliorations_create_agent.md` déplacés dans `base_connaissances/`. Références réparées dans `.claude/commands/create_agent.md` et `close.md`. `README.md` § "Structure du kit" réécrit.
- `roadmap_refacto_kit.md` créée : 6 phases pour traiter la cause commune identifiée (vérité dupliquée sur 5 emplacements sans contrôle mécanique) — normalisation LF, `scripts/check_kit.py`, rotation `signals.md`, correctifs de divergence kit/template, dé-duplication documentaire.
- `_contexte/signals.md` : **rotation appliquée** (Phase 4) — 21 anciennes sessions (508→58 lignes, 46→12.6 KB) déplacées vers `_contexte/archive_sessions.md` (544 lignes, 36 KB, format append-only). Seule la dernière session conservée dans `signals.md`. Historique reste consultable via `archive_sessions.md` (non chargé par `/start`).
- `_contexte/archive_sessions.md` : créé, contient les 21 sessions archivées (2026-07-26 → 2026-08-13).
- `.claude/commands/close.md` et `templates/.claude/commands/close.md` : étape 4 mise à jour pour implémenter la rotation automatique (déplacement vers `archive_sessions.md` si >1 session).
- `Protocole_start_close_context.md` : section "Format canonique de `signals.md`" mise à jour avec la documentation de la rotation.

## v3.17 — 2026-08-13

### Ajouté
- `/init_projet` propose désormais, si le projet cible n'est pas sous git, d'automatiser un backup miroir du dossier vers Google Drive à chaque `/close` (nouveau script `backup_project.py`, `rclone sync` avec exclusions standard). Si accepté : le script est copié dans le projet cible et une étape est injectée dans le bloc `SPECIFICITES PROJET` de son `close.md` (avec le `allowed-tools` correspondant).

## v3.16 — 2026-08-13

### Ajouté
- Nouvelle commande `/create_com_agents <chemin_projet_cible>` : installe un mécanisme de communication en étoile agent↔orchestrateur (`_contexte/statut.md` pull écrasé à chaque `/close` d'une zone-agent, `_contexte/messages.md` push purgé à chaque `/start` de la zone destinataire, agrégation automatique des statuts à chaque `/start` racine) dans un projet cible déjà initialisé — unifie 3 mécanismes existants non propagés (`roadmap_messages_zones.md`, `statut.md` ad hoc de Roberto2/MASCOTTE, `synthese_agents.md` de jeu_zombies). Suivie par `roadmap_com_agents.md` (nouveau).
- Pilote réel effectué sur Roberto2 (Phase 2 de la roadmap, en cours).

### Corrigé
- Bug constaté lors du pilote : une étape conditionnelle de `start.md` placée après un paragraphe de synthèse narrative est sautée à l'exécution réelle. Corrigé en plaçant les deux étapes `create_com_agents` adjacentes, tôt dans la procédure (juste après le chargement de charte), documenté dans `create_com_agents.md` pour éviter la régression sur les futures installations.

## v3.15 — 2026-08-12

### Corrigé
- `create_memory.md` manquait à l'étape 3 d'`init_projet.md` (jamais propagé aux nouveaux projets) : ligne ajoutée.
- Déploiement rattrapé sur les 22 projets réels de `DEPLOYMENTS.md` (2 sans dépôt git, `Open_Code_Apprentissage` toujours introuvable) via nouveau script `deploy_create_memory.py`.

## v3.14 — 2026-08-12

### Ajouté
- Sauvegarde automatique de `DEPLOYMENTS.md` vers Google Drive, intégrée à `/close` du kit (étape 12bis, optionnelle, confirmation utilisateur requise, kit uniquement — non propagée au template générique). Script `backup_file.py` (nouveau, racine du kit) : sauvegarde horodatée d'un fichier via `rclone copyto`, réutilise la configuration Google Drive déjà authentifiée. Destination `googledrive:BackUps/claude-vibecoding-kit/`.

### Corrigé
- Corruption locale de `.claude/commands/close.md` (caractère isolé "e" avant l'étape 12) restaurée.

## v3.13 — 2026-08-11

### Ajouté
- Commande locale `/create_agent` créée dans `jeu_espace` (hors dépôt kit) : donne à l'orchestrateur (zone racine) la capacité de créer lui-même des agents dans son projet, sans passer par le kit. Copie autonome — templates `agent_role_TEMPLATE.md` et `_contexte/` embarqués localement — sans écriture dans les fichiers de bookkeeping du kit (`AGENTS_REGISTRY.md`, `ameliorations_create_agent.md`) ni phase `[AUDIT]`. Expérimentation isolée à `jeu_espace`, aucun template du kit modifié, jamais testée en conditions réelles.

## v3.12 — 2026-08-10

### Ajouté
- Agent `review` créé dans `jeu_zombies` (revue de code continue, sans production de code) via `/create_agent`.
- Feature "synthèse agents pour l'orchestrateur" conçue et implémentée en expérimentation, limitée au projet `jeu_zombies` (hors dépôt kit) : chaque zone-agent écrit une synthèse à `/close` dans un fichier partagé, la zone racine la lit à `/start` et propose des actions. Suivie par `roadmap_synthese_agents.md` (jeu_zombies) ; propagation au kit conditionnée au bilan de sa Phase 3.

## v3.11 — 2026-08-08

### Corrigé
- Vérification réelle (fetch + status) des 18 dépôts concernés par le correctif v3.10 : contrairement à l'état déclaré, 13 d'entre eux (robert-ia, Jeu pour Nino, JeGeekUtile, TableauDeBord, IA-TSA, La Rev, IA_V7, jeux_vibecoder, AutoClaude, Projet_de_reve, site_internet_Sereniatech_V2, jeu_espace, Roberto) avaient un commit local jamais poussé. Poussés sur confirmation utilisateur. `Lieux_Hybrides` reste sans upstream, décision antérieure assumée.

## v3.10 — 2026-08-05

### Corrigé
- Propagation v3.9 du `git push` automatique : l'instruction était restée dans le bloc "Spécificités projet" des 18 close.md concernés (15 propagés + 3 zones test antérieures) au lieu d'une étape native numérotée comme dans `close.md` du kit. Corrigée et commitée sur les 18 fichiers ; push laissé en attente de confirmation utilisateur.
- Corruption locale non commitée du `close.md` du kit (étape 11 "Effectuer un commit git" effacée, jamais commitée) détectée et restaurée via `git checkout` en début de session.

## v3.9 — 2026-08-04

### Ajouté
- `git push` automatique (ex-étape 11bis en test) promu en étape native (12) de la procédure `/close` — décision "garder" actée. Intégré à `templates/.claude/commands/close.md` et `.claude/commands/close.md` du kit.

### Modifié
- Propagation du push automatique à 15 projets déployés avec remote git (`close.md` modifié, bloc "Spécificités projet"), commité dans les 15, poussé dans 14 (`Lieux_Hybrides` sans upstream configuré, laissé en commit local sur décision explicite).

## v3.8 — 2026-08-04

### Ajouté
- `git push` automatique (étape 11bis de `/close`) étendu à une 4ème zone en test : `crea_zik` (hors template, hors dépôt kit).

### Corrigé
- `.claude/commands/doc_sync.md` (kit) : corruption pré-existante du frontmatter (`a---` au lieu de `---`) corrigée.

## v3.7 — 2026-08-02

### Ajouté
- `.claude/commands/close.md` (kit uniquement, hors template) : étape 11bis en test — `git push` automatique après le commit. Même ajout appliqué manuellement dans `Appli_TSA_SDI_TDAH` et `VisioAide` (hors dépôt kit). Décision garder/écarter/propager au template à trancher ultérieurement.

## v3.6 — 2026-08-01

### Ajouté
- `templates/GEMINI.md` : nouveau template, équivalent `CLAUDE.md` spécifique à Gemini.
- `.claude/commands/init_projet.md` : nouvelle question 8 proposant la création de `GEMINI.md` (jamais automatique, jamais écrasé s'il existe déjà — même logique que la question 7 sur `AGENTS.md`).
- `.claude/commands/update.md` : étape 7 renommée "AGENTS.md et GEMINI.md (optionnels)", traite désormais les deux fichiers en parallèle (numérotation des étapes inchangée).

## v3.5 — 2026-07-31

### Ajouté
- `.claude/commands/create_agent.md` : nouvelle étape `[SORTIE]` (étape 10) — propose de copier dans le presse-papier un message court de mise à jour pour l'agent racine du projet cible, résumant les agents créés lors de l'appel (une seule fois même en création en lot) ; n'écrit rien dans les fichiers du projet cible. Renumérotation du récapitulatif final (10→11) et de la phase `[AUDIT]` (11→12).

## v3.4 — 2026-07-31

### Corrigé
- `.claude/commands/create_agent.md` : suppression d'une ligne parasite (`" pl"`) introduite accidentellement, corrompant le marqueur de fin de bloc "Spécificités projet".
- Rattrapage de commit : rétrospectives de sessions antérieures (agents notes/narrateur/data sur Open_Code_Apprentissage, agent communication sur Moulin du Sud) restées non commitées malgré des clôtures annoncées comme terminées, désormais intégrées au dépôt.

## v3.3 — 2026-07-30

### Ajouté
- Base de connaissances `DOCUMENTATION/` (pattern "progressive disclosure" : `INDEX.md` catalogue + docs individuels) introduite comme feature générale du kit. `templates/.claude/commands/close.md` : nouvelle étape 7 conditionnelle proposant une entrée/MAJ dans `DOCUMENTATION/` en fin de session (jamais automatique, sur confirmation). `templates/.claude/CLAUDE.md` : nouvelle section "Base de connaissances".
- `templates/AGENTS.md` : nouveau template, équivalent `CLAUDE.md` pour les agents non-Claude (Codex, ChatGPT, Gemini...). Jamais créé automatiquement : `/init_projet` (nouvelle question 7) et `/update` (nouvelle étape 7) le proposent sur confirmation explicite à chaque exécution (sautée en mode batch `all`), et ne l'écrasent jamais s'il existe déjà.

### Modifié
- `.claude/commands/update.md` : renumérotation des étapes 8→11 suite à l'insertion de l'étape 7 (AGENTS.md).
- `templates/.claude/commands/close.md` : renumérotation des étapes 8→13 suite à l'insertion de l'étape 7 (base de connaissances).

## v3.2 — 2026-07-30

### Modifié
- `.claude/commands/create_agent.md` : le dossier de l'agent (créé ou converti) est désormais normalisé en MAJUSCULES pour une meilleure reconnaissance visuelle dans l'arborescence du projet ; l'alias de zone reste en minuscules. En mode conversion, un dossier existant à la casse non conforme est renommé (`git mv` si suivi par git) et le chemin mis à jour dans `zones.md`.

## v3.1 — 2026-07-28

### Ajouté
- `CLAUDE.md` (kit + template) : nouvelle section "Tests manuels" — utiliser `tests_manuels.md` (racine du projet) comme file d'attente exhaustive des contrôles manuels non validés ; ajout systématique d'un test en attente, suppression immédiate de sa section une fois validé, vidage intégral du fichier quand tous les tests sont validés.
- `CLAUDE.md` (kit + template), section "Honnêteté" : nouvelle sous-section "Déclencheurs de vérification" — règles mécaniques (nommer un fichier implique l'avoir lu dans la session, chiffres de `signals.md`/`contexte.md` datés donc à revérifier, vocabulaire de vérification réservé à un appel d'outil réel, absence d'information à questionner plutôt qu'affirmer), suite à une affirmation non vérifiée faite en session.

## v3.0 — 2026-07-26

### Modifié
- `.claude/commands/create_agent.md` réécrite : procédure structurée en phases nommées (`[PREFLIGHT]`/`[COLLECTE]`/`[ECRITURE]`/`[SORTIE]`/`[AUDIT]`), tous les renvois internes utilisent désormais l'ancre de phase plutôt qu'un numéro d'étape. Une seule interaction utilisateur groupée en `[COLLECTE]` au lieu de plusieurs questions séquentielles.
- Mode **conversion** formalisé (P12) : détection explicite d'une zone déjà enregistrée dans `zones.md` pointant vers le dossier demandé ; ne crée que ce qui manque (`agent_role.md`, `_contexte/`), ne touche jamais `zones.md` ni un `signals.md` déjà présent, propose la mise à jour de la section stack de `contexte.md` seulement si vide/générique.
- Analyse de `{{STACK}}` (P13) conditionnée au mode et à l'état de `contexte.md` — plus de scan systématique du projet cible en mode conversion si le contexte existe déjà.
- Règle `{{ALIAS_RACINE}}` (P11) : ne retient la première ligne de `zones.md` que si elle correspond effectivement à la racine du projet cible ; sinon la ligne "Zone parente" est omise de la charte générée plutôt que laissée vide.
- Nouvelle phase `[AUDIT]` : analyse à froid de `create_agent.md` elle-même (pertinence des ajouts, économie de tokens, construction, régression), déclenchée uniquement sur demande explicite et seulement sur le modèle Opus ; sortie obligatoire dans `ameliorations_create_agent.md`.
- `templates/agent_role_TEMPLATE.md` : placeholder `{{NOM_AGENT}}` renommé en `{{DOSSIER_AGENT}}` (doublon supprimé, un seul placeholder pour le nom du dossier).

## v2.26 — 2026-07-21

### Ajouté
- `AGENTS_REGISTRY.md` (racine du kit, hors git — cf. `.gitignore`) : registre centralisé de tous les agents créés, tous projets confondus (alias, projet, chemin absolu, rôle, date de création, verdict, retex résumé avec renvoi vers `TEST_CREATE_AGENT_RESULTS.md`/`ameliorations_create_agent.md`). Peuplé rétroactivement avec les 4 agents existants (com, memory, web, linkedin).
- `/create_agent` : nouvelle étape 10, ajoute automatiquement une ligne à `AGENTS_REGISTRY.md` à chaque création d'agent (verdict initial "à évaluer", à mettre à jour manuellement ensuite). Étape de rétrospective Opus renumérotée en étape 11.

## v2.25 — 2026-07-21

### Ajouté
- `/cherche_meilleure_action [décision]` (kit uniquement, non propagée) : commande d'aide à la décision. Charge le contexte réel de la zone (`signals.md`, `contexte.md`, `roadmap`), énumère les options candidates sans en inventer, les évalue selon des critères explicites (impact, effort, risque, dépendances, urgence, alignement), applique les garde-fous d'honnêteté de `CLAUDE.md` (méta-travail, prompt theater, option sans valeur), recommande une action et se termine par une question de confirmation à l'utilisateur. Modèle : Opus.

### Corrigé
- `/create_agent` : première ligne du frontmatter corrompue (`u---`) rétablie en `---` — le YAML de la commande était cassé.

## v2.24 — 2026-07-21

### Ajouté
- `/close` : nouvelle étape 11, bilan des résidus non commités (`git status --short`) en fin de session, purement informatif — sans action automatique (Lot 1, proposition 1.3).
- `CLAUDE.md` : section "Données sensibles" activée — `/init_projet` pose désormais une question dédiée (Q6) et `/update` la pose une fois si la section n'a jamais été renseignée ; rappel générique ajouté ("jamais de secret en dur, stockage hors git, accès via service/API") (Lot 1, proposition 1.7).
- `CLAUDE.md` : nouvelle section "Modèles recommandés" (Haiku start / Sonnet close / Opus plans-debug / Opus refacto-migration structurelle) (Lot 1, proposition 2.4).
- `CLAUDE.md` : section Roadmap, "Contenu des phases" — un benchmark reproductible à N cas verrouillés peut servir de gate de phase pour un comportement critique difficile à tester unitairement (Lot 1, proposition 2.5).

### Modifié
- `/close` étape 4 : les sections vides de `signals.md` (Questions ouvertes, Échéances, Blocages, Contexte chaud) sont désormais omises entièrement plutôt qu'affichées sans puce ; recréées seulement si elles redeviennent non vides.
- `/close` étape 5 : limite de 5 lignes par entrée de "Décisions structurantes" dans `contexte.md`.
- `templates/_contexte/signals.md` : sections vides retirées du gabarit initial (ne restent que "Actions ouvertes" et "Dernière session").

## v2.23 — 2026-07-21

### Modifié
- `/create_agent` réécrite pour s'exécuter toujours depuis le kit et prendre le projet cible en premier argument (`<chemin_projet_cible> <dossier> [rôle]`), au lieu de résoudre le working directory courant. Décision utilisateur : la commande n'est plus jamais copiée dans les projets cibles.
- Nouvelle étape 2b : vérifie que le `start.md` du projet cible charge bien la charte automatiquement avant de créer l'agent ; sinon avertit et demande confirmation explicite (P6, friction observée lors du premier test end-to-end réel — friction déjà rencontrée sur La Rev, corrigée après coup via `/update`).
- `agent_role_TEMPLATE.md` : précise que l'agent peut mettre à jour son propre `_contexte/` via `/start`/`/close`.

### Supprimé
- `templates/.claude/commands/create_agent.md` (copie miroir devenue incohérente avec la commande qui ne se copie plus dans les projets). `doc_sync.md` et `update.md` mis à jour en conséquence.

### Ajouté
- `TEST_CREATE_AGENT_RESULTS.md` (racine du kit) : journal réutilisable pour la période de test end-to-end de `/create_agent`, un test par entrée.
- Premier test end-to-end réel de `/create_agent` (agent `web` créé dans La Rev) : détail dans `TEST_CREATE_AGENT_RESULTS.md` et `ameliorations_create_agent.md`. Propositions P6 (implémentée) à P10 (différées, hors périmètre incrémental) consignées.
- `/update` exécuté sur La Rev (v2.13 → v2.22 au moment de l'update), corrigeant l'absence de l'étape 2b dans son `start.md`.

## v2.22 — 2026-07-21

### Modifié
- Phase 4 de `roadmap_agents.md` (rétrospective bootstrap agents) : `create_agent.md` (kit + template) capte désormais le **rôle durable** de l'agent (rejette une formulation en tâche unique, friction observée sur COM) et demande si l'agent doit **écrire hors de son dossier** (friction observée sur MEMORY/`backend/`). Nouveau placeholder `{{ECRITURE_ETENDUE}}` dans `agent_role_TEMPLATE.md`.
- `ameliorations_create_agent.md` créé à la racine du kit : journal des frictions et améliorations de la commande (sortie concrète, décision 6 du cadrage).

### Corrigé
- `templates/.claude/commands/update.md` désynchronisé de sa paire miroir `.claude/commands/update.md` depuis la Phase 3 (mention des zones-agents absente côté template) — resynchronisé.
- `# Changelog` de `Protocole_start_close_context.md` : entrées manquantes v2.19, v2.20, v2.21 rajoutées (miroir de `CHANGELOG.md`).

## v2.21 — 2026-07-21

### Ajouté
- Phases 2 et 3 de `roadmap_agents.md` closes : agents COM et MEMORY créés dans robert-ia (mise en pratique) ; commande `/create_agent <dossier> [rôle]` généralisée dans le kit (`templates/.claude/commands/create_agent.md` + `templates/agent_role_TEMPLATE.md`, charte générique paramétrée par rôle, contrôle d'unicité d'alias, étape finale de rétrospective écrite dans `ameliorations_create_agent.md`).
- `start.md` (kit + template) : nouvelle étape 2b, chargement automatique de `agent_role.md` avant `signals.md` pour les zones-agents.
- `update.md` : documente explicitement que `/update` ne touche jamais les `_contexte/`/`agent_role.md` des zones-agents (déjà vrai de fait, désormais noir sur blanc).

### Décidé
- `/create_agent` n'est pas propagée par `/update` — reste dans le kit, copie manuelle selon les projets où elle est voulue.

## v2.20 — 2026-07-20

### Ajouté
- Phase 1 de `roadmap_agents.md` close : `note_conception_create_agent.md` livre l'analyse de la mécanique zones/start/close/update, l'arborescence d'un agent (`<dossier>/agent_role.md` + `<dossier>/_contexte/`), le format de la charte, et l'insertion prévue de l'étape 2b dans `start.md` (chargement automatique de la charte).
- Nouveau dossier `_docs/` à la racine du kit, dédié à la documentation générée ; première pièce : `roadmap_agents_explained.html`, vulgarisation de `roadmap_agents.md` pour un lecteur novice.

## v2.19 — 2026-07-20

### Ajouté
- `roadmap_agents.md` : cadrage et roadmap d'un futur template de création d'agent (« zone à rôle » : dossier + charte `agent_role.md` + `_contexte/` propre, piloté par `/start`/`/close`), expérimenté sur robert-ia. 6 décisions de conception actées après revue critique croisée (Fable 5) : nommage anti-collision `agent_role.md`, préservation des `_contexte/` de sous-zones par `/update`, unicité d'alias dans `zones.md`, chargement automatique de la charte par `/start`, périmètre déclaratif, rétrospective à sortie écrite obligatoire.

## v2.18 — 2026-07-17

### Corrigé
- `/update` réécrit désormais la version et la date d'une ligne `DEPLOYMENTS.md` existante au lieu de l'ignorer (friction F1) ; `DEPLOYMENTS.md` corrigé manuellement pour les lignes déjà fausses.
- `/update` migre automatiquement (sans poser de question) tout contenu "Spécificités projet" détecté, y compris les sections spécifiques placées hors de la zone dédiée.

### Ajouté
- `/update` : étape de vérification post-update (7 contrôles) avant la confirmation finale, avec statut `⚠️` en cas d'échec.

## v2.17 — 2026-07-17

### Ajouté
- `base_connaissances/` : audit reproductible des 11 projets déployés (historique git, `_contexte/`, roadmaps, mémoire projet, transcripts Claude Code) — `INDEX.md`, une fiche par projet, `ANALYSE.md` (frictions et patterns terrain) et `PROPOSITIONS_AMELIORATION.md` (propositions priorisées, non mises en œuvre).

## v2.16 — 2026-07-17

### Corrigé
- `/doc_sync` ignore désormais le contenu des blocs `SPECIFICITES PROJET` de `start.md` et `close.md` lors de la comparaison des miroirs ; ces règles locales ne sont plus signalées comme une divergence.

## v2.15 — 2026-07-17

### Ajouté
- Suite `unittest` du lanceur Ollama : sérialisation des prompts, sélection du modèle, sortie UTF-8 et gestion des erreurs. Un appel réel est disponible sur demande via `OLLAMA_LIVE_TEST=1`.

### Corrigé
- `ollama_call.py` applique un délai maximal de 60 secondes et remonte explicitement les réponses JSON invalides ou inattendues du service local.

## v2.14 — 2026-07-17

### Corrigé
- La délégation Ollama repose désormais sur `ollama_call.py`, un lanceur Python compatible Windows, sans dépendance à Bash ou WSL. La sortie est écrite en UTF-8 pour éviter les erreurs d'encodage de la console Windows.
- `/init_projet`, `/update`, `CLAUDE.md` et la documentation propagent et utilisent ce nouveau lanceur. Les fichiers bytecode Python sont ignorés par Git.

## v2.13 — 2026-07-17

### Modifié
- `/close` : si le `README.md` du projet cible n'existe pas encore, il est désormais créé automatiquement (sections objectif, stack, structure, état actuel) au lieu de demander confirmation à l'utilisateur.

### Corrigé
- `/update` : suppression des références obsolètes au mécanisme de substitution `{{ALIAS}}`/`{{RACINE}}` dans `start.md`/`close.md` (ces fichiers lisent `zones.md` directement depuis une version antérieure du kit, la doc `/update` ne le reflétait plus). Correction de l'objectif, du message de confirmation (étape 9) et de la liste de fichiers copiés en mode initialisation (étape 2), qui mentionnaient `init_projet.md`/`update.md` comme fichiers propagés vers les projets cibles alors qu'ils restent dans le kit.

## v2.12 — 2026-07-17

### Ajouté
- `/init_projet` : nouvelle étape listant, avant la confirmation finale, tous les fichiers créés ou modifiés au cours de l'initialisation, sous forme de liens cliquables (chemin absolu).

## v2.11 — 2026-07-17

### Modifié
- `/init_projet` : inversion du sens de lancement — la commande se lance désormais depuis le repo du kit (working directory), avec en argument le chemin absolu du projet cible à initialiser (au lieu de se lancer depuis le projet cible avec le chemin du kit en argument). Toutes les opérations de copie référencent désormais explicitement ce chemin, et `DEPLOYMENTS.md`/`CHANGELOG.md` sont lus directement à la racine du kit.

## v2.10 — 2026-07-14

### Corrigé
- `ollama_call.sh` : suppression de la dépendance à `jq` (absente sur certains postes). Le script encode/décode le JSON via `python`/`python3` (déjà requis ailleurs dans le kit), avec remontée explicite des erreurs HTTP Ollama (ex: modèle introuvable) au lieu d'un échec silencieux.
- `/update` : la procédure ne copiait jamais `ollama_call.sh` vers les projets cibles — corrigé, il est désormais inclus dans la table de copie et les commits de sauvegarde/mise à jour.

### Modifié
- `ollama_call.sh` : modèle par défaut changé de `gemma3:4b` (jamais installé) à `gemma4:e4b`. Reste surchargeable via `OLLAMA_MODEL`.

## v2.9 — 2026-07-03

### Modifié
- `/update` : inversion du sens de lancement — la commande se lance désormais depuis le repo du kit (working directory), avec en argument le chemin absolu du projet cible à mettre à jour (au lieu de se lancer depuis le projet cible avec le chemin du kit en argument). Toutes les opérations sur le projet cible référencent désormais explicitement ce chemin (`git -C <cible> ...`), et `DEPLOYMENTS.md`/`CHANGELOG.md` sont lus directement à la racine du kit.

## v2.8 — 2026-07-03

### Ajouté
- `CLAUDE.md` : nouvelle section "Spécificités projet", préservée intégralement par `/update` (comme "Données sensibles").
- `start.md` / `close.md` : bloc `SPECIFICITES PROJET` en fin de fichier, préservé par `/update` (extraction/réinjection). Convention de référencement explicite par étape/section pour limiter la perte de position logique.
- `/update` : si la zone "Spécificités projet" est absente (fichier jamais migré), détection par diff contre le fichier kit et question à l'utilisateur (migrer / ignorer / décider ligne par ligne) — y compris en mode `/update all`, qui se met en pause ciblée sur le projet concerné sans interrompre le reste du batch.
- `.claude/commands/close.md` (kit) : lancement de `/doc_sync` ajouté entre l'étape 8 et l'étape 9, via la zone "Spécificités projet".

## v2.7 — 2026-07-03

### Ajouté
- `/update` : nouveau mode batch `/update all` — met à jour tous les projets listés dans `DEPLOYMENTS.md` en une seule commande, exécution silencieuse avec résumé final, sans interrompre le batch en cas de projet introuvable ou non-git.

## v2.6 — 2026-07-03

### Ajouté
- `CLAUDE.md` : nouvelle section "Roadmap" — critères de création, format canonique (nommage, phase `[EN COURS]` unique, checkpoint `/compact`), et sous-section "Contenu des phases" (tests intégrés à la phase fonctionnelle, phase de refacto dédiée uniquement si dette technique visible). Règle appliquée en permanence via CLAUDE.md plutôt que via une commande dédiée, pour couvrir les demandes de roadmap formulées en cours de session.

## v2.5 — 2026-07-03

### Ajouté
- `/close` : nouvelle étape 9 — vérification explicite que les étapes 3 à 8 ont bien été exécutées (pas seulement planifiées) avant le commit, avec exécution immédiate de toute commande de génération non encore lancée. Étapes 9-10 deviennent 10-11. Corrige un cas observé où une étape de régénération listée dans une commande `/close` dérivée avait été committée après coup plutôt qu'avant.

## v2.4 — 2026-06-29

### Modifié
- Pattern roadmap unifié : `roadmap_*.md` → `roadmap*.md` dans `/start`, `/close` et `Protocole_start_close_context.md`.

## v2.3 — 2026-06-21

### Ajouté
- Commande `/update` : met à jour les fichiers de protocole (`start.md`, `close.md`, `init_projet.md`) dans un projet déjà initialisé, sans toucher aux données projet.
- `zones.md` : table centralisée des alias → dossiers réels, copiée par `/init` et `/update`.

### Modifié
- `/close` : utilise désormais la zone **implicite** (working directory courant) si aucun argument n'est fourni, alignant le comportement avec `/start`.
- Build : `DEPLOYMENTS.md` ajouté au `.gitignore` pour permettre à chaque clone du kit d'avoir son propre registre de déploiements.

## v2.2 — 2026-06-20

### Modifié
- `/start` (étape 5) : `signals.md` est désormais affiché **intégralement**, sans résumé ni reformulation. La synthèse précédente pouvait omettre des actions ouvertes, échéances ou blocages ; l'affichage intégral garantit qu'aucun signal de pilotage n'est perdu au démarrage. Les autres fichiers (roadmap, contexte) restent résumés en complément.
- Fichiers touchés : `templates/.claude/commands/start.md`, `Protocole_start_close_context.md`.

## v2.1 — 2026-06-12

### Corrigé
- `ollama_call.sh` : correction du bug d'échappement JSON. Le payload est désormais construit avec `jq -n --arg` et passé à curl via `-d @-`.

### Modifié
- Suppression du champ "Résumé de démarrage" du manifest (écrit par `/close`, jamais lu par `/start`). Le manifest se réduit à la liste "Charger au démarrage".
- Fusion de `derniere_session.md` dans `signals.md` (section "Dernière session").
- `/close` passe de 10 à 9 étapes ; `/start` charge 2 fichiers au lieu de 3 (hors roadmap).
- Frontmatter des commandes : `start.md` (`model: haiku`), `close.md` (`model: sonnet` + `allowed-tools` git).

## v2 — 2026

### Ajouté
- Section "Structure `_contexte/`" : formats canoniques stricts pour `_manifest.md`, `contexte.md`, `signals.md`.
- Commande `/init` : initialisation basée sur un kit de templates avec substitution de placeholders.

### Modifié
- `/start` : ordre de lecture hiérarchisé (`signals.md` → `contexte.md` → roadmap).
- `/close` : gestion des priorités [P1/P2], section "Contexte chaud", structure fixe de `contexte.md` avec règle d'archivage, étape git renforcée.
- Table des modèles : "Debug → Sonnet" (Fable retiré, non disponible publiquement).
- `ollama_call.sh` : vérification de disponibilité du service, gestion d'erreur, modèle `gemma3:4b`.
