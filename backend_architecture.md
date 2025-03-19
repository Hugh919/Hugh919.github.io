# AI工具聚合平台后端架构设计

## 1. 架构概述

AI工具聚合平台的后端采用模块化、可扩展的架构设计，主要负责处理用户认证、API集成、数据存储和业务逻辑。后端将作为前端与各种AI服务之间的中间层，统一管理API调用，处理认证和授权，并提供一致的接口给前端使用。

### 架构图

```
+-------------------+    +-------------------+    +-------------------+
|                   |    |                   |    |                   |
|   客户端应用       |    |   客户端应用       |    |   客户端应用       |
|   (Web浏览器)      |    |   (移动设备)       |    |   (桌面应用)       |
|                   |    |                   |    |                   |
+--------+----------+    +--------+----------+    +--------+----------+
         |                        |                        |
         |                        |                        |
         v                        v                        v
+-------------------------------------------------------------------+
|                                                                   |
|                           API网关层                               |
|                                                                   |
|  +---------------+  +---------------+  +---------------+          |
|  |               |  |               |  |               |          |
|  |  认证与授权    |  |  请求验证     |  |  速率限制     |          |
|  |               |  |               |  |               |          |
|  +---------------+  +---------------+  +---------------+          |
|                                                                   |
+----------------------------+----------------------------------------+
                             |
                             |
+----------------------------v----------------------------------------+
|                                                                   |
|                           业务逻辑层                               |
|                                                                   |
|  +---------------+  +---------------+  +---------------+          |
|  |               |  |               |  |               |          |
|  |  用户服务      |  |  AI对话服务    |  |  AI绘画服务   |          |
|  |               |  |               |  |               |          |
|  +---------------+  +---------------+  +---------------+          |
|                                                                   |
|  +---------------+  +---------------+  +---------------+          |
|  |               |  |               |  |               |          |
|  |  AI视频服务    |  |  内容管理     |  |  计费服务     |          |
|  |               |  |               |  |               |          |
|  +---------------+  +---------------+  +---------------+          |
|                                                                   |
+----------------------------+----------------------------------------+
                             |
                             |
+----------------------------v----------------------------------------+
|                                                                   |
|                           数据访问层                               |
|                                                                   |
|  +---------------+  +---------------+  +---------------+          |
|  |               |  |               |  |               |          |
|  |  用户数据      |  |  内容数据     |  |  API密钥管理   |          |
|  |               |  |               |  |               |          |
|  +---------------+  +---------------+  +---------------+          |
|                                                                   |
+----------------------------+----------------------------------------+
                             |
                             |
+----------------------------v----------------------------------------+
|                                                                   |
|                           外部服务集成层                            |
|                                                                   |
|  +---------------+  +---------------+  +---------------+          |
|  |               |  |               |  |               |          |
|  |  OpenAI集成    |  |  Runway集成    |  |  Synthesia集成 |          |
|  |               |  |               |  |               |          |
|  +---------------+  +---------------+  +---------------+          |
|                                                                   |
|  +---------------+  +---------------+  +---------------+          |
|  |               |  |               |  |               |          |
|  |  其他AI服务集成 |  |  存储服务集成  |  |  支付服务集成  |          |
|  |               |  |               |  |               |          |
|  +---------------+  +---------------+  +---------------+          |
|                                                                   |
+-------------------------------------------------------------------+
```

## 2. 技术栈选择

### 后端框架
- **Node.js**：使用JavaScript/TypeScript作为主要开发语言
- **Express.js**：轻量级Web应用框架，用于构建API
- **NestJS**（可选）：基于Express的全功能框架，提供更好的结构化和TypeScript支持

### 数据库
- **MongoDB**：主数据库，用于存储用户数据、内容和设置
- **Redis**：缓存层，用于会话管理和频率限制

### 认证与授权
- **JWT (JSON Web Tokens)**：用于用户认证
- **OAuth 2.0**：用于第三方服务集成
- **Passport.js**：认证中间件

### API文档
- **Swagger/OpenAPI**：API文档生成和测试
- **Postman**：API测试和协作

### 部署与DevOps
- **Docker**：容器化应用
- **Docker Compose**：多容器应用编排
- **GitHub Actions**：CI/CD流程

### 监控与日志
- **Winston**：日志记录
- **Prometheus**：指标收集
- **Grafana**：指标可视化

## 3. 数据模型设计

### 用户模型 (User)
```json
{
  "_id": "ObjectId",
  "username": "String",
  "email": "String",
  "passwordHash": "String",
  "firstName": "String",
  "lastName": "String",
  "avatar": "String",
  "createdAt": "Date",
  "updatedAt": "Date",
  "lastLogin": "Date",
  "role": "String",
  "status": "String",
  "preferences": {
    "theme": "String",
    "language": "String",
    "notifications": "Object"
  },
  "subscription": {
    "plan": "String",
    "startDate": "Date",
    "endDate": "Date",
    "status": "String"
  }
}
```

