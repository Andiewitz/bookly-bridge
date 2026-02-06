from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.gig import GigPosting
from app.schemas.gig import GigPostingCreate, GigPostingResponse
from app.api.deps import get_current_user, require_venue_role
from uuid import UUID

router = APIRouter()

@router.post("/", response_model=GigPostingResponse)
def create_gig_posting(
    gig_in: GigPostingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_venue_role),
) -> Any:
    # Get venue name from profile if possible
    venue_name = current_user.email.split('@')[0].capitalize()
    if current_user.venue_profile:
        venue_name = current_user.venue_profile.venue_name
    
    gig_data = gig_in.dict(exclude={"location"})
    
    # Extract lat/lng from GeoJSON if present
    if gig_in.location and "coordinates" in gig_in.location:
        gig_data["location_lng"] = gig_in.location["coordinates"][0]
        gig_data["location_lat"] = gig_in.location["coordinates"][1]
    
    db_obj = GigPosting(
        venue_id=current_user.id,
        venue_name=venue_name,
        **gig_data
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[GigPostingResponse])
def list_gig_postings(
    db: Session = Depends(get_db),
    genre: Optional[str] = None,
    search: Optional[str] = None
) -> Any:
    query = db.query(GigPosting).filter(GigPosting.status == "open")
    if genre:
        query = query.filter(GigPosting.genre == genre)
    
    if search:
        query = query.filter(
            (GigPosting.title.ilike(f"%{search}%")) | 
            (GigPosting.description.ilike(f"%{search}%"))
        )
    
    return query.order_by(GigPosting.created_at.desc()).all()

@router.get("/{id}", response_model=GigPostingResponse)
def get_gig_posting(
    id: UUID,
    db: Session = Depends(get_db)
) -> Any:
    post = db.query(GigPosting).filter(GigPosting.id == id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Gig not found")
    return post

@router.get("/me/managed", response_model=List[GigPostingResponse])
def list_my_managed_gigs(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_venue_role),
) -> Any:
    return db.query(GigPosting).filter(GigPosting.venue_id == current_user.id).order_by(GigPosting.created_at.desc()).all()
