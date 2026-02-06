from sqlalchemy import Column, String, Integer, Text, ARRAY, ForeignKey, DateTime, func, Boolean, Date, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.db.session import Base

class GigPosting(Base):
    __tablename__ = "gig_postings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    venue_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    venue_name = Column(String(255))
    title = Column(String(255), nullable=False)
    date = Column(Date, nullable=False)
    time = Column(String(50), nullable=False)
    genre = Column(String(100), nullable=False, index=True)
    description = Column(Text)
    pay = Column(String(100))
    formatted_address = Column(Text)
    location_lat = Column(Numeric(9,6))
    location_lng = Column(Numeric(9,6))
    status = Column(String(20), default="open")
    tags = Column(ARRAY(String))
    photo_url = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    venue = relationship("User")
    applications = relationship("GigApplication", back_populates="gig", cascade="all, delete-orphan")

class GigApplication(Base):
    __tablename__ = "gig_applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    gig_id = Column(UUID(as_uuid=True), ForeignKey("gig_postings.id", ondelete="CASCADE"))
    applicant_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    venue_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    applicant_name = Column(String(255))
    applicant_avatar = Column(Text)
    message = Column(Text)
    status = Column(String(20), default="pending") # pending, accepted, declined
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    gig = relationship("GigPosting", back_populates="applications")
    applicant = relationship("User", foreign_keys=[applicant_id])

class GigRequest(Base):
    __tablename__ = "gig_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    band_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    available_from = Column(Date, nullable=False)
    available_to = Column(Date, nullable=False)
    genres = Column(ARRAY(String), nullable=False)
    willing_to_travel = Column(Boolean, default=False)
    max_distance = Column(Integer)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    band = relationship("User")
