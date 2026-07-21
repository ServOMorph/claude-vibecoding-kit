# Améliorations — /create_agent

Journal des frictions et améliorations de la commande `/create_agent` et de la charte `agent_role.md`.
Sortie concrète de l'étape 10 de la commande et des rétrospectives de `roadmap_agents.md` (décision 6 du cadrage).

## 2026-07-21 — Rétrospective Phases 1-3 (bootstrap, agents COM + MEMORY de robert-ia)

### Constat central
La commande `/create_agent` n'a jamais été exécutée. Les agents COM et MEMORY ont été créés
manuellement en Phase 2, avant que la commande existe (Phase 3). Le template est donc validé sur
le principe, pas sur l'exécution end-to-end. Validation réelle = créer un 3e agent avec la commande.

### Frictions observées (création manuelle)
- Conflit périmètre/rôle (MEMORY) : rôle = ajuster le contexte de robert (code dans `backend/`),
  charte par défaut interdit `backend/`. Détecté en cours de route, résolu par pivot manuel
  (prompt de passation `MEMORY/prompt_multi_contexte_knowledge.md`).
- Charte trop centrée sur la tâche (COM) : premier jet = tâche WhatsApp ; corrigé vers le rôle
  durable (com générale). L'étape 1 capte le besoin immédiat, pas le rôle pérenne.
- Incohérence cosmétique : template mentionne `AGENTS.md/CLAUDE.md`, instances `AGENTS.md` seul.

### Propositions
- P1 [retenue] — Étape 1 : distinguer rôle durable / tâche courante dans la question posée.
- P2 [retenue] — Étape 1 : demander si l'agent doit écrire hors de son dossier (code applicatif),
  répercuter dans `Peut écrire`/`Ne doit pas toucher` de la charte.
- P3 [retenue] — Créer un agent test end-to-end avec la commande (valide l'étape 10).
- P4 [écartée] — `contexte.md` dédié agent : faible valeur, différé.
- P5 [retenue] — Corriger l'incohérence `AGENTS.md/CLAUDE.md` du template (trivial).

### État d'implémentation (2026-07-21)
- P1 implémentée : étape 1 de `create_agent.md` capte le rôle **durable**, rejette une formulation
  en tâche unique.
- P2 implémentée : étape 1 demande si l'agent écrit hors de son dossier ; nouveau placeholder
  `{{ECRITURE_ETENDUE}}` dans `agent_role_TEMPLATE.md` (ligne `Peut écrire`) + tableau de
  substitution étape 5.
- P3 retenue mais non exécutée cette session (validation end-to-end reportée).
- P5 abandonnée à l'implémentation : sans objet. Le template est générique, `AGENTS.md/CLAUDE.md`
  (les deux cas possibles) est correct ; l'incohérence était côté instance robert-ia, pas côté template.
