@echo off
chcp 65001 >nul
echo Installing dependencies...

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

echo Using Python: %PYTHON_CMD%
%PYTHON_CMD% --version
echo.
echo Installing libraries (this may take a while)...
%PYTHON_CMD% -m pip install -r backend\requirements.txt

if %errorlevel% neq 0 (
    echo.
    echo Error: インストールに失敗しました。
    echo ネットワーク接続や権限を確認してください。
    pause
    exit /b
)

echo.
echo Done. インストールが完了しました。
echo 「起動.bat」を実行してください。
pause
