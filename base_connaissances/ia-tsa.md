# IA-TSA

## Identité
- Chemin : `D:\ServOMorph\IA-TSA`
- Zone : ia-tsa
- Version kit : v2.12

## Historique git
- Nombre de commits : 12

- 2026-07-17 642d4d7 update: protocole vibecoding — zone ia-tsa — kit v2.13
- 2026-07-17 4c855c9 close(IA-TSA): session 2026-07-16 — roadmap sélection utilisateur + logging horodaté implémentée
- 2026-07-17 ed56fea init: protocole vibecoding — zone ia-tsa (zone supplémentaire)
- 2026-07-16 4eaee4c close(IA-TSA): session 2026-07-16 — roadmap sélection utilisateur + logging horodaté
- 2026-07-08 2f0171c close(IA-TSA): session 2026-07-08 — activite Ecris et ecoute + Piper TTS local
- 2026-07-08 567c7bd close(IA-TSA): session 2026-07-08 — piste touches différenciées implémentée, docs/ réorganisé + explorateur Markdown
- 2026-06-19 2a89c4a close(IA-TSA): session 2026-06-19 — projet_pedagogique.md créé (8 sections, ancrage HAS 2026)
- 2026-06-19 789200b close(IA-TSA): session 2026-06-19 — timer visuel codé (5 visuels, durée réglable, sélecteur custom)
- 2026-06-19 27022eb close(IA-TSA): session 2026-06-19 — 2 activités codées maison + onglet retour terrain
- 2026-06-19 c8596bc close(IA-TSA): session 2026-06-19 — doc référence autisme+informatique créé (synthèse web sourcée)
- 2026-06-19 37c9bc8 close(IA-TSA): session 2026-06-19 — Flask UI port 4110, docs/web enrichi activités cause-effet
- 2026-06-19 3d8744f close(IA-TSA): session 2026-06-19 — init repo public, licence MIT, .gitignore, README

## État du working tree (non commité)
```
M UI/__pycache__/routes.cpython-311.pyc
?? "A ajouter.txt"
?? UI/__pycache__/__init__.cpython-313.pyc
?? UI/__pycache__/routes.cpython-313.pyc
?? ollama_call.py
```

## Contexte stable (_contexte/contexte.md)

# Contexte — IA-TSA

## Objectif (immuable sauf décision explicite)
Recherche appliquée — comment l'IA peut apporter des aides aux enfants atteints de TSA (trouble du spectre autistique). Projet porté par un éducateur ayant un accès régulier à une salle informatique pour travailler individuellement avec les enfants.

## Stack / contraintes techniques (stable, rarement modifié)
- Web UI : Flask 3.0 (Blueprint, app factory, Jinja2), port 4110, autoreload via run.py
- Python : module UI/ (majuscules) — import `from UI import create_app`
- CSS : charte SéréniaTech (variables CSS, dark mode, reduced motion)
- Contraintes : RGPD stricte (aucune donnée sur les enfants ni l'établissement), repo opensource, licence MIT

## État actuel (réécrit intégralement à chaque /close)
Flask UI opérationnelle (run.py, port 4110). Sidebar : Recherches (explorateur docs/), Activités, Terrain.
4 activités codées, toutes instrumentées en logging d'événements (sans contenu saisi par l'enfant).
roadmap.md implémentée intégralement : sélection utilisateur à l'ouverture (`/utilisateur`, admin par défaut non supprimable, création/renommage/suppression), session Flask 4h, logging horodaté unifié (`data/logs/activite_AAAA-MM.jsonl` : nav auto + événements fins via `/api/log-event`), retours terrain désormais associés à un utilisateur.
Flux testé via curl (redirection, cycle utilisateur complet, génération des logs) ; test en séance réelle restant à faire.
Prochaine étape : tester le flux complet en séance (sélection utilisateur, activités, retour terrain).

