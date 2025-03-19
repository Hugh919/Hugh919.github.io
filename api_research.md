# AI工具API研究报告

本文档整理了AI对话、AI绘画和AI视频生成相关的API信息，包括认证方式、请求格式、响应格式和使用限制等关键信息。

## 目录
1. [AI对话API](#ai对话api)
   - [OpenAI GPT API](#openai-gpt-api)
2. [AI绘画API](#ai绘画api)
   - [OpenAI DALL-E API](#openai-dall-e-api)
3. [AI视频API](#ai视频api)
   - [Runway Gen-3 Alpha API](#runway-gen-3-alpha-api)
   - [Synthesia API](#synthesia-api)

## AI对话API

### OpenAI GPT API

#### 概述
OpenAI的GPT API提供了强大的自然语言处理能力，可用于文本生成、对话、内容摘要、翻译等多种任务。最新的模型包括GPT-4和GPT-3.5-Turbo，其中GPT-3.5-Turbo是为ChatGPT提供支持的模型，专为对话模式进行了优化。

#### 认证方式
- 需要OpenAI API密钥
- 在请求头中添加`Authorization: Bearer YOUR_API_KEY`

#### 主要端点
- 会话补全API: `https://api.openai.com/v1/chat/completions`

#### 请求格式示例（会话补全）
```json
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {"role": "system", "content": "你是一个有用的助手。"},
    {"role": "user", "content": "你好，请介绍一下自己。"}
  ],
  "temperature": 0.7
}
```

#### 响应格式示例
```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "你好！我是OpenAI开发的AI助手。我可以回答问题、提供信息、帮助创作内容等。有什么我可以帮助你的吗？"
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 18,
    "completion_tokens": 42,
    "total_tokens": 60
  }
}
```

#### 使用限制
- 根据账户等级和订阅计划有不同的速率限制
- 模型有上下文长度限制（如GPT-3.5-Turbo通常为4096个token）
- 按token计费，包括输入和输出的token数量

## AI绘画API

### OpenAI DALL-E API

#### 概述
OpenAI的DALL-E API允许根据文本描述生成和编辑图像。DALL-E模型可以创建各种风格的图像，从写实到抽象，并且能够理解复杂的文本描述。

#### 认证方式
- 与GPT API相同，需要OpenAI API密钥
- 在请求头中添加`Authorization: Bearer YOUR_API_KEY`

#### 主要端点
- 图像生成: `https://api.openai.com/v1/images/generations`
- 图像编辑: `https://api.openai.com/v1/images/edits`
- 图像变体: `https://api.openai.com/v1/images/variations`

#### 请求格式示例（图像生成）
```json
{
  "prompt": "一只坐在草地上的橙色猫咪，背景是蓝天",
  "n": 1,
  "size": "1024x1024"
}
```

#### 响应格式示例
```json
{
  "created": 1589478378,
  "data": [
    {
      "url": "https://..."
    }
  ]
}
```

#### 使用限制
- 根据账户等级和订阅计划有不同的速率限制
- 图像生成有尺寸限制（如256x256、512x512或1024x1024）
- 按图像生成次数计费，不同尺寸价格不同

## AI视频API

### Runway Gen-3 Alpha API

#### 概述
Runway的Gen-3 Alpha是一个先进的AI视频生成模型，可以从文本描述或图像生成高质量视频。Gen-3 Alpha Turbo是其中一个更快速的版本，但需要输入图像。

#### 认证方式
- 需要Runway API密钥
- 在请求头中添加API密钥

#### 主要功能
1. 文本到视频生成
2. 图像到视频生成
3. 视频编辑和扩展

#### 价格
- 5秒视频: $0.25
- 10秒视频: $0.50

#### 使用限制
- Gen-3 Alpha Turbo需要输入图像
- 视频长度支持5秒和10秒
- 单个生成可以扩展最多三次
- 输出分辨率为1280x768或768x1280（仅Turbo模型支持竖屏）

### Synthesia API

#### 概述
Synthesia是一个AI视频生成平台，专注于创建带有AI虚拟人物的视频内容。它允许用户通过API自动化视频创建过程，特别适合个性化视频内容的批量生成。

#### 认证方式
- 需要Synthesia API密钥
- 在请求头中添加`Authorization: YOUR_API_KEY`

#### 主要端点
- 创建视频: `https://api.synthesia.io/v2/videos`
- 从模板创建视频: `https://api.synthesia.io/v2/videos/fromTemplate`
- 获取视频列表: `https://api.synthesia.io/v2/videos`
- 获取单个视频: `https://api.synthesia.io/v2/videos/{id}`

#### 请求格式示例（创建视频）
```json
{
  "test": true,
  "title": "My first Synthetic video",
  "visibility": "private",
  "aspectRatio": "16:9",
  "input": [
    {
      "scriptText": "Hello, this is a test video created using Synthesia API.",
      "avatar": "anna_costume1_cameraA",
      "background": "office1",
      "avatarSettings": {
        "voice": "en-US-JennyNeural",
        "horizontalAlignment": "center",
        "scale": 1
      }
    }
  ]
}
```

#### 响应格式示例
```json
{
  "callbackId": "example@example.com",
  "createdAt": 1713425134,
  "ctaSettings": {
    "label": "click me",
    "url": "example.com"
  },
  "description": "desc",
  "id": "81f62a0a-d9b0-4440-9b0c-XXXXXXX",
  "lastUpdatedAt": 1713425135,
  "status": "in_progress",
  "title": "title",
  "visibility": "private"
}
```

#### 使用限制
- 需要Creator计划或更高级别的订阅
- API速率限制根据订阅计划不同：
  - Tier 3 (Creator): 60 req/min, 300 req/hour, 1,000 req/day
  - Tier 2 (Enterprise): 80 req/min, 400 req/hour, 2,000 req/day
  - Tier 1 (Enterprise): 120 req/min, 600 req/hour, 3,000 req/day

## 总结与比较

### AI对话API
OpenAI的GPT API提供了最先进的自然语言处理能力，适合各种对话和文本生成任务。其API接口设计简洁，易于集成，但需要注意token使用限制和费用。

### AI绘画API
OpenAI的DALL-E API在图像生成领域表现出色，能够根据文本描述生成高质量图像。API使用方式与GPT API类似，便于开发者快速上手。

### AI视频API
- Runway Gen-3 Alpha专注于高质量的短视频生成，特别是在视觉效果和动态场景方面表现出色。
- Synthesia则专注于带有AI虚拟人物的视频内容，特别适合教育、培训和营销等场景。

在选择API时，需要根据具体应用场景、预算和技术要求进行评估。对于我们的AI工具聚合平台，可以考虑同时集成多种API，为用户提供更丰富的选择。
