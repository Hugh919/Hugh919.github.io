#!/bin/bash

# 部署脚本 - 将应用部署到Cloudflare Pages和Workers

# 设置颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== AI工具聚合平台部署脚本 ===${NC}"

# 检查wrangler是否安装
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}未找到wrangler命令，请先安装：npm install -g wrangler${NC}"
    exit 1
fi

# 进入项目目录
cd /home/ubuntu/ai-platform-deployment/ai-platform

# 安装依赖
echo -e "${BLUE}安装依赖...${NC}"
npm install

# 构建前端
echo -e "${BLUE}构建前端...${NC}"
npm run build

# 初始化数据库
echo -e "${BLUE}初始化数据库...${NC}"
wrangler d1 execute DB --local --file=migrations/0001_initial.sql

# 部署到Cloudflare
echo -e "${BLUE}部署到Cloudflare...${NC}"
wrangler deploy

echo -e "${GREEN}部署完成！${NC}"
echo "您的应用已部署到Cloudflare。"
echo "前端地址: https://ai-platform.example.com"
echo "API地址: https://ai-platform.example.com/api"
echo ""
echo "请确保在Cloudflare Dashboard中设置以下环境变量："
echo "- NODE_ENV: production"
echo "- JWT_SECRET: <您的JWT密钥>"
