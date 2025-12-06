"""FastAPI application entry point.

This module wires the core configuration, database, and API routers.
"""

import os

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.api import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.database import get_db
from app.schemas.common import ResponseModel


def create_app() -> FastAPI:
    """Create and configure the FastAPI application instance."""

    app = FastAPI(
        title=settings.APP_NAME,
        version="1.0.0",
        description="API for CNPM Project with PostgreSQL",
    )

    # CORS configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include versioned API router
    app.include_router(api_router, prefix="/api")

    # Exception handlers
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
        """Handle HTTPException và trả về format ResponseModel."""
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "message": exc.detail,
                "data": None,
               
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
        """Handle validation errors."""
        errors = []
        for error in exc.errors():
            errors.append({
                "field": " -> ".join(str(loc) for loc in error["loc"]),
                "message": error["msg"],
                "type": error["type"],
            })
        
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "success": False,
                "message": "Dữ liệu không hợp lệ",
                "data": None,
                "error": "Validation Error",
                "detail": errors,
            },
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        """Handle all other exceptions."""
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "message": "Đã xảy ra lỗi hệ thống",
                "data": None,
                "error": str(exc) if settings.DEBUG else "Internal Server Error",
            },
        )

    @app.on_event("startup")
    async def startup_event() -> None:  # noqa: D401
        """Application startup hook."""

        # Create database tables (simple approach, no Alembic yet)
        Base.metadata.create_all(bind=engine)
        print("🚀 FastAPI application started")
        print(f"📊 Database URL: {os.getenv('DATABASE_URL', 'Not set')}")

    @app.get("/")
    async def root() -> dict[str, str]:
        return {
            "message": "Welcome to CNPM API",
            "status": "running",
            "version": "1.0.0",
            "docs": "/docs",
        }

    @app.get("/health")
    async def health_check(db: Session = Depends(get_db)) -> dict[str, str]:
        try:
            # Test database connection
            db.execute("SELECT 1")
            db_status = "connected"
        except Exception as exc:  # noqa: BLE001
            db_status = f"error: {str(exc)}"

        return {
            "status": "healthy",
            "database": db_status,
            "environment": os.getenv("ENVIRONMENT", "development"),
        }

    @app.get("/api/test")
    async def test_endpoint() -> dict[str, str]:
        return {
            "message": "API is working!",
            "environment": os.getenv("ENVIRONMENT", "development"),
            "database_host": os.getenv("DB_HOST", "not set"),
        }

    return app


app = create_app()


if __name__ == "__main__":
    os.system("clear")
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

