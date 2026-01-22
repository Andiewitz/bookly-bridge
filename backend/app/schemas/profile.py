from pydantic import BaseModel, EmailStr, HttpUrl
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class ProfileBase(BaseModel):
    bio: Optional[str] = None
    contact_method: Optional[str] = None
    whatsapp_number: Optional[str] = None
    contact_email: Optional[EmailStr] = None

class BandProfileBase(ProfileBase):
    band_name: str
    genre: str
    location_city: str
    location_state: str
    instagram: Optional[str] = None
    spotify: Optional[str] = None
    youtube: Optional[str] = None

class BandProfileCreate(BandProfileBase):
    pass

class BandProfileUpdate(BandProfileBase):
    band_name: Optional[str] = None
    genre: Optional[str] = None
    location_city: Optional[str] = None
    location_state: Optional[str] = None

class VenueProfileBase(ProfileBase):
    venue_name: str
    location_city: str
    location_state: str
    capacity: Optional[int] = None
    typical_genres: List[str] = []
    instagram: Optional[str] = None

class VenueProfileCreate(VenueProfileBase):
    pass

class VenueProfileUpdate(VenueProfileBase):
    venue_name: Optional[str] = None
    location_city: Optional[str] = None
    location_state: Optional[str] = None

class BandProfileResponse(BandProfileBase):
    id: UUID
    user_id: UUID
    demo_url: Optional[str] = None
    photo_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class VenueProfileResponse(VenueProfileBase):
    id: UUID
    user_id: UUID
    photo_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
