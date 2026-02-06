from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.gig import GigPosting
from app.schemas.gig import GigPostingResponse
import math

router = APIRouter()

@router.get("/gigs", response_model=List[GigPostingResponse])
def discover_gigs(
    db: Session = Depends(get_db),
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    genre: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 20,
    offset: int = 0
) -> Any:
    """
    Explore gigs with simple filtering and search.
    """
    query = db.query(GigPosting).filter(GigPosting.status == "open")
    
    # Simple search
    if search:
        query = query.filter(
            (GigPosting.title.ilike(f"%{search}%")) | 
            (GigPosting.description.ilike(f"%{search}%"))
        )
        
    # Genre filter
    if genre:
        query = query.filter(GigPosting.genre == genre)

    # Note: Geo-spatial query is simplified/removed in the 'dumbed down' version
    # because it usually requires PostGIS or complex math in SQL.
    # We just return the latest matching gigs.

    return query.order_by(GigPosting.created_at.desc()).offset(offset).limit(limit).all()

@router.get("/venues", response_model=List[Any])
def discover_venues(
    search: Optional[str] = None,
    genre: Optional[str] = None
) -> Any:
    return []
