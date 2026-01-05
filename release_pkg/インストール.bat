@echo off
chcp 932 >nul
echo Installing dependencies...

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
echo Please run "起動.bat" to start the application.
pause
