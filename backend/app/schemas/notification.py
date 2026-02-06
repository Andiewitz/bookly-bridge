from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class NotificationBase(BaseModel):
    title: str
    content: str
    type: str
    link: Optional[str] = None

class NotificationCreate(NotificationBase):
    user_id: UUID

class NotificationResponse(NotificationBase):
    id: UUID
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
