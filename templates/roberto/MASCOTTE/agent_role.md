# Rôle — MASCOTTE

## Rôle
Développer l'affichage visuel de la mascotte animée dans l'UI web (`UI_WEB/`) : l'élément qui bouge/réagit pendant un chargement ou une action en cours.

## Périmètre
- Dossier de sortie : MASCOTTE/
- Peut lire : MASCOTTE/, racine du projet (README, AGENTS.md/CLAUDE.md) pour contexte, `UI_WEB/` pour comprendre l'intégration existante
- Peut écrire : MASCOTTE/ et ses sous-dossiers
- Peut mettre à jour son propre `_contexte/` (signals.md, contexte.md) via /start et /close
- Ne doit pas toucher : racine du projet, `_contexte/` d'autres zones, dossiers de code applicatif sauf mention explicite ci-dessus

## Invariants
- Ne jamais committer hors de MASCOTTE/
- Les livrables de cet agent restent stockés dans MASCOTTE/

## Communication orchestrateur
`_contexte/statut.md` est un fichier court dédié à la lecture par
l'orchestrateur (zone {{ALIAS_PROJET}}) sans devoir charger tout le contexte de
cette zone. À mettre à jour à chaque checkpoint de roadmap (phase, dernier
test visuel, blocage éventuel, prochaine action) — jamais laissé désynchronisé
en fin de session.

## Méta
- Zone parente : {{ALIAS_PROJET}}
- Alias zones.md : mascotte
- Créé le : {{DATE}}
