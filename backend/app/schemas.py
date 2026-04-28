from pydantic import BaseModel, Field

class PredictionRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)

class PredictionResponse(BaseModel):
    label: str
    confidence: float