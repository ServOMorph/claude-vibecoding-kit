# Roadmap — Workflow quotidien (com_telephone)
Objectif : le workflow vocal `workflow quotidien` (`templates/roberto/AUTOMATISATIONS/workflows/quotidien.md`) analyse l'avancement des projets listés dans `DEPLOYMENTS.md` et propose 3 actions prioritaires du jour, que l'utilisateur valide par la voix.
Créée le : 2026-08-19

---

## Cadrage (à lire avant Phase 1, ne pas supprimer)

**Décisions actées** :
- L'ordre des projets est un fichier édité manuellement (pas de commande vocale de réordonnancement pour l'instant).
- L'ordre doit pouvoir évoluer dans le temps sans reclasser tout le fichier à chaque fois.

**Ce qui reste ouvert** (à trancher en Phase 2) :
- Source de l'avancement réel par projet : lecture de `signals.md`/`contexte.md` de chaque projet (précis, coûteux) vs fraîcheur git (léger, approximatif).
- Format du score d'envie (Phase 3) et formule de combinaison rang + avancement + envie → 3 actions concrètes.

---

## Phase 1 — Structure d'ordre des projets [FAIT]
- [x] Créer `templates/roberto/AUTOMATISATIONS/workflows/quotidien/ordre_projets.md` : liste des projets de `DEPLOYMENTS.md` classés par rang, édition manuelle uniquement.
- [x] Initialiser avec l'ordre neutre actuel de `DEPLOYMENTS.md` (l'utilisateur a réordonné ensuite à la main).
- [x] Documenter la règle de garde : un projet présent dans `DEPLOYMENTS.md` mais absent de `ordre_projets.md` est signalé par le workflow, jamais classé automatiquement.
- [x] UI de réordonnancement par glisser-déposer (`workflows/quotidien/UI/`, mode sombre, style repris de `UI_WEB`), bouton VALIDER qui enregistre dans `ordre_projets.md` (`py -3.11 UI/server.py`).

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 2 — Lecture de l'avancement réel [FAIT]
- [x] Tranché : lecture de la section "État actuel" de `_contexte/contexte.md` de chaque projet (réécrite intégralement à chaque `/close`, plus fiable que la fraîcheur git). 24/25 projets disposent de ce fichier ; `Open_Code_Apprentissage` fait exception (état signalé comme inconnu).
- [x] `avancement.py` : lit `ordre_projets.md` + `DEPLOYMENTS.md`, imprime l'état actuel de chaque projet dans l'ordre de priorité. Testé sur les 25 projets (exit 0, extraction correcte, un seul "état inconnu" attendu).
- [x] `quotidien.md` mis à jour pour exécuter `avancement.py` et en restituer un résumé via `POST /send`.

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 3 — Score combiné priorité + envie [TODO]
- [ ] Ajouter une note d'envie ponctuelle par projet (éditable à la main, séparée du rang).
- [ ] Définir la formule rang + avancement + envie → 3 actions concrètes (pas juste 3 noms de projets).

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 4 — Intégration dans quotidien.md [TODO]
- [ ] Le workflow lit `ordre_projets.md` + avancement + `DEPLOYMENTS.md`, calcule le top 3, envoie la proposition via `POST /send`, attend le choix vocal de l'utilisateur.

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 5 — Tests [TODO]
- [ ] Test bout en bout via com_telephone (message vocal réel, réponse reçue sur le téléphone).
