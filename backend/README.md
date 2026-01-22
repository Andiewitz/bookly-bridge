# Booklyn Backend

FastAPI backend for the Band-to-Gig platform.

## Setup

1. **Environment Variables**:
   Create a `.env` file in the `backend/` directory:
   ```env
   SECRET_KEY=your-super-secret-key
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=booklyn
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   ```

2. **Database Setup**:
   Ensure Postgres is running and create the `booklyn` database. Then run the schema:
   ```bash
   psql -U postgres -d booklyn -f app/db/schema.sql
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Server**:
   ```bash
   uvicorn app.main:app --reload
   ```

## API Documentation
Once the server is running, visit:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