## Décisions structurantes (append only — 10 entrées max, archiver au-delà)
- 2026-06-19 : Timer visuel codé (3e activité) — 5 visuels, durée réglable sur stage, sélecteur custom dans panneau réglages.
- 2026-06-19 : docs/projet_pedagogique.md créé — document de présentation pédagogique complet (8 sections, ancrage HAS 2026).
- 2026-07-08 : Cause-effet — piste "touches différenciées" (Espace/Entrée/Ctrl) retenue après analyse littérature, plutôt que la variation progressive du stimulus.
- 2026-07-08 : Cause-effet — restriction aux 3 touches actives ; toute autre touche est ignorée (prévisibilité, réduction du bruit d'interaction).
- 2026-07-08 : docs/ réorganisé par catégories (pedagogie/, reference/, reference/analyses/, web/) pour une architecture scalable, sans accents dans les noms de dossiers.
- 2026-07-08 : Onglet Recherches transformé en explorateur arborescent de tout docs/ avec rendu Markdown (au lieu du listing plat de docs/web/ seul).
- 2026-07-08 : 4e activité "Écris et écoute" ajoutée — saisie texte, historique de lignes, relecture et édition indépendantes par ligne.
- 2026-07-08 : Piper TTS retenu pour la synthèse vocale (moteur neuronal local, gratuit, voix fr_FR-siwis-medium) plutôt que l'API navigateur Web Speech, pour un rendu plus proche d'une voix humaine.
- 2026-07-16 : Sélection utilisateur à l'ouverture de l'UI (admin par défaut, sans mot de passe, création/suppression/renommage) + logging horodaté unifié (navigation + événements d'activité) actés en roadmap, en attente d'implémentation.
- 2026-07-16 : roadmap.md implémentée (session suivante) — modèle users.json, routes /utilisateur, hooks before/after_request, /api/log-event, instrumentation des 4 activités ; testé fonctionnellement via curl.

## Signals (_contexte/signals.md)

# Signals — IA-TSA   (MAJ 2026-07-16)

## Actions ouvertes
- [P1|ouvert] Tester en séance le flux complet sélection utilisateur + logging (roadmap.md implémentée, testée uniquement via curl)
- [P1|ouvert] Tester "Écris et écoute" en séance (qualité voix Piper, intérêt pédagogique, ergonomie clavier/historique)
- [P1|ouvert] Tester l'activité cause-effet modifiée (3 touches Espace/Entrée/Ctrl, effets distincts) en séance + noter retours terrain
- [P1|ouvert] Tester les activités choix-a-deux et timer en séance + noter retours dans l'onglet Terrain
- [P2|ouvert] Ajuster les paramètres par défaut selon retours terrain + coder activités suivantes (picto CAA, séquence avant/après)
- [P3|ouvert] Approfondir docs/reference/autisme_informatique.md : PDF complets (HAS, arXiv, NCBI), nuances détection/diagnostic IA

## Questions ouvertes
- Quel retour sur la voix Piper (fr_FR-siwis-medium) et sur l'activité "Écris et écoute" en séance ?
- Quelles réactions observées en séance sur les 3 effets différenciés (cercle/carré/losange) et la restriction aux 3 touches ?
- Quel visuel du timer est le plus lisible pour les enfants ?

## Échéances

## Blocages

## Contexte chaud
- Flask UI opérationnelle sur port 4110 (run.py, autoreload)
- Import module : `from UI import` (majuscules — piège Windows/Python)
- Activités ouvrent dans un nouvel onglet (target="_blank")
- Son WebAudio : première interaction utilisateur obligatoire (politique navigateur)
- Sélection utilisateur opérationnelle : `/utilisateur` (before_request global, hors assets statiques), `data/users.json` (admin par défaut non supprimable, création/renommage/suppression), session Flask (`secret_key` statique local, expiration 4h)
- Logging horodaté actif : `data/logs/activite_AAAA-MM.jsonl` — nav automatique (after_request) + événements fins via `POST /api/log-event` (appelé par `ActivityCore.logEvent()` dans les 4 scripts d'activité + ouverture/sortie auto via sendBeacon)
- RGPD logging : jamais le texte saisi (ex. "Écris et écoute") ni contenu enfant dans les logs, uniquement route/utilisateur/horodatage/nom d'événement
- data/retours_terrain.json : 4 retours enregistrés ; nouvelles entrées incluent désormais "user" (entrées antérieures non migrées)
- docs/ réorganisé par catégories : pedagogie/, reference/ (+ reference/analyses/), web/ — ne plus utiliser les anciens chemins docs/projet_pedagogique.md ni docs/doc_reference_autisme_cree_par_claude.md
- Onglet Recherches = explorateur arborescent de tout docs/ (route /recherches/docs), rendu Markdown en HTML à l'affichage
- Activité cause-effet : seules Espace/Entrée/Ctrl déclenchent un effet (cercle/carré/losange, sons distincts) ; autres touches ignorées
- 4e activité "Écris et écoute" : saisie texte -> historique de lignes, chaque ligne relisible (bouton haut-parleur) et modifiable (bouton crayon, Entrée valide sans relecture auto, Échap annule)
- TTS via Piper (endpoint POST /api/tts, UI/routes.py) : modèle voix dans voices/fr_FR-siwis-medium.onnx, gitignoré — à retélécharger sur chaque poste via `python -m piper.download_voices fr_FR-siwis-medium --download-dir voices`
- Piège poste de travail : deux installations Python coexistent (Windows Store 3.11 et Program Files Python313) ; le serveur réel tourne sous Python313 — toujours installer les deps pip (`pip install -r requirements.txt`) dans cet environnement précis, pas dans celui que `python` résout par défaut dans un terminal

## Dernière session (2026-07-17)
# Session du 2026-07-17

## Décisions prises
- Aucune décision structurante (session d'incident + vérification)

## Livrables produits ou modifiés
- run.py : restauré depuis le dernier commit (fichier vidé accidentellement, contenu identique à HEAD)

## Hypothèses validées / invalidées
- VALIDE : le changement d'utilisateur en cours de session est déjà implémenté (lien sidebar → /utilisateur, sélection d'un utilisateur existant fonctionnelle) — aucun code à ajouter
- EN ATTENTE : test en séance réelle du flux complet (reporté depuis le 2026-07-16, toujours pas fait)

## Prochaine étape exacte
Reprendre les tests terrain en attente (flux sélection utilisateur + logging, "Écris et écoute", cause-effet, timer/choix-a-deux).

## Question bloquante pour la session suivante
Aucune

## Archive des décisions (_contexte/archive_decisions.md)

# Archive des décisions structurantes — IA-TSA

Décisions archivées depuis `contexte.md` (append only, plus anciennes en premier).

- 2026-06-19 : Initialisation du protocole vibecoding.
- 2026-06-19 : Licence MIT retenue. Repo public poli (README, LICENSE, .gitignore, suppression brouillon docs/).
- 2026-06-19 : Flask 3.0 retenu comme stack web. UI opérationnelle port 4110.
- 2026-06-19 : Import module UI en majuscules (case-sensitive Python/Windows — piège à éviter).
- 2026-06-19 : doc_reference_autisme créé — base de données autisme + informatique (web sourcé, 7 sections).
- 2026-06-19 : socle activités codées maison retenu (pas d'apps tierces) — 2 activités + onglet Retour terrain opérationnels.

## Roadmaps (titres et statuts de phases)

### roadmap.md

# Roadmap — IA-TSA

## Sessions Claude Code (transcripts)

- Dossier : `d--ServOMorph-IA-TSA`
- Nombre de sessions : 15
- Période : 2026-06-19 → 2026-07-17

