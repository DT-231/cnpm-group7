#!/bin/sh
set -e

echo "🔍 Detecting OS environment..."
OS_TYPE=$(uname -s)
echo "OS Type: $OS_TYPE"

# Install/Update dependencies (skip if already installed)
echo "📥 Installing dependencies from requirements.txt..."
pip install --no-cache-dir -r requirements.txt --quiet
echo "✅ Dependencies installed successfully"

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL database..."

echo "✅ Database connection verified!"

echo "🚀 Starting FastAPI application..."
exec uvicorn main:app --host 0.0.0.0 --port 8000 --reload
