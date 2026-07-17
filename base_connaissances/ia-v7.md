# IA_V7

## Identité
- Chemin : `D:\ServOMorph\IA_V7`
- Zone : ia_v7
- Version kit : v2.13

## Historique git
- Nombre de commits : 9

- 2026-07-17 31df7f6 close(ia_v7): session 2026-07-17 — correction régression pliage dossiers (double-clic renommage)
- 2026-07-17 7c6b26c close(ia_v7): session 2026-07-17 — rapport renommage traité
- 2026-07-17 2a0e37f close(ia_v7): session 2026-07-17 — benchmark RGPD livré
- 2026-07-17 87111dc close(ia_v7): session 2026-07-17 - rapport de capture traite, planification benchmark /rgpd
- 2026-07-17 e9a550f close(ia_v7): session 2026-07-17 — renforcement de la consigne livrable (DELIVERABLE_INSTRUCTION)
- 2026-07-17 ba07fa6 close(ia_v7): session 2026-07-17 — commande /rgpd (anonymisation PII regex) + capture d'ecran UI vers rapports_erreurs_manuels/
- 2026-07-17 b89170b close(ia_v7): session 2026-07-17 — archivage de roadmap_commandes.md dans _archives/
- 2026-07-17 6e629d3 close(ia_v7): session 2026-07-17 — systeme de commandes /xxx (help, write) + premier commit du code applicatif
- 2026-07-17 acb9536 init: protocole vibecoding — zone ia_v7

## État du working tree (non commité)
```
?? AGENTS.md
?? ollama_call.py
?? tests-perso/doc_test_rgpd_anonymise.md
?? tests-perso/pong.py.md
```

## Contexte stable (_contexte/contexte.md)

# Contexte — ia_v7

## Objectif (immuable sauf décision explicite)
Application autonome pilotant Ollama local : gestion de dossiers et conversations, historique conserve dans une base SQLite dediee, reponses en streaming (extraite du module IA de SerenIA Tech).

## Stack / contraintes techniques (stable, rarement modifié)
Python 3.11+, SQLite, Node.js 20+ et Playwright pour les tests UI, Ollama local

## État actuel (réécrit intégralement à chaque /close)
Commandes disponibles : `/help`, `/write`, `/rgpd` ; l'anonymisation PII fonctionne en mode fichier ou texte.
Le benchmark `/rgpd` repose sur 26 cas synthétiques, atteint 21 cas exactement conformes et verrouille 21 cas obligatoires.
IBAN atypiques, IPv4, cartes, adresses avec ville/code postal et emails à ponctuation Unicode sont couverts par des règles déterministes.
Le renommage des dossiers et conversations est disponible par double-clic ; le clic simple sur un dossier (pliage/dépliage), régressé par l'ajout du renommage, est corrigé mais reste à valider manuellement en app.
Tests verts : 56 pytest lors de la session précédente ; Playwright desktop et mobile validés lors des sessions précédentes.
En attente : validation manuelle du correctif de pliage des dossiers, test manuel `/rgpd` dans l'app, efficacité de `DELIVERABLE_INSTRUCTION` et décisions sur les cas ambigus.

## Décisions structurantes (append only — 10 entrées max, archiver au-delà)
- 2026-07-17 : Initialisation du protocole vibecoding.
- 2026-07-17 : Ajout du système de commandes `/xxx` (parseur, registre, `/help`, `/write`) intercepté avant Ollama.
- 2026-07-17 : Roadmaps terminées archivées dans `_archives/` (avec `index.md` de suivi).
- 2026-07-17 : `/rgpd` en anonymisation regex déterministe (pas de LLM) ; noms détectés uniquement avec civilité.
- 2026-07-17 : Capture d'écran via html2canvas vendorisé (pas de getDisplayMedia) ; PNG dans `rapports_erreurs_manuels/` (`IA_V7_CAPTURES_DIR`).
- 2026-07-17 : `DELIVERABLE_INSTRUCTION` reformulée de façon plus impérative suite à un manquement du modèle ; fallback client-side écarté pour l'instant.
- 2026-07-17 : Le benchmark `/rgpd` devient le garde-fou de non-régression de l'anonymisation déterministe.
- 2026-07-17 : Les cas ambigus (noms sans civilité, pseudonymes, formats obfusqués ou fragmentés) restent hors du périmètre standard.
- 2026-07-17 : Le rapport manuel sur le renommage est clos : cette fonctionnalité était déjà implémentée et testée.
- 2026-07-17 : Correction d'une régression du pliage/dépliage des dossiers introduite par l'ajout du renommage par double-clic (`.ia-dossier-nom` n'avait pas d'`onclick`).

