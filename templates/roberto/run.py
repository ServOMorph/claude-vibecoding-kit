import subprocess
import sys
import time
from pathlib import Path

UI_WEB_DIR = Path(__file__).parent / "UI_WEB"


def lancer():
    return subprocess.Popen([sys.executable, "-m", "UI_WEB.app"], cwd=Path(__file__).parent)


def dernier_mtime():
    return max(f.stat().st_mtime for f in UI_WEB_DIR.rglob("*") if f.is_file())


def main():
    watch = "--watch" in sys.argv

    process = lancer()

    if not watch:
        process.wait()
        return

    mtime_precedent = dernier_mtime()
    try:
        while True:
            time.sleep(1)
            mtime = dernier_mtime()
            if mtime != mtime_precedent:
                mtime_precedent = mtime
                process.terminate()
                process.wait()
                process = lancer()
    except KeyboardInterrupt:
        process.terminate()


if __name__ == "__main__":
    main()
