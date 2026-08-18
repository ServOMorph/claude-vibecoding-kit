# Discord Com - Setup rapide

## 1. Créer le bot
1. https://discord.com/developers/applications → New Application
2. Bot → Add Bot → copier le token
3. Copier `.env.example` vers `.env` et coller le token dans `DISCORD_BOT_TOKEN`
   (fichier local, jamais commité, jamais lu par Claude)
4. Copier `config_bot_discord.example.json` vers `config_bot_discord.json`

## 2. Inviter le bot sur le serveur
1. Developer Portal → application → **General Information** → copier l'**Application ID**
2. Ouvrir dans un navigateur (connecté au compte ayant les droits sur le serveur cible) :
   `https://discord.com/api/oauth2/authorize?client_id=APPLICATION_ID&permissions=68608&scope=bot`
   (`permissions=68608` = View Channel + Send Messages + Read Message History)
3. Sélectionner le serveur, valider les permissions affichées, cliquer Autoriser
4. Vérifier que le bot apparaît dans la liste des membres avec accès au salon cible

## 3. Configurer le salon
1. Activer : Message Content Intent (Developer Portal → Bot → Privileged Gateway Intents → Save Changes)
2. Clic droit sur le salon dédié → Copier l'identifiant
3. Coller dans `config_bot_discord.json` → `channel_id`

## 4. Lancer
```bash
pip install -r discord_com/requirements.txt
python discord_com/bot.py
```

## 5. Activer / Désactiver
- `"enabled": true` dans `config_bot_discord.json` → bot actif
- `"enabled": false` → bot s'arrête immédiatement au lancement

## 6. Personnaliser
- Ajouter des commandes autonomes propres au projet dans `traiter_autonome()` (`bot.py`),
  sur le modèle de `_cmd_ping`/`_cmd_help`
