from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import User
from app.models.gig_mongo import GigPost
from app.models.application_mongo import GigApplication
from app.schemas.application import ApplicationCreate, ApplicationResponse
from app.api.deps import get_current_user
from beanie import PydanticObjectId

router = APIRouter()

@router.post("/", response_model=ApplicationResponse)
async def create_application(
    app_in: ApplicationCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    # 1. Verify user is an artist/band
    if current_user.role != "band" or not current_user.band_profile:
        raise HTTPException(status_code=403, detail="Only artists with a profile can apply to gigs")

    # 2. Verify gig exists
    gig = await GigPost.get(PydanticObjectId(app_in.gig_id))
    if not gig:
        raise HTTPException(status_code=404, detail="Gig not found")

    # 3. Check if already applied
    existing = await GigApplication.find_one(
        GigApplication.gig_id == app_in.gig_id,
        GigApplication.applicant_id == current_user.id
    )
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this gig")

    # 4. Create application
    new_app = GigApplication(
        gig_id=app_in.gig_id,
        author_id=gig.author_id,
        applicant_id=current_user.id,
        applicant_name=current_user.band_profile.band_name,
        message=app_in.message,
    )
    await new_app.insert()
    
    res = new_app.dict()
    res["id"] = str(new_app.id)
    return res

@router.get("/my-applications", response_model=List[ApplicationResponse])
async def list_my_applications(
    current_user: User = Depends(get_current_user),
) -> Any:
    apps = await GigApplication.find(GigApplication.applicant_id == current_user.id).to_list()
    results = []
    for a in apps:
        ad = a.dict()
        ad["id"] = str(a.id)
        results.append(ad)
    return results

@router.get("/venue", response_model=List[ApplicationResponse])
async def list_venue_applications(
    current_user: User = Depends(get_current_user),
) -> Any:
    # Get applications for gigs where current_user is the author
    apps = await GigApplication.find(GigApplication.author_id == current_user.id).to_list()
    results = []
    for a in apps:
        ad = a.dict()
        ad["id"] = str(a.id)
        results.append(ad)
    return results

@router.patch("/{id}/status", response_model=ApplicationResponse)
async def update_application_status(
    id: str,
    status_update: str, # pending, accepted, declined
    current_user: User = Depends(get_current_user),
) -> Any:
    app_record = await GigApplication.get(PydanticObjectId(id))
    if not app_record:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Only the gig author can change status
    if app_record.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    app_record.status = status_update
    await app_record.save()
    
    res = app_record.dict()
    res["id"] = str(app_record.id)
    return res
