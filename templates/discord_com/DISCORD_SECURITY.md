# Sécurité Discord — Configuration des tokens

## ⚠️ Important : Les tokens ne sont jamais dans le dépôt git

La configuration avec les tokens Discord est **ignorée par git** pour des raisons de sécurité.

```
.gitignore :
discord_com/config_bot_discord.json  ← Jamais commité
config_bot_discord.example.json      ← Exemple (peut être commité)
```

## Workflow de configuration

### 1️⃣ Clone le dépôt

```bash
git clone https://...
cd mon-projet
```

Tu noteras : **config_bot_discord.json n'existe pas** (c'est normal, il est ignoré)

### 2️⃣ Copie le fichier example

```bash
cp discord_com/config_bot_discord.example.json discord_com/config_bot_discord.json
```

### 3️⃣ Remplis le fichier avec tes credentials

Édite `discord_com/config_bot_discord.json` :

```json
{
  "enabled": true,
  "bot_token": "TON_TOKEN_DISCORD_ICI",
  "channel_id": 123456789012345678
}
```

### 4️⃣ La config est protégée

```bash
git status
# config_bot_discord.json ne sera jamais affiché (ignoré)
```

## Obtenir les credentials

### Bot Token

1. Aller sur https://discord.com/developers/applications
2. Sélectionner ton application
3. Aller dans "Bot" → copier le **Token**

**⚠️ Jamais partager ce token. Il permet de contrôler le bot.**

### Channel ID

1. Discord → User Settings → Advanced → **Developer Mode** (activer)
2. Clic droit sur le salon → **Copier l'ID**

## Déploiement / CI-CD

### Partager les credentials entre machines

**Option 1 : Variable d'environnement**

```bash
export DISCORD_BOT_TOKEN="ton_token_ici"
export DISCORD_CHANNEL_ID="123456789"
python discord_com/bot.py
```

Script peut lire depuis env :

```python
import os
import json

config = json.load(open("discord_com/config_bot_discord.json"))
config["bot_token"] = os.environ.get("DISCORD_BOT_TOKEN", config["bot_token"])
config["channel_id"] = int(os.environ.get("DISCORD_CHANNEL_ID", config["channel_id"]))
```

**Option 2 : Fichier .env (également ignoré)**

```bash
# .env (ignoré par git)
DISCORD_BOT_TOKEN=ton_token
DISCORD_CHANNEL_ID=123456789
```

```python
from dotenv import load_dotenv
import os

load_dotenv()
config = {
    "bot_token": os.getenv("DISCORD_BOT_TOKEN"),
    "channel_id": int(os.getenv("DISCORD_CHANNEL_ID"))
}
```

**Option 3 : GitHub Secrets (pour CI/CD)**

```yaml
# .github/workflows/deploy.yml
env:
  DISCORD_BOT_TOKEN: <valeur depuis GitHub Secrets DISCORD_BOT_TOKEN>
  DISCORD_CHANNEL_ID: <valeur depuis GitHub Secrets DISCORD_CHANNEL_ID>
```

## Vérifier la sécurité

```bash
# Ces fichiers NE doivent JAMAIS être committés
git log --follow -- discord_com/config_bot_discord.json
# → Aucun résultat (fichier ignoré depuis le départ)

# Les fichiers example PEUVENT être committés (pas de secrets)
git log --follow -- discord_com/config_bot_discord.example.json
# → Affiche les commits (documentation)
```

## Regénérer le bot token (si compromis)

1. Discord Developer Portal → Bot → **Regenerate**
2. Copier le nouveau token
3. Mettre à jour `discord_com/config_bot_discord.json` localement
4. Ne pas commiter le nouveau fichier (gitignore)

## Checklist sécurité

- [ ] `config_bot_discord.json` est dans `.gitignore`
- [ ] `config_bot_discord.json` n'existe pas dans le dépôt (historique git)
- [ ] `config_bot_discord.example.json` sert de template (pas de secrets)
- [ ] Les tokens ne sont jamais dans les logs git
- [ ] Les tokens ne sont jamais dans les commits

---

**Règle d'or** : Si un token a été commité accidentellement, il doit être régénéré immédiatement (il n'est plus secret).

Pour nettoyer l'historique : `git filter-branch --prune-empty -- --all` (avancé, consulter la doc git)
