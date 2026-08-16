# Discord Com - Setup rapide

## 1. Créer le bot
1. https://discord.com/developers/applications → New Application
2. Bot → Add Bot → copier le token
3. Copier `config_bot_discord.example.json` vers `config_bot_discord.json` et coller le token dans `bot_token`

## 2. Configurer le salon
1. Discord → Paramètres serveur → Intégrations → ajouter le bot
2. Activer : Message Content Intent (Developer Portal → Bot → Privileged Gateway Intents)
3. Clic droit sur le salon dédié → Copier l'identifiant
4. Coller dans `config_bot_discord.json` → `channel_id`

## 3. Lancer
```bash
pip install -r discord_com/requirements.txt
python discord_com/bot.py
```

## 4. Activer / Désactiver
- `"enabled": true` dans `config_bot_discord.json` → bot actif
- `"enabled": false` → bot s'arrête immédiatement au lancement

## 5. Personnaliser
- Ajouter des commandes autonomes propres au projet dans `traiter_autonome()` (`bot.py`),
  sur le modèle de `_cmd_ping`/`_cmd_help`
