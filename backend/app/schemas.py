"""Backward-compatibility re-exports for Pydantic schemas.

New code should import from `app.schemas.user` or `app.schemas.common`.
"""

from app.schemas.common import ResponseModel
from app.schemas.user import UserBase, UserCreate, UserResponse

__all__ = [
    "ResponseModel",
    "UserBase",
    "UserCreate",
    "UserResponse",
]
