from __future__ import annotations

from UI_WEB import launcher

from . import opencode


def envoyer_message(message: str) -> tuple[bool, str]:
    if not opencode.focus_opencode():
        return False, "OpenCode n'est pas ouvert."

    launcher.type_text(message)
    launcher.press_key(launcher.VK_RETURN)
    return True, "Message envoye."
