---
description: Arrête tous les process de l'assistant vocal com_telephone (Node, STT Whisper, TTS Piper) et le Monitor associé
argument-hint: (aucun argument)
model: haiku
---

# /com_stop

## Objectif
Stopper intégralement `voice-code-bridge` (`com_telephone/`) : les 3 process serveur (Node,
STT Whisper, TTS Piper) et le Monitor qui surveille `messages.log`. Raccourci de
`/com_manager stop` pour l'arrêt complet, sans avoir à préciser d'action.

## Procédure
1. Exécuter :
   ```
   py -3.11 "<dossier_de_ce_fichier>/com_manager.py" stop
   ```
2. Afficher la sortie brute du script à l'utilisateur.
3. Si `<dossier_de_ce_fichier>/monitor.lock` existe encore : lire son `task_id`, l'arrêter avec
   `TaskStop`, puis supprimer le fichier — le script `com_manager.py` tue les process serveur mais
   ne gère pas le Monitor lui-même.
4. Confirmer à l'utilisateur que les 3 process et la surveillance sont arrêtés.
