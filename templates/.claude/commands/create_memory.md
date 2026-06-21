---
description: Ajoute une entrée dans la mémoire projet (.claude/memory.md)
argument-hint: [contenu à mémoriser]
model: haiku
---

# /create_memory [contenu]

## Procédure

1. Lire l'argument fourni ($ARGUMENTS).
   - Si absent : afficher le contenu actuel de `.claude/memory.md` (ou "Aucune mémoire enregistrée." si le fichier n'existe pas) et s'arrêter.

2. Vérifier si `.claude/memory.md` existe.
   - Si absent : créer le fichier avec l'en-tête suivant :
     ```
     # Mémoire projet
     <!-- Fichier géré via /create_memory. Ne pas modifier manuellement sauf pour supprimer des entrées. -->
     ```

3. Formuler une entrée concise au format :
   ```
   ## YYYY-MM-DD — [sujet en 3-5 mots]
   [contenu mémorisé, reformulé si nécessaire pour être autonome et compréhensible hors contexte]
   ```
   Utiliser la date du jour. Inférer le sujet à partir du contenu.

4. Ajouter l'entrée à la fin de `.claude/memory.md`.

5. Confirmer en une ligne : "Mémorisé : [sujet]"
