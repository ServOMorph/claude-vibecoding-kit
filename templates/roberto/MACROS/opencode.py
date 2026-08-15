from __future__ import annotations

import time

import pyautogui
import pywintypes
import win32con
import win32gui

from UI_WEB import launcher

WAIT_WINDOW_TIMEOUT_MS = 8000
FOCUS_RETRIES = 5
FOCUS_RETRY_DELAY_S = 0.5
SEARCH_MENU_DELAY_S = 0.5
SEARCH_RESULTS_DELAY_S = 0.8

NEW_WINDOW_BUTTON_X = 1039
NEW_WINDOW_BUTTON_Y = 23
ICON_CLICK_DELAY_S = 3

NOUVELLE_CONVERSATION_ETAPE_1 = (1311, 22)
NOUVELLE_CONVERSATION_ETAPE_2 = (1274, 22)
CHAMP_PROMPT_INITIAL = (1132, 491)
CHAMP_PROMPT_SUIVANT = (1035, 976)
NOUVELLE_CONVERSATION_DELAI_S = 1
CLICK_INDICATOR_DELAY_S = 1

_hwnd: int | None = None


def _set_foreground(hwnd: int) -> bool:
    for _ in range(FOCUS_RETRIES):
        try:
            win32gui.SetForegroundWindow(hwnd)
            return True
        except pywintypes.error:
            launcher.press_key(win32con.VK_MENU)
            time.sleep(FOCUS_RETRY_DELAY_S)
    return False


def launch_opencode(folder: str) -> tuple[bool, str]:
    global _hwnd

    before = launcher.list_visible_windows()

    launcher.press_key(win32con.VK_LWIN)
    time.sleep(SEARCH_MENU_DELAY_S)
    launcher.type_text("opencode")
    time.sleep(SEARCH_RESULTS_DELAY_S)
    launcher.press_key(launcher.VK_RETURN)

    hwnd = launcher.wait_new_window(before, WAIT_WINDOW_TIMEOUT_MS)
    if not hwnd:
        return False, "Echec du lancement d'OpenCode."

    launcher.position_right_half(hwnd)
    _hwnd = hwnd
    _set_foreground(hwnd)

    click_new_window_button()
    return True, "OpenCode lance."


def click_new_window_button() -> None:
    launcher.show_click_indicator(NEW_WINDOW_BUTTON_X, NEW_WINDOW_BUTTON_Y, ICON_CLICK_DELAY_S)
    pyautogui.click(NEW_WINDOW_BUTTON_X, NEW_WINDOW_BUTTON_Y)


def _cliquer(x: int, y: int) -> None:
    launcher.show_click_indicator(x, y, CLICK_INDICATOR_DELAY_S)
    pyautogui.click(x, y)


def nouvelle_conversation() -> None:
    _cliquer(*NOUVELLE_CONVERSATION_ETAPE_1)
    time.sleep(NOUVELLE_CONVERSATION_DELAI_S)
    _cliquer(*NOUVELLE_CONVERSATION_ETAPE_2)
    time.sleep(NOUVELLE_CONVERSATION_DELAI_S)
    _cliquer(*CHAMP_PROMPT_INITIAL)


def envoyer_prompt_initial(message: str) -> None:
    launcher.copy_to_clipboard(message)
    launcher.paste()
    launcher.press_key(launcher.VK_RETURN)


def envoyer_message_suivant(message: str) -> None:
    _cliquer(*CHAMP_PROMPT_SUIVANT)
    launcher.copy_to_clipboard(message)
    launcher.paste()
    launcher.press_key(launcher.VK_RETURN)


def find_opencode_window() -> int | None:
    trouvees: list[int] = []

    def _check(hwnd: int, _: None) -> bool:
        if win32gui.IsWindowVisible(hwnd) and "opencode" in win32gui.GetWindowText(hwnd).lower():
            trouvees.append(hwnd)
        return True

    win32gui.EnumWindows(_check, None)
    return trouvees[0] if trouvees else None


def focus_opencode() -> bool:
    global _hwnd

    hwnd = _hwnd if _hwnd is not None and win32gui.IsWindow(_hwnd) else find_opencode_window()
    if hwnd is None:
        return False

    _hwnd = hwnd
    return _set_foreground(hwnd)


def ensure_opencode_foreground() -> bool:
    hwnd = _hwnd if _hwnd is not None and win32gui.IsWindow(_hwnd) else find_opencode_window()
    if hwnd is None:
        return False

    if win32gui.GetForegroundWindow() == hwnd:
        return True

    return focus_opencode()
