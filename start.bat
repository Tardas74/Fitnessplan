@echo off
cd /d "%~dp0"
echo.
echo ========================================
echo   PULS.OS - React App
echo ========================================
echo.
echo npm --version:
call npm --version
echo.
echo npm install...
call npm install
echo.
echo npm run dev...
call npm run dev
pause
