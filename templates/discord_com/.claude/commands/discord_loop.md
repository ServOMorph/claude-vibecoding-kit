# Discord Loop - Contrôle Claude Code via Discord

Active la boucle de contrôle Discord native : Claude (cette session) attend les commandes Discord, les exécute directement avec ses outils, et renvoie les résultats.

**Différence clé** : Claude exécute les commandes lui-même (Bash, Read, Write...) — aucun sous-processus `claude -p`.

## Utilisation

```
/discord_loop
```

## Prérequis

- `discord_com/config_bot_discord.json` → `"enabled": true` + token + channel_id configurés
- Bot Discord en cours d'exécution : `python discord_com/bot.py` (terminal séparé)

## Processus

### Étape 1 : Vérifier que le bot tourne

```bash
python -c "
import json
from pathlib import Path
q = json.loads(Path('discord_com/queue.json').read_text(encoding='utf-8'))
print('Queue OK :', q['status'])
"
```

Si erreur → demander à l'utilisateur de lancer `python discord_com/bot.py` dans un terminal séparé.

### Étape 2 : Notifier Discord

```bash
python discord_com/discord_loop.py notify "🤖 Claude Code connecté. Envoie ta commande."
```

### Étape 3 : Boucle native Claude

Répéter indéfiniment jusqu'à "stop" :

#### 3a. Attendre une commande Discord

```bash
python discord_com/discord_loop.py wait
```

Ce script bloque jusqu'à 10 secondes par cycle. Quand un message Discord arrive :
- Affiche la commande sur stdout
- Marque `commands.json` → `"processing"`

Si la sortie est `TIMEOUT` → relancer `wait` immédiatement. Ce cycle peut se répéter indéfiniment (heures, jours). L'attente n'a pas de limite — juste des cycles de 10 secondes.

#### 3b. Traiter la commande directement

Lire la commande reçue et l'**exécuter directement** avec les outils natifs Claude :
- Questions sur le projet → lire fichiers, analyser, répondre
- Commandes bash → utiliser l'outil Bash
- Création/modification fichiers → utiliser Write/Edit
- Analyse git → git status, git log, etc.
- Commandes slash (`/commit`, `/task`, etc.) → les exécuter

#### 3c. Envoyer la réponse sur Discord

Construire une réponse concise (max 1900 caractères) et l'envoyer :

```bash
python discord_com/discord_loop.py send "RÉPONSE ICI"
```

Pour les réponses longues, envoyer par morceaux (appeler `send` plusieurs fois).

#### 3d. Marquer comme traité

```bash
python discord_com/discord_loop.py done
```

#### 3e. Commande "stop"

Si la commande reçue est exactement `stop` :
```bash
python discord_com/discord_loop.py notify "👋 Session Claude arrêtée."
python discord_com/discord_loop.py done
```
→ Arrêter la boucle.

### Flux résumé

```
wait → commande reçue → exécuter directement → send réponse → done → wait → ...
```

## Commandes Discord disponibles

Une fois la boucle active :

```
liste les fichiers du projet     → Claude liste et répond
quel est l'état du projet ?      → Claude lit STATUS.md et répond
git status                       → Claude exécute et répond
crée un fichier test.txt         → Claude crée le fichier
/commit                          → Claude fait le commit
stop                              → Arrête la boucle proprement
```

## Format de réponse au démarrage

```
✅ Boucle Discord native active.

Bot     : ✅ actif
Mode    : Claude natif (pas de sous-processus)
Timeout : cycles de 10s (reboucle automatiquement)

Envoie "stop" sur Discord pour arrêter.
```

## Notes importantes

- Claude reste en boucle active dans cette session — ne pas quitter
- Chaque commande Discord est exécutée avec le contexte complet du projet
- Les réponses >1900 caractères sont envoyées en plusieurs messages
- Si le bot Discord s'arrête : relancer `python discord_com/bot.py`
- `discord_loop.py` gère uniquement queue/commands — Claude gère l'exécution
