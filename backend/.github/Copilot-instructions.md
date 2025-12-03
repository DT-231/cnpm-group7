# Copilot Instructions - AI English Learning Platform

## 🎯 Project Overview

**Tech Stack:** FastAPI + Gemini AI + PostgreSQL + JWT Authentication  
**Purpose:** Backend API cho chức năng luyện phát âm tiếng Anh (FR-03)

**Core Features:**
- Authentication (JWT-based)
- Pronunciation Practice với Gemini AI
- Speech-to-Text processing
- Lưu lịch sử và feedback

---

## 📁 Folder Structure
```
backend/
│
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app entry point
│   │
│   ├── api/                       # API Routes
│   │   ├── __init__.py
│   │   ├── deps.py               # Dependencies (get_db, get_current_user)
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── auth.py           # POST /register, /login, GET /me
│   │       └── practice.py       # GET /sentences, POST /evaluate, GET /history
│   │
│   ├── core/                      # Core config
│   │   ├── __init__.py
│   │   ├── config.py             # Settings (Pydantic BaseSettings)
│   │   ├── security.py           # JWT + password hashing
│   │   └── logging.py            # Logging setup
│   │
│   ├── db/                        # Database
│   │   ├── __init__.py
│   │   ├── base.py               # SQLAlchemy Base
│   │   ├── session.py            # get_db() session factory
│   │   └── models.py             # User, PracticeSentence, PracticeAttempt
│   │
│   ├── schemas/                   # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py               # UserCreate, UserLogin, UserResponse
│   │   ├── practice.py           # SentenceResponse, EvaluationRequest, EvaluationResponse
│   │   └── common.py             # ResponseModel[T]
│   │
│   ├── services/                  # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py       # register(), login(), verify_token()
│   │   ├── speech_service.py     # speech_to_text()
│   │   ├── gemini_service.py     # evaluate_pronunciation()
│   │   └── practice_service.py   # get_sentences(), save_attempt()
│   │
│   └── utils/                     # Utilities
│       ├── __init__.py
│       ├── audio.py              # Audio file handling
│       ├── prompts.py            # Gemini AI prompts
│       └── exceptions.py         # Custom exceptions
│
├── uploads/                       # Temp audio files (gitignored)
├── tests/                         # Unit tests
│   ├── __init__.py
│   ├── test_auth.py
│   └── test_practice.py
│
├── .env                          # Environment variables (gitignored)
├── .gitignore
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🔧 Coding Rules

### 1. **Type Hints Everywhere**
```python
# ✅ GOOD
def get_user(user_id: int) -> Optional[User]:
    return db.query(User).filter(User.user_id == user_id).first()

# ❌ BAD
def get_user(user_id):
    return db.query(User).filter(User.user_id == user_id).first()
```

### 2. **Always Use Pydantic Schemas**
```python
# ✅ GOOD
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None

@router.post("/register", response_model=ResponseModel[UserResponse])
async def register(user: UserCreate):
    ...

# ❌ BAD - Using dict
@router.post("/register")
async def register(user: dict):
    ...
```

### 3. **Dependency Injection Pattern**
```python
# ✅ GOOD
from fastapi import Depends
from app.api.deps import get_db, get_current_user

@router.get("/me")
async def get_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return current_user

# ❌ BAD - Global database session
@router.get("/me")
async def get_me():
    db = SessionLocal()  # Don't do this
    ...
```

### 4. **Async/Await for I/O Operations**
```python
# ✅ GOOD - Use async for file I/O and API calls
import aiofiles
from httpx import AsyncClient

async def save_audio(file: UploadFile, path: str):
    async with aiofiles.open(path, 'wb') as f:
        content = await file.read()
        await f.write(content)

async def call_gemini_api(prompt: str):
    async with AsyncClient() as client:
        response = await client.post(url, json={"prompt": prompt})
        return response.json()

# ❌ BAD - Blocking I/O in async function
async def save_audio(file: UploadFile, path: str):
    with open(path, 'wb') as f:  # Blocks event loop
        f.write(file.file.read())
```

### 5. **Consistent Response Format**
```python
# ✅ GOOD - Use generic ResponseModel
from app.schemas.common import ResponseModel

@router.post("/login", response_model=ResponseModel[UserResponse])
async def login(credentials: UserLogin):
    result = await auth_service.login(credentials)
    return ResponseModel(
        success=True,
        data=result,
        message="Đăng nhập thành công"
    )

# Response structure:
{
    "success": true,
    "data": {...},
    "message": "Success message"
}

