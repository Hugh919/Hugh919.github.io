// src/lib/openai.ts
// 这个文件包含与OpenAI API通信的函数

// 定义消息类型
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// 定义聊天请求参数
export interface ChatRequest {
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
}

// 定义聊天响应
export interface ChatResponse {
  message: Message;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// 模拟OpenAI API调用
export async function chatCompletion(request: ChatRequest): Promise<ChatResponse> {
  // 在实际应用中，这里会调用真实的OpenAI API
  // 现在我们使用模拟响应
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 获取用户的最后一条消息
  const lastUserMessage = request.messages
    .filter(msg => msg.role === 'user')
    .pop()?.content || '';
  
  // 生成模拟响应
  const responseContent = generateMockResponse(lastUserMessage, request.messages);
  
  return {
    message: {
      role: 'assistant',
      content: responseContent
    },
    usage: {
      prompt_tokens: calculateTokens(request.messages),
      completion_tokens: calculateTokens([{ role: 'assistant', content: responseContent }]),
      total_tokens: calculateTokens([...request.messages, { role: 'assistant', content: responseContent }])
    }
  };
}

// 生成模拟响应
function generateMockResponse(userInput: string, conversationHistory: Message[]): string {
  const input = userInput.toLowerCase();
  
  // 检查是否有系统消息设置特定的响应模式
  const systemMessage = conversationHistory.find(msg => msg.role === 'system')?.content || '';
  const isCreativeMode = systemMessage.includes('创意') || systemMessage.includes('creative');
  
  // 基于用户输入的关键词生成响应
  if (input.includes('你好') || input.includes('嗨') || input.includes('hi')) {
    return '你好！很高兴与你交流。我能帮你做什么呢？';
  } else if (input.includes('名字')) {
    return '我是AI助手，很高兴为你服务！';
  } else if (input.includes('能做什么') || input.includes('功能')) {
    return '我可以回答问题、提供信息、进行对话交流，以及帮助你使用AI绘画功能。你可以问我任何问题，或者告诉我你想了解的内容。';
  } else if (input.includes('天气')) {
    return '我无法获取实时天气信息，但我可以帮你解答其他问题。如果你想知道天气，可以查看天气预报应用或网站。';
  } else if (input.includes('谢谢') || input.includes('感谢')) {
    return '不客气！如果还有其他问题，随时告诉我。';
  } else if (input.includes('绘画') || input.includes('画图') || input.includes('生成图像')) {
    return '你可以前往"AI绘画"页面，输入描述来生成图像。只需点击导航栏中的"AI绘画"选项，然后在文本框中描述你想要的图像，点击"生成图像"按钮即可。';
  } else if (input.includes('如何使用') || input.includes('怎么用')) {
    return '使用我很简单！在对话框中输入你的问题或想法，然后点击发送按钮。如果你想使用AI绘画功能，点击导航栏中的"AI绘画"选项，然后在文本框中描述你想要的图像。';
  } else if (input.length < 5) {
    return '请告诉我更多信息，这样我能更好地帮助你。';
  } else if (isCreativeMode) {
    // 创意模式下的响应更加活泼
    return `我理解你对"${userInput}"很感兴趣！这是一个很棒的话题，让我们一起探索更多可能性。你有什么特别想了解的方面吗？`;
  } else {
    // 默认响应
    return `我理解你说的是关于"${userInput}"。这是一个很好的问题。根据我的理解，这个话题涉及到多个方面。你想了解哪个具体方面的信息呢？`;
  }
}

// 计算token数量（简化版）
function calculateTokens(messages: Message[]): number {
  // 在实际应用中，这会使用更准确的token计算方法
  // 这里我们简单地计算字符数并除以4作为估计
  const totalChars = messages.reduce((sum, msg) => sum + msg.content.length, 0);
  return Math.ceil(totalChars / 4);
}
