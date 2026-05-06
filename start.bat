@echo off
echo ========================================
echo  Smart Study Assistant - Quick Start
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    pause
    exit /b 1
)

REM Check if Node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Python and Node.js are installed
echo.

REM Check if .env exists
if not exist .env (
    echo [WARNING] .env file not found!
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo [ACTION REQUIRED] Please edit .env file and add your API key:
    echo   - Get Groq API key from: https://console.groq.com/
    echo   - OR HuggingFace token from: https://huggingface.co/settings/tokens
    echo   - Add it to the .env file
    echo.
    notepad .env
    pause
)

REM Check if dependencies are installed
if not exist "backend\__pycache__" (
    echo [INFO] Installing Python dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERROR] Failed to install Python dependencies
        pause
        exit /b 1
    )
)

if not exist "frontend\node_modules" (
    echo [INFO] Installing Node dependencies...
    cd frontend
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install Node dependencies
        pause
        exit /b 1
    )
    cd ..
)

echo.
echo ========================================
echo  Starting Backend Server...
echo ========================================
echo.

REM Start backend in a new window
start "Backend Server" cmd /k "cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo  Starting Frontend Server...
echo ========================================
echo.

REM Start frontend in a new window
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo  Smart Study Assistant is starting!
echo ========================================
echo.
echo Two new windows have opened:
echo   1. Backend Server (Python/FastAPI)
echo   2. Frontend Server (React/Vite)
echo.
echo Wait a few seconds, then open your browser to:
echo   http://localhost:5173
echo.
echo To stop the servers:
echo   - Close both server windows
echo   - Or press CTRL+C in each window
echo.
echo ========================================
echo.

REM Wait 8 seconds then open browser
timeout /t 8 /nobreak >nul
start http://localhost:5173

echo Browser opened to http://localhost:5173
echo.
echo Press any key to close this window...
pause >nul
