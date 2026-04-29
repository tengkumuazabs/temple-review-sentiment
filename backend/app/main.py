from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import PredictionRequest, PredictionResponse
from app.model import model_instance
import os

app = FastAPI(title="Sentiment API", version="1.0")

# Configure CORS for different environments
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict", response_model=PredictionResponse)
def predict(req: PredictionRequest):
    return model_instance.predict(req.text)