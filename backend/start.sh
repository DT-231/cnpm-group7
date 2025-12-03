#!/bin/sh

echo "🔍 Detecting OS environment..."
OS_TYPE=$(uname -s)
echo "OS Type: $OS_TYPE"

# Decide env folder name
ENV_DIR="env"

echo "📂 Checking Python virtual environment folder: $ENV_DIR"
if [ ! -d "$ENV_DIR" ]; then
  echo "📦 env folder not found, creating virtual environment..."
  # Use python -m venv so it works the same on Linux/macOS/Windows-based images
  python -m venv "$ENV_DIR"
  echo "✅ Virtual environment created at ./$ENV_DIR"
else
  echo "✅ Virtual environment folder already exists"
fi

echo "🔧 Activating virtual environment..."
# Unix-like (Linux/macOS) path
if [ -f "$ENV_DIR/bin/activate" ]; then
  . "$ENV_DIR/bin/activate"
  echo "✅ Activated venv using $ENV_DIR/bin/activate"
# Windows-style path (for future compatibility)
elif [ -f "$ENV_DIR/Scripts/activate" ]; then
  . "$ENV_DIR/Scripts/activate"
  echo "✅ Activated venv using $ENV_DIR/Scripts/activate"
else
  echo "⚠️  Could not find activate script, continuing without venv"
fi

# Install/Update dependencies from requirements.txt inside venv
if [ -f "requirements.txt" ]; then
  echo "📥 Installing dependencies from requirements.txt into env..."
  pip install --no-cache-dir -r requirements.txt
  echo "✅ Dependencies installed successfully"
else
  echo "⚠️  requirements.txt not found, skipping dependency installation"
fi

echo "🚀 Starting FastAPI application..."
exec uvicorn main:app --host 0.0.0.0 --port 8000 --reload