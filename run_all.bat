@echo off
setlocal
echo ==========================================
echo    SEAMAN FRESH - FAST DEV MODE
echo ==========================================
echo Terminating old processes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM python.exe /T 2>nul
timeout /t 1 /nobreak >nul

:: Check for uv
where uv >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set RUNNER=uv run
    echo [FAST] Using 'uv' for backend execution
) else (
    set RUNNER=python
    echo [NORMAL] 'uv' not found, using standard python
)

echo Starting Backend (Port 8000)...
start cmd /k "cd /d %~dp0backend_django && %RUNNER% manage.py runserver 0.0.0.0:8000"

echo Starting Client (Port 5173)...
start cmd /k "cd /d %~dp0client && npm run dev -- --port 5173"

echo Starting Admin Panel (Port 5174)...
start cmd /k "cd /d %~dp0admin-panel && npm run dev -- --port 5174"

echo.
echo Ready! All services are starting in the background.
echo ------------------------------------------
echo Backend: http://localhost:8000
echo Client:  http://localhost:5173
echo Admin:   http://localhost:5174
echo ------------------------------------------
echo Note: Using JSON-based storage for high speed and zero database setup.
echo Business data: backend_django/api/data/*.json
echo Orders are handled via WhatsApp for serverless simplicity.
echo ==========================================
pause
