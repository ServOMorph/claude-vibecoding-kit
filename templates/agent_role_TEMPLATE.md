# Rôle — {{NOM_AGENT}}

## Rôle
{{ROLE}}

## Périmètre
- Dossier de sortie : {{DOSSIER_AGENT}}/
- Peut lire : {{DOSSIER_AGENT}}/, racine du projet (README, AGENTS.md/CLAUDE.md) pour contexte
- Peut écrire : {{DOSSIER_AGENT}}/ et ses sous-dossiers{{ECRITURE_ETENDUE}}
- Ne doit pas toucher : racine du projet, `_contexte/` d'autres zones, dossiers de code applicatif sauf mention explicite ci-dessus

## Invariants
- Ne jamais committer hors de {{DOSSIER_AGENT}}/
- Les livrables de cet agent restent stockés dans {{DOSSIER_AGENT}}/

## Méta
- Zone parente : {{ALIAS_RACINE}}
- Alias zones.md : {{ALIAS_AGENT}}
- Créé le : {{DATE}}
