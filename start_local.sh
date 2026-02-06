#!/bin/bash
set -e

# Kill any existing processes on ports 8000 and 3002
lsof -ti:8000,3002 | xargs kill -9 2>/dev/null || true

# Setup PostgreSQL Database locally
echo "Setting up local PostgreSQL database..."

# Check if database exists
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw booklyn; then
    echo "Database 'booklyn' already exists."
else
    echo "Creating 'booklyn' database..."
    # Always try to create the user 'postgres' with password 'postgres' if it doesn't exist
    # This might fail if user already exists, which is fine
    sudo -u postgres psql -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'postgres') THEN CREATE ROLE postgres WITH LOGIN PASSWORD 'postgres'; END IF; END \$\$;" || true
    
    # Allow the 'postgres' user to create databases (if not already)
    sudo -u postgres psql -c "ALTER USER postgres CREATEDB;"
    
    # Create the database owned by 'postgres'
    sudo -u postgres createdb -O postgres booklyn
    echo "Database created successfully."
fi

# Run the backend
echo "Starting backend..."
source venv/bin/activate
# Run migrations/table creation via uvicorn startup event
# We'll run it in the background
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Run the frontend
echo "Starting frontend..."
cd frontend
# Install node modules if needed
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run dev -- -p 3002 -H 0.0.0.0 &
FRONTEND_PID=$!

echo "🚀 App is running locally!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3002"
echo "Press Ctrl+C to stop both servers."

# Trap Ctrl+C to kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
