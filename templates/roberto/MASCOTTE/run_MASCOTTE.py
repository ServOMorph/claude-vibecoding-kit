import hashlib
import http.server
import socketserver
import threading
import webbrowser
from pathlib import Path

DOSSIER = Path(__file__).parent
PORT = 8642
CHEMIN_VERSION = "/animations/version.js"

FICHIERS_SUIVIS = [
    "index.html",
    "style.css",
    "app.js",
    "animations/registry.js",
    "animations/animations_base.js",
    "animations/animations_variantes.js",
    "animations/animations_plans.js",
    "animations/animations_logo.js",
    "animations/animations_codex.js",
    "animations/montage.js",
]


def calculer_version():
    hachage = hashlib.md5()
    for nom in FICHIERS_SUIVIS:
        chemin = DOSSIER / nom
        if chemin.exists():
            hachage.update(chemin.read_bytes())
    return "v-" + hachage.hexdigest()[:8]


class GestionnaireSansCache(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DOSSIER), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        super().end_headers()

    def do_GET(self):
        if self.path == CHEMIN_VERSION:
            contenu = f"const VERSION_GENERATION_MASCOTTE = '{calculer_version()}';".encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/javascript; charset=utf-8")
            self.send_header("Content-Length", str(len(contenu)))
            self.end_headers()
            self.wfile.write(contenu)
            return
        super().do_GET()


class Serveur(socketserver.TCPServer):
    allow_reuse_address = True


def main():
    url = f"http://127.0.0.1:{PORT}/index.html"
    with Serveur(("127.0.0.1", PORT), GestionnaireSansCache) as httpd:
        threading.Timer(0.4, lambda: webbrowser.open(url)).start()
        print(f"Serveur MASCOTTE actif sur {url}")
        print("Modifier les fichiers puis rafraîchir le navigateur suffit. Ctrl+C pour arrêter.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
