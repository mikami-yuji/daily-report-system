@echo off
chcp 932 >nul

:: Change to the directory where this batch file is located
cd /d "%~dp0"

echo Starting Daily Report System...
echo Current directory: %CD%

:: Check for python
set PYTHON_CMD=python
where %PYTHON_CMD% >nul 2>&1
if %errorlevel% neq 0 (
    set PYTHON_CMD=py
    where py >nul 2>&1
    if %errorlevel% neq 0 (
        echo Error: Python is not found.
        echo Please install Python from https://python.org
        echo Make sure to check "Add Python to PATH" during installation.
        pause
        exit /b
    )
)

echo Python environment: %PYTHON_CMD%
%PYTHON_CMD% --version

:: Check libraries
echo Checking libraries...
%PYTHON_CMD% -c "import fastapi; import uvicorn; import pandas" >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Required libraries not found.
    echo Please run install batch first.
    echo.
    echo --- Error Details ---
    %PYTHON_CMD% -c "import fastapi; import uvicorn; import pandas"
    echo ---------------------
    pause
    exit /b
)

:: Check if main.py exists
if not exist "backend\main.py" (
    echo Error: backend\main.py not found.
    echo Current directory: %CD%
    pause
    exit /b
)

echo Starting backend...
start "Daily Report Backend" %PYTHON_CMD% backend\main.py
timeout /t 5 >nul
start http://localhost:8001
pause
