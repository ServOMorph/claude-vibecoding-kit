from __future__ import annotations

import time

import win32gui

from UI_WEB import launcher

WAIT_START_MENU_MS = 400
WAIT_TYPE_MS = 300
WAIT_WINDOW_MS = 1500
WAIT_WINDOW_TIMEOUT_MS = 8000


def lancer_programme(name: str) -> tuple[bool, str]:
    before = launcher.list_visible_windows()

    launcher.press_key(launcher.VK_LWIN)
    time.sleep(WAIT_START_MENU_MS / 1000)
    launcher.type_text(name)
    time.sleep(WAIT_TYPE_MS / 1000)
    launcher.press_key(launcher.VK_RETURN)

    time.sleep(WAIT_WINDOW_MS / 1000)
    hwnd = win32gui.GetForegroundWindow()
    if not hwnd or hwnd in before:
        hwnd = launcher.wait_new_window(before, WAIT_WINDOW_TIMEOUT_MS)

    if not hwnd:
        return False, f"Echec du lancement de {name}."

    launcher.position_right_half(hwnd)
    return True, f"{name} lance."
