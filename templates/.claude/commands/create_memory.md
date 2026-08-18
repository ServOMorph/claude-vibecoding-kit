---
description: Ajoute une entrée dans la mémoire projet (.claude/memory.md) ou dans la mémoire d'une zone (_contexte/memory.md)
argument-hint: [alias_zone] [contenu à mémoriser]
model: haiku
---

# /create_memory [alias_zone] [contenu]

## Procédure

1. Résoudre la cible.
   - Si `.claude/zones.md` existe et que le premier mot de $ARGUMENTS correspond à un alias de cette table : cible = zone (dossier résolu via la table), contenu = reste de $ARGUMENTS, fichier = `<dossier_zone>/_contexte/memory.md`.
   - Sinon : cible = projet (comportement historique, inchangé), contenu = $ARGUMENTS entier, fichier = `.claude/memory.md`.

2. Si le contenu est absent : afficher le contenu actuel du fichier cible (ou "Aucune mémoire enregistrée." si le fichier n'existe pas) et s'arrêter.

3. Vérifier si le fichier cible existe.
   - Si absent : le créer avec l'en-tête suivant :
     ```
     # Mémoire <projet|zone>
     <!-- Fichier géré via /create_memory. Ne pas modifier manuellement sauf pour supprimer des entrées. -->
     ```

4. Formuler une entrée concise au format :
   ```
   ## YYYY-MM-DD — [sujet en 3-5 mots]
   [contenu mémorisé, reformulé si nécessaire pour être autonome et compréhensible hors contexte]
   ```
   Utiliser la date du jour. Inférer le sujet à partir du contenu.

5. Ajouter l'entrée à la fin du fichier cible.

6. Confirmer en une ligne : "Mémorisé (<projet|zone: alias>) : [sujet]"
