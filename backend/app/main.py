from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import auth, profile, gig, request, user

app = FastAPI(title="Booklyn API", version="0.1.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(profile.router, prefix="/api/v1/profile", tags=["profile"])
app.include_router(gig.router, prefix="/api/v1/gigs", tags=["gigs"])
app.include_router(request.router, prefix="/api/v1/gig-requests", tags=["gig-requests"])
app.include_router(user.router, prefix="/api/v1/users", tags=["users"])

@app.get("/")
async def root():
    return {"message": "Welcome to Booklyn API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
