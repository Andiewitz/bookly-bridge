from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.gig import GigPosting
from app.schemas.gig import GigPostingCreate, GigPostingUpdate, GigPostingResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=GigPostingResponse)
def create_gig_posting(
    gig_in: GigPostingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    if current_user.role != "venue":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only venues can create gig postings."
        )
    
    db_gig = GigPosting(venue_id=current_user.id, **gig_in.dict())
    db.add(db_gig)
    db.commit()
    db.refresh(db_gig)
    return db_gig

@router.get("/", response_model=List[GigPostingResponse])
def list_gig_postings(
    genre: Optional[str] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db)
) -> Any:
    query = db.query(GigPosting)
    if genre:
        query = query.filter(GigPosting.genre == genre)
    # Add more complex location filtering if needed
    return query.all()

@router.get("/{id}", response_model=GigPostingResponse)
def get_gig_posting(
    id: Any,
    db: Session = Depends(get_db)
) -> Any:
    gig = db.query(GigPosting).filter(GigPosting.id == id).first()
    if not gig:
        raise HTTPException(status_code=404, detail="Gig not found")
    return gig
