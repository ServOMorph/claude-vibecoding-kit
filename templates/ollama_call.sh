#!/bin/bash
# Usage : ./ollama_call.sh "prompt"
# Override modèle : OLLAMA_MODEL=autre:tag ./ollama_call.sh "prompt"
MODEL="${OLLAMA_MODEL:-gemma4:e4b}"

if [ -z "$1" ]; then
  echo "ERREUR: prompt manquant. Usage : ./ollama_call.sh \"prompt\"" >&2
  exit 1
fi

PY=$(command -v python3 || command -v python)
if [ -z "$PY" ]; then
  echo "ERREUR: python introuvable dans le PATH." >&2
  exit 1
fi

if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
  echo "ERREUR: Ollama n'est pas démarré. Lancer 'ollama serve' puis réessayer." >&2
  exit 1
fi

"$PY" - "$MODEL" "$1" <<'PYEOF'
import json
import sys
import urllib.error
import urllib.request

model, prompt = sys.argv[1], sys.argv[2]
payload = json.dumps({"model": model, "prompt": prompt, "stream": False}).encode("utf-8")
req = urllib.request.Request(
    "http://localhost:11434/api/generate",
    data=payload,
    headers={"Content-Type": "application/json"},
)

try:
    with urllib.request.urlopen(req) as resp:
        data = json.load(resp)
except urllib.error.HTTPError as e:
    body = e.read().decode("utf-8", "replace")
    try:
        detail = json.loads(body).get("error", body)
    except json.JSONDecodeError:
        detail = body
    print("ERREUR Ollama (HTTP %d): %s" % (e.code, detail), file=sys.stderr)
    sys.exit(1)
except urllib.error.URLError as e:
    print("ERREUR: connexion a Ollama impossible: %s" % e.reason, file=sys.stderr)
    sys.exit(1)

response = data.get("response")
if not response:
    print("ERREUR: reponse vide ou inattendue du modele", file=sys.stderr)
    sys.exit(1)

sys.stdout.write(response)
if not response.endswith("\n"):
    sys.stdout.write("\n")
PYEOF
