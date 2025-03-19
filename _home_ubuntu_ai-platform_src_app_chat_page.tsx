'use client'

import { useState, useRef, useEffect } from 'react'
import { Message, chatCompletion } from '@/lib/openai'
import { saveConversationHistory, loadConversationHistory, validateUserInput } from '@/lib/utils'
import { useAppState } from '@/components/AppProvider'
import Link from 'next/link'

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // 使用应用状态
  const { setLastChatMessage, lastDrawPrompt } = useAppState()

  // 加载对话历史
  useEffect(() => {
    const history = loadConversationHistory()
    setMessages(history)
  }, [])

  // 保存对话历史
  useEffect(() => {
    if (messages.length > 0) {
      saveConversationHistory(messages)
    }
  }, [messages])

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // 如果有来自绘画页面的提示词，自动填入输入框
  useEffect(() => {
    if (lastDrawPrompt) {
      setInput(`请描述这个图像: ${lastDrawPrompt}`)
    }
  }, [lastDrawPrompt])

  // 处理发送消息
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证输入
    const validation = validateUserInput(input)
    if (!validation.valid) {
      setError(validation.message || '输入无效')
      return
    }
    
    if (isLoading) return
    
    setError(null)

    // 添加用户消息
    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    
    // 更新最后的聊天消息（用于在绘画页面使用）
    setLastChatMessage(input)
    
    setInput('')
    setIsLoading(true)

    try {
      // 调用AI API获取响应
      const response = await chatCompletion({
        messages: [...messages, userMessage],
        temperature: 0.7,
        max_tokens: 1000
      })

      setMessages(prev => [...prev, response.message])
    } catch (error) {
      console.error('Error getting AI response:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '抱歉，我遇到了一些问题。请稍后再试。' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // 清空对话历史
  const handleClearChat = () => {
    const newMessages = [{ 
      role: 'assistant', 
      content: '对话已清空。有什么我可以帮助你的吗？' 
    }]
    setMessages(newMessages)
    saveConversationHistory(newMessages)
  }
  
  // 使用当前消息作为绘画提示词
  const handleUseAsDrawPrompt = (content: string) => {
    setLastChatMessage(content)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI 对话</h1>
        <button
          onClick={handleClearChat}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
        >
          清空对话
        </button>
      </div>
      
      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-4 ${
              message.role === 'user' 
                ? 'text-right' 
                : 'text-left'
            }`}
          >
            <div 
              className={`inline-block max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              {message.content}
              
              {/* 用户消息添加"用作绘画提示词"按钮 */}
              {message.role === 'user' && (
                <div className="mt-2 text-xs flex justify-end">
                  <Link 
                    href="/draw" 
                    onClick={() => handleUseAsDrawPrompt(message.content)}
                    className="text-white/80 hover:text-white underline"
                  >
                    用作绘画提示词
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-left mb-4">
            <div className="inline-block max-w-[80%] p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {/* 输入区域 */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入你的问题..."
          className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          发送
        </button>
      </form>
    </div>
  )
}
