from datetime import datetime
from typing import Optional
from pydantic import Field
from beanie import Document
from uuid import UUID

class GigApplication(Document):
    gig_id: str  # MongoDB ObjectID of the Gig
    author_id: UUID # Venue ID (owner of the gig)
    applicant_id: UUID # Artist ID
    applicant_name: str
    applicant_avatar: Optional[str] = None
    message: Optional[str] = None
    status: str = Field(default="pending") # pending, accepted, declined
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "gig_applications"
