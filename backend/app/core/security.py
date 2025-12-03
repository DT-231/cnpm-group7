"""Security utilities: password hashing and JWT token handling."""

from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a plain password using bcrypt."""

    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hash."""

    return pwd_context.verify(plain_password, hashed_password)


def _create_token(data: dict[str, Any], expires_delta: timedelta) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def create_access_token(subject: str, expires_minutes: Optional[int] = None) -> str:
    """Create a short-lived access token for given subject (user identifier)."""

    minutes = expires_minutes or settings.ACCESS_TOKEN_EXPIRE_MINUTES
    return _create_token({"sub": subject, "type": "access"}, timedelta(minutes=minutes))


def create_refresh_token(subject: str, expires_days: Optional[int] = None) -> str:
    """Create a long-lived refresh token for given subject (user identifier)."""

    days = expires_days or settings.REFRESH_TOKEN_EXPIRE_DAYS
    return _create_token({"sub": subject, "type": "refresh"}, timedelta(days=days))


def decode_token(token: str) -> dict[str, Any]:
    """Decode a JWT and return the payload or raise JWTError."""

    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

