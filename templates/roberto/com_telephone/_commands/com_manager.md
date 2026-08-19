---
description: Démarre, arrête ou vérifie l'état des 3 processus de l'assistant vocal (Node, STT Whisper, TTS Piper)
argument-hint: start | stop | restart | status [node|stt|tts]
model: haiku
---

# /com_manager

## Objectif

Gérer le cycle de vie des 3 processus nécessaires au fonctionnement de l'assistant vocal
`voice-code-bridge` (`com_telephone/`) : le serveur Node (HTTP + WebSocket, port 5000), le serveur
STT Whisper local (port 5001) et le serveur TTS Piper local (port 5002). Évite de devoir lancer
manuellement 3 commandes dans 3 terminaux séparés. Après un `start`/`restart`, l'agent doit être
en écoute des messages envoyés depuis l'appli, sans action supplémentaire de l'utilisateur.

## Procédure

1. Lire `$ARGUMENTS` : premier mot = action (`start`/`stop`/`restart`/`status`, défaut `status` si
   absent), second mot optionnel = composant ciblé (`node`/`stt`/`tts`, défaut : les 3).
2. Exécuter :
   ```
   py -3.11 "<dossier_de_ce_fichier>/com_manager.py" <action> [<composant>]
   ```
3. Afficher la sortie brute du script à l'utilisateur.
4. Si l'action est `start` : rappeler que le chargement des modèles (Whisper, Piper) prend
   10 à 20 secondes avant que le serveur Node ne soit réellement utilisable, même si le script
   rapporte les process comme lancés immédiatement.
5. Si l'action est `stop` ou `restart` : le script utilise `taskkill /T` pour tuer aussi le
   processus enfant réel (le lanceur `py -3.11` spawn un `python3.11.exe` distinct) — ne jamais
   appeler `taskkill` manuellement sans `/T` sur ces PID.
6. Si l'action est `start` ou `restart` (composant `node` inclus) : une fois les process confirmés
   actifs, (re)lancer la surveillance du fichier d'échange en respectant impérativement cet ordre
   (le fichier `<dossier_de_ce_fichier>/monitor.lock` trace le Monitor actif d'une session à
   l'autre — se fier à ce fichier, jamais à la mémoire de la conversation, un Monitor `persistent`
   constaté ne survit pas forcément à un changement de session) :
   1. Si `monitor.lock` existe, lire le `task_id` qu'il contient et appeler `TaskStop` dessus
      (échec silencieux accepté si le Monitor n'existait déjà plus).
   2. Lancer un nouveau Monitor :
      ```
      command: cd "<dossier_de_ce_fichier>/../voice-code-bridge/server" && tail -f -n 0 messages.log
      persistent: true
      ```
   3. Écrire le `task_id` retourné dans `<dossier_de_ce_fichier>/monitor.lock` (écrasant tout
      contenu précédent).
   Sans cette étape, les messages envoyés depuis l'appli après le lancement n'arrivent à l'agent
   qu'au prochain redémarrage de session. Sauter l'étape 1 (ne pas arrêter l'éventuel Monitor
   existant avant d'en relancer un) crée deux Monitor actifs en parallèle et donc des notifications
   en double pour chaque message reçu — déjà constaté.
7. Si l'action est `stop` (composant `node` inclus ou aucun composant précisé) : si
   `<dossier_de_ce_fichier>/monitor.lock` existe, lire son `task_id`, l'arrêter avec `TaskStop`,
   puis supprimer le fichier — puisqu'il n'y a alors plus de serveur à surveiller.
