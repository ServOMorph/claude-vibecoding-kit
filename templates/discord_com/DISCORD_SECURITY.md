# Sécurité Discord — Configuration des tokens

## ⚠️ Important : le token n'est jamais dans le dépôt git, ni lu par Claude

Le token Discord vit uniquement dans `.env`, ignoré par git **et jamais lu ni écrit par
Claude** : c'est l'utilisateur qui le colle lui-même dans le fichier, dans son éditeur.
`config_bot_discord.json` (non sensible : `enabled`, `channel_id`) peut en revanche être
rempli par Claude sans problème.

```
.gitignore :
discord_com/.env                     ← Jamais commité, jamais lu par Claude
.env.example                         ← Exemple sans secret (peut être commité)
discord_com/config_bot_discord.json  ← Non sensible, mais ignoré par cohérence
config_bot_discord.example.json      ← Exemple (peut être commité)
```

## Workflow de configuration

### 1️⃣ Clone le dépôt

```bash
git clone https://...
cd mon-projet
```

Tu noteras : **`.env` et `config_bot_discord.json` n'existent pas** (c'est normal, ignorés)

### 2️⃣ Copie les fichiers example

```bash
cp discord_com/.env.example discord_com/.env
cp discord_com/config_bot_discord.example.json discord_com/config_bot_discord.json
```

### 3️⃣ Remplis le token toi-même (jamais via Claude)

Édite `discord_com/.env` directement dans ton éditeur :

```
DISCORD_BOT_TOKEN=TON_TOKEN_DISCORD_ICI
```

Édite `discord_com/config_bot_discord.json` (Claude peut t'aider ici) :

```json
{
  "enabled": true,
  "channel_id": 123456789012345678
}
```

### 4️⃣ La config est protégée

```bash
git status
# .env et config_bot_discord.json ne seront jamais affichés (ignorés)
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

Chaque machine recopie `.env.example` vers `.env` et remplit `DISCORD_BOT_TOKEN` elle-même
(jamais via un fichier partagé ou committé).

**GitHub Secrets (pour CI/CD)**

```yaml
# .github/workflows/deploy.yml
env:
  DISCORD_BOT_TOKEN: <valeur depuis GitHub Secrets DISCORD_BOT_TOKEN>
  DISCORD_CHANNEL_ID: <valeur depuis GitHub Secrets DISCORD_CHANNEL_ID>
```

## Vérifier la sécurité

```bash
# Ce fichier NE doit JAMAIS être committé
git log --follow -- discord_com/.env
# → Aucun résultat (fichier ignoré depuis le départ)

# Les fichiers example PEUVENT être committés (pas de secrets)
git log --follow -- discord_com/.env.example
```

## Regénérer le bot token (si compromis, ou après passage par Claude)

1. Discord Developer Portal → Bot → **Reset Token**
2. Copier le nouveau token
3. Mettre à jour `discord_com/.env` localement (toi-même, pas via Claude)
4. Ne pas commiter le fichier (gitignore)

## Checklist sécurité

- [ ] `.env` est dans `.gitignore`
- [ ] `.env` n'existe pas dans le dépôt (historique git)
- [ ] `.env.example` sert de template (pas de secrets)
- [ ] Le token n'a jamais transité par Claude (ni lu, ni écrit par lui)
- [ ] Les tokens ne sont jamais dans les logs git ni dans les commits

---

**Règle d'or** : Si un token a été commité accidentellement, il doit être régénéré immédiatement (il n'est plus secret).

Pour nettoyer l'historique : `git filter-branch --prune-empty -- --all` (avancé, consulter la doc git)
