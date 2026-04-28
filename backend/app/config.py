from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = os.getenv(
    "MODEL_PATH",
    str(BASE_DIR / "sentiment-model")
)