# Error response:
{
    "success": false,
    "error": "Error message",
    "detail": {...}
}
```

### 6. **Error Handling with Custom Exceptions**
```python
# ✅ GOOD - Custom exceptions
from app.utils.exceptions import (
    AuthenticationError,
    GeminiAPIError,
    SpeechRecognitionError
)

@router.post("/evaluate")
async def evaluate(audio: UploadFile):
    try:
        transcription = await speech_service.transcribe(audio)
        result = await gemini_service.evaluate(transcription)
        return ResponseModel(success=True, data=result)
    
    except SpeechRecognitionError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Không nhận diện được giọng nói: {str(e)}"
        )
    
    except GeminiAPIError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Lỗi AI service: {str(e)}"
        )
```

### 7. **Environment Variables with Pydantic**
```python
# ✅ GOOD - app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # App
    APP_NAME: str = "AI English Learning"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # Gemini AI
    GEMINI_API_KEY: str
    GEMINI_MODEL: str = "gemini-pro"
    
    # File Upload
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

### 8. **Database Models Pattern**
```python
# ✅ GOOD - app/db/models.py
from sqlalchemy import Column, Integer, String, Text, DECIMAL, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    attempts = relationship("PracticeAttempt", back_populates="user")

class PracticeAttempt(Base):
    __tablename__ = "practice_attempts"
    
    attempt_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    sentence_id = Column(Integer, ForeignKey("practice_sentences.sentence_id"))
    
    overall_score = Column(DECIMAL(3, 1), nullable=False)
    transcription = Column(Text)
    ai_feedback = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="attempts")
```

### 9. **Service Layer Pattern**
```python
# ✅ GOOD - Separate business logic from routes
# app/services/practice_service.py

class PracticeService:
    def __init__(self, db: Session):
        self.db = db
    
    async def get_random_sentence(self, difficulty: str = None) -> PracticeSentence:
        """Lấy câu ngẫu nhiên theo độ khó"""
        query = self.db.query(PracticeSentence)
        if difficulty:
            query = query.filter(PracticeSentence.difficulty == difficulty)
        return query.order_by(func.rand()).first()
    
    async def save_attempt(self, attempt_data: dict) -> PracticeAttempt:
        """Lưu kết quả luyện tập"""
        attempt = PracticeAttempt(**attempt_data)
        self.db.add(attempt)
        self.db.commit()
        self.db.refresh(attempt)
        return attempt

# Then in routes:
@router.post("/evaluate")
async def evaluate(
    audio: UploadFile,
    db: Session = Depends(get_db)
):
    practice_service = PracticeService(db)
    result = await practice_service.save_attempt(data)
    return result
```

### 10. **Gemini Integration Pattern**
```python
# ✅ GOOD - app/services/gemini_service.py
import google.generativeai as genai
from app.utils.prompts import create_pronunciation_prompt
from app.core.config import settings

class GeminiService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
    
    async def evaluate_pronunciation(
        self,
        target_sentence: str,
        transcription: str,
        audio_metadata: dict = None
    ) -> dict:
        """
        Đánh giá phát âm với Gemini AI
        
        Returns:
            {
                "success": bool,
                "data": {...evaluation...},
                "error": str (if failed)
            }
        """
        try:
            # 1. Build prompt
            prompt = create_pronunciation_prompt(
                target_sentence,
                transcription,
                audio_metadata
            )
            
            # 2. Call Gemini API
            response = await self.model.generate_content_async(prompt)
            
            # 3. Parse response
            evaluation = self._parse_response(response.text)
            
            return {
                "success": True,
                "data": evaluation
            }
            
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            return {
                "success": False,
                "error": str(e),
                "fallback": self._generate_fallback()
            }
    
    def _parse_response(self, text: str) -> dict:
        """Parse JSON từ Gemini response"""
        import json
        import re
        
        # Extract JSON from markdown code block
        json_match = re.search(r'```json\s*(\{[\s\S]*?\})\s*```', text)
        if json_match:
            return json.loads(json_match.group(1))
        
        # Try direct JSON parse
        return json.loads(text)
```

---

## 🎯 API Endpoints Structure

### **Authentication Endpoints** (`/api/v1/auth/`)
```python
POST   /auth/register    # Đăng ký user mới
POST   /auth/login       # Đăng nhập
GET    /auth/me          # Lấy thông tin user hiện tại (requires token)
POST   /auth/refresh     # Refresh access token
```

### **Practice Endpoints** (`/api/v1/practice/`)
```python
GET    /practice/sentences              # Lấy danh sách câu (query: difficulty, limit)
GET    /practice/sentences/random       # Lấy câu ngẫu nhiên (query: difficulty)
GET    /practice/sentences/{id}         # Lấy câu theo ID
POST   /practice/evaluate               # Đánh giá phát âm (multipart: audio_file, sentence_id)
GET    /practice/history                # Lịch sử luyện tập của user (requires token)
GET    /practice/attempts/{id}          # Chi tiết 1 lần luyện tập
```

