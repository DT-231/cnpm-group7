
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr
from typing import Generic, Optional, TypeVar

T = TypeVar("T")

class ResponseBase(BaseModel, Generic[T]):
    success:bool
    message:Optional[str] = None
    data:Optional[T] = {}

