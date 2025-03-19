// src/lib/utils.ts
// 工具函数库

import { Message } from './openai';

// 保存对话历史到本地存储
export function saveConversationHistory(messages: Message[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }
}

// 从本地存储加载对话历史
export function loadConversationHistory(): Message[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse chat history:', e);
      }
    }
  }
  
  // 默认初始消息
  return [
    { role: 'assistant', content: '你好！我是AI助手，有什么我可以帮助你的吗？' }
  ];
}

// 验证用户输入
export function validateUserInput(input: string): { valid: boolean; message?: string } {
  if (!input.trim()) {
    return { valid: false, message: '请输入内容' };
  }
  
  if (input.length > 1000) {
    return { valid: false, message: '输入内容过长，请限制在1000字符以内' };
  }
  
  return { valid: true };
}

// 格式化日期时间
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
}

// 生成唯一ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
