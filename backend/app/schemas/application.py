from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class ApplicationCreate(BaseModel):
    gig_id: UUID
    message: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: UUID
    gig_id: UUID
    applicant_id: UUID
    venue_id: UUID
    applicant_name: str
    applicant_avatar: Optional[str] = None
    message: Optional[str] = None
    status: str
    created_at: datetime
    # Gig details
    gig_title: Optional[str] = None
    gig_date: Optional[str] = None
    venue_name: Optional[str] = None

    class Config:
        from_attributes = True
