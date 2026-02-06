# Booklyn | Documentation & Handoff

Welcome to the Booklyn platform. This guide explains how to run the project locally and how to migrate the development environment to Windows.

## 🚀 Quick Start (Linux)

If you are already on the current Linux environment, use the helper scripts:

1.  **LAN Access (Best for Preview)**:
    Runs both servers and broadcasts them to your local network IP (e.g., your phone can connect).
    ```bash
    bash start_apps.sh
    ```

2.  **Local Access**:
    ```bash
    bash start_local.sh
    ```

---

## 💻 Windows Migration Guide

There are two ways to develop on Windows. **WSL2** is highly recommended for compatibility.

### Option A: WSL2 (Recommended)
1.  **Install WSL2**: Open PowerShell as Admin and run `wsl --install`.
2.  **Clone Project**: Open your WSL terminal (e.g., Ubuntu) and clone the repo.
3.  **Setup**: Follow the **Linux** instructions above within your WSL terminal.

### Option B: Native Windows
If you must develop directly on Windows without WSL:

#### 1. Prerequisites
- **Python 3.10+**: Download from [python.org](https://www.python.org/).
- **Node.js**: Download from [nodejs.org](https://nodejs.org/).
- **PostgreSQL**: Download the installer from the [PostgreSQL site](https://www.postgresql.org/download/windows/).

#### 2. Backend Setup
1.  Open Command Prompt or PowerShell.
2.  `cd backend`
3.  Create Virtual Env: `python -m venv venv`
4.  Activate: `venv\Scripts\activate`
5.  Install Deps: `pip install -r requirements.txt`
6.  **Database**:
    - Open pgAdmin 4 (installed with Postgres).
    - Create a database named `booklyn`.
    - Create a `.env` file in the `backend` folder:
      ```env
      POSTGRES_USER=postgres
      POSTGRES_PASSWORD=your_password
      POSTGRES_SERVER=localhost
      POSTGRES_PORT=5432
      POSTGRES_DB=booklyn
      SECRET_KEY=your_secret_key
      ```
7.  Run: `uvicorn app.main:app --reload`

#### 3. Frontend Setup
1.  Open a new terminal.
2.  `cd frontend`
3.  Install Deps: `npm install`
4.  Create `.env.local`:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
    ```
5.  Run: `npm run dev`

---

## 🛠 Features Summary
- **Discovery Map**: Interactive Google Maps integration with custom markers.
- **My Activity**: Role-specific dashboard to track applications and bookings.
- **Notification Center**: Real-time alerts for booking status.
- **Profile Hub**: Live-preview editor for Bands and Venues.
- **Auth Flow**: Secure JWT-based registration and login with specific error reporting.
