import { useState, useRef, useEffect } from 'react'
import { HiOutlineBell } from 'react-icons/hi'
import React from 'react'
import NotificationList from './NotificationList'
import { useNotifications } from '../../hooks/useNotifications'

const NotificationBell = ({ count }) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef(null)
  const { notifications, markNotificationAsRead } = useNotifications()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={buttonRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <HiOutlineBell className="w-6 h-6 text-gray-600" />
        {count > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>
          <NotificationList 
            notifications={notifications.slice(0, 5)}
            onNotificationClick={markNotificationAsRead}
          />
          <div className="p-3 border-t border-gray-200">
            <button 
              onClick={() => {
                // Navigate to notifications page
                window.location.href = '/notifications'
              }}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium w-full text-center"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell