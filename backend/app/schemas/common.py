"""Common generic response schemas."""

from typing import Generic, Optional, TypeVar

from pydantic import BaseModel


T = TypeVar("T")

class ResponseModel(BaseModel, Generic[T]):
    """Standard API response wrapper.

    Matches the pattern described in the backend rules.
    """

    success: bool
    message: Optional[str] = None
    data: Optional[T] = None
    
