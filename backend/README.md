# Backend - AI English Learning Platform

FastAPI backend với JWT authentication và PostgreSQL database.

## 🚀 Quick Start

### 1. Setup Environment
```bash
# Tạo virtual environment
python -m venv env

# Activate environment
source env/bin/activate  # macOS/Linux
# or
env\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Database
```bash
# Copy environment template
cp .env.example .env

# Edit .env với database credentials của bạn
nano .env
```

### 3. Run Server
```bash
# Start FastAPI server
python main.py

# Server sẽ chạy tại: http://localhost:8000
```

### 4. Test API
```bash
# Check health
curl http://localhost:8000/health

# View API documentation
open http://localhost:8000/docs
```

---

## 🔐 Authentication System

Hệ thống đã implement JWT authentication với **access token** và **refresh token**.

### Features:
- ✅ User registration với email validation
- ✅ Login với username/password
- ✅ JWT access token (24 hours)
- ✅ JWT refresh token (7 days)
- ✅ Password hashing với bcrypt
- ✅ Protected endpoints với Bearer token
- ✅ Get current user info

### API Endpoints:

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Đăng ký user mới | ❌ |
| POST | `/api/v1/auth/login` | Đăng nhập | ❌ |
| GET | `/api/v1/auth/me` | Lấy thông tin user | ✅ |
| POST | `/api/v1/auth/refresh` | Làm mới tokens | ❌ |

### Documentation:
- 📄 **[AUTH_API_DOCUMENTATION.md](./AUTH_API_DOCUMENTATION.md)** - Full API documentation
- 📄 **[JWT_AUTH_SUMMARY.md](./JWT_AUTH_SUMMARY.md)** - Implementation summary
- 📄 **[POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md)** - Testing với Postman

---

## 🧪 Testing

### Option 1: Python Script
```bash
python test_auth_manual.py
```

### Option 2: Postman
1. Import `postman_collection.json` vào Postman
2. Run collection
3. Tokens tự động được lưu

### Option 3: FastAPI Docs (Swagger)
1. Mở http://localhost:8000/docs
2. Test endpoints trực tiếp trong UI

### Option 4: cURL
```bash
# Register
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── deps.py              # Dependencies (get_db, get_current_user)
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── auth.py          # Authentication endpoints
│   │       └── practice.py      # Practice endpoints (TODO)
│   │
│   ├── core/
│   │   ├── config.py            # Settings (Pydantic)
│   │   ├── security.py          # JWT & password hashing
│   │   └── logging.py           # Logging config
│   │
│   ├── db/
│   │   ├── base.py              # SQLAlchemy Base
│   │   ├── session.py           # Database session
│   │   ├── models_user.py       # User model
│   │   ├── models_practice_sentence.py
│   │   └── models_practice_attempt.py
│   │
│   ├── schemas/
│   │   ├── auth.py              # Auth Pydantic schemas
│   │   ├── user.py              # User schemas
│   │   └── common.py            # ResponseModel[T]
│   │
│   ├── services/
│   │   └── auth_service.py      # Auth business logic
│   │
│   └── utils/
│       └── exceptions.py        # Custom exceptions
│
├── tests/
│   ├── test_health.py
│   └── test_auth.py
│
├── .env.example                 # Environment template
├── requirements.txt             # Python dependencies
├── main.py                      # FastAPI app entry point
│
├── AUTH_API_DOCUMENTATION.md    # API docs
├── JWT_AUTH_SUMMARY.md          # Implementation summary
├── POSTMAN_GUIDE.md             # Postman testing guide
├── postman_collection.json      # Postman collection
└── test_auth_manual.py          # Manual test script
```

---

## 🔧 Configuration

### Environment Variables (.env)

```bash
# Application
APP_NAME=AI English Learning
DEBUG=False

# Database
DATABASE_URL=postgresql://admin:admin123@localhost:5433/cnpm_db

# JWT Security
SECRET_KEY=your-super-secret-key-here  # Change in production!
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440  # 24 hours
REFRESH_TOKEN_EXPIRE_DAYS=7       # 7 days
```

### Generate Secure SECRET_KEY
```python
import secrets
print(secrets.token_urlsafe(32))
```

---

## 📦 Dependencies

### Main Libraries:
- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **SQLAlchemy** - ORM
- **Pydantic** - Data validation
- **python-jose** - JWT handling
- **passlib** - Password hashing
- **bcrypt** - Password hashing algorithm

### Install:
```bash
pip install -r requirements.txt
```

---

## 🗄️ Database

### PostgreSQL Setup
```bash
# Start PostgreSQL với Docker
docker-compose up -d

# Connection string
postgresql://admin:admin123@localhost:5433/cnpm_db
```

### Database Models:
- **users** - User accounts
- **practice_sentences** - Practice sentences for learning
- **practice_attempts** - User practice history

---

## 🔒 Security

### Implemented:
✅ Password hashing với bcrypt (10 rounds)  
✅ JWT token signing  
✅ Token expiration  
✅ Token type validation (access vs refresh)  
✅ SQL injection prevention (SQLAlchemy ORM)  
✅ Input validation (Pydantic)  
✅ CORS configuration  

### Best Practices:
- ⚠️ **Never commit** `.env` file
- ⚠️ **Change** `SECRET_KEY` in production
- ⚠️ Use HTTPS in production
- ⚠️ Implement rate limiting for auth endpoints
- ⚠️ Add token blacklist for logout

---

## 📚 API Documentation

### Interactive Docs:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Static Docs:
- **API Documentation:** [AUTH_API_DOCUMENTATION.md](./AUTH_API_DOCUMENTATION.md)
- **Implementation Details:** [JWT_AUTH_SUMMARY.md](./JWT_AUTH_SUMMARY.md)

---

## 🐛 Troubleshooting

### Server không khởi động được
```bash
# Check if port 8000 is in use
lsof -i :8000

# Kill process if needed
kill -9 <PID>
```

### Database connection error
```bash
# Check if PostgreSQL is running
docker ps

# Check connection
psql postgresql://admin:admin123@localhost:5433/cnpm_db
```

### Token không hợp lệ
- Kiểm tra SECRET_KEY trong .env
- Kiểm tra token có hết hạn không
- Đảm bảo gửi đúng header: `Authorization: Bearer <token>`

---

## 🚧 TODO / Next Features

- [ ] Email verification
- [ ] Password reset
- [ ] OAuth2 (Google, GitHub)
- [ ] 2FA (Two-Factor Authentication)
- [ ] Rate limiting
- [ ] Token blacklist (logout)
- [ ] Audit logging
- [ ] Practice endpoints implementation
- [ ] Speech-to-text integration
- [ ] Gemini AI integration

---

## 📞 Support

- **Issues:** GitHub Issues
- **Documentation:** See `AUTH_API_DOCUMENTATION.md`
- **API Docs:** http://localhost:8000/docs

---

**Created:** 2025-12-01  
**Status:** ✅ Authentication System Ready  
**Version:** 1.0
