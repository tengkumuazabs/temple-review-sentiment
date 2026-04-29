# 🏯 Temple Review Sentiment Analyzer

A full-stack sentiment analysis application specifically trained on Indonesian temple reviews. Analyzes visitor reviews from **Candi Borobudur** and **Candi Prambanan** in both Indonesian and English.

**Live Demo:** https://temple-review-sentiment.vercel.app

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Model Details](#model-details)
6. [Setup & Installation](#setup--installation)
7. [API Documentation](#api-documentation)
8. [Deployment](#deployment)
9. [Development Guide](#development-guide)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 System Overview

### What Does It Do?

```
User Input (Review Text)
    ↓
React Frontend (Vercel)
    ↓
HTTP POST /predict
    ↓
FastAPI Backend (Docker on Home Server)
    ↓
ML Model (Transformer-based)
    ↓
Returns: {label: "positive/negative/neutral", confidence: 0.95}
    ↓
Display Result to User
```

### Key Features

✅ **Multi-language:** Supports Indonesian & English reviews  
✅ **Real-time Analysis:** Instant sentiment prediction  
✅ **Confidence Scores:** Shows model confidence (0-1)  
✅ **History Tracking:** Keeps analysis history in session  
✅ **Responsive UI:** Beautiful Tailwind CSS design  
✅ **GPU Acceleration:** Optional CUDA support on backend  

---

## 🏗️ Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────┐
│              Vercel Frontend (HTTPS)                │
│         https://temple-review-sentiment.vercel.app  │
│  - React + Vite                                     │
│  - Tailwind CSS UI                                  │
│  - Axios HTTP Client                                │
└────────────────────┬────────────────────────────────┘
                     │ HTTP POST /predict
                     │ JSON: {text: "review"}
                     ▼
┌─────────────────────────────────────────────────────┐
│      Docker Container (Home Server 192.168.1.10)    │
│ FastAPI + Uvicorn + Gunicorn                        │
│  ┌─────────────────────────────────────────────┐   │
│  │  Sentiment Analysis Model                   │   │
│  │  - HuggingFace Transformers                 │   │
│  │  - PyTorch Inference                        │   │
│  │  - GPU-accelerated (optional)               │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │  Local Model Files                          │   │
│  │  - config.json                              │   │
│  │  - model.safetensors                        │   │
│  │  - tokenizer.json                           │   │
│  └─────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

### Data Flow

```
1. USER SUBMITS REVIEW
   └─→ React Component: analyze()
   
2. FRONTEND SENDS REQUEST
   └─→ axios.post(VITE_API_URL + "/predict", {text})
   
3. BACKEND RECEIVES REQUEST
   └─→ FastAPI route: /predict (POST)
   
4. MODEL INFERENCE
   └─→ Tokenize text
   └─→ Load model from sentiment-model/
   └─→ Get predictions
   └─→ Calculate confidence
   
5. BACKEND RETURNS RESPONSE
   └─→ JSON: {label, confidence}
   
6. FRONTEND DISPLAYS RESULT
   └─→ Show sentiment badge
   └─→ Show confidence percentage
   └─→ Add to history
```

---

## 🛠️ Technology Stack

### Backend

| Tool | Version | Purpose |
|------|---------|---------|
| **FastAPI** | Latest | Web framework for Python APIs |
| **Uvicorn** | Latest | ASGI server (local dev) |
| **Gunicorn** | Latest | Production WSGI server |
| **PyTorch** | Latest | Deep learning framework |
| **Transformers** | Latest | HuggingFace model library |
| **SafeTensors** | Latest | Model file format |
| **Python** | 3.11 | Programming language |

### Frontend

| Tool | Version | Purpose |
|------|---------|---------|
| **React** | ^19.2.5 | UI framework |
| **Vite** | ^8.0.10 | Build tool (ultra-fast) |
| **Tailwind CSS** | ^3.4.19 | Utility-first CSS |
| **Axios** | ^1.15.2 | HTTP client |
| **Lucide React** | ^1.11.0 | Icon library |

### Deployment

| Tool | Purpose |
|------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Vercel** | Frontend hosting |
| **Home Server** | Backend hosting |
| **Git** | Version control |

---

## 📁 Project Structure

```
temple-review-sentiment/
│
├── 📄 README.md                          ← You are here
├── 📄 DEPLOYMENT.md                      ← Deployment guide
├── 📄 docker-compose.yml                 ← Docker orchestration
├── 📄 .gitignore                         ← Git ignore rules
│
├── backend/                              ← FastAPI backend
│   ├── 📄 Dockerfile                     ← Container config
│   ├── 📄 .dockerignore
│   ├── 📄 requirements.txt                ← Python dependencies
│   ├── 📄 .env                           ← Environment variables
│   │
│   ├── app/
│   │   ├── 📄 main.py                    ← FastAPI app entry
│   │   ├── 📄 config.py                  ← Configuration
│   │   ├── 📄 model.py                   ← Model factory
│   │   ├── 📄 local_model.py             ← Local model loading
│   │   ├── 📄 schemas.py                 ← Data models (Pydantic)
│   │   └── 📄 __init__.py
│   │
│   └── sentiment-model/                  ← Bundled ML Model
│       ├── 📄 config.json
│       ├── 📄 model.safetensors
│       ├── 📄 tokenizer.json
│       ├── 📄 tokenizer_config.json
│       └── 📄 training_args.bin
│
├── frontend/                             ← React frontend
│   ├── 📄 package.json
│   ├── 📄 vite.config.js
│   ├── 📄 tailwind.config.js
│   ├── 📄 postcss.config.js
│   ├── 📄 eslint.config.js
│   ├── 📄 .env.local                     ← Dev environment
│   ├── 📄 .env.production                ← Production environment
│   ├── 📄 index.html
│   │
│   ├── src/
│   │   ├── 📄 main.jsx                   ← React entry point
│   │   ├── 📄 App.jsx                    ← Main component
│   │   ├── 📄 App.css
│   │   ├── 📄 index.css
│   │   └── assets/
│   │
│   └── public/
│
├── notebooks/                            ← Jupyter experiments
│   └── 📄 main.ipynb
│
└── data/                                 ← Training data (local)
```

---

## 🤖 Model Details

### Model Architecture

**Name:** `tengkumuaz/temple-sentiment-model`  
**Base Model:** Transformer-based (likely DistilBERT or similar)  
**Task:** Sentiment Classification  
**Classes:** 3 (Positive, Negative, Neutral)  
**Input:** Text (Indonesian or English)  
**Output:** {label: string, confidence: float}

### Model Files (in `backend/sentiment-model/`)

| File | Purpose |
|------|---------|
| `model.safetensors` | Pre-trained weights (~150-500MB) |
| `tokenizer.json` | Fast tokenizer |
| `config.json` | Model configuration |
| `tokenizer_config.json` | Tokenizer settings |
| `training_args.bin` | Training metadata |

### Inference Pipeline

```python
1. Load Tokenizer
   └─→ Convert text to token IDs
   └─→ Add special tokens ([CLS], [SEP])
   └─→ Pad to max length
   
2. Load Model
   └─→ Load weights from safetensors
   └─→ Move to GPU (if available)
   └─→ Set to eval mode
   
3. Forward Pass
   └─→ Pass tokens through transformer
   └─→ Get logits for 3 classes
   
4. Post-Process
   └─→ Apply softmax → confidence scores
   └─→ argmax → predicted label
   └─→ Return {label, confidence}
```

### Training Data

- **Source:** Borobudur & Prambanan temple reviews
- **Languages:** Indonesian + English
- **Classes:** Positive, Negative, Neutral
- **Note:** Model trained separately; only inference happening here

---

## 🔌 API Documentation

### Base URL

```
Local: http://localhost:8000
Production: http://192.168.1.10:8000
```

### Endpoints

#### 1. Health Check

**Request:**
```bash
GET /health
```

**Response:**
```json
{"status": "ok"}
```

#### 2. Sentiment Prediction

**Request:**
```bash
POST /predict
Content-Type: application/json

{
  "text": "The temple is absolutely beautiful!"
}
```

**Response:**
```json
{
  "label": "positive",
  "confidence": 0.9847
}
```

**Status Codes:**
- `200` - Success
- `422` - Validation error (invalid input)
- `500` - Server error

### Data Models (Pydantic)

```python
class PredictionRequest(BaseModel):
    text: str  # Review text (required)

class PredictionResponse(BaseModel):
    label: str      # "positive", "negative", or "neutral"
    confidence: float  # 0.0 to 1.0
```

### CORS Configuration

Frontend can make requests from:
- `http://localhost:3000` (dev)
- `http://localhost:5173` (Vite dev)
- `https://temple-review-sentiment.vercel.app` (production)

Controlled via `ALLOWED_ORIGINS` environment variable.

---

## 🚀 Deployment

### Production Architecture

```
User Browser (anywhere)
    ↓
CDN (Vercel Edge Network)
    ↓
Vercel Serverless Functions (frontend)
    ↓
HTTP requests
    ↓
Home Server (192.168.1.10:8000)
    ↓
Docker Container
    ↓
ML Model
```

### Deployment Steps

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete guide.

**Quick Start:**

```bash
# On home server
git clone <repo> temple-api
cd temple-api

# Transfer model
scp -r backend/sentiment-model user@192.168.1.10:~/temple-api/backend/

# Build and run
docker-compose up --build

# Frontend (Vercel)
git push origin main  # Auto-deploys
```

### Environment Variables

**Backend (`.env`):**
```
USE_HF_API=false                    # Use local model
HF_MODEL_NAME=                      # Not needed (local only)
HF_TOKEN=                           # Not needed (local only)
ALLOWED_ORIGINS=...                # CORS configuration
```

**Frontend (Vercel Dashboard):**
```
VITE_API_URL=http://192.168.1.10:8000
```

---

## 💻 Setup & Installation

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose (for production)
- GPU (optional, for faster inference)

### Local Development

#### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run locally
uvicorn app.main:app --reload
```

#### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev

# Open browser: http://localhost:5173
```

#### Test Together

```bash
# Terminal 1: Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev

# Open: http://localhost:5173
# Test prediction with backend running on localhost:8000
```

---

## 🔨 Development Guide

### Adding New Features

#### 1. Backend Changes

```python
# Edit app/main.py to add new route
@app.post("/new-endpoint")
def new_endpoint(data: SomeModel):
    return {"result": "something"}

# Add data model in app/schemas.py
class SomeModel(BaseModel):
    field: str
```

#### 2. Frontend Changes

```jsx
// Edit frontend/src/App.jsx
const newFunction = async () => {
  const res = await axios.post(`${apiUrl}/new-endpoint`, {...});
  // Use response
}
```

### Building for Production

**Backend:**
```bash
# Docker builds automatically in production
docker-compose up --build
```

**Frontend:**
```bash
npm run build  # Creates optimized bundle
# Deploy to Vercel automatically on git push
```

### Running Tests

```bash
# Backend (if tests exist)
pytest

# Frontend
npm run lint
```

---

## 📊 Performance Considerations

### Model Performance

- **Inference Time:** ~500ms per request (CPU) or ~50ms (GPU)
- **Memory Usage:** ~2-4GB RAM
- **Model Size:** ~400MB

### Scaling Options

1. **GPU Acceleration:**
   - Add `cuda` to requirements.txt
   - Model auto-detects CUDA devices

2. **Multiple Workers:**
   - Docker uses gunicorn with 4 workers
   - Can adjust in Dockerfile

3. **Caching:**
   - Model loaded once on startup
   - Tokenizer cached in memory

---

## 🐛 Troubleshooting

### Backend Issues

#### Docker Container Won't Start

```bash
# Check logs
docker-compose logs api

# Common issues:
# 1. Port 8000 already in use → Change in docker-compose.yml
# 2. Model files missing → Run: scp -r backend/sentiment-model user@server:...
# 3. Disk space → Remove old images: docker image prune -a
```

#### Model Not Loading

```bash
# Check model files exist
ls backend/sentiment-model/
# Should show: config.json, model.safetensors, tokenizer.json, tokenizer_config.json

# Check file permissions
sudo chown -R $USER:$USER backend/sentiment-model/
```

#### CORS Errors

```
Error: 400 CORS error on request to backend
```

**Fix:** Update `ALLOWED_ORIGINS` in `.env` or `docker-compose.yml`:

```bash
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://your-vercel-domain.vercel.app
docker-compose restart api
```

### Frontend Issues

#### API Requests Fail

1. **Check backend is running:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Check VITE_API_URL:**
   ```bash
   # Local dev should use .env.local
   # Vercel should have env var set in dashboard
   ```

3. **Check browser DevTools (F12):**
   - Network tab → Look for /predict request
   - Console tab → Check error messages

#### Environment Variable Not Working

```bash
# Restart dev server
npm run dev

# Or rebuild Vite
npm run build
```

---

## 📚 Additional Resources

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [Docker Docs](https://docs.docker.com/)
- [Vercel Docs](https://vercel.com/docs)
- [HuggingFace Transformers](https://huggingface.co/docs/transformers/)

---

## 📝 License

Private project for temple review sentiment analysis.

---

## 🤝 Contributing

This is a personal project, but feedback welcome!

**Development Workflow:**
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# Test locally

# Commit
git commit -m "Add new feature"

# Push
git push origin feature/new-feature
```

---

## 📞 Support

For issues or questions:
1. Check [DEPLOYMENT.md](DEPLOYMENT.md)
2. Review API Documentation above
3. Check Troubleshooting section
4. Review docker logs: `docker-compose logs -f api`

---

**Last Updated:** April 2026  
**Status:** ✅ Production Ready

