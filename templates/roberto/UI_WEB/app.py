from __future__ import annotations

import webview

from . import paths
from .api import Api
from .screen import enable_dpi_awareness, primary_screen_left_half


def main() -> None:
    enable_dpi_awareness()
    screen = primary_screen_left_half()
    webview.create_window(
        "Lanceur",
        str(paths.UI_DIR / "index.html"),
        js_api=Api(),
        width=screen["width"],
        height=screen["height"],
        x=screen["left"],
        y=screen["top"],
        background_color="#10131a",
    )
    webview.start(debug=False)


if __name__ == "__main__":
    main()
