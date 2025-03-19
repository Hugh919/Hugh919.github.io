'use client'

import { createContext, useContext, useState, useEffect } from "react"

// 创建应用状态上下文
type AppState = {
  lastChatMessage: string | null;
  lastGeneratedImage: string | null;
}

type AppContextType = {
  appState: AppState;
  updateLastChatMessage: (message: string) => void;
  updateLastGeneratedImage: (imageUrl: string) => void;
}

const initialState: AppState = {
  lastChatMessage: null,
  lastGeneratedImage: null
}

const AppContext = createContext<AppContextType | null>(null)

// 应用状态提供者组件
export function AppStateProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [appState, setAppState] = useState<AppState>(initialState)
  
  // 从本地存储加载状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedState = localStorage.getItem('appState')
        if (savedState) {
          setAppState(JSON.parse(savedState))
        }
      } catch (error) {
        console.error('加载应用状态失败:', error)
      }
    }
  }, [])
  
  // 保存状态到本地存储
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('appState', JSON.stringify(appState))
    }
  }, [appState])
  
  // 更新最后的聊天消息
  const updateLastChatMessage = (message: string) => {
    setAppState(prev => ({
      ...prev,
      lastChatMessage: message
    }))
  }
  
  // 更新最后生成的图像
  const updateLastGeneratedImage = (imageUrl: string) => {
    setAppState(prev => ({
      ...prev,
      lastGeneratedImage: imageUrl
    }))
  }
  
  return (
    <AppContext.Provider value={{ appState, updateLastChatMessage, updateLastGeneratedImage }}>
      {children}
    </AppContext.Provider>
  )
}

// 使用应用状态的钩子
export function useAppState() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider")
  }
  return context
}
