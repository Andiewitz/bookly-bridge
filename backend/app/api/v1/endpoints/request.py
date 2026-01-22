from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.gig import GigRequest
from app.schemas.gig import GigRequestCreate, GigRequestUpdate, GigRequestResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=GigRequestResponse)
def create_gig_request(
    request_in: GigRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    if current_user.role != "band":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only bands can create gig requests."
        )
    
    db_request = GigRequest(band_id=current_user.id, **request_in.dict())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@router.get("/", response_model=List[GigRequestResponse])
def list_gig_requests(
    genre: Optional[str] = None,
    db: Session = Depends(get_db)
) -> Any:
    query = db.query(GigRequest)
    if genre:
        query = query.filter(GigRequest.genres.any(genre))
    return query.all()

@router.get("/{id}", response_model=GigRequestResponse)
def get_gig_request(
    id: Any,
    db: Session = Depends(get_db)
) -> Any:
    request = db.query(GigRequest).filter(GigRequest.id == id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Gig request not found")
    return request
