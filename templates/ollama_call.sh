#!/bin/bash
# Usage : ./ollama_call.sh "prompt"
# Override modèle : OLLAMA_MODEL=autre:tag ./ollama_call.sh "prompt"
MODEL="${OLLAMA_MODEL:-gemma3:4b}"

# Vérification que le service est disponible
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
  echo "ERREUR: Ollama n'est pas démarré. Lancer 'ollama serve' puis réessayer." >&2
  exit 1
fi

jq -n --arg model "$MODEL" --arg prompt "$1" \
  '{model:$model, prompt:$prompt, stream:false}' \
  | curl -s http://localhost:11434/api/generate \
      -H "Content-Type: application/json" \
      -d @- \
  | jq -r '.response // "ERREUR: réponse vide ou inattendue du modèle"'
