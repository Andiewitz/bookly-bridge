from sqlalchemy import create_engine, text
from app.db.session import Base
from app.models.user import User
from app.models.profile import BandProfile, VenueProfile
from app.models.gig import GigPosting, GigApplication, GigRequest
from app.core.config import settings

def reset_db():
    print(f"Connecting to {settings.DATABASE_URL}...")
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        print("Dropping all tables with CASCADE...")
        # Get all table names
        result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
        tables = [row[0] for row in result]
        
        for table in tables:
            try:
                print(f"Dropping table {table} CASCADE...")
                conn.execute(text(f"DROP TABLE IF EXISTS \"{table}\" CASCADE"))
                conn.commit()
            except Exception as e:
                print(f"Failed to drop {table}: {e}")

    print("Recreating all tables...")
    Base.metadata.create_all(bind=engine)
    
    print("✅ Database reset successfully!")

if __name__ == "__main__":
    reset_db()
