@echo off
chcp 65001 >nul
echo Starting Daily Report System...

:: Check for python
set PYTHON_CMD=python
where %PYTHON_CMD% >nul 2>&1
if %errorlevel% neq 0 (
    set PYTHON_CMD=py
    where py >nul 2>&1
    if %errorlevel% neq 0 (
        echo Error: Pythonが見つかりません。
        echo Python公式サイト (https://python.org) からインストールしてください。
        echo ※インストール時に「Add Python to PATH」にチェックを入れてください。
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
    echo Error: 必要なライブラリが見つかりません。
    echo 「インストール.bat」を実行してください。
    echo.
    echo --- Error Details ---
    %PYTHON_CMD% -c "import fastapi; import uvicorn; import pandas"
    echo ---------------------
    pause
    exit /b
)

echo Starting backend...
start "Daily Report Backend" %PYTHON_CMD% backend\main.py
timeout /t 5 >nul
start http://localhost:8001
pause
