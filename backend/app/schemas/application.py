from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class ApplicationCreate(BaseModel):
    gig_id: str
    message: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: str
    gig_id: str
    applicant_id: UUID
    applicant_name: str
    applicant_avatar: Optional[str] = None
    message: Optional[str] = None
    status: str
    created_at: datetime
