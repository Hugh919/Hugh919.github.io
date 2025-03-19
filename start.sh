#!/bin/bash

# 启动脚本 - 同时启动前端和后端服务

# 设置颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== AI工具聚合平台启动脚本 ===${NC}"

# 检查MongoDB是否运行
echo -e "${BLUE}检查MongoDB状态...${NC}"
if ! pgrep -x "mongod" > /dev/null
then
    echo -e "${RED}MongoDB未运行，请先启动MongoDB${NC}"
    echo "可以使用以下命令启动MongoDB："
    echo "sudo systemctl start mongod"
    exit 1
fi
echo -e "${GREEN}MongoDB正在运行${NC}"

# 启动后端服务
echo -e "${BLUE}启动后端服务...${NC}"
cd /home/ubuntu/ai-platform-project/backend
npm install
node src/app.js &
BACKEND_PID=$!
echo -e "${GREEN}后端服务已启动，PID: $BACKEND_PID${NC}"

# 等待后端服务启动
echo "等待后端服务完全启动..."
sleep 5

# 启动前端服务
echo -e "${BLUE}启动前端服务...${NC}"
cd /home/ubuntu/ai-platform-project/frontend
npm install
npm start &
FRONTEND_PID=$!
echo -e "${GREEN}前端服务已启动，PID: $FRONTEND_PID${NC}"

echo -e "${GREEN}AI工具聚合平台已启动${NC}"
echo "前端地址: http://localhost:3000"
echo "后端API地址: http://localhost:5000/api"
echo ""
echo "按 Ctrl+C 停止服务"

# 捕获SIGINT信号（Ctrl+C）
trap "echo -e '${BLUE}正在停止服务...${NC}'; kill $BACKEND_PID $FRONTEND_PID; echo -e '${GREEN}服务已停止${NC}'; exit" INT

# 保持脚本运行
wait
