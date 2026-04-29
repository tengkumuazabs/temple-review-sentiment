from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# load .env file automatically
load_dotenv(BASE_DIR / ".env")

LOCAL_MODEL_PATH = str(BASE_DIR / "sentiment-model")