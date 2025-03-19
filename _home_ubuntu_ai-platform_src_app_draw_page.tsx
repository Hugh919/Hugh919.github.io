'use client'

import { useState, useEffect } from 'react'
import { generateImage, getAvailableStyles, getAvailableSizes, ImageGenerationResponse } from '@/lib/imageai'
import { useAppState } from '@/components/AppProvider'

export default function DrawPage() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<ImageGenerationResponse | null>(null)
  const [error, setError] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('realistic')
  const [selectedSize, setSelectedSize] = useState('512x512')
  const [generationHistory, setGenerationHistory] = useState<ImageGenerationResponse[]>([])
  
  // 使用应用状态
  const { lastChatMessage, setLastDrawPrompt, setLastGeneratedImageUrl } = useAppState()
  
  // 加载历史记录
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('drawHistory')
      if (saved) {
        try {
          setGenerationHistory(JSON.parse(saved))
        } catch (e) {
          console.error('Failed to parse draw history:', e)
        }
      }
    }
  }, [])
  
  // 保存历史记录
  useEffect(() => {
    if (generationHistory.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem('drawHistory', JSON.stringify(generationHistory.slice(0, 10))) // 只保存最近10条
    }
  }, [generationHistory])
  
  // 如果有来自聊天页面的消息，自动填入提示词输入框
  useEffect(() => {
    if (lastChatMessage) {
      setPrompt(lastChatMessage)
      setLastDrawPrompt(lastChatMessage)
    }
  }, [lastChatMessage, setLastDrawPrompt])
  
  // 处理图像生成
  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isGenerating) return
    
    setIsGenerating(true)
    setError('')
    
    try {
      // 调用AI绘画API生成图像
      const response = await generateImage({
        prompt,
        style: selectedStyle,
        size: selectedSize,
        n: 1
      })
      
      setGeneratedImage(response)
      setGenerationHistory(prev => [response, ...prev].slice(0, 10)) // 只保存最近10条
      
      // 更新最后生成的图像URL（用于在聊天页面使用）
      if (response.data && response.data.length > 0) {
        setLastGeneratedImageUrl(response.data[0].url)
      }
      
    } catch (error) {
      console.error('Error generating image:', error)
      setError('生成图像时出错，请稍后再试')
    } finally {
      setIsGenerating(false)
    }
  }
  
  // 处理图像下载
  const handleDownloadImage = () => {
    if (!generatedImage) return
    
    const link = document.createElement('a')
    link.href = generatedImage.data[0].url
    link.download = `ai-drawing-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  // 处理分享图像
  const handleShareImage = async () => {
    if (!generatedImage) return
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '我用AI创作的图像',
          text: `基于提示词: ${prompt}`,
          url: generatedImage.data[0].url
        })
      } catch (error) {
        console.error('Error sharing:', error)
        setError('分享失败，请手动复制图像链接')
      }
    } else {
      // 如果不支持原生分享，复制链接到剪贴板
      navigator.clipboard.writeText(generatedImage.data[0].url)
        .then(() => alert('图像链接已复制到剪贴板'))
        .catch(() => setError('复制链接失败'))
    }
  }
  
  // 可用的风格选项
  const styles = getAvailableStyles()
  
  // 可用的尺寸选项
  const sizes = getAvailableSizes()
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI 绘画</h1>
      
      <div className="mb-8">
        <form onSubmit={handleGenerateImage} className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              描述你想要的图像
            </label>
            <textarea
              id="prompt"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：一只可爱的猫咪在阳光下玩耍，背景是美丽的花园..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 dark:bg-gray-700 dark:text-white"
              disabled={isGenerating}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="style" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                图像风格
              </label>
              <select
                id="style"
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 dark:bg-gray-700 dark:text-white"
                disabled={isGenerating}
              >
                {styles.map(style => (
                  <option key={style.id} value={style.id}>{style.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                图像尺寸
              </label>
              <select
                id="size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 dark:bg-gray-700 dark:text-white"
                disabled={isGenerating}
              >
                {sizes.map(size => (
                  <option key={size.id} value={size.id}>{size.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? '生成中...' : '生成图像'}
            </button>
          </div>
        </form>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}
      
      {isGenerating && (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="w-16 h-16 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">正在生成您的图像，请稍候...</p>
        </div>
      )}
      
      {generatedImage && !isGenerating && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-4 bg-gray-50 dark:bg-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">生成结果</h3>
          </div>
          
          <div className="p-6 flex justify-center">
            <img 
              src={generatedImage.data[0].url} 
              alt="AI生成的图像" 
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
          
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex flex-wrap justify-between items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              提示词：{prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt}
            </span>
            
            <div className="flex space-x-2">
              <button
                onClick={handleDownloadImage}
                className="px-3 py-1 bg-secondary-600 text-white text-sm rounded hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2"
              >
                下载图像
              </button>
              
              <button
                onClick={handleShareImage}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                分享图像
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 历史记录 */}
      {generationHistory.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">历史记录</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {generationHistory.map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <img 
                  src={item.data[0].url} 
                  alt={`历史图像 ${index + 1}`}
                  className="w-full h-40 object-cover"
                />
                <div className="p-2 text-xs text-gray-500 dark:text-gray-400 truncate">
                  {item.data[0].prompt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
