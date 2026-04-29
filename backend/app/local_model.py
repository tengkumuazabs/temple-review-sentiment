# app/models/local_model.py
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from pathlib import Path
from app.config import LOCAL_MODEL_PATH

class LocalModel:
    def __init__(self):
        # Load from local model directory
        local_path = Path(LOCAL_MODEL_PATH)
        if not local_path.exists():
            raise FileNotFoundError(f"Model not found at {LOCAL_MODEL_PATH}")

        source = LOCAL_MODEL_PATH

        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        print(f"[LocalModel] Loading from: {source}")

        self.tokenizer = AutoTokenizer.from_pretrained(source)

        self.model = AutoModelForSequenceClassification.from_pretrained(source)

        self.model.to(self.device)
        self.model.eval()

        self.labels = self.model.config.id2label

    def predict(self, text: str):
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding=True
        )

        inputs = {k: v.to(self.device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = self.model(**inputs)
            probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
            pred = torch.argmax(probs, dim=1).item()

        return {
            "label": self.labels[pred],
            "confidence": float(probs[0][pred])
        }