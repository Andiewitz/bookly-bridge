from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.gig import GigPosting, GigApplication
from app.models.profile import BandProfile
from app.models.notification import Notification
from app.schemas.application import ApplicationCreate, ApplicationResponse
from app.api.deps import get_current_user
from uuid import UUID

router = APIRouter()

@router.post("/", response_model=ApplicationResponse)
def create_application(
    app_in: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    # 1. Verify user is an artist/band
    if current_user.role != "band" or not current_user.band_profile:
        raise HTTPException(status_code=403, detail="Only artists with a profile can apply to gigs")

    # 2. Verify gig exists
    gig = db.query(GigPosting).filter(GigPosting.id == app_in.gig_id).first()
    if not gig:
        raise HTTPException(status_code=404, detail="Gig not found")

    # 3. Check if already applied
    existing = db.query(GigApplication).filter(
        GigApplication.gig_id == app_in.gig_id,
        GigApplication.applicant_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this gig")

    # 4. Create application
    new_app = GigApplication(
        gig_id=app_in.gig_id,
        venue_id=gig.venue_id,
        applicant_id=current_user.id,
        applicant_name=current_user.band_profile.band_name,
        applicant_avatar=current_user.band_profile.photo_url,
        message=app_in.message,
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app

@router.get("/my-applications", response_model=List[ApplicationResponse])
def list_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    apps = db.query(GigApplication).filter(GigApplication.applicant_id == current_user.id).all()
    
    # Enrich with gig details
    for app in apps:
        gig = db.query(GigPosting).filter(GigPosting.id == app.gig_id).first()
        if gig:
            app.gig_title = gig.title
            app.gig_date = str(gig.date)
            app.venue_name = gig.venue_name
            
    return apps

@router.get("/venue", response_model=List[ApplicationResponse])
def list_venue_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    apps = db.query(GigApplication).filter(GigApplication.venue_id == current_user.id).all()
    
    # Enrich with contact info and gig details
    for app in apps:
        band_profile = db.query(BandProfile).filter(BandProfile.user_id == app.applicant_id).first()
        if band_profile:
            app.applicant_email = band_profile.contact_email
            app.applicant_whatsapp = band_profile.whatsapp_number
            app.applicant_instagram = band_profile.instagram
            
        gig = db.query(GigPosting).filter(GigPosting.id == app.gig_id).first()
        if gig:
            app.gig_title = gig.title
            app.gig_date = str(gig.date)
            app.venue_name = gig.venue_name
            
    return apps

@router.patch("/{id}/status", response_model=ApplicationResponse)
def update_application_status(
    id: UUID,
    status_update: str, # pending, accepted, declined
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    app_record = db.query(GigApplication).filter(GigApplication.id == id).first()
    if not app_record:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Only the gig author (venue) can change status
    if app_record.venue_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    app_record.status = status_update
    db.commit()
    db.refresh(app_record)

    # Trigger notification for the band if accepted
    if status_update == "accepted":
        notif = Notification(
            user_id=app_record.applicant_id,
            title="Application Accepted! 🎸",
            content=f"Your application for '{app_record.gig_title}' has been accepted. View contact details to connect.",
            type="application_accepted",
            link=f"/dashboard/my-gigs"
        )
        db.add(notif)
        db.commit()
    
    # Enrich response with contact info if accepted
    band_profile = db.query(BandProfile).filter(BandProfile.user_id == app_record.applicant_id).first()
    if band_profile:
        app_record.applicant_email = band_profile.contact_email
        app_record.applicant_whatsapp = band_profile.whatsapp_number
        app_record.applicant_instagram = band_profile.instagram
        
    return app_record
