@echo off
chcp 65001 > nul
cd /d "%~dp0"

echo ============================================
echo   安康綜合醫院 掛號系統 - 安裝程式
echo ============================================
echo.

echo [1/2] 安裝後端套件 (backend)...
cd backend
call npm install
if errorlevel 1 (
    echo.
    echo [x] 後端安裝失敗，請確認已安裝 Node.js 18+
    pause
    exit /b 1
)
echo ✓ 後端安裝完成
echo.

echo [2/2] 安裝前端套件 (frontend)...
cd ..\frontend
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo.
    echo [x] 前端安裝失敗
    pause
    exit /b 1
)
echo ✓ 前端安裝完成
echo.

echo ============================================
echo   安裝完成！請執行 start.bat 啟動系統
echo ============================================
echo.
pause
