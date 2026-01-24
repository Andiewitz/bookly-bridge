from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.gig_mongo import GigPost
from app.schemas.gig import MongoGigPostCreate, MongoGigPostResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=MongoGigPostResponse)
async def create_gig_posting(
    gig_in: MongoGigPostCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    # In a real app, we'd check if they have a venue profile. 
    # For now, we'll use the 'author_name' from the email or a placeholder.
    
    new_post = GigPost(
        author_id=current_user.id,
        author_name=current_user.email.split('@')[0].capitalize(), # Simple fallback
        avatar_char=current_user.email[0].upper(),
        **gig_in.dict()
    )
    await new_post.insert()
    
    # Return with string ID
    res_dict = new_post.dict()
    res_dict["id"] = str(new_post.id)
    return res_dict

@router.get("/", response_model=List[MongoGigPostResponse])
async def list_gig_postings(
    genre: Optional[str] = None,
    borough: Optional[str] = None,
    search: Optional[str] = None
) -> Any:
    query = {}
    if genre:
        query["genre"] = genre
    if borough:
        query["borough"] = borough
    
    if search:
        # Simple regex search for zero-data version (no full-text index needed yet)
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
        
    posts = await GigPost.find(query).to_list()
    
    # Map to responses with string IDs
    results = []
    for p in posts:
        pd = p.dict()
        pd["id"] = str(p.id)
        results.append(pd)
    return results

@router.get("/{id}", response_model=MongoGigPostResponse)
async def get_gig_posting(
    id: str
) -> Any:
    from beanie import PydanticObjectId
    post = await GigPost.get(PydanticObjectId(id))
    if not post:
        raise HTTPException(status_code=404, detail="Gig not found")
    
    pd = post.dict()
    pd["id"] = str(post.id)
    return pd
