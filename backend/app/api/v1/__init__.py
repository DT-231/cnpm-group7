"""v1 API router aggregation."""

from fastapi import APIRouter

from app.api.v1 import auth, practice

router = APIRouter()
router.include_router(auth.router, prefix="/auth", tags=["auth"])
# practice.router đã có prefix="/practice" nên không cần thêm prefix nữa
router.include_router(practice.router, tags=["Practice"])
