from sqlalchemy import Column, String, Text, ForeignKey, TIMESTAMP, DATE, ARRAY, Boolean, Integer, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.db.session import Base

class GigPosting(Base):
    __tablename__ = "gig_postings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    venue_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String(255), nullable=False)
    date_time = Column(TIMESTAMP(timezone=True), nullable=False)
    genre = Column(String(100), nullable=False, index=True)
    description = Column(Text)
    pay_range = Column(String(100))
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    venue = relationship("User", backref="gigs")

class GigRequest(Base):
    __tablename__ = "gig_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    band_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    available_from = Column(DATE, nullable=False)
    available_to = Column(DATE, nullable=False)
    genres = Column(ARRAY(String), nullable=False)
    willing_to_travel = Column(Boolean, default=False)
    max_distance = Column(Integer)
    notes = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    band = relationship("User", backref="requests")
