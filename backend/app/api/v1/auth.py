"""Authentication endpoints: register, login, me, refresh."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.db.models_user import User
from app.schemas.auth import LoginRequest, RefreshTokenRequest, RegisterRequest, TokenPair, UserInDB
from app.schemas.common import ResponseModel
from app.services.auth_service import AuthService
from app.schemas.response import ResponseBase
from app.schemas.user import UserCreate

router = APIRouter(prefix="/auth")


@router.post("/register", response_model=ResponseBase, status_code=status.HTTP_201_CREATED)
async def register(
    payload: UserCreate, db: Session = Depends(get_db)
) -> ResponseModel:
    service = AuthService(db)
    success, msg, data = service.register(payload)
    
    # Trả về data rỗng khi đăng ký thành công
    return ResponseModel(success=success, data={}, message=msg)


@router.post("/login", response_model=ResponseModel[TokenPair])
async def login(payload: LoginRequest, db: Session = Depends(get_db)) -> ResponseModel[TokenPair]:
    service = AuthService(db)
    tokens = service.login(payload)
    return ResponseModel(success=True, data=tokens, message="Đăng nhập thành công")


@router.post("/refresh", response_model=ResponseModel[TokenPair])
async def refresh_tokens(
    payload: RefreshTokenRequest, db: Session = Depends(get_db)
) -> ResponseModel[TokenPair]:
    service = AuthService(db)
    tokens = service.refresh_tokens(payload.refresh_token)
    return ResponseModel(success=True, data=tokens, message="Làm mới token thành công")


@router.get("/me", response_model=ResponseModel[UserInDB])
async def get_me(current_user: User = Depends(get_current_user)) -> ResponseModel[UserInDB]:
    user_schema = UserInDB(
        user_id=current_user.user_id,
        username=current_user.username,
        email=current_user.email,
        full_name=current_user.full_name,
        created_at=current_user.created_at,
    )
    return ResponseModel(success=True, data=user_schema, message="Thông tin người dùng hiện tại")

