from typing import Any, Union
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.profile import BandProfile, VenueProfile
from app.schemas.profile import (
    BandProfileCreate, BandProfileUpdate, BandProfileResponse,
    VenueProfileCreate, VenueProfileUpdate, VenueProfileResponse
)
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/me", response_model=Union[BandProfileResponse, VenueProfileResponse])
def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    if current_user.role == "band":
        profile = db.query(BandProfile).filter(BandProfile.user_id == current_user.id).first()
    else:
        profile = db.query(VenueProfile).filter(VenueProfile.user_id == current_user.id).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/me", response_model=Union[BandProfileResponse, VenueProfileResponse])
def update_my_profile(
    profile_in: Union[BandProfileUpdate, VenueProfileUpdate],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    if current_user.role == "band":
        profile = db.query(BandProfile).filter(BandProfile.user_id == current_user.id).first()
        if not profile:
            profile = BandProfile(user_id=current_user.id, **profile_in.dict())
            db.add(profile)
        else:
            for field, value in profile_in.dict(exclude_unset=True).items():
                setattr(profile, field, value)
    else:
        profile = db.query(VenueProfile).filter(VenueProfile.user_id == current_user.id).first()
        if not profile:
            profile = VenueProfile(user_id=current_user.id, **profile_in.dict())
            db.add(profile)
        else:
            for field, value in profile_in.dict(exclude_unset=True).items():
                setattr(profile, field, value)
    
    db.commit()
    db.refresh(profile)
    return profile

@router.get("/{user_id}", response_model=Union[BandProfileResponse, VenueProfileResponse])
def get_profile_by_id(
    user_id: Any,
    db: Session = Depends(get_db)
) -> Any:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.role == "band":
        profile = db.query(BandProfile).filter(BandProfile.user_id == user.id).first()
    else:
        profile = db.query(VenueProfile).filter(VenueProfile.user_id == user.id).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile
