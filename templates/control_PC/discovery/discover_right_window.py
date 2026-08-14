"""Observation et exploration prudente de la fenêtre visible à droite.

Le processus ne clique jamais seul. Il enregistre les captures, les zones
visuellement candidates et les changements d'état. Un clic ne peut être émis
qu'avec --click X Y --confirm-click.
"""

from __future__ import annotations

import argparse
import ctypes
import json
import time
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import cv2
import numpy as np
import pyautogui
import win32gui
from PIL import Image, ImageGrab


ESC_KEY = 0x1B


@dataclass
class WindowInfo:
    handle: int
    title: str
    left: int
    top: int
    right: int
    bottom: int

    @property
    def width(self) -> int:
        return self.right - self.left

    @property
    def height(self) -> int:
        return self.bottom - self.top


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def escape_pressed() -> bool:
    return bool(ctypes.windll.user32.GetAsyncKeyState(ESC_KEY) & 0x8000)


def visible_windows() -> list[WindowInfo]:
    windows: list[WindowInfo] = []

    def collect(handle: int, _: Any) -> bool:
        if not win32gui.IsWindowVisible(handle) or win32gui.IsIconic(handle):
            return True
        title = win32gui.GetWindowText(handle).strip()
        if not title:
            return True
        left, top, right, bottom = win32gui.GetWindowRect(handle)
        if right <= left or bottom <= top:
            return True
        windows.append(WindowInfo(handle, title, left, top, right, bottom))
        return True

    win32gui.EnumWindows(collect, None)
    return windows


def choose_right_window(screen_width: int, screen_height: int) -> WindowInfo | None:
    right_left = screen_width // 2
    candidates: list[tuple[int, WindowInfo]] = []
    for window in visible_windows():
        overlap_left = max(window.left, right_left)
        overlap_top = max(window.top, 0)
        overlap_right = min(window.right, screen_width)
        overlap_bottom = min(window.bottom, screen_height)
        overlap = max(0, overlap_right - overlap_left) * max(0, overlap_bottom - overlap_top)
        if overlap >= (screen_width // 2) * (screen_height // 4):
            # EnumWindows renvoie les fenêtres de haut en bas : la première
            # couvrant substantiellement la zone droite est celle visible.
            return window
        if overlap:
            candidates.append((overlap, window))
    return max(candidates, key=lambda item: item[0])[1] if candidates else None


def detect_candidates(crop: Image.Image, x_offset: int) -> list[dict[str, int]]:
    bgr = cv2.cvtColor(np.array(crop.convert("RGB")), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 60, 160)
    contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    candidates: list[dict[str, int]] = []

    for contour in contours:
        x, y, width, height = cv2.boundingRect(contour)
        area = width * height
        if width < 24 or height < 16 or area < 700 or width > crop.width * 0.9 or height > 140:
            continue
        perimeter = cv2.arcLength(contour, True)
        if perimeter == 0:
            continue
        compactness = cv2.contourArea(contour) / area
        if compactness < 0.12:
            continue
        candidates.append({"x": x + x_offset, "y": y, "width": width, "height": height})

    candidates.sort(key=lambda item: item["width"] * item["height"], reverse=True)
    unique: list[dict[str, int]] = []
    for candidate in candidates:
        if any(
            abs(candidate["x"] - prior["x"]) < 8
            and abs(candidate["y"] - prior["y"]) < 8
            and abs(candidate["width"] - prior["width"]) < 8
            and abs(candidate["height"] - prior["height"]) < 8
            for prior in unique
        ):
            continue
        unique.append(candidate)
        if len(unique) == 30:
            break
    return unique


def annotate(crop: Image.Image, candidates: list[dict[str, int]], x_offset: int) -> Image.Image:
    image = cv2.cvtColor(np.array(crop.convert("RGB")), cv2.COLOR_RGB2BGR)
    for index, candidate in enumerate(candidates, start=1):
        x = candidate["x"] - x_offset
        y = candidate["y"]
        width = candidate["width"]
        height = candidate["height"]
        cv2.rectangle(image, (x, y), (x + width, y + height), (175, 75, 120), 2)
        cv2.putText(image, str(index), (x + 4, y + 17), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (235, 190, 250), 1, cv2.LINE_AA)
    return Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))


def image_delta(previous: Image.Image | None, current: Image.Image) -> float | None:
    if previous is None:
        return None
    before = np.asarray(previous.convert("L"), dtype=np.int16)
    after = np.asarray(current.convert("L"), dtype=np.int16)
    return round(float(np.mean(np.abs(after - before))), 2)


