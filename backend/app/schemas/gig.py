from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime, date

class GigPostingBase(BaseModel):
    title: str
    date_time: datetime
    genre: str
    description: Optional[str] = None
    pay_range: Optional[str] = None

class GigPostingCreate(GigPostingBase):
    pass

class GigPostingUpdate(GigPostingBase):
    title: Optional[str] = None
    date_time: Optional[datetime] = None
    genre: Optional[str] = None

class GigPostingResponse(GigPostingBase):
    id: UUID
    venue_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# MongoDB Gig Post Schemas
class MongoGigPostCreate(BaseModel):
    title: str
    description: str
    genre: str
    date: str
    time: str
    pay: str
    tags: List[str] = []
    photo_url: Optional[str] = None

class MongoGigPostResponse(MongoGigPostCreate):
    id: str  # String representation of ObjectId
    author_id: UUID
    author_name: str
    avatar_char: str
    created_at: datetime

class GigRequestBase(BaseModel):
    available_from: date
    available_to: date
    genres: List[str]
    willing_to_travel: bool = False
    max_distance: Optional[int] = None
    notes: Optional[str] = None

class GigRequestCreate(GigRequestBase):
    pass

class GigRequestUpdate(GigRequestBase):
    available_from: Optional[date] = None
    available_to: Optional[date] = None
    genres: Optional[List[str]] = None

class GigRequestResponse(GigRequestBase):
    id: UUID
    band_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
