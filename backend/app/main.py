from app.db.mongo import init_mongo
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import auth, profile, gig, request, user, application

app = FastAPI(title="Booklyn API", version="0.1.0")

@app.on_event("startup")
async def startup_event():
    await init_mongo()

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # Add production frontend URL here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(profile.router, prefix="/api/v1/profile", tags=["profile"])
app.include_router(gig.router, prefix="/api/v1/gigs", tags=["gigs"])
app.include_router(request.router, prefix="/api/v1/gig-requests", tags=["gig-requests"])
app.include_router(user.router, prefix="/api/v1/users", tags=["users"])
app.include_router(application.router, prefix="/api/v1/applications", tags=["applications"])

@app.get("/")
async def root():
    return {"message": "Welcome to Booklyn API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