### API密钥模型 (ApiKey)
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "service": "String",
  "keyName": "String",
  "keyValue": "String (加密存储)",
  "createdAt": "Date",
  "updatedAt": "Date",
  "lastUsed": "Date",
  "status": "String",
  "usageStats": {
    "totalCalls": "Number",
    "monthlyUsage": "Number",
    "dailyUsage": "Number"
  }
}
```

### 对话模型 (Conversation)
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "title": "String",
  "model": "String",
  "createdAt": "Date",
  "updatedAt": "Date",
  "messages": [
    {
      "role": "String",
      "content": "String",
      "timestamp": "Date"
    }
  ],
  "settings": {
    "temperature": "Number",
    "maxLength": "Number",
    "topP": "Number"
  },
  "tags": ["String"]
}
```

### 图像模型 (Image)
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "title": "String",
  "prompt": "String",
  "model": "String",
  "createdAt": "Date",
  "imageUrl": "String",
  "thumbnailUrl": "String",
  "width": "Number",
  "height": "Number",
  "settings": {
    "style": "String",
    "numberOfImages": "Number"
  },
  "tags": ["String"]
}
```

### 视频模型 (Video)
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "title": "String",
  "prompt": "String",
  "model": "String",
  "createdAt": "Date",
  "videoUrl": "String",
  "thumbnailUrl": "String",
  "duration": "Number",
  "settings": {
    "inputType": "String",
    "inputImageUrl": "String",
    "resolution": "String"
  },
  "status": "String",
  "tags": ["String"]
}
```

### 使用统计模型 (UsageStats)
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "service": "String",
  "year": "Number",
  "month": "Number",
  "day": "Number",
  "count": "Number",
  "tokens": "Number",
  "cost": "Number",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## 4. API设计

### RESTful API端点

#### 用户管理
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息
- `PUT /api/auth/me` - 更新用户信息
- `PUT /api/auth/password` - 更改密码

#### API密钥管理
- `GET /api/keys` - 获取所有API密钥
- `POST /api/keys` - 添加新API密钥
- `GET /api/keys/:id` - 获取特定API密钥
- `PUT /api/keys/:id` - 更新API密钥
- `DELETE /api/keys/:id` - 删除API密钥

#### AI对话
- `GET /api/conversations` - 获取所有对话
- `POST /api/conversations` - 创建新对话
- `GET /api/conversations/:id` - 获取特定对话
- `PUT /api/conversations/:id` - 更新对话
- `DELETE /api/conversations/:id` - 删除对话
- `POST /api/conversations/:id/messages` - 添加新消息
- `GET /api/models/chat` - 获取可用的聊天模型

#### AI绘画
- `GET /api/images` - 获取所有图像
- `POST /api/images` - 创建新图像
- `GET /api/images/:id` - 获取特定图像
- `DELETE /api/images/:id` - 删除图像
- `POST /api/images/:id/variations` - 创建图像变体
- `GET /api/models/image` - 获取可用的图像模型

#### AI视频
- `GET /api/videos` - 获取所有视频
- `POST /api/videos` - 创建新视频
- `GET /api/videos/:id` - 获取特定视频
- `DELETE /api/videos/:id` - 删除视频
- `GET /api/videos/:id/status` - 检查视频生成状态
- `GET /api/models/video` - 获取可用的视频模型

#### 使用统计
- `GET /api/stats/usage` - 获取使用统计
- `GET /api/stats/usage/daily` - 获取每日使用统计
- `GET /api/stats/usage/monthly` - 获取每月使用统计

### API响应格式

所有API响应将遵循一致的JSON格式：

```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "errors": null
}
```

错误响应：

```json
{
  "success": false,
  "data": null,
  "message": "操作失败",
  "errors": [
    {
      "field": "email",
      "message": "邮箱格式不正确"
    }
  ]
}
```

## 5. 认证与授权

### 认证流程
1. 用户通过用户名/密码或社交媒体账号登录
2. 服务器验证凭据并生成JWT令牌
3. 客户端在后续请求中使用JWT令牌
4. 服务器验证令牌并授权请求

### JWT结构
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "用户ID",
    "name": "用户名",
    "role": "用户角色",
    "iat": "签发时间",
    "exp": "过期时间"
  },
  "signature": "..."
}
```

### 授权策略
- 基于角色的访问控制 (RBAC)
- 支持的角色：管理员、普通用户、高级用户
- 每个API端点定义所需的角色和权限

## 6. API代理层设计

API代理层是后端的核心组件，负责统一处理各种AI服务的API调用。

### 代理层职责
- 统一API调用接口
- 处理认证和授权
- 管理API密钥
- 处理错误和重试
- 实现速率限制
- 记录使用统计

### 代理层架构

```
+-------------------------------------------------------------------+
|                                                                   |
|                           API代理层                                |
|                                                                   |
|  +---------------+  +---------------+  +---------------+          |
|  |               |  |               |  |               |          |
|  |  请求预处理    |  |  服务路由     |  |  响应后处理   |          |
|  |               |  |               |  |               |          |
|  +---------------+  +---------------+  +---------------+          |
|                                                                   |
|  +---------------+  +---------------+  +---------------+          |
|  |               |  |               |  |               |          |
|  |  错误处理     |  |  速率限制     |  |  使用统计     |          |
|  |               |  |               |  |               |          |
|  +---------------+  +---------------+  +---------------+          |
|                                                                   |
+----------------------------+----------------------------------------+
                             |
                             v
