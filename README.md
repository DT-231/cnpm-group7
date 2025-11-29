# CNPM Project

## Cấu trúc Project

- `backend/` - Python/FastAPI backend
- `front-end/` - React/Vite frontend
- `db_data/` - PostgreSQL data (tự động tạo)

## Yêu cầu

- Docker
- Docker Compose

## Tính năng Docker

### 🔧 Backend Dockerfile
- ✅ Tự động phát hiện môi trường (Windows/Mac/Linux)
- ✅ Tự động tạo folder `env` (virtual environment) nếu chưa có
- ✅ Cài đặt dependencies từ `requirements.txt`
- ✅ Đợi PostgreSQL khởi động xong mới chạy backend
- ✅ Verify kết nối database trước khi start

### 🎨 Frontend Dockerfile
- ✅ Kiểm tra `node_modules` tồn tại chưa
- ✅ Tự động chạy `npm install` nếu chưa có node_modules
- ✅ Cập nhật dependencies nếu đã tồn tại

### 🐳 Docker Compose
- ✅ `restart: no` - Không tự khởi động cùng app/máy tính
- ✅ Services chỉ chạy khi bạn gọi lệnh `docker-compose up`

## Cài đặt và Chạy

### 1. Clone project và di chuyển vào thư mục

```bash
cd /Users/hoangnguyen/workspace/Learning/cnpm
```

### 2. Chạy Docker Compose

```bash
# Build và khởi động tất cả services
docker-compose up --build

# Hoặc chạy ở background
docker-compose up -d --build
```

### 3. Dừng services

```bash
docker-compose down

# Dừng và xóa cả volumes (dữ liệu database)
docker-compose down -v
```

## Thông tin Services

### PostgreSQL Database
- **Port**: 5432
- **Database**: cnpm_db
- **User**: admin
- **Password**: admin123
- **Data folder**: `./db_data` (tự động tạo khi chạy)

### Backend (FastAPI)
- **Port**: 8000
- **URL**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Frontend (React/Vite)
- **Port**: 5173
- **URL**: http://localhost:5173

## Kết nối Database

### Từ Backend
```python
DATABASE_URL = "postgresql://admin:admin123@postgres:5432/cnpm_db"
```

### Từ máy local (pgAdmin, DBeaver, etc.)
```
Host: localhost
Port: 5432
Database: cnpm_db
Username: admin
Password: admin123
```

## Các lệnh hữu ích

```bash
# Xem logs
docker-compose logs -f

# Xem logs của một service cụ thể
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Restart một service
docker-compose restart backend

# Vào shell của container
docker-compose exec backend sh
docker-compose exec postgres psql -U admin -d cnpm_db

# Rebuild một service cụ thể
docker-compose up -d --build backend
```

## Cấu trúc Database

Folder `db_data/` sẽ được tự động tạo khi chạy Docker Compose lần đầu. Folder này chứa toàn bộ dữ liệu của PostgreSQL.

**Lưu ý**: Folder `db_data/` đã được thêm vào `.gitignore` để không commit dữ liệu database lên git.
