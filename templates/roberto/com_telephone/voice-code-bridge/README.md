# voice-code-bridge

Prototype d'assistant vocal distant pour Claude Code : PWA mobile (chat + capture vocale) connectée
en WebSocket à un serveur Node local, avec transcription (Whisper local) et synthèse vocale (Piper
local). Aucune donnée envoyée en cloud.

## Composants

- `mobile/` : PWA (HTML/JS statique), servie par le serveur Node.
- `server/server.js` : serveur HTTP + WebSocket (port 5000). Sert la PWA, relaie STT/TTS, journalise
  les échanges dans `server/messages.log`.
- `server/stt_server.py` : serveur Whisper local (`faster-whisper`, port 5001).
- `server/tts_server.py` : serveur Piper local (port 5002), nécessite le modèle de voix (voir plus bas).

## Installation

```bash
cd server
npm install
pip install faster-whisper piper-tts
```

Télécharger le modèle de voix Piper français (non versionné, ~63 Mo) :
```bash
mkdir voices
curl -L -o voices/fr_FR-siwis-medium.onnx "https://huggingface.co/rhasspy/piper-voices/resolve/main/fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx"
curl -L -o voices/fr_FR-siwis-medium.onnx.json "https://huggingface.co/rhasspy/piper-voices/resolve/main/fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx.json"
```

## Authentification

`node server.js` exige la variable d'environnement `AUTH_TOKEN` (le serveur refuse de démarrer
sans elle). Générer un jeton aléatoire, par exemple :

```bash
AUTH_TOKEN=$(openssl rand -hex 24)
export AUTH_TOKEN
```

## Lancement (3 processus séparés)

```bash
python stt_server.py      # port 5001
python tts_server.py      # port 5002
AUTH_TOKEN=... node server.js   # port 5000
```

Accès depuis le téléphone : exposer le port 5000 via un tunnel (Cloudflare Tunnel, Tailscale, etc.)
pour un accès hors LAN, puis ouvrir une première fois `https://<url-tunnel>/?token=<AUTH_TOKEN>`.
Le serveur pose un cookie de session ; les visites suivantes n'ont plus besoin du paramètre `token`
dans l'URL. `POST /send` (utilisé par l'agent Claude Code local) n'est accessible que depuis
`127.0.0.1`, indépendamment du jeton.

## Traitement des messages

Le serveur ne répond pas automatiquement : chaque message utilisateur est journalisé dans
`server/messages.log`. Un agent Claude Code surveille ce fichier et répond via une requête HTTP
`POST /send` (`{"text": "..."}`), qui synthétise l'audio et le pousse au client connecté.
