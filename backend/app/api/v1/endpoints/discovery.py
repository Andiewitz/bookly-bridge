from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from app.models.gig_mongo import GigPost
from app.schemas.gig import MongoGigPostResponse
import math

router = APIRouter()

@router.get("/gigs", response_model=List[MongoGigPostResponse])
async def discover_gigs(
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    radius_meters: float = 10000, # Default 10km
    genre: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 20,
    offset: int = 0
) -> Any:
    """
    Explore gigs with Geo-spatial and Keyword search.
    """
    query: dict = {"status": "open"}
    
    # Text search
    if search:
        query["$text"] = {"$search": search}
        
    # Genre filter
    if genre:
        query["genre"] = genre

    # Geo-spatial query
    if lat is not None and lng is not None:
        query["location"] = {
            "$near": {
                "$geometry": {
                    "type": "Point",
                    "coordinates": [lng, lat]
                },
                "$maxDistance": radius_meters
            }
        }

    # Find and return
    posts = await GigPost.find(query).limit(limit).skip(offset).to_list()
    
    results = []
    for p in posts:
        pd = p.dict()
        pd["id"] = str(p.id)
        results.append(pd)
    return results

@router.get("/venues", response_model=List[Any])
async def discover_venues(
    search: Optional[str] = None,
    genre: Optional[str] = None
) -> Any:
    # This will be implemented when we have a more robust discovery for venue profiles themselves
    return []
