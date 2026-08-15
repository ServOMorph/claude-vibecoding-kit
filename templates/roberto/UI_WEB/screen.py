import ctypes


def primary_screen_right_half() -> dict[str, int]:
    width = ctypes.windll.user32.GetSystemMetrics(0)
    height = ctypes.windll.user32.GetSystemMetrics(1)
    half_width = width // 2
    return {"left": half_width, "top": 0, "width": width - half_width, "height": height}


def primary_screen_left_half() -> dict[str, int]:
    width = ctypes.windll.user32.GetSystemMetrics(0)
    height = ctypes.windll.user32.GetSystemMetrics(1)
    return {"left": 0, "top": 0, "width": width // 2, "height": height}


def enable_dpi_awareness() -> None:
    try:
        ctypes.windll.shcore.SetProcessDpiAwareness(2)
    except (AttributeError, OSError):
        pass
