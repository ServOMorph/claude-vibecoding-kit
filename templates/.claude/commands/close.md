---
description: Clôture la session d'une zone — synthèse, mise à jour du contexte, commit
argument-hint: <zone>
model: sonnet
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*)
---

# /close <zone>

## Zones valides et dossiers réels
| Alias | Dossier |
|-------|---------|
| {{ALIAS}} | {{RACINE}} |


## Procédure

1. Lire l'argument fourni ($ARGUMENTS). Si absent ou non reconnu :
   répondre "Erreur : zone manquante ou inconnue. Usage : /close <zone>"
   et s'arrêter.

2. Résoudre le dossier réel via la table.

3. Produire une synthèse de session (< 25 lignes) au format suivant :

```
# Session du AAAA-MM-JJ

## Décisions prises
- [décision actée, 1 ligne]

## Livrables produits ou modifiés
- [fichier] : [statut]

## Hypothèses validées / invalidées
- VALIDE : ...
- INVALIDE : ... -> pivot vers ...
- EN ATTENTE : ...

## Prochaine étape exacte
[1-3 lignes]

## Question bloquante pour la session suivante
[1 question, ou "Aucune"]
```

4. Mettre à jour `<dossier>/_contexte/signals.md` :
   - Lire le fichier existant. Reporter tout élément non résolu.
   - Écraser la section "Dernière session" avec la synthèse de l'étape 3 (date du jour dans le titre).
   - Mettre à jour les priorités [P1/P2] sur les actions ouvertes.
   - Supprimer les entrées "Contexte chaud" périmées. Ajouter les nouvelles informations volatiles.
   - Sections sans contenu : laisser le titre sans puce.

5. Mettre à jour `<dossier>/_contexte/contexte.md` :
   - Réécrire intégralement la section "État actuel" (5 lignes max).
   - Ajouter les décisions actées à "Décisions structurantes" (append only).
   - Si la liste dépasse 10 entrées : archiver les plus anciennes dans `_contexte/archive_decisions.md`.
   - Ne pas toucher à "Objectif" sauf décision explicite. Ne pas toucher à "Stack" sauf changement technique.
   - Si rien n'a changé : ne pas toucher au fichier.

6. Mettre à jour `<dossier>/_contexte/_manifest.md` :
   - Ajouter ou retirer la roadmap de "Charger au démarrage" si son statut a changé.
   - Sinon : ne pas toucher au fichier.

7. Lire la section "Charger au démarrage" du manifest.
   Pour chaque autre fichier listé (hors fichiers déjà traités aux étapes 4-6), vérifier qu'il reflète
   fidèlement l'état après session. Mettre à jour ceux qui sont périmés.
   Invariant : ce que lira le prochain `/start` doit être vrai.

8. Mettre à jour `README.md` à la racine du projet :
   - Refléter l'état actuel du projet (section "État actuel" de `contexte.md`).
   - Ne pas modifier les sections stables (objectif, stack, structure) sauf changement explicite.
   - Si le README n'existe pas encore : ne pas le créer sans demander.

9. Effectuer un commit git :
   ```bash
   git diff --name-only          # vérifier tous les fichiers modifiés pendant la session
   git status                    # confirmer l'état du repo
   git add <dossier>/_contexte/ [autres fichiers modifiés identifiés ci-dessus]
   git commit -m "close(<alias>): session AAAA-MM-JJ — <résumé 1 ligne>"
   ```
   - Le résumé reprend la première décision actée, ou la prochaine étape si aucune décision.
   - En cas de doute sur ce qu'il faut stager : préférer un commit légèrement trop large
     plutôt qu'un commit partiel laissant le repo dans un état incohérent.
   - Ne pas inclure de fichiers sans lien avec la session.

10. Afficher en fin de réponse en grand format : ✌️😎
