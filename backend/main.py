from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os

from app.database import engine, get_db, Base
from app.models import User
from app.schemas import UserResponse

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CNPM API",
    version="1.0.0",
    description="API for CNPM Project with PostgreSQL"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("🚀 FastAPI application started")
    print(f"📊 Database URL: {os.getenv('DATABASE_URL', 'Not set')}")

@app.get("/")
async def root():
    return {
        "message": "Welcome to CNPM API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        # Test database connection
        db.execute("SELECT 1")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "database": db_status,
        "environment": os.getenv("ENVIRONMENT", "development")
    }

@app.get("/api/users", response_model=list[UserResponse])
async def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@app.get("/api/test")
async def test_endpoint():
    return {
        "message": "API is working!",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "database_host": os.getenv("DB_HOST", "not set")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
