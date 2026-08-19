import io
import json
import wave
from http.server import BaseHTTPRequestHandler, HTTPServer
from piper import PiperVoice
from piper.config import SynthesisConfig

PORT = 5002
MODEL_PATH = "voices/fr_FR-siwis-medium.onnx"
SYN_CONFIG = SynthesisConfig(length_scale=1.25)

print("Chargement de la voix Piper (fr_FR-siwis-medium)...", flush=True)
voice = PiperVoice.load(MODEL_PATH)
print("Voix chargee.", flush=True)


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/synthesize":
            self.send_response(404)
            self.end_headers()
            return

        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)

        try:
            text = json.loads(body).get("text", "")
        except Exception:
            self.send_response(400)
            self.end_headers()
            return

        buffer = io.BytesIO()
        with wave.open(buffer, "wb") as wav_file:
            voice.synthesize_wav(text, wav_file, syn_config=SYN_CONFIG)

        audio_bytes = buffer.getvalue()

        self.send_response(200)
        self.send_header("Content-Type", "audio/wav")
        self.send_header("Content-Length", str(len(audio_bytes)))
        self.end_headers()
        self.wfile.write(audio_bytes)

    def log_message(self, format, *args):
        pass


if __name__ == "__main__":
    server = HTTPServer(("127.0.0.1", PORT), Handler)
    print(f"Serveur TTS demarre sur le port {PORT}", flush=True)
    server.serve_forever()
