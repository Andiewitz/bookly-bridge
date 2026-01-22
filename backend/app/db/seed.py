import sys
import os

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.db.session import SessionLocal, engine, Base
from app.models.user import User
from app.models.profile import BandProfile, VenueProfile
from app.core.auth import get_password_hash
import uuid

def seed():
    db = SessionLocal()
    try:
        # Check if demo users already exist
        band_user = db.query(User).filter(User.email == "band@demo.com").first()
        if not band_user:
            print("Creating demo band user...")
            band_user = User(
                id=uuid.uuid4(),
                email="band@demo.com",
                password_hash=get_password_hash("password123"),
                role="band"
            )
            db.add(band_user)
            db.flush()

            band_profile = BandProfile(
                user_id=band_user.id,
                band_name="The Booklyn Rockers",
                genre="Rock",
                location_city="New York",
                location_state="NY",
                bio="Just a demo band rocking the Booklyn app.",
                contact_method="email",
                contact_email="band@demo.com"
            )
            db.add(band_profile)

        venue_user = db.query(User).filter(User.email == "venue@demo.com").first()
        if not venue_user:
            print("Creating demo venue user...")
            venue_user = User(
                id=uuid.uuid4(),
                email="venue@demo.com",
                password_hash=get_password_hash("password123"),
                role="venue"
            )
            db.add(venue_user)
            db.flush()

            venue_profile = VenueProfile(
                user_id=venue_user.id,
                venue_name="The Vinyl Lounge",
                location_city="Brooklyn",
                location_state="NY",
                capacity=200,
                bio="Coolest demo venue in town.",
                typical_genres=["Rock", "Jazz", "Blues"],
                contact_method="instagram",
                instagram="vinyllounge_demo"
            )
            db.add(venue_profile)

        db.commit()
        print("Seeding complete!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
