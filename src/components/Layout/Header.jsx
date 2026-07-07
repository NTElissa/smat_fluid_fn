import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useNotifications } from '../../hooks/useNotifications'
import NotificationBell from '../Notifications/NotificationBell'
import { 
  HiMenu,
  HiUserCircle,
  HiLogout,
  HiChevronDown,
  HiMoon,
  HiSun
} from 'react-icons/hi'

const Header = ({ toggleSidebar, isMobile, darkMode, toggleTheme }) => {
  const { user, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-30 border-b border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <HiMenu className="w-6 h-6 text-gray-600" />
            </button>
          )}
          
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">IV</span>
            </div>
            <span className="hidden font-semibold text-gray-800 dark:text-slate-100 sm:block">
              SMAT Fluid 
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {darkMode ? <HiSun className="h-5 w-5" /> : <HiMoon className="h-5 w-5" />}
          </button>

          <NotificationBell count={unreadCount} />
          
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-500/20">
                <HiUserCircle className="w-6 h-6 text-primary-600" />
              </div>
              <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 md:block">
                {user?.firstName} {user?.lastName}
              </span>
              <HiChevronDown className="hidden h-4 w-4 text-gray-600 dark:text-slate-300 md:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                <div className="border-b border-gray-100 px-4 py-2 dark:border-slate-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs capitalize text-gray-500 dark:text-slate-400">{user?.role}</p>
                </div>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  onClick={() => setShowUserMenu(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    logout()
                  }}
                  className="flex w-full items-center space-x-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  <HiLogout className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header