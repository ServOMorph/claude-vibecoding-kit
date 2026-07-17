# Archive des décisions — claude-vibecoding-kit

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
