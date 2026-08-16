---
description: Recherche une fonction/fonctionnalité déjà codée dans d'anciens projets, à partir d'une description
argument-hint: "<description de la fonction recherchée>"
model: sonnet
---

# /cherche_fonction <description>

## Objectif

Retrouver, dans d'anciens projets, du code correspondant à une description
fonctionnelle (ex: « communication Discord depuis Claude Code ») quand on ne
se souvient plus dans quel programme il a été écrit.

## [COLLECTE]

1. Description absente de `$ARGUMENTS` : la demander.
2. Toujours demander les dossiers racines où chercher (chemins absolus,
   plusieurs possibles) — même si une recherche précédente a déjà servi, ne
   jamais réutiliser un dossier mémorisé sans le redemander explicitement à
   chaque appel.
3. Dériver des mots-clés de recherche à partir de la description (termes
   littéraux, libs connues associées si évidentes — ex. discord.py,
   discord.js, nextcord, webhook, bot token). Rester sur des variantes
   raisonnables, ne pas sur-interpréter au-delà de la description donnée.

## [RECHERCHE]

4. Pour chaque dossier racine fourni, chercher récursivement (exclure
   `node_modules`, `.git`, `venv`, `__pycache__`, `dist`, `build`, `.venv`) :
   - occurrences des mots-clés dans le code (imports, noms de fonctions, noms
     de fichiers) ;
   - fichiers de config pertinents (`.env.example`, `requirements.txt`,
     `package.json`) mentionnant les libs identifiées.
5. Regrouper les résultats par projet (premier sous-dossier sous la racine
   fournie). Pour chaque candidat : chemin du fichier, symbole/fonction
   trouvé, extrait pertinent (3-5 lignes).

## [SORTIE]

6. Présenter les candidats du plus probable au moins probable (nombre de
   correspondances, spécificité des mots-clés touchés).
7. Un seul candidat clair : l'indiquer directement avec chemin exact et
   extrait.
8. Plusieurs candidats ambigus : les lister, demander lequel correspond.
9. Aucun résultat : le dire explicitement, ne pas inventer de piste.
   Proposer d'élargir les dossiers cherchés ou d'ajuster les mots-clés.
10. Proposer (sans l'exécuter automatiquement) d'enregistrer la localisation
    trouvée via `/create_memory` pour ne plus avoir à refaire cette
    recherche.

<!-- SPECIFICITES PROJET : DEBUT (préservé par /update, ne pas toucher hors de ce bloc) -->
<!-- SPECIFICITES PROJET : FIN -->
