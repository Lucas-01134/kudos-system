@echo off
REM Quick Setup Script for Kudos Application (Windows)

echo 🎉 Kudos Application - Quick Setup
echo ====================================
echo.

REM Check Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js v18+ from https://nodejs.org/
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js version: %NODE_VERSION%
echo ✅ npm version: %NPM_VERSION%
echo.

REM Backend setup
echo 📦 Setting up Backend...
cd backend
call npm install
if exist .env (
    echo ✅ .env file exists
) else (
    copy .env.example .env
    echo ⚠️  Created .env file - Please update MongoDB URI if needed
)
cd ..
echo ✅ Backend setup complete
echo.

REM Frontend setup
echo 📦 Setting up Frontend...
cd frontend
call npm install
cd ..
echo ✅ Frontend setup complete
echo.

echo 🎉 Setup Complete!
echo.
echo To start the application:
echo 1. Backend: cd backend ^&^& npm start
echo 2. Frontend: cd frontend ^&^& npm run dev
echo.
echo Then visit: http://localhost:5173
pause
