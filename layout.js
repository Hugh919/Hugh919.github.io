import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI工具聚合平台',
  description: '一站式AI对话、AI绘画、AI视频生成平台',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
