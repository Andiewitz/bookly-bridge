from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Booklyn"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-dev-only") # Override in .env
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "booklyn")
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "localhost")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    
    # Direct override for production (Render/Heroku)
    DATABASE_URL_OVERRIDE: Optional[str] = os.getenv("DATABASE_URL")
    
    MONGO_URL: str = os.getenv("MONGO_URL", "mongodb+srv://gracefulandrei_db_user:jatgmOrnltb2hEO0@cluster0.emd6opx.mongodb.net/?appName=Cluster0")
    
    @property
    def DATABASE_URL(self) -> str:
        if self.DATABASE_URL_OVERRIDE:
            # Render provides 'postgres://', but SQLAlchemy requires 'postgresql://'
            return self.DATABASE_URL_OVERRIDE.replace("postgres://", "postgresql://", 1)
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    class Config:
        case_sensitive = True

settings = Settings()
