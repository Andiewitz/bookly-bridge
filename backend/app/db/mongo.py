from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.gig_mongo import GigPost

async def init_mongo():
    client = AsyncIOMotorClient(settings.MONGO_URL)
    await init_beanie(
        database=client.booklyn,
        document_models=[
            GigPost,
        ]
    )
