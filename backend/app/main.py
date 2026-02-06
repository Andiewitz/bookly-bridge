
from app.db.session import engine, Base
from app.models.user import User
from app.models.profile import BandProfile, VenueProfile
from app.models.notification import Notification
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import auth, profile, gig, request, user, application, discovery, notification

app = FastAPI(title="Booklyn API", version="0.1.0")

@app.on_event("startup")
async def startup_event():
    # Ensure Postgres tables exist
    Base.metadata.create_all(bind=engine)
    pass

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(discovery.router, prefix="/api/v1/discovery", tags=["discovery"])
app.include_router(profile.router, prefix="/api/v1/profiles", tags=["profiles"])
app.include_router(gig.router, prefix="/api/v1/gigs", tags=["gigs"])
app.include_router(request.router, prefix="/api/v1/gig-requests", tags=["gig-requests"])
app.include_router(user.router, prefix="/api/v1/users", tags=["users"])
app.include_router(application.router, prefix="/api/v1/applications", tags=["applications"])
app.include_router(notification.router, prefix="/api/v1/notifications", tags=["notifications"])

@app.get("/")
async def root():
    return {"message": "Welcome to Booklyn API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