---

## 🔒 Security Checklist

- [x] Password hashing với bcrypt (min 10 rounds)
- [x] JWT token expiration (24 hours)
- [x] Environment variables in `.env` (not committed)
- [x] CORS configuration
- [x] File upload validation (type, size, extension)
- [x] Rate limiting on auth endpoints
- [x] SQL injection prevention (use ORM)
- [x] Input sanitization with Pydantic

---

## 📊 Logging Standards
```python
import logging

logger = logging.getLogger(__name__)

# INFO: Important flow events
logger.info("User logged in", extra={"user_id": user.id, "username": user.username})

# WARNING: Potential issues
logger.warning("Audio file too large", extra={"size": file.size, "max": MAX_SIZE})

# ERROR: Errors that need attention
logger.error("Gemini API failed", extra={"error": str(e)}, exc_info=True)

# Use structured logging with extra fields
```

---

## 🧪 Testing Guidelines
```python
# Use pytest + httpx
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_register_success():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "username": "testuser",
                "email": "test@example.com",
                "password": "password123"
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["success"] is True
        assert "token" in data["data"]

@pytest.mark.asyncio
async def test_evaluate_pronunciation():
    # Mock Gemini response
    # Upload sample audio
    # Verify response structure
    pass
```

---

## 📦 Dependencies (requirements.txt)
```txt
# FastAPI
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6

# Database
sqlalchemy==2.0.23
pymysql==1.1.0
alembic==1.12.1

# Security
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.0

# Gemini AI
google-generativeai==0.3.2

# Speech Recognition
SpeechRecognition==3.10.0
pydub==0.25.1

# HTTP Client
httpx==0.25.2
aiofiles==23.2.1

# Testing
pytest==7.4.3
pytest-asyncio==0.21.1

# Other
pydantic==2.5.2
pydantic-settings==2.1.0
```

---

## 🚀 Quick Start Commands
```bash
# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Run migrations (if using Alembic)
alembic upgrade head

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run tests
pytest

# Run with Docker
docker-compose up -d
```

---

## 📝 Git Commit Convention
```
feat: Thêm endpoint đánh giá phát âm
fix: Sửa lỗi JWT token expiration
refactor: Tối ưu Gemini service
docs: Cập nhật API documentation
test: Thêm test cho authentication
chore: Cập nhật dependencies
```

---

## 🎨 Code Style

- Follow PEP 8
- Use Black for formatting
- Use isort for import sorting
- Max line length: 100 characters
- Use meaningful variable names (no `a`, `b`, `x`)
```bash
# Format code
black app/
isort app/

# Lint
flake8 app/
```

---

## ⚡ Performance Tips
```python
# ✅ Use background tasks for heavy operations
from fastapi import BackgroundTasks

@router.post("/evaluate")
async def evaluate(audio: UploadFile, background_tasks: BackgroundTasks):
    # Quick response
    result = await quick_evaluation(audio)
    
    # Save to DB in background
    background_tasks.add_task(save_to_database, result)
    
    return result

# ✅ Use caching for frequently accessed data
from functools import lru_cache

@lru_cache(maxsize=100)
def get_sentence_by_id(sentence_id: int):
    return db.query(PracticeSentence).get(sentence_id)

# ✅ Database connection pooling
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True
)
```

---

## 🐛 Common Issues & Solutions

**Issue 1: Gemini API timeout**
```python
# Solution: Add timeout and retry logic
async def call_gemini_with_retry(prompt: str, max_retries: int = 3):
    for attempt in range(max_retries):
        try:
            response = await asyncio.wait_for(
                model.generate_content_async(prompt),
                timeout=30.0
            )
            return response
        except asyncio.TimeoutError:
            if attempt == max_retries - 1:
                raise
            await asyncio.sleep(2 ** attempt)  # Exponential backoff
```

**Issue 2: File upload size limit**
```python
# Solution: Configure in main.py
from fastapi import FastAPI

app = FastAPI()
app.max_request_body_size = 10 * 1024 * 1024  # 10MB

# Also validate in endpoint
if file.size > settings.MAX_FILE_SIZE:
    raise HTTPException(400, "File quá lớn")
```

---

## 📚 Resources

- FastAPI Docs: https://fastapi.tiangolo.com/
- Gemini API: https://ai.google.dev/docs
- SQLAlchemy: https://docs.sqlalchemy.org/
- Pydantic: https://docs.pydantic.dev/

---

**Last Updated:** 2025-12-01  
**Version:** 1.0