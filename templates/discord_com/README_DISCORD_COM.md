# discord_com — Intégration Discord ↔ Claude Code

Permet de contrôler Claude Code depuis Discord : envoyer des commandes, recevoir les résultats, interagir avec le projet à distance.

---

## Lancer le process

**Prérequis** : bot configuré (`config_bot_discord.json` rempli) + `pip install -r discord_com/requirements.txt` fait.

### Terminal 1 — Bot Discord (tourne en permanence)

```bash
python discord_com/bot.py
```

→ Affiche `Bot prêt → #nom-du-salon` quand connecté.

### Terminal 2 (ou Claude Code) — Boucle Claude native

Dans Claude Code :

```
/discord_loop
```

→ Claude envoie `🤖 Claude Code connecté.` sur Discord et attend tes commandes.

### C'est tout

Envoie n'importe quelle commande depuis Discord. Claude l'exécute et répond.
Envoie `stop` pour arrêter proprement la boucle.

---

## Architecture

```
Discord (toi)
    │
    │ message
    ▼
bot.py ──── écrit ──→ commands.json
    │                      │
    │                      │ poll (10s cycles)
    │                      ▼
    │              Claude Code natif (/discord_loop)
    │              exécute directement (Bash, Read, Write...)
    │                      │
    │                      │ écrit réponse
    │                      ▼
    └──── lit ──── queue.json ────→ Discord (réponse)
```

**Principe clé** : Claude Code (la session active) est le handler — il exécute les commandes directement, sans sous-processus `claude -p`.

---

## Fichiers

| Fichier | Rôle |
|---|---|
| `bot.py` | Bot Discord permanent — relai messages ↔ fichiers |
| `bot_manager.py` | Gestion du cycle de vie de `bot.py` (start/stop/restart/status) |
| `discord_loop.py` | Helper CLI — `wait` / `send` / `done` / `notify` |
| `claude_bridge.py` | Module Python importable — `envoyer()` / `notifier()` pour agents/scripts |
| `commands.json` | File de commandes entrantes (Discord → Claude) |
| `queue.json` | File de messages sortants (Claude → Discord) |
| `config_bot_discord.json` | Configuration bot (token, channel_id, enabled) — jamais commité |
| `requirements.txt` | Dépendances Python |
| `SETUP.md` | Guide configuration bot Discord |
| `DISCORD_SECURITY.md` | Gestion des credentials (gitignore, rotation) |

---

## Setup (première fois)

### 1. Créer le bot Discord

1. [discord.com/developers/applications](https://discord.com/developers/applications) → New Application
2. Bot → Add Bot → copier le **token**
3. Developer Portal → Bot → activer **Message Content Intent**

### 2. Inviter le bot sur le serveur

Générer une URL OAuth2 avec les permissions `Send Messages` + `Read Messages`.

### 3. Configurer

Copier `discord_com/config_bot_discord.example.json` vers `discord_com/config_bot_discord.json` et remplir :

```json
{
  "enabled": true,
  "bot_token": "TON_TOKEN_ICI",
  "channel_id": 123456789012345678
}
```

Pour obtenir le `channel_id` : clic droit sur le salon Discord → Copier l'identifiant (mode développeur requis).

### 4. Installer les dépendances

```bash
pip install -r discord_com/requirements.txt
```

### 5. Lancer le bot

Dans un terminal séparé (tourne en permanence) :

```bash
python discord_com/bot.py
```

---

## Utilisation — Boucle native Claude

### Lancer

Dans Claude Code :

```
/discord_loop
```

Claude entre en boucle d'attente. Il poll `commands.json` en cycles de 10 secondes.
L'attente est illimitée — tu peux répondre après plusieurs heures.

### Cycle de traitement

```
wait (10s) → TIMEOUT → wait (10s) → ... → commande reçue → exécution → réponse → wait
```

### Commandes autonomes (bot répond seul, Claude non requis)

| Commande | Résultat |
|---|---|
| `!ping` | Test connexion bot + statut Claude |
| `!help` | Liste de toutes les commandes |

Extensible : ajouter des commandes métier propres au projet dans `traiter_autonome()`
(`bot.py`), sur le modèle de `_cmd_ping`/`_cmd_help`.

### Commandes Claude (boucle /discord_loop requise)

| Commande | Résultat |
|---|---|
| `liste les fichiers` | Claude liste et répond |
| `git status` | Claude exécute et répond |
| `/commit` | Claude crée le commit |
| `stop` | Arrête la boucle proprement |
| N'importe quelle demande | Claude l'exécute avec ses outils natifs |

---

## Utilisation — discord_loop.py CLI

Helper utilisé par la boucle Claude. Peut aussi être appelé manuellement.

```bash
# Attendre une commande Discord (bloque 10s, retourne TIMEOUT si rien)
python discord_com/discord_loop.py wait

# Envoyer un message sur Discord
python discord_com/discord_loop.py send "Message ici"

# Marquer la commande courante comme traitée
python discord_com/discord_loop.py done

# Notification rapide (fire & forget)
python discord_com/discord_loop.py notify "Message ici"
```

---

## Utilisation — claude_bridge.py (dans un script/agent)

Pour envoyer des messages Discord depuis un agent ou script Python :

```python
from discord_com.claude_bridge import envoyer, notifier, est_active

# Envoyer et attendre une réponse utilisateur
if est_active():
    reponse = envoyer("Valider le déploiement ? [O/n]", timeout=300)
    print(f"Réponse : {reponse}")

# Notification sans attendre de réponse
notifier("✅ Tâche terminée.")
```

---

## Utilisation — bot_manager.py (gestion du process)

```bash
python discord_com/bot_manager.py start    # lance bot.py en arrière-plan
python discord_com/bot_manager.py status   # vérifie si bot.py tourne
python discord_com/bot_manager.py stop     # arrête bot.py
python discord_com/bot_manager.py restart  # stop + start
```

---

## Flux des fichiers JSON

### `commands.json` — commandes entrantes

```json
{ "status": "idle|pending|processing|running", "command": "...", "timestamp": 0 }
```

| Status | Signification |
|---|---|
| `idle` | Rien en attente |
| `pending` | Nouveau message Discord reçu, à traiter |
| `processing` | Claude a pris en charge la commande |

### `queue.json` — messages sortants vers Discord

```json
{ "status": "pending|waiting|responded|idle", "message": "...", "response": "", "timestamp": 0 }
```

| Status | Signification |
|---|---|
| `pending` | Message à envoyer par le bot |
| `waiting` | Message envoyé, bot attend réponse utilisateur |
| `responded` | Utilisateur a répondu (response rempli) |
| `idle` | Rien en attente |

---

## Activer / Désactiver

```json
{ "enabled": false }
```

→ `bot.py` et `discord_loop.py` s'arrêtent immédiatement. Aucun message traité.

---

## Dépannage

| Problème | Solution |
|---|---|
| Bot ne répond pas | Vérifier que `bot.py` tourne dans un terminal séparé |
| `enabled: false` | Mettre `true` dans `config_bot_discord.json` |
| Message Content Intent manquant | Developer Portal → Bot → activer l'intent |
| `channel_id` invalide | Vérifier le mode développeur Discord activé |
| Boucle bloquée | Envoyer `stop` sur Discord ou Ctrl+C dans Claude Code |
