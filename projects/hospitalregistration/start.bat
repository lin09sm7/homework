@echo off
chcp 65001 > nul
cd /d "%~dp0"

echo ============================================
echo   安康綜合醫院 掛號系統 - 啟動中...
echo ============================================
echo.

echo [1/2] 啟動後端伺服器 (port 3001)...
start "Hospital Backend (port 3001)" cmd /k "chcp 65001 > nul & cd /d "%~dp0backend" && node server.js"
echo ✓ 後端已啟動
echo.

timeout /t 2 /nobreak > nul

echo [2/2] 啟動前端伺服器 (port 5173)...
start "Hospital Frontend (port 5173)" cmd /k "chcp 65001 > nul & cd /d "%~dp0frontend" && npm run dev"
echo ✓ 前端已啟動
echo.

timeout /t 3 /nobreak > nul

start "" http://localhost:5173

echo ============================================
echo   系統已啟動！
echo   前端：http://localhost:5173
echo   後端：http://localhost:3001
echo.
echo   要停止系統，請關閉彈出的 Backend 和 Frontend 視窗
echo ============================================
echo.
pause
