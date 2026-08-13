# Roadmap — Communication agent ↔ orchestrateur (`create_com_agents`)
Objectif : commande `create_com_agents` installant un mécanisme de communication en étoile (agent↔orchestrateur) dans un projet cible, unifiant les 3 mécanismes existants non propagés (`roadmap_messages_zones.md` conçu non implémenté, `statut.md` ad hoc de Roberto2/MASCOTTE, `synthese_agents.md` expérimental de jeu_zombies).
Créée le : 2026-08-12

---

## Cadrage (à lire avant Phase 1, ne pas supprimer)

**Topologie retenue (décision utilisateur du 2026-08-12)** : étoile agent↔orchestrateur. Pas de communication agent↔agent directe — un agent qui doit prévenir un autre agent passe par l'orchestrateur.

**Deux canaux, un par sens** :

| | `_contexte/statut.md` (agent → orchestrateur) | `_contexte/messages.md` (orchestrateur → agent) |
|---|---|---|
| Modèle | Pull, écrasé (pas append) | Push, purgé après lecture |
| Écriture | Étape native ajoutée à `close.md`, uniquement si `agent_role.md` présent dans le dossier | Directe, par une session côté racine, dès qu'un message doit être transmis — pas de nouvelle commande |
| Lecture | Étape native ajoutée à `start.md`, uniquement quand la zone résolue est la racine (comme la détection de jeu_zombies : dossier contenant directement `.claude/zones.md`) — agrège le `statut.md` de chaque zone-agent listée dans `zones.md` | Étape native ajoutée à `start.md`, pour toute zone — affichée avant `signals.md`, puis vidée |
| Contenu | Format structuré fixe (roadmap active, phase, avancement, bloqué, prochaine action, date) | Format compact `[AAAA-MM-JJ] <message>` (repris de `roadmap_messages_zones.md`) |

**Simplification par rapport à `synthese_agents.md`** : chaque zone n'écrit que dans son propre `_contexte/` (déjà autorisé par la charte standard — "peut mettre à jour son propre `_contexte/` via `/start` et `/close`"). Aucune exception de périmètre à déclarer dans `agent_role.md`, contrairement au fichier central partagé de jeu_zombies.

**Portée de `create_com_agents`** : modifie uniquement `start.md` et `close.md` du projet cible (jamais `zones.md`/`agent_role.md`), sur le modèle d'exécution de `/create_agent` (vit dans le kit, jamais copiée, `<chemin_projet_cible>` en argument, idempotente — détecte une installation déjà présente).

**Cas particulier identifié** : MASCOTTE (Roberto2) a déjà un `statut.md` ad hoc, format proche mais pas identique (champ "Dernier test visuel" spécifique, pas de champ "Mis à jour"). À détecter et proposer une conversion plutôt qu'écraser silencieusement.

---

## Phase 1 — Rédaction de `create_com_agents.md` (kit) [FAIT]
- [x] Créer `.claude/commands/create_com_agents.md` (phases [PREFLIGHT]/[ECRITURE]/[SORTIE], sur le modèle de `create_agent.md`).
- [x] Définir précisément le format `statut.md` et son insertion dans `close.md` (étape native, ancrage explicite).
- [x] Définir précisément les 2 étapes ajoutées à `start.md` (lecture/purge `messages.md` pour toute zone, agrégation `statut.md` pour la racine) — corrigé en Phase 2 : les deux étapes doivent être adjacentes et placées tôt (2c/2d), jamais l'une isolée après un paragraphe de synthèse narrative (bug constaté en conditions réelles).
- [x] Gérer la détection d'installation déjà présente (idempotence) et le cas `statut.md` ad hoc non conforme (conversion proposée, pas d'écrasement).

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 2 — Pilote sur Roberto2 [EN COURS]
- [x] Lancer `create_com_agents` sur `D:\ServOMorph\Roberto2` (installation réelle, jamais testée avant commit dans le kit).
- [x] Vérifier la détection du `statut.md` ad hoc existant de MASCOTTE (non conforme, signalé — champ "Dernier test visuel" en trop, "Mis à jour" manquant, pas converti automatiquement comme prévu par la commande).
- [x] Bug trouvé et corrigé (2026-08-13) : premier `/start roberto2` réel a sauté l'étape d'agrégation `statut.md` (placée en 4c, après la synthèse narrative de `signals.md`). Déplacée en `2d`, adjacente à `2c` (qui avait fonctionné) — corrigée dans Roberto2 et dans `create_com_agents.md` (kit).
- [ ] Retester `/start roberto2` pour valider le correctif 2d.
- [ ] `/close mascotte` réel : vérifier la mise à jour automatique de `statut.md`.
- [ ] Écrire un message réel dans `MASCOTTE/_contexte/messages.md` depuis la racine, puis `/start mascotte` : vérifier affichage + purge.
- [ ] Bilan : garder tel quel, ajuster, ou écarter.

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 3 — Bilan et propagation (si validé) [TODO]
- [ ] Décider du sort de `roadmap_messages_zones.md` (design kit→zone superseded par ce mécanisme) et de `roadmap_synthese_agents.md` de jeu_zombies (mécanisme concurrent, jamais testé en Phase 2 de sa propre roadmap).
- [ ] Si retenu : propager dans `templates/.claude/commands/start.md`, `templates/.claude/commands/close.md`.
- [ ] `/doc_sync` : `CHANGELOG.md`, `README.md`, `Protocole_start_close_context.md`.
- [ ] Décider si une propagation `/update` immédiate aux projets existants est utile ou si le mécanisme se diffuse au fil des `/update` normaux.
