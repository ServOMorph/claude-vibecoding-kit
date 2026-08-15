"""Envoie un prompt unique au modèle Ollama local."""

import json
import os
import sys
import urllib.error
import urllib.request


def main() -> int:
    if len(sys.argv) != 2:
        print('ERREUR: prompt manquant. Usage : python ollama_call.py "prompt"', file=sys.stderr)
        return 1

    payload = json.dumps(
        {
            "model": os.environ.get("OLLAMA_MODEL", "gemma4:e4b"),
            "prompt": sys.argv[1],
            "stream": False,
        }
    ).encode("utf-8")
    request = urllib.request.Request(
        "http://localhost:11434/api/generate",
        data=payload,
        headers={"Content-Type": "application/json"},
    )

    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            data = json.load(response)
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", "replace")
        try:
            detail = json.loads(body).get("error", body)
        except json.JSONDecodeError:
            detail = body
        print(f"ERREUR Ollama (HTTP {error.code}): {detail}", file=sys.stderr)
        return 1
    except urllib.error.URLError as error:
        print(f"ERREUR: connexion à Ollama impossible: {error.reason}", file=sys.stderr)
        return 1
    except TimeoutError:
        print("ERREUR: délai d’attente Ollama dépassé", file=sys.stderr)
        return 1
    except json.JSONDecodeError:
        print("ERREUR: réponse JSON invalide d’Ollama", file=sys.stderr)
        return 1

    result = data.get("response") if isinstance(data, dict) else None
    if not result:
        print("ERREUR: réponse vide ou inattendue du modèle", file=sys.stderr)
        return 1

    sys.stdout.buffer.write(result.encode("utf-8"))
    if not result.endswith("\n"):
        sys.stdout.buffer.write(b"\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
