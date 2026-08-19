import json
import os
import tempfile
from http.server import BaseHTTPRequestHandler, HTTPServer
from faster_whisper import WhisperModel

MODEL_SIZE = "small"
PORT = 5001

print(f"Chargement du modele Whisper ({MODEL_SIZE})...", flush=True)
model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8")
print("Modele charge.", flush=True)


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/transcribe":
            self.send_response(404)
            self.end_headers()
            return

        length = int(self.headers.get("Content-Length", 0))
        audio_bytes = self.rfile.read(length)

        fd, tmp_path = tempfile.mkstemp(suffix=".audio")
        try:
            with os.fdopen(fd, "wb") as f:
                f.write(audio_bytes)

            segments, _ = model.transcribe(tmp_path, language="fr")
            text = "".join(seg.text for seg in segments).strip()
            status = 200
            payload = {"text": text}
        except Exception as exc:
            status = 400
            payload = {"error": str(exc)}
        finally:
            os.remove(tmp_path)

        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        pass


if __name__ == "__main__":
    server = HTTPServer(("127.0.0.1", PORT), Handler)
    print(f"Serveur STT demarre sur le port {PORT}", flush=True)
    server.serve_forever()
