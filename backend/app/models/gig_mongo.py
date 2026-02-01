from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import Field
from beanie import Document, Indexed
from uuid import UUID

class GigPost(Document):
    author_id: UUID
    author_name: str
    avatar_char: str
    title: str
    description: str
    genre: str
    borough: Optional[str] = None # Brooklyn, Manhattan, etc. (Can keep for legacy/quick filter)
    
    # Location Metadata from Google Maps
    formatted_address: str
    place_id: str
    location: Dict[str, Any] = Field(..., description="GeoJSON Point: {'type': 'Point', 'coordinates': [lng, lat]}")
    
    date: str
    time: str
    pay: str
    tags: List[str] = []
    photo_url: Optional[str] = None
    status: str = "open" # open, filled, cancelled
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "gig_posts"
        indexes = [
            # Compound text index for full-text search
            [
                ("title", "text"),
                ("description", "text"),
                ("tags", "text"),
            ],
            # 2dsphere index for geo-spatial queries
            [("location", "2dsphere")],
            # Individual indexes for frequent filtering
            "genre",
            "borough",
            "status",
            "created_at",
            "author_id"
        ]