+-------------------------------------------------------------------+
|                                                                   |
|                           服务适配器                               |
|                                                                   |
|  +---------------+  +---------------+  +---------------+          |
|  |               |  |               |  |               |          |
|  |  OpenAI适配器  |  |  Runway适配器  |  | Synthesia适配器|          |
|  |               |  |               |  |               |          |
|  +---------------+  +---------------+  +---------------+          |
|                                                                   |
|  +---------------+  +---------------+  +---------------+          |
|  |               |  |               |  |               |          |
|  |  其他AI适配器   |  |  通用适配器    |  |  自定义适配器  |          |
|  |               |  |               |  |               |          |
|  +---------------+  +---------------+  +---------------+          |
|                                                                   |
+-------------------------------------------------------------------+
```

### 适配器模式

每个AI服务都有一个对应的适配器，负责处理特定服务的API调用。适配器实现统一的接口，使得代理层可以一致地处理不同的服务。

```typescript
interface AIServiceAdapter {
  initialize(config: any): Promise<void>;
  isAvailable(): boolean;
  callService(params: any): Promise<any>;
  handleError(error: any): any;
}

class OpenAIAdapter implements AIServiceAdapter {
  // 实现OpenAI特定的方法
}

class RunwayAdapter implements AIServiceAdapter {
  // 实现Runway特定的方法
}

class SynthesiaAdapter implements AIServiceAdapter {
  // 实现Synthesia特定的方法
}
```

## 7. 错误处理策略

### 错误分类
- 客户端错误 (4xx)
  - 验证错误
  - 认证错误
  - 授权错误
  - 资源不存在
- 服务器错误 (5xx)
  - 内部服务器错误
  - 外部服务错误
  - 数据库错误

### 错误处理流程
1. 捕获错误
2. 记录错误日志
3. 转换为标准错误格式
4. 返回适当的HTTP状态码和错误信息

### 错误响应格式
```json
{
  "success": false,
  "data": null,
  "message": "错误摘要",
  "errors": [
    {
      "code": "ERROR_CODE",
      "message": "详细错误信息",
      "field": "相关字段"
    }
  ]
}
```

## 8. 安全考虑

### 数据安全
- 所有敏感数据加密存储
- API密钥使用强加密算法保护
- 数据库访问控制和审计

### API安全
- 输入验证和清理
- HTTPS传输
- CORS策略
- 防止SQL注入和XSS攻击

### 认证安全
- 密码哈希使用bcrypt
- JWT令牌过期策略
- 防止暴力破解攻击

### 速率限制
- 基于IP的限制
- 基于用户的限制
- 基于API的限制

## 9. 可扩展性考虑

### 水平扩展
- 无状态API设计
- 负载均衡
- 分布式缓存

### 服务扩展
- 模块化设计
- 插件架构
- 动态服务发现

### 新AI服务集成
- 标准化适配器接口
- 配置驱动的服务集成
- 动态加载适配器

## 10. 实现计划

### 第一阶段：基础框架
- 设置Node.js/Express项目
- 实现基本的用户认证
- 创建数据库模型
- 设计API端点

### 第二阶段：API代理层
- 实现OpenAI适配器
- 实现Runway适配器
- 实现Synthesia适配器
- 开发统一的代理层

### 第三阶段：业务逻辑
- 实现对话服务
- 实现绘画服务
- 实现视频服务
- 开发使用统计

### 第四阶段：安全和优化
- 实现完整的认证和授权
- 添加速率限制
- 优化性能
- 完善错误处理

## 11. 部署架构

### 开发环境
- 本地Docker容器
- 开发数据库
- 模拟外部服务

### 测试环境
- CI/CD流水线
- 自动化测试
- 性能测试

### 生产环境
- 容器编排 (Kubernetes或Docker Swarm)
- 高可用数据库
- CDN集成
- 监控和警报

## 12. 监控和日志

### 日志策略
- 应用日志
- 访问日志
- 错误日志
- 性能日志

### 监控指标
- API响应时间
- 错误率
- 资源使用率
- 用户活动

### 警报系统
- 基于阈值的警报
- 异常检测
- 通知渠道 (邮件、短信、Slack)

## 13. 结论

本文档提供了AI工具聚合平台后端架构的全面设计。通过模块化、可扩展的架构，平台能够统一管理多种AI服务的API调用，为前端提供一致的接口，同时确保系统的安全性、可靠性和可扩展性。

后端架构将随着项目的进展而不断完善和调整，以适应用户需求和技术变化。下一步将是实现基础框架和核心功能，为前端开发提供必要的API支持。
