from datetime import datetime
from typing import Optional, List
from beanie import Document
from pydantic import Field
from uuid import UUID

class GigPost(Document):
    author_id: UUID
    author_name: str
    avatar_char: str
    title: str
    description: str = ""
    genre: str
    date: str  # Human readable or machine readable, Mongo gives us flexibility
    time: str
    pay: str
    tags: List[str] = []
    photo_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "gig_posts"
