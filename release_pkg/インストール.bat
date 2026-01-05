@echo off
chcp 932 >nul

:: Change to the directory where this batch file is located
cd /d "%~dp0"

echo Installing dependencies...
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

echo Using Python: %PYTHON_CMD%
%PYTHON_CMD% --version
echo.

:: Check if requirements.txt exists
if not exist "backend\requirements.txt" (
    echo Error: backend\requirements.txt not found.
    echo Current directory: %CD%
    dir backend
    pause
    exit /b
)

echo Installing libraries (this may take a while)...
%PYTHON_CMD% -m pip install -r backend\requirements.txt

if %errorlevel% neq 0 (
    echo.
    echo Error: Installation failed.
    echo Please check your network connection and permissions.
    pause
    exit /b
)

echo.
echo Done. Installation completed successfully.
echo Please run the startup batch file to start the application.
pause
