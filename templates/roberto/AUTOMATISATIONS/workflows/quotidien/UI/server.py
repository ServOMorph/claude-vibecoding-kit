from __future__ import annotations

import json
import webbrowser
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

UI_DIR = Path(__file__).resolve().parent
ORDRE_PROJETS = UI_DIR.parent / "ordre_projets.md"
PORT = 5100

HEADER = (
    "# Ordre des projets\n\n"
    "Liste des projets de `DEPLOYMENTS.md` classés par rang de priorité "
    "(1 = priorité la plus haute).\n"
    "Édition manuelle uniquement — aucun mécanisme automatique ne modifie ce fichier.\n\n"
    "Un projet présent dans `DEPLOYMENTS.md` mais absent d'ici est un nouveau projet non "
    "classé : le\n"
    "workflow quotidien doit le signaler à l'utilisateur plutôt que de lui attribuer un rang "
    "par défaut.\n\n"
)
TABLE_HEADER = "| Rang | Projet | Alias (zones.md) |\n|------|--------|-------------------|\n"


def read_projects() -> list[dict]:
    projects = []
    for line in ORDRE_PROJETS.read_text(encoding="utf-8").splitlines():
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) != 3 or cells[0] in ("Rang", "------"):
            continue
        projects.append({"nom": cells[1], "alias": cells[2]})
    return projects


def write_projects(projects: list[dict]) -> None:
    rows = "".join(
        f"| {i + 1} | {p['nom']} | {p['alias']} |\n" for i, p in enumerate(projects)
    )
    ORDRE_PROJETS.write_text(HEADER + TABLE_HEADER + rows, encoding="utf-8", newline="\n")


class Handler(BaseHTTPRequestHandler):
    def _send_json(self, payload: dict, status: int = 200) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        if self.path == "/order":
            self._send_json({"projects": read_projects()})
            return
        path = self.path.lstrip("/") or "index.html"
        file_path = UI_DIR / path
        if not file_path.is_file():
            self.send_response(404)
            self.end_headers()
            return
        content_type = "text/html"
        if path.endswith(".js"):
            content_type = "text/javascript"
        elif path.endswith(".css"):
            content_type = "text/css"
        body = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self) -> None:
        if self.path != "/order":
            self.send_response(404)
            self.end_headers()
            return
        length = int(self.headers.get("Content-Length", 0))
        payload = json.loads(self.rfile.read(length))
        write_projects(payload["projects"])
        self._send_json({"ok": True})

    def log_message(self, format: str, *args) -> None:
        pass


def main() -> None:
    server = HTTPServer(("127.0.0.1", PORT), Handler)
    webbrowser.open(f"http://127.0.0.1:{PORT}/")
    server.serve_forever()


if __name__ == "__main__":
    main()
