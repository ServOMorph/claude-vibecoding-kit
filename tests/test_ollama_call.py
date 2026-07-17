"""Tests du lanceur Ollama.

Exécution rapide sans Ollama : python -m unittest discover -s tests -v
Test réel opt-in : $env:OLLAMA_LIVE_TEST = "1"; python -m unittest tests.test_ollama_call -v
"""

import importlib.util
import io
import json
import os
import subprocess
import sys
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.error import HTTPError, URLError


ROOT = Path(__file__).resolve().parents[1]
LAUNCHER = ROOT / "templates" / "ollama_call.py"


class BinaryStdout:
    def __init__(self):
        self.buffer = io.BytesIO()

    def text(self) -> str:
        return self.buffer.getvalue().decode("utf-8")


class JsonResponse:
    def __init__(self, content: object):
        self.stream = io.BytesIO(json.dumps(content).encode("utf-8"))

    def __enter__(self):
        return self.stream

    def __exit__(self, exc_type, exc_value, traceback):
        return False


class RawResponse:
    def __init__(self, content: bytes):
        self.stream = io.BytesIO(content)

    def __enter__(self):
        return self.stream

    def __exit__(self, exc_type, exc_value, traceback):
        return False


class OllamaCallTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        spec = importlib.util.spec_from_file_location("ollama_call", LAUNCHER)
        cls.module = importlib.util.module_from_spec(spec)
        assert spec.loader is not None
        spec.loader.exec_module(cls.module)

    def invoke(self, arguments, response=None, error=None, environment=None):
        stdout = BinaryStdout()
        stderr = io.StringIO()
        with (
            patch.object(self.module.sys, "argv", ["ollama_call.py", *arguments]),
            patch.object(self.module.sys, "stdout", stdout),
            patch.object(self.module.sys, "stderr", stderr),
            patch.dict(self.module.os.environ, environment or {}, clear=True),
            patch.object(
                self.module.urllib.request,
                "urlopen",
                return_value=response,
                side_effect=error,
            ) as urlopen,
        ):
            code = self.module.main()
        return code, stdout.text(), stderr.getvalue(), urlopen

    def test_missing_prompt_returns_clear_error(self):
        code, stdout, stderr, urlopen = self.invoke([])

        self.assertEqual(code, 1)
        self.assertEqual(stdout, "")
        self.assertIn("prompt manquant", stderr)
        urlopen.assert_not_called()

    def test_request_serializes_special_characters_and_default_model(self):
        prompt = 'Résumé : « test »\nJSON: {"ok": true}'
        code, stdout, stderr, urlopen = self.invoke([prompt], response=JsonResponse({"response": "OK"}))

        self.assertEqual(code, 0)
        self.assertEqual(stdout, "OK\n")
        self.assertEqual(stderr, "")
        request = urlopen.call_args.args[0]
        self.assertEqual(urlopen.call_args.kwargs["timeout"], 60)
        self.assertEqual(request.full_url, "http://localhost:11434/api/generate")
        self.assertEqual(request.get_header("Content-type"), "application/json")
        self.assertEqual(
            json.loads(request.data),
            {"model": "gemma4:e4b", "prompt": prompt, "stream": False},
        )

    def test_model_can_be_selected_with_environment_variable(self):
        code, _, _, urlopen = self.invoke(
            ["Bonjour"],
            response=JsonResponse({"response": "Salut"}),
            environment={"OLLAMA_MODEL": "qwen3:4b"},
        )

        self.assertEqual(code, 0)
        request = urlopen.call_args.args[0]
        self.assertEqual(json.loads(request.data)["model"], "qwen3:4b")

    def test_preserves_response_that_already_ends_with_newline(self):
        code, stdout, stderr, _ = self.invoke(
            ["Bonjour"], response=JsonResponse({"response": "Réponse\n"})
        )

        self.assertEqual(code, 0)
        self.assertEqual(stdout, "Réponse\n")
        self.assertEqual(stderr, "")

    def test_http_json_error_is_reported(self):
        error = HTTPError(
            "http://localhost:11434/api/generate",
            404,
            "Not Found",
            {},
            io.BytesIO(b'{"error":"modele introuvable"}'),
        )
        code, stdout, stderr, _ = self.invoke(["Bonjour"], error=error)

        self.assertEqual(code, 1)
        self.assertEqual(stdout, "")
        self.assertIn("HTTP 404", stderr)
        self.assertIn("modele introuvable", stderr)

    def test_network_error_is_reported(self):
        code, stdout, stderr, _ = self.invoke(["Bonjour"], error=URLError("connexion refusée"))

        self.assertEqual(code, 1)
        self.assertEqual(stdout, "")
        self.assertIn("connexion à Ollama impossible", stderr)

    def test_timeout_is_reported(self):
        code, stdout, stderr, _ = self.invoke(["Bonjour"], error=TimeoutError())

        self.assertEqual(code, 1)
        self.assertEqual(stdout, "")
        self.assertIn("délai d’attente", stderr)

    def test_invalid_json_response_is_reported(self):
        code, stdout, stderr, _ = self.invoke(["Bonjour"], response=RawResponse(b"pas du json"))

        self.assertEqual(code, 1)
        self.assertEqual(stdout, "")
        self.assertIn("réponse JSON invalide", stderr)

    def test_empty_or_unexpected_response_is_reported(self):
        for payload in ({}, {"response": ""}, []):
            with self.subTest(payload=payload):
                code, stdout, stderr, _ = self.invoke(["Bonjour"], response=JsonResponse(payload))

                self.assertEqual(code, 1)
                self.assertEqual(stdout, "")
                self.assertIn("réponse vide ou inattendue", stderr)

    @unittest.skipUnless(os.environ.get("OLLAMA_LIVE_TEST") == "1", "test Ollama réel non demandé")
    def test_live_ollama_returns_a_response(self):
        result = subprocess.run(
            [sys.executable, str(LAUNCHER), "Réponds uniquement : OK"],
            capture_output=True,
            text=True,
            encoding="utf-8",
            timeout=90,
            check=False,
        )

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue(result.stdout.strip())


if __name__ == "__main__":
    unittest.main()
