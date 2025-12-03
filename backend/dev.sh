#!/bin/bash

# Quick start script for development

echo "🚀 Starting FastAPI Server..."
echo "================================"

# Check if virtual environment exists
if [ ! -d "env" ]; then
    echo "❌ Virtual environment not found!"
    echo "Please run: python -m venv env"
    exit 1
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source env/bin/activate

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    echo "Creating from .env.example..."
    cp .env.example .env
    echo "✅ Please edit .env with your configuration"
fi

# Install/update dependencies
echo "📦 Checking dependencies..."
pip install -q -r requirements.txt

# Start server
echo "🌐 Starting server on http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo "================================"
echo ""

python main.py
