from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.gig_mongo import GigPost
from app.schemas.gig import MongoGigPostCreate, MongoGigPostResponse
from app.api.deps import get_current_user, require_venue_role

router = APIRouter()

@router.post("/", response_model=MongoGigPostResponse)
async def create_gig_posting(
    gig_in: MongoGigPostCreate,
    current_user: User = Depends(require_venue_role),
) -> Any:
    # Get venue name from profile if possible
    author_name = current_user.email.split('@')[0].capitalize()
    if current_user.venue_profile:
        author_name = current_user.venue_profile.venue_name
    
    new_post = GigPost(
        author_id=current_user.id,
        author_name=author_name,
        avatar_char=author_name[0].upper(),
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
        # Utilize the text index for high-performance scaleable search
        query["$text"] = {"$search": search}
        
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

@router.get("/me/managed", response_model=List[MongoGigPostResponse])
async def list_my_managed_gigs(
    current_user: User = Depends(require_venue_role),
) -> Any:
    """
    List gigs created by the current venue.
    """
    posts = await GigPost.find(GigPost.author_id == current_user.id).to_list()
    
    results = []
    for p in posts:
        pd = p.dict()
        pd["id"] = str(p.id)
        results.append(pd)
    return results
