"""Application settings using Pydantic BaseSettings."""

import os
from pathlib import Path
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Global application settings loaded from environment variables."""

    APP_NAME: str = "AI English Learning"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str 

    # Security (JWT configuration)
    SECRET_KEY: str   # noqa: S105 - placeholder, change in production
    ALGORITHM: str 
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440   # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7   # 7 days

    # Gemini AI Configuration (optional - only needed for pronunciation evaluation)
    GEMINI_API_KEY: Optional[str] = None

    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ENVIRONMENT: str = "development"

    class Config:
        # Get the backend directory path
        backend_dir = Path(__file__).parent.parent.parent
        env_file = str(backend_dir / ".env")
        case_sensitive = True


settings = Settings()
