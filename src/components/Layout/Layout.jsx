import { Outlet } from 'react-router-dom'
import React from 'react'
import { useState, useEffect } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Header 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        isMobile={isMobile}
        darkMode={darkMode}
        toggleTheme={() => setDarkMode(!darkMode)}
      />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <Sidebar />
          </aside>
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          >
            <div 
              className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pt-16">
                <Sidebar closeSidebar={() => setSidebarOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          !isMobile ? 'ml-64' : ''
        }`}>
          <div className="p-4 md:p-6 mt-16">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileNav />}
    </div>
  )
}

export default Layout