## Signals (_contexte/signals.md)

# Signals — ia_v7   (MAJ 2026-07-17)

## Actions ouvertes
- [P1] Valider manuellement en app le correctif du pliage/dépliage des dossiers (clic simple) et du renommage inline (double-clic), après régression introduite par l'ajout du renommage.
  fait quand: clic simple sur un nom de dossier le replie/déplie, double-clic ouvre le renommage inline, sans régression sur les conversations
  réf: static/js/app.js (iaBrancherArbo, iaClickTimers)
- [P1] Test manuel de `/rgpd` dans l'app lancée (`python run.py`), sur le fichier de démo.
  fait quand: `/rgpd tests-perso/doc_test_rgpd.txt` produit `doc_test_rgpd_anonymise.md` sans PII résiduelle, et le mode texte collé affiche le texte anonymisé
  réf: tests-perso/doc_test_rgpd.txt, src/ia_v7/services/commands.py
- [P2] Vérifier l'efficacité du renforcement de la consigne `DELIVERABLE_INSTRUCTION` (livrables non systématiquement mis en bloc ```livrable``` par le modèle Ollama).
  fait quand: observation sur plusieurs échanges réels (reformulation, traduction, résumé) que le modèle respecte le bloc livrable sans manquement ; sinon envisager fallback client (détection + bouton "convertir en livrable") ou post-traitement serveur
  réf: src/ia_v7/services/chat.py (DELIVERABLE_INSTRUCTION)
- [P2] Décider des extensions `/rgpd` : chemins avec espaces, pseudonymes, noms sans civilité, PII écrites en lettres ou fragmentées.
  fait quand: périmètre standard et éventuel mode strict actés pour chaque cas ambigu
  réf: benchmarks/rapport_rgpd.md, src/ia_v7/services/commands.py

## Questions ouvertes

## Échéances

## Blocages

## Contexte chaud
- `/write` et `/rgpd` : en conversation éphémère, rien n'est persisté ; le texte collé à `/rgpd` avec PII est persisté en historique SQLite dans une conversation normale.
- Le benchmark `/rgpd` est reproductible : 21/26 cas conformes, 24/29 PII absentes littéralement et 21 cas obligatoires verrouillés.
- Les limites `/rgpd` restantes sont les noms sans civilité, pseudonymes et PII écrites en lettres ou fragmentées ; aucun NER ni mode strict n'est implémenté.
- Capture d'écran : `html2canvas` re-rend le DOM (fidélité non pixel-perfect) ; alternative `getDisplayMedia` écartée (prompt à chaque capture, non testable).
- `/start` signale désormais les fichiers présents dans `rapports_erreurs_manuels/` (sans les lire).
- La consigne `DELIVERABLE_INSTRUCTION` est un prompt système, pas du code déterministe : son respect par le modèle local n'est pas garanti même renforcée. Le fallback côté client a été écarté pour l'instant (choix explicite).
- Le renommage de dossiers et conversations est déjà disponible par double-clic ; la validation API est verte.

## Dernière session (2026-07-17)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->
# Session du 2026-07-17

## Décisions prises
- Bug de régression corrigé : le double-clic de renommage sur les dossiers avait supprimé le clic simple de pliage/dépliage.

## Livrables produits ou modifiés
- `static/js/app.js` : ajout d'un `onclick` (délai 220ms) sur `.ia-dossier-nom` pour restaurer le pliage/dépliage au clic simple, en parallèle du `ondblclick` de renommage. Correction connexe : clés de `iaClickTimers` préfixées (`conv-`/`dossier-`) pour éviter une collision d'id entre dossiers et conversations.

## Hypothèses validées / invalidées
- VALIDE (diagnostic) : seul `ondblclick` était branché sur `.ia-dossier-nom`, sans `onclick` équivalent au pattern déjà utilisé pour `.ia-conv-nom` ; le toggle ▸/▾ (14px) restait le seul point cliquable fonctionnel.
- EN ATTENTE : validation manuelle en app que le clic simple replie/déplie et que le double-clic renomme toujours ; test manuel applicatif `/rgpd` ; efficacité de `DELIVERABLE_INSTRUCTION` ; décision de périmètre des cas ambigus `/rgpd`.

## Prochaine étape exacte
Lancer `python run.py`, vérifier au clic simple le pliage/dépliage d'un dossier et au double-clic son renommage inline ; puis reprendre le test manuel `/rgpd` en attente.

## Question bloquante pour la session suivante
Aucune

## Sessions Claude Code (transcripts)

- Dossier : `d--ServOMorph-IA-V7`
- Nombre de sessions : 6
- Période : 2026-07-17 → 2026-07-17

