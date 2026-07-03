---
description: Charge le contexte d'une zone en début de session
argument-hint: [zone]
model: haiku
---

# /start [zone]

## Zones valides et dossiers réels

Lire `.claude/zones.md` pour obtenir la table des alias → dossiers réels.


## Procédure

1. Lire l'argument fourni ($ARGUMENTS).
   - Si absent : utiliser le working directory courant comme dossier cible (zone implicite).
   - Si présent mais non reconnu dans la table ci-dessus :
     répondre "Erreur : zone inconnue. Zones valides : <liste des alias>"
     et s'arrêter.
   - Si présent et reconnu : résoudre le dossier via la table.

2. Vérifier que `<dossier>/_contexte/signals.md` et `<dossier>/_contexte/contexte.md` existent.
   Si absents : proposer d'initialiser la structure `_contexte/` pour cette zone (créer
   `contexte.md` et `signals.md` vides) et s'arrêter.

3. Charger dans l'ordre :
   1. `_contexte/signals.md` — actions ouvertes, blocages, dernière session (priorité absolue)
   2. `_contexte/contexte.md` — contexte stable
   3. `roadmap*.md` — si un fichier correspondant existe dans `<dossier>`, le charger

   > **Économie tokens :** si `signals.md` suffit à répondre à la question immédiate,
   > `contexte.md` peut être chargé à la demande plutôt que systématiquement.
   > En cas de doute : le charger.

4. Afficher le contenu intégral de `signals.md` (sans résumé ni reformulation).

4b. Pour chaque action listée dans `signals.md` qui contient un champ `réf:`, lire les fichiers
    référencés avant d'afficher la synthèse. Si une action semble ambiguë mais qu'une `réf:` existe,
    lire la référence en priorité plutôt que de demander des précisions.

    Ajouter ensuite, à partir des autres fichiers chargés : la phase en cours si roadmap active,
    et le point d'attention immédiat.

5. Afficher en fin de réponse : 🎉🎉🎉

<!-- SPECIFICITES PROJET : DEBUT (préservé par /update, ne pas toucher hors de ce bloc) -->
<!-- Convention : toute règle liée à une étape précise de la Procédure ci-dessus doit la
     référencer explicitement par son numéro (ex: "Étape 3 : ..."), plutôt que compter sur la
     position physique de cette zone (toujours en fin de fichier). -->
<!-- SPECIFICITES PROJET : FIN -->
