@echo off
title VoxShield AI — Launcher (SIH26104)
echo ========================================================
echo   VoxShield AI — Full-Stack Launcher (SIH26104)
echo   Detect. Verify. Defend Against AI Voice Impersonation.
echo ========================================================
echo.

echo [*] Starting FastAPI Backend on http://localhost:8000 ...
start "VoxShield Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo [*] Starting Vite Frontend on http://localhost:5173 ...
start "VoxShield Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo   VoxShield AI is starting!
echo   Frontend: http://localhost:5173
echo   Backend API: http://localhost:8000/docs
echo ========================================================
echo.
pause
