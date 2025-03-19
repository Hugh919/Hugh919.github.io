'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  
  return (
    <nav className="bg-white shadow-md dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
                AI平台
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink href="/" current={pathname === '/'}>
                首页
              </NavLink>
              <NavLink href="/chat" current={pathname === '/chat'}>
                AI对话
              </NavLink>
              <NavLink href="/draw" current={pathname === '/draw'}>
                AI绘画
              </NavLink>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* 可以添加用户头像或其他功能按钮 */}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            {/* 移动端菜单按钮 */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:hover:bg-gray-700 dark:hover:text-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">打开主菜单</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      <div className="sm:hidden" id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          <MobileNavLink href="/" current={pathname === '/'}>
            首页
          </MobileNavLink>
          <MobileNavLink href="/chat" current={pathname === '/chat'}>
            AI对话
          </MobileNavLink>
          <MobileNavLink href="/draw" current={pathname === '/draw'}>
            AI绘画
          </MobileNavLink>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, current, children }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
        current
          ? 'border-primary-500 text-gray-900 dark:text-white'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
      }`}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, current, children }) {
  return (
    <Link
      href={href}
      className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
        current
          ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-gray-700 dark:border-primary-400 dark:text-white'
          : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
      }`}
    >
      {children}
    </Link>
  )
}
