from sqlalchemy import Column, String, Integer, Text, ARRAY, ForeignKey, DateTime, func, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.db.session import Base

class BandProfile(Base):
    __tablename__ = "band_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    band_name = Column(String(255), nullable=False)
    genre = Column(String(100), nullable=False, index=True)
    location_city = Column(String(100), nullable=False)
    location_state = Column(String(50), nullable=False)
    bio = Column(Text)
    demo_url = Column(Text)
    photo_url = Column(Text)
    instagram = Column(String(255))
    spotify = Column(String(255))
    youtube = Column(String(255))
    contact_method = Column(String(20)) # whatsapp, instagram, email
    whatsapp_number = Column(String(20))
    contact_email = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", backref="band_profile")

class VenueProfile(Base):
    __tablename__ = "venue_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    venue_name = Column(String(255), nullable=False)
    location_city = Column(String(100), nullable=False)
    location_state = Column(String(50), nullable=False)
    capacity = Column(Integer)
    bio = Column(Text)
    photo_url = Column(Text)
    typical_genres = Column(ARRAY(String))
    contact_method = Column(String(20)) # whatsapp, instagram, email
    whatsapp_number = Column(String(20))
    instagram = Column(String(255))
    contact_email = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", backref="venue_profile")
