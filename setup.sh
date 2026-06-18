#!/bin/bash
# Quick Setup Script for Kudos Application

echo "🎉 Kudos Application - Quick Setup"
echo "===================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Backend setup
echo "📦 Setting up Backend..."
cd backend
npm install
if [ -f .env ]; then
    echo "✅ .env file exists"
else
    cp .env.example .env
    echo "⚠️  Created .env file - Please update MongoDB URI if needed"
fi
cd ..
echo "✅ Backend setup complete"
echo ""

# Frontend setup
echo "📦 Setting up Frontend..."
cd frontend
npm install
cd ..
echo "✅ Frontend setup complete"
echo ""

echo "🎉 Setup Complete!"
echo ""
echo "To start the application:"
echo "1. Backend: cd backend && npm start"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "Then visit: http://localhost:5173"
