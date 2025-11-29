#!/bin/sh
set -e

echo "🔍 Checking for node_modules..."

# Check if node_modules exists and has content
if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
    echo "📦 node_modules not found or empty, installing dependencies..."
    npm install
    echo "✅ Dependencies installed successfully"
else
    echo "✅ node_modules already exists"
    echo "🔄 Checking for updates..."
    npm install --prefer-offline
    echo "✅ Dependencies up to date"
fi

echo "🚀 Starting Vite development server..."
exec npm run dev -- --host