def write_report(output: Path, target: WindowInfo | None, observations: list[dict[str, Any]]) -> None:
    report = output / "analyse.md"
    lines = [
        "# Analyse de la fenêtre droite",
        "",
        "Rapport généré automatiquement par `discover_right_window.py`.",
        "",
        "## Cible observée",
        "",
    ]
    if target:
        lines += [
            f"- Titre : `{target.title}`",
            f"- Géométrie : `{target.left},{target.top}` — `{target.width}×{target.height}`",
        ]
    else:
        lines.append("- Aucune fenêtre cible détectée.")

    lines += ["", "## Observations", ""]
    if not observations:
        lines.append("Aucune capture enregistrée.")
    else:
        for item in observations:
            delta = "initiale" if item["screen_change"] is None else str(item["screen_change"])
            lines.append(
                f"- `{item['timestamp']}` — {item['candidate_count']} zones candidates, "
                f"variation visuelle : {delta}, capture : [{item['image']}]({item['image']})"
            )

    lines += [
        "",
        "## Sécurité et périmètre",
        "",
        "- Les zones listées sont des **candidates visuelles** : elles ne sont pas présumées cliquables.",
        "- Aucun clic automatique n'est émis par le mode observation.",
        "- `Esc` arrête immédiatement le processus.",
        "- Toute exploration par clic doit être confirmée et vérifiée par une capture avant/après.",
    ]
    report.write_text("\n".join(lines) + "\n", encoding="utf-8")


def emit_click(x: int, y: int, output: Path) -> None:
    before = ImageGrab.grab()
    before.save(output / "before_click.png")
    pyautogui.click(x, y)
    time.sleep(0.7)
    after = ImageGrab.grab()
    after.save(output / "after_click.png")
    (output / "click.json").write_text(
        json.dumps({"timestamp": utc_now(), "x": x, "y": y, "screen_change": image_delta(before, after)}, indent=2),
        encoding="utf-8",
    )


def observe(output: Path, interval: float, duration: float) -> None:
    output.mkdir(parents=True, exist_ok=True)
    screenshot = ImageGrab.grab()
    width, height = screenshot.size
    right_left = width // 2
    target = choose_right_window(width, height)
    observations: list[dict[str, Any]] = []
    previous: Image.Image | None = None
    started = time.monotonic()

    while not escape_pressed() and (duration <= 0 or time.monotonic() - started < duration):
        full = ImageGrab.grab()
        crop = full.crop((right_left, 0, width, height))
        candidates = detect_candidates(crop, right_left)
        index = len(observations) + 1
        image_name = f"capture_{index:03d}.png"
        annotated_name = f"zones_{index:03d}.png"
        crop.save(output / image_name)
        annotate(crop, candidates, right_left).save(output / annotated_name)
        observation = {
            "timestamp": utc_now(),
            "image": image_name,
            "annotated_image": annotated_name,
            "candidate_count": len(candidates),
            "candidates": candidates,
            "screen_change": image_delta(previous, crop),
        }
        observations.append(observation)
        with (output / "observations.jsonl").open("a", encoding="utf-8") as stream:
            stream.write(json.dumps(observation, ensure_ascii=False) + "\n")
        write_report(output, target, observations)
        previous = crop
        time.sleep(interval)

    write_report(output, target, observations)


def main() -> None:
    parser = argparse.ArgumentParser(description="Observe la moitié droite de l'écran sans clic automatique.")
    parser.add_argument("--output", type=Path, default=Path("analysis"), help="Dossier des captures et du rapport.")
    parser.add_argument("--interval", type=float, default=2.0, help="Intervalle entre captures, en secondes.")
    parser.add_argument("--duration", type=float, default=0, help="Durée en secondes ; 0 signifie jusqu'à Esc.")
    parser.add_argument("--click", nargs=2, type=int, metavar=("X", "Y"), help="Clic unique documenté.")
    parser.add_argument("--confirm-click", action="store_true", help="Autorise --click après confirmation explicite.")
    args = parser.parse_args()

    if args.click:
        if not args.confirm_click:
            parser.error("--click exige --confirm-click")
        args.output.mkdir(parents=True, exist_ok=True)
        emit_click(args.click[0], args.click[1], args.output)
        return

    observe(args.output, max(args.interval, 0.2), args.duration)


if __name__ == "__main__":
    main()
