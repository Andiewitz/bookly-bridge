---
description: Terminate all project-related servers and processes to free up RAM
---

# // turbo-all

This workflow completely shuts down the development environment and kills any lingering processes to free up system resources.

### 1. Stop Docker Infrastructure
Shuts down all containers defined in `docker-compose.yml`.
```bash
docker compose down
```

### 2. Kill Lingering Node/Frontend Processes
Forcefully terminates any Next.js or Node processes that might be running outside of Docker.
```bash
pkill -9 -f "node|next|npm|yarn"
```

### 3. Kill Lingering Python/Backend Processes
Forcefully terminates any Uvicorn or Python backend processes.
```bash
pkill -9 -f "uvicorn|fastapi|python3.*app.main"
```

### 4. Clear Specific Ports
Ensures ports 3000 (Frontend) and 8000 (Backend) are absolutely free.
```bash
lsof -ti:3000,8000 | xargs kill -9 2>/dev/null || true
```

### 5. (Optional) Stop System Postgres
If you want to stop the background system Postgres service (port 5432):
```bash
sudo systemctl stop postgresql
```
