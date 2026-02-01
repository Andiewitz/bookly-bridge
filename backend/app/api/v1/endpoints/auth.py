from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import jwt
from app.core import auth
from app.core.config import settings
from app.db.session import get_db
from app.models.user import User
from app.models.profile import BandProfile, VenueProfile
from app.schemas.user import UserCreate, UserResponse, Token, UserLogin
import uuid

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists.",
        )
    
    db_user = User(
        email=user_in.email,
        role=user_in.role,
        password_hash=auth.get_password_hash(user_in.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)) -> Any:
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not auth.verify_password(user_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": auth.create_access_token(user.id, expires_delta=access_token_expires),
        "refresh_token": auth.create_refresh_token(user.id),
        "token_type": "bearer",
    }

@router.post("/refresh-token", response_model=Token)
def refresh_token(refresh_token: str, db: Session = Depends(get_db)) -> Any:
    """
    Refresh access token using a refresh token.
    """
    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=400, detail="Invalid token type")
        user_id = payload.get("sub")
    except:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": auth.create_access_token(user.id, expires_delta=access_token_expires),
        "refresh_token": refresh_token, # Send same refresh token back or rotate it
        "token_type": "bearer",
    }


