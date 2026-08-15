from __future__ import annotations

import ctypes
import time
import tkinter as tk

import win32clipboard
import win32con
import win32gui

from .screen import primary_screen_right_half

INPUT_KEYBOARD = 1
KEYEVENTF_KEYUP = 0x0002
KEYEVENTF_UNICODE = 0x0004
VK_LWIN = 0x5B
VK_RETURN = 0x0D
VK_CONTROL = 0x11
VK_V = 0x56

WAIT_WINDOW_POLL_MS = 100

CLICK_INDICATOR_RADIUS = 15
CLICK_INDICATOR_COLOR = "red"


class _KeyBdInput(ctypes.Structure):
    _fields_ = [
        ("wVk", ctypes.c_ushort),
        ("wScan", ctypes.c_ushort),
        ("dwFlags", ctypes.c_ulong),
        ("time", ctypes.c_ulong),
        ("dwExtraInfo", ctypes.POINTER(ctypes.c_ulong)),
    ]


class _Input(ctypes.Structure):
    _fields_ = [
        ("type", ctypes.c_ulong),
        ("ki", _KeyBdInput),
        ("padding", ctypes.c_ubyte * 8),
    ]


def _send_input(*inputs: _Input) -> None:
    array = (_Input * len(inputs))(*inputs)
    ctypes.windll.user32.SendInput(len(inputs), array, ctypes.sizeof(_Input))


def _key_input(vk: int = 0, scan: int = 0, flags: int = 0) -> _Input:
    return _Input(type=INPUT_KEYBOARD, ki=_KeyBdInput(vk, scan, flags, 0, None))


def press_key(vk: int) -> None:
    _send_input(_key_input(vk=vk))
    _send_input(_key_input(vk=vk, flags=KEYEVENTF_KEYUP))


def type_text(text: str) -> None:
    for char in text:
        code = ord(char)
        _send_input(_key_input(scan=code, flags=KEYEVENTF_UNICODE))
        _send_input(_key_input(scan=code, flags=KEYEVENTF_UNICODE | KEYEVENTF_KEYUP))


def copy_to_clipboard(text: str) -> None:
    win32clipboard.OpenClipboard()
    win32clipboard.EmptyClipboard()
    win32clipboard.SetClipboardText(text, win32clipboard.CF_UNICODETEXT)
    win32clipboard.CloseClipboard()


def paste() -> None:
    _send_input(_key_input(vk=VK_CONTROL))
    _send_input(_key_input(vk=VK_V))
    _send_input(_key_input(vk=VK_V, flags=KEYEVENTF_KEYUP))
    _send_input(_key_input(vk=VK_CONTROL, flags=KEYEVENTF_KEYUP))


def list_visible_windows() -> set[int]:
    windows: set[int] = set()

    def _collect(hwnd: int, _: None) -> bool:
        if win32gui.IsWindowVisible(hwnd) and win32gui.GetWindowText(hwnd):
            windows.add(hwnd)
        return True

    win32gui.EnumWindows(_collect, None)
    return windows


def wait_new_window(before: set[int], timeout_ms: int) -> int:
    deadline = time.monotonic() + timeout_ms / 1000
    while time.monotonic() < deadline:
        for hwnd in list_visible_windows() - before:
            return hwnd
        time.sleep(WAIT_WINDOW_POLL_MS / 1000)
    return 0


def show_click_indicator(x: int, y: int, duration_s: float) -> None:
    radius = CLICK_INDICATOR_RADIUS
    size = radius * 2
    root = tk.Tk()
    root.overrideredirect(True)
    root.attributes("-topmost", True)
    root.attributes("-transparentcolor", "black")
    root.geometry(f"{size}x{size}+{x - radius}+{y - radius}")
    canvas = tk.Canvas(root, width=size, height=size, bg="black", highlightthickness=0)
    canvas.pack()
    canvas.create_oval(2, 2, size - 2, size - 2, outline=CLICK_INDICATOR_COLOR, width=3)
    root.update()
    time.sleep(duration_s)
    root.destroy()


def position_right_half(hwnd: int) -> None:
    geometry = primary_screen_right_half()
    win32gui.ShowWindow(hwnd, win32con.SW_RESTORE)
    win32gui.MoveWindow(
        hwnd,
        geometry["left"],
        geometry["top"],
        geometry["width"],
        geometry["height"],
        True,
    )
