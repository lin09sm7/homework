#!/bin/bash
cd "$(dirname "$0")"

echo "============================================"
echo "  安康綜合醫院 掛號系統 - 安裝程式"
echo "============================================"
echo ""

echo "[1/2] 安裝後端套件 (backend)..."
cd backend
npm install
echo "✓ 後端安裝完成"
echo ""

echo "[2/2] 安裝前端套件 (frontend)..."
cd ../frontend
npm install --legacy-peer-deps
echo "✓ 前端安裝完成"
echo ""

echo "============================================"
echo "  安裝完成！請執行 start.command 啟動系統"
echo "============================================"
echo ""
read -p "按 Enter 鍵關閉視窗..."
