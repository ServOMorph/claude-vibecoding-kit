# Archive des décisions — claude-vibecoding-kit

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
