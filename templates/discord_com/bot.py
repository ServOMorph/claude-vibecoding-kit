"""Bot Discord - relai bidirectionnel Claude Code ↔ Discord."""
import discord
import asyncio
import json
import os
import time
from pathlib import Path

from dotenv import load_dotenv

DIR = Path(__file__).parent
load_dotenv(DIR / ".env")
CONFIG = json.loads((DIR / "config_bot_discord.json").read_text(encoding="utf-8"))

if not CONFIG.get("enabled", True):
    print("Discord com désactivée.")
    exit(0)

TOKEN = os.environ["DISCORD_BOT_TOKEN"]
CHANNEL_ID = int(CONFIG["channel_id"])
QUEUE = DIR / "queue.json"
COMMANDS = DIR / "commands.json"
POLL_INTERVAL = 1

intents = discord.Intents.default()
intents.message_content = True
client = discord.Client(intents=intents)

_channel = None


def lire(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def ecrire(path: Path, data: dict):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


# ------------------------------------------------------------------
# Commandes autonomes (sans Claude actif)
# ------------------------------------------------------------------

def _cmd_help() -> str:
    return (
        "📋 **Commandes disponibles**\n"
        "`!ping` — test connexion bot\n"
        "`!help` — cette aide\n"
        "_(tout autre message → transmis à Claude si actif)_"
    )


def _cmd_ping() -> str:
    cmd = lire(COMMANDS)
    claude = "✅ actif" if cmd["status"] in ("idle", "processing") else "⚠️ inconnu"
    return f"🏓 Pong ! Bot OK — Claude : {claude}"


async def traiter_autonome(message_content: str) -> str | None:
    """Retourne une réponse si c'est une commande autonome, None sinon."""
    stripped = message_content.strip()
    cmd = stripped.lower()

    if cmd == "!help":
        return _cmd_help()
    if cmd == "!ping":
        return _cmd_ping()
    return None


# ------------------------------------------------------------------
# Events Discord
# ------------------------------------------------------------------

@client.event
async def on_ready():
    global _channel
    _channel = await client.fetch_channel(CHANNEL_ID)
    print(f"Bot pret -> #{_channel.name}")
    asyncio.ensure_future(boucle_polling())


@client.event
async def on_message(message):
    if message.author == client.user:
        return
    if message.channel.id != CHANNEL_ID:
        return

    # Commandes autonomes (priorité absolue)
    reponse = await traiter_autonome(message.content)
    if reponse:
        await _channel.send(reponse)
        return

    # Mode réponse interactive (claude_bridge.envoyer) : priorité si une attente est en cours
    q = lire(QUEUE)
    if q["status"] == "waiting":
        q["response"] = message.content
        q["status"] = "responded"
        q["timestamp"] = int(time.time())
        ecrire(QUEUE, q)
        return

    # Mode commande Claude : si Claude attend, transmettre
    cmd = lire(COMMANDS)
    if cmd["status"] == "idle":
        # Préfixe novice si message commence par "? "
        contenu = message.content
        if contenu.strip().startswith("? "):
            sujet = contenu.strip()[2:].strip()
            contenu = f"Explique à un novice complet, en termes simples et concrets (pas de jargon) : {sujet}"
        await _channel.send(f"👀 Reçu : `{message.content[:100]}`")
        ecrire(COMMANDS, {
            "status": "pending",
            "command": contenu,
            "timestamp": int(time.time())
        })


async def boucle_polling():
    """Envoie les messages en attente dans queue.json vers Discord."""
    _dernier_ts_envoye = 0
    while True:
        try:
            q = lire(QUEUE)
            ts = q.get("timestamp", 0)
            if q["status"] == "pending" and q["message"] and ts != _dernier_ts_envoye:
                _dernier_ts_envoye = ts
                q["status"] = "waiting"
                q["response"] = ""
                ecrire(QUEUE, q)
                await _channel.send(q["message"])
        except Exception as e:
            print(f"Erreur polling : {e}")
        await asyncio.sleep(POLL_INTERVAL)


client.run(TOKEN)
