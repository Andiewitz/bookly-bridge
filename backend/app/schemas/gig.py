from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime, date

class GigPostingBase(BaseModel):
    title: str
    description: Optional[str] = None
    genre: str
    date: date
    time: str
    pay: Optional[str] = None
    formatted_address: Optional[str] = None
    # Support both old and new formats for latitude/longitude
    location: Optional[Dict[str, Any]] = None # {'type': 'Point', 'coordinates': [lng, lat]}
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    tags: List[str] = []
    photo_url: Optional[str] = None

class GigPostingCreate(GigPostingBase):
    pass

class GigPostingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    genre: Optional[str] = None
    date: Optional[date] = None
    time: Optional[str] = None
    pay: Optional[str] = None
    status: Optional[str] = None

class GigPostingResponse(BaseModel):
    id: UUID
    venue_id: UUID
    venue_name: Optional[str] = None
    title: str
    description: Optional[str] = None
    genre: str
    date: date
    time: str
    pay: Optional[str] = None
    formatted_address: Optional[str] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    tags: List[str] = []
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class GigApplicationCreate(BaseModel):
    gig_id: UUID
    message: Optional[str] = None

class GigApplicationResponse(BaseModel):
    id: UUID
    gig_id: UUID
    applicant_id: UUID
    venue_id: UUID
    applicant_name: Optional[str] = None
    applicant_avatar: Optional[str] = None
    message: Optional[str] = None
    status: str
    created_at: datetime
    # Contact info visible only to venue when accepted
    applicant_email: Optional[str] = None
    applicant_whatsapp: Optional[str] = None
    applicant_instagram: Optional[str] = None

    class Config:
        from_attributes = True

# Missing GigRequest Schemas added below
class GigRequestBase(BaseModel):
    available_from: date
    available_to: date
    genres: List[str]
    willing_to_travel: bool = False
    max_distance: Optional[int] = None
    notes: Optional[str] = None

class GigRequestCreate(GigRequestBase):
    pass

class GigRequestUpdate(BaseModel):
    available_from: Optional[date] = None
    available_to: Optional[date] = None
    genres: Optional[List[str]] = None
    willing_to_travel: Optional[bool] = None
    max_distance: Optional[int] = None
    notes: Optional[str] = None

class GigRequestResponse(GigRequestBase):
    id: UUID
    band_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
