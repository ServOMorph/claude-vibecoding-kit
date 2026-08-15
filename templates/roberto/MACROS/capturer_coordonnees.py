from __future__ import annotations

import win32api
import win32clipboard
import win32con
import win32gui

HOTKEY_ID = 1
VK_F8 = win32con.VK_F8


def _copier_dans_presse_papier(texte: str) -> None:
    win32clipboard.OpenClipboard()
    win32clipboard.EmptyClipboard()
    win32clipboard.SetClipboardText(texte, win32clipboard.CF_UNICODETEXT)
    win32clipboard.CloseClipboard()


def attendre_capture() -> str:
    win32gui.RegisterHotKey(None, HOTKEY_ID, 0, VK_F8)
    try:
        while True:
            msg = win32gui.GetMessage(None, 0, 0)
            if msg[1][1] == win32con.WM_HOTKEY and msg[1][2] == HOTKEY_ID:
                x, y = win32api.GetCursorPos()
                coord = f"{x},{y}"
                _copier_dans_presse_papier(coord)
                return coord
    finally:
        win32gui.UnregisterHotKey(None, HOTKEY_ID)


if __name__ == "__main__":
    attendre_capture()
