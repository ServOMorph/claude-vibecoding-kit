from __future__ import annotations

import threading

import webview

from MACROS import capturer_coordonnees, envoyer_message_opencode, lancer_programme, opencode

from . import recent_folders

DEFAULT_OPENCODE_DIR = "D:\\ServOMorph"


class Api:
    def launch_program(self, name: str) -> dict:
        name = (name or "").strip()
        if not name:
            return {"success": False, "message": "Nom de programme vide."}

        success, message = lancer_programme.lancer_programme(name)
        return {"success": success, "message": message}

    def choose_folder(self) -> dict:
        result = webview.windows[0].create_file_dialog(
            webview.FileDialog.FOLDER, directory=DEFAULT_OPENCODE_DIR
        )
        if not result:
            return {"folder": None}
        return {"folder": result[0]}

    def open_opencode(self, folder: str) -> dict:
        folder = (folder or "").strip()
        if not folder:
            return {"success": False, "message": "Dossier vide.", "recent": recent_folders.load_recent()}

        success, message = opencode.launch_opencode(folder)
        recent = recent_folders.add_recent(folder) if success else recent_folders.load_recent()
        return {"success": success, "message": message, "recent": recent}

    def get_recent_folders(self) -> list[str]:
        return recent_folders.load_recent()

    def send_message_to_opencode(self, message: str) -> dict:
        message = (message or "").strip()
        if not message:
            return {"success": False, "message": "Message vide."}

        success, message_resultat = envoyer_message_opencode.envoyer_message(message)
        return {"success": success, "message": message_resultat}

    def start_coord_capture(self) -> dict:
        def _capturer() -> None:
            coord = capturer_coordonnees.attendre_capture()
            webview.windows[0].evaluate_js(
                f"log('Coordonnee {coord} copiee dans le presse-papier.')"
            )

        threading.Thread(target=_capturer, daemon=True).start()
        return {"success": True, "message": "Capture active : appuie sur F8 sur la position visee."}
