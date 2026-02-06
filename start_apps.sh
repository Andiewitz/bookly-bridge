#!/bin/bash
set -e

# Kill any existing processes on ports 8000 and 3002
lsof -ti:8000,3002 | xargs kill -9 2>/dev/null || true

# Run the backend
echo "Starting backend..."
source venv/bin/activate
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Run the frontend
echo "Starting frontend..."
cd frontend
npm run dev -- -p 3002 -H 0.0.0.0 &
FRONTEND_PID=$!

echo "🚀 App is running on LAN!"
IP=$(hostname -I | awk '{print $1}')
echo "Backend: http://$IP:8000"
echo "Frontend: http://$IP:3002"
echo "Press Ctrl+C to stop both servers."

# Trap Ctrl+C to kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
