# Deployment Guide - Temple Review Sentiment

Complete steps to deploy the sentiment analysis API to a remote server using Docker.

## Prerequisites

✅ **Local Verification**
- Run locally first: `docker-compose up --build`
- Test endpoint: `curl http://localhost:8000/health`

## Step 1: Prepare Repository (Local Machine)

```bash
cd d:\mis\VSCode\Projects\temple-review-sentiment

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: sentiment API with local model"

# Add remote (GitHub/GitLab/etc)
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```

## Step 2: SSH into Remote Server

```bash
ssh user@home-server
```

## Step 3: Install Docker & Docker Compose on Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group (optional - avoid sudo for docker commands)
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

## Step 4: Clone Repository on Server

```bash
cd ~
git clone <YOUR_REPO_URL> temple-api
cd temple-api
```

## Step 5: Build & Run with Docker Compose

### Option A: Using Docker Compose (Recommended)

```bash
# Build image (first time only)
docker-compose build

# Start service in background
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop service
docker-compose down
```

### Option B: Manual Docker Commands

```bash
# Build image
docker build -t sentiment-api:latest ./backend

# Run container
docker run -d \
  --name sentiment-api \
  -p 8000:8000 \
  --restart unless-stopped \
  sentiment-api:latest

# View logs
docker logs -f sentiment-api

# Stop container
docker stop sentiment-api
docker rm sentiment-api
```

## Step 6: Test the API

```bash
# Health check
curl http://localhost:8000/health

# Test prediction
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a great experience!"}'

# Sample response:
# {"label":"positive","confidence":0.98}
```

## Step 7: Optional - Reverse Proxy Setup (Nginx)

If you want to access via domain or different port:

```bash
sudo apt install nginx -y

# Create nginx config
sudo nano /etc/nginx/sites-available/sentiment-api
```

Add this config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/sentiment-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## File Sizes & Storage Requirements

- **Docker Image**: ~2.5GB (includes model + dependencies)
- **Runtime Memory**: ~2-4GB (depending on batch size)
- **Disk Space**: ~3GB minimum

## Useful Commands

```bash
# View running containers
docker ps

# View all containers
docker ps -a

# View image sizes
docker images

# Remove old images
docker image prune -a

# View container stats
docker stats sentiment-api

# Restart service
docker restart sentiment-api

# Update code (pull latest + rebuild)
cd ~/temple-api
git pull
docker-compose build --no-cache
docker-compose up -d
```

## Troubleshooting

**Container keeps restarting?**
```bash
docker-compose logs api
```

**Model not found?**
```bash
# Verify model files are in repo
ls -la backend/sentiment-model/

# Should see: config.json, model.safetensors, tokenizer.json, tokenizer_config.json
```

**Port 8000 already in use?**
```bash
# Change port in docker-compose.yml
# Change: "8000:8000" to "9000:8000"
docker-compose up -d
```

**Out of memory?**
```bash
# Limit memory usage in docker-compose.yml
services:
  api:
    mem_limit: 4gb
```

## Production Checklist

- [ ] Model files included in repo
- [ ] `.env` has no sensitive data (removed HF tokens)
- [ ] Health check responds: `curl http://localhost:8000/health`
- [ ] Logs are accessible
- [ ] Auto-restart enabled (--restart unless-stopped)
- [ ] Firewall allows port 8000
- [ ] Regular backups of model files
- [ ] SSL/HTTPS configured (if exposed to internet)

---

**Need help?** Check container logs: `docker-compose logs -f api`
