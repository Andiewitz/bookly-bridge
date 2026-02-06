from sqlalchemy import create_engine, text
import os

POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "postgres")
POSTGRES_DB = os.getenv("POSTGRES_DB", "booklyn")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")

DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

engine = create_engine(DATABASE_URL)

migrations = [
    "ALTER TABLE band_profiles ADD COLUMN IF NOT EXISTS messenger_username VARCHAR(255);",
    "ALTER TABLE band_profiles ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(20);",
    "ALTER TABLE band_profiles ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);",
    "ALTER TABLE venue_profiles ADD COLUMN IF NOT EXISTS messenger_username VARCHAR(255);",
    "ALTER TABLE venue_profiles ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(20);",
    "ALTER TABLE venue_profiles ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);",
    "ALTER TABLE venue_profiles ADD COLUMN IF NOT EXISTS instagram VARCHAR(255);",
    "ALTER TABLE venue_profiles ADD COLUMN IF NOT EXISTS typical_genres TEXT[];",
    "ALTER TABLE gig_postings ADD COLUMN IF NOT EXISTS venue_name VARCHAR(255);"
]

def run_migrations():
    with engine.connect() as conn:
        for m in migrations:
            try:
                print(f"Running: {m}")
                conn.execute(text(m))
                conn.commit()
                print("Success.")
            except Exception as e:
                print(f"Failed: {e}")

if __name__ == "__main__":
    run_migrations()
