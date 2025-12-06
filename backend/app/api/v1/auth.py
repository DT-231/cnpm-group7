"""Authentication endpoints: register, login, refresh tokens and get current user.

This module provides the HTTP routes used by the frontend for authentication
workflows. Handlers are thin wrappers that delegate business logic to
``app.services.auth_service.AuthService``.
"""

from typing import Any

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.db.models_user import User
from app.schemas.auth import (
    LoginRequest,
    RefreshTokenRequest,
    TokenPair,
    UserInDB,
)
from app.schemas.common import ResponseModel
from app.schemas.response import ResponseBase
from app.schemas.user import UserCreate
from app.services.auth_service import AuthService


router = APIRouter(prefix="/auth")


@router.post(
    "/register",
    response_model=ResponseBase,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    payload: UserCreate, db: Session = Depends(get_db)
) -> ResponseModel[Any]:
    """Create a new user account.

    The actual registration logic (validation, password hashing, DB insert)
    is implemented in ``AuthService.register``. This endpoint returns a
    generic response body; on success the returned data is empty.
    """

    service = AuthService(db)
    success, msg, _ = service.register(payload)

    # Return an empty data object on successful registration
    return ResponseModel(success=success, data={}, message=msg)


@router.post("/login", response_model=ResponseModel[TokenPair])
async def login(
    payload: LoginRequest, db: Session = Depends(get_db)
) -> ResponseModel[TokenPair]:
    """Authenticate a user and return access/refresh tokens.

    Delegates authentication to ``AuthService.login`` which returns a
    TokenPair on success.
    """

    service = AuthService(db)
    tokens = service.login(payload)
    return ResponseModel(success=True, data=tokens, message="Đăng nhập thành công")


@router.post("/refresh", response_model=ResponseModel[TokenPair])
async def refresh_tokens(
    payload: RefreshTokenRequest, db: Session = Depends(get_db)
) -> ResponseModel[TokenPair]:
    """Refresh access/refresh tokens using a refresh token.

    The refresh token is validated and new tokens are issued by the
    AuthService.
    """

    service = AuthService(db)
    tokens = service.refresh_tokens(payload.refresh_token)
    return ResponseModel(success=True, data=tokens, message="Làm mới token thành công")


@router.get("/me", response_model=ResponseModel[UserInDB])
async def get_me(
    current_user: User = Depends(get_current_user),
) -> ResponseModel[UserInDB]:
    """Return information about the currently authenticated user.

    ``get_current_user`` injects the SQLAlchemy ``User`` instance for the
    authenticated user. Convert it to the response schema before returning.
    """

    user_schema = UserInDB(
        user_id=current_user.user_id,
        username=current_user.username,
        email=current_user.email,
        full_name=current_user.full_name,
        created_at=current_user.created_at,
    )

    return ResponseModel(
        success=True, data=user_schema, message="Thông tin người dùng hiện tại"
    )
