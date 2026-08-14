# Index des macros Control PC

Les macros sont des séquences atomiques et réutilisables. Elles sont classées par application ; un workflow composé les orchestre sans répéter leurs étapes.

## Convention

- Dossier : `macros/<application>/` en minuscules et avec `_`.
- Fichier : une action précise, par exemple `planifier_un_post.md`.
- Statut : `brouillon` tant que le résultat final n’a pas été vérifié, puis `validée`.
- Données personnelles : ne jamais les inscrire dans une macro, un index ou la base SQLite.

## Applications

| Application | Macro | Statut |
| --- | --- | --- |
| LinkedIn | [`planifier_un_post.md`](linkedin/planifier_un_post.md) | Brouillon — arrêt avant confirmation finale |

