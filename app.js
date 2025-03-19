require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// 导入路由
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const apiKeyRoutes = require('./routes/apiKey.routes');
const chatRoutes = require('./routes/chat.routes');
const imageRoutes = require('./routes/image.routes');
const videoRoutes = require('./routes/video.routes');

// 初始化Express应用
const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(helmet()); // 安全HTTP头
app.use(cors()); // 启用CORS
app.use(express.json()); // 解析JSON请求体
app.use(morgan('dev')); // 日志记录

// 速率限制
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP限制100个请求
  standardHeaders: true,
  legacyHeaders: false,
  message: '请求过多，请稍后再试'
});

// 应用速率限制到所有请求
app.use('/api/', apiLimiter);

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/keys', apiKeyRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/videos', videoRoutes);

// 根路由
app.get('/', (req, res) => {
  res.json({
    message: 'AI工具聚合平台API',
    version: '1.0.0',
    status: 'running'
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '未找到请求的资源'
  });
});

// 连接数据库并启动服务器
const startServer = async () => {
  try {
    // 连接到MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-platform');
    console.log('已连接到MongoDB');
    
    // 启动服务器
    app.listen(PORT, () => {
      console.log(`服务器运行在端口 ${PORT}`);
    });
  } catch (error) {
    console.error('无法启动服务器:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app; // 导出用于测试
