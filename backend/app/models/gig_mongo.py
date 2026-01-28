from typing import List, Optional
from datetime import datetime
from pydantic import Field
from beanie import Document
from uuid import UUID

class GigPost(Document):
    author_id: UUID
    author_name: str
    avatar_char: str
    title: str
    description: str
    genre: str
    borough: Optional[str] = None # Brooklyn, Manhattan, etc.
    date: str
    time: str
    pay: str
    tags: List[str] = []
    photo_url: Optional[str] = None
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
            # Individual indexes for frequent filtering
            "genre",
            "borough",
            "created_at",
        ]
