'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Message } from '@/lib/openai'

// 定义应用状态类型
interface AppState {
  // 对话相关状态
  lastChatMessage: string | null;
  setLastChatMessage: (message: string | null) => void;
  
  // 绘画相关状态
  lastDrawPrompt: string | null;
  setLastDrawPrompt: (prompt: string | null) => void;
  lastGeneratedImageUrl: string | null;
  setLastGeneratedImageUrl: (url: string | null) => void;
  
  // 共享功能
  useChatMessageAsDrawPrompt: (message: string) => void;
}

// 创建上下文
const AppContext = createContext<AppState | undefined>(undefined)

// 提供者组件
export function AppProvider({ children }: { children: ReactNode }) {
  const [lastChatMessage, setLastChatMessage] = useState<string | null>(null)
  const [lastDrawPrompt, setLastDrawPrompt] = useState<string | null>(null)
  const [lastGeneratedImageUrl, setLastGeneratedImageUrl] = useState<string | null>(null)
  
  // 使用聊天消息作为绘画提示词
  const useChatMessageAsDrawPrompt = (message: string) => {
    setLastDrawPrompt(message)
    // 可以添加导航到绘画页面的逻辑，但这需要在组件中使用router
  }
  
  const value = {
    lastChatMessage,
    setLastChatMessage,
    lastDrawPrompt,
    setLastDrawPrompt,
    lastGeneratedImageUrl,
    setLastGeneratedImageUrl,
    useChatMessageAsDrawPrompt
  }
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// 自定义钩子，用于访问上下文
export function useAppState() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider')
  }
  return context
}
