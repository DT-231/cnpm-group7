"""Authentication service implementing register, login and refresh."""

from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.db.models_user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenPair, UserInDB
from app.schemas.user import UserCreate


class AuthService:
    """Service encapsulating auth business logic."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def _user_to_schema(self, user: User) -> UserInDB:
        return UserInDB(
            user_id=user.user_id,
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            created_at=user.created_at,
        )

    def register(self, data: UserCreate) -> tuple[bool, str, dict]:
        """Register a new user and return status tuple."""

        # Kiểm tra email đã tồn tại
        existing_email = self.db.query(User).filter(User.email == data.email).first()
        if existing_email  is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email đã tồn tại",
            )
        
        # Kiểm tra username đã tồn tại
        existing_username = self.db.query(User).filter(User.username == data.username).first()
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username đã tồn tại",
            )

        hashed = hash_password(data.password)
        user = User(
            username=data.username,
            email=data.email,
            full_name=data.full_name,
            password_hash=hashed,
        )
        self.db.add(user)
        try:
            self.db.commit()
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username hoặc email đã tồn tại",
            )
        self.db.refresh(user)

        return True, "Đăng ký thành công", {}

    def authenticate_user(self, username: str, password: str) -> Optional[User]:
        """Return user if credentials are valid, otherwise None."""

        user: Optional[User] = (
            self.db.query(User).filter(User.username == username).one_or_none()
        )
        if user is None:
            return None
        if not verify_password(password, user.password_hash):
            return None
        user.last_login = datetime.now(timezone.utc)
        self.db.add(user)
        self.db.commit()
        return user

    def login(self, data: LoginRequest) -> TokenPair:
        """Validate credentials and return token pair or raise HTTPException."""

        user = self.authenticate_user(data.username, data.password)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Sai tài khoản hoặc mật khẩu",
            )
        subject = str(user.user_id)
        access = create_access_token(subject)
        refresh = create_refresh_token(subject)
        return TokenPair(access_token=access, refresh_token=refresh)

    def refresh_tokens(self, refresh_token: str) -> TokenPair:
        """Generate new token pair from a refresh token."""

        try:
            payload = decode_token(refresh_token)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token không hợp lệ",
            ) from None

        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token không hợp lệ",
            )

        sub = payload.get("sub")
        if sub is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token không hợp lệ",
            )

        access = create_access_token(sub)
        new_refresh = create_refresh_token(sub)
        return TokenPair(access_token=access, refresh_token=new_refresh)
