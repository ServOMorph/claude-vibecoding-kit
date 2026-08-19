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
   actifs, activer une surveillance persistante du fichier d'échange avec l'outil Monitor :
   ```
   command: cd "<dossier_de_ce_fichier>/../voice-code-bridge/server" && tail -f -n 0 messages.log
   persistent: true
   ```
   Sans cette étape, les messages envoyés depuis l'appli après le lancement n'arrivent à l'agent
   qu'au prochain redémarrage de session (déjà constaté : les process survivent au changement de
   session mais le watcher, lui, ne survit pas). Si un Monitor équivalent tourne déjà (vérifier
   avant d'en relancer un doublon), ne pas en relancer un second.
7. Si l'action est `stop` (composant `node` inclus ou aucun composant précisé) : arrêter le Monitor
   actif sur `messages.log` avec TaskStop, puisqu'il n'y a alors plus de serveur à surveiller.
