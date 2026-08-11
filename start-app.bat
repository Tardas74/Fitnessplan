@echo off
chcp 65001 >nul
cls
echo.
echo ========================================
echo   PULS.OS – React App Starter
echo ========================================
echo.
echo Installiere Dependencies...
call npm install
if errorlevel 1 goto error

echo.
echo ========================================
echo   Starting Dev Server...
echo ========================================
echo.
echo App wird geladen auf: http://localhost:5173
echo.
echo Am Handy öffnen (selbes WiFi):
echo   - Finde deine lokale IP: ipconfig
echo   - Öffne: http://[DEINE-IP]:5173
echo.
call npm run dev
goto end

:error
echo.
echo FEHLER! npm install fehlgeschlagen.
pause
goto end

:end
pause
