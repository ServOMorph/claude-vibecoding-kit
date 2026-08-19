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

## Lancement (3 processus séparés)

```bash
python stt_server.py      # port 5001
python tts_server.py      # port 5002
node server.js            # port 5000
```

Accès depuis le téléphone : exposer le port 5000 via un tunnel (Cloudflare Tunnel, Tailscale, etc.)
pour un accès hors LAN. Voir `signals.md` du kit pour l'état des tâches restantes (authentification
non implémentée à ce stade).

## Traitement des messages

Le serveur ne répond pas automatiquement : chaque message utilisateur est journalisé dans
`server/messages.log`. Un agent Claude Code surveille ce fichier et répond via une requête HTTP
`POST /send` (`{"text": "..."}`), qui synthétise l'audio et le pousse au client connecté.
