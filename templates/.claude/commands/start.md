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

2. Résoudre le dossier réel via la table. Vérifier que `<dossier>/_contexte/_manifest.md` existe.
   Si absent : proposer d'initialiser la structure `_contexte/` pour cette zone (créer les fichiers
   vides : `_manifest.md`, `contexte.md`, `signals.md`) et s'arrêter.

3. Lire `<dossier>/_contexte/_manifest.md`.

4. Charger les fichiers listés dans "Charger au démarrage" dans l'ordre suivant, indépendamment
   de leur ordre dans le manifest :
   1. `signals.md` — actions ouvertes, blocages, dernière session (priorité absolue)
   2. `contexte.md` — contexte stable
   3. roadmap active si présente

   > **Économie tokens :** si `signals.md` suffit à répondre à la question immédiate,
   > `contexte.md` peut être chargé à la demande plutôt que systématiquement.
   > En cas de doute : le charger.

5. Afficher le contenu intégral de `signals.md` (sans résumé ni reformulation).

5b. Pour chaque action listée dans `signals.md` qui contient un champ `réf:`, lire les fichiers
    référencés avant d'afficher la synthèse. Si une action semble ambiguë mais qu'une `réf:` existe,
    lire la référence en priorité plutôt que de demander des précisions.

    Ajouter ensuite, à partir des autres fichiers chargés : la phase en cours si roadmap active,
    et le point d'attention immédiat.

6. Afficher en fin de réponse : 🎉🎉🎉
