// src/context/NotificationContext.jsx - UPDATED WITH DEBOUNCE
import React, { createContext, useState, useEffect, useCallback, useRef } from 'react'
import { useSocket } from '../hooks/useSocket'
import { getNotifications, markAsRead, markAllAsRead as markAllNotificationsRead } from '../services/notificationService'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'

export const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { socket } = useSocket()
  const { isAuthenticated } = useAuth()
  const loadTimeoutRef = useRef(null)
  const lastLoadRef = useRef(0)

  // Debounced load function
  const debouncedLoad = useCallback(() => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current)
    }
    
    loadTimeoutRef.current = setTimeout(() => {
      loadNotifications()
    }, 2000) // Wait 2 seconds after last call before loading
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      // Initial load with delay
      const timer = setTimeout(() => {
        loadNotifications()
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (socket && isAuthenticated) {
      socket.on('notification', handleNewNotification)
      
      return () => {
        socket.off('notification', handleNewNotification)
      }
    }
  }, [socket, isAuthenticated])

  const loadNotifications = async (force = false) => {
    // Prevent too frequent calls
    const now = Date.now()
    if (!force && now - lastLoadRef.current < 5000) { // 5 seconds minimum between loads
      console.log('Skipping notification load - too soon')
      return
    }

    if (isLoading) return

    try {
      setIsLoading(true)
      lastLoadRef.current = now
      const response = await getNotifications({ limit: 50 })
      setNotifications(response.data.data)
      updateUnreadCount(response.data.data)
    } catch (error) {
      if (error.response?.status === 429) {
        console.log('Rate limited, will retry later')
        // Retry after delay
        setTimeout(() => loadNotifications(true), 10000)
      } else {
        console.error('Failed to load notifications:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewNotification = (notification) => {
    setNotifications(prev => {
      const updated = [notification, ...prev]
      updateUnreadCount(updated)
      return updated
    })
    
    // Show toast for new notifications
    if (notification.priority === 'high') {
      toast.error(notification.message, {
        duration: 5000,
        icon: '🔴',
        position: 'top-right'
      })
    } else if (notification.type === 'alert') {
      toast.warning(notification.message, {
        duration: 4000,
        icon: '⚠️',
        position: 'top-right'
      })
    } else {
      toast.success(notification.message, {
        duration: 3000,
        icon: '🔔',
        position: 'top-right'
      })
    }
  }

  const updateUnreadCount = (notifs) => {
    const count = notifs.filter(n => !n.isRead).length
    setUnreadCount(count)
    
    // Update document title with unread count
    if (count > 0) {
      document.title = `(${count}) IV Monitoring`
    } else {
      document.title = 'IV Monitoring'
    }
  }

  const markNotificationAsRead = async (id) => {
    try {
      await markAsRead(id)
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true, readAt: new Date() } : n)
      )
      updateUnreadCount(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      toast.error('Failed to mark notification as read')
    }
  }

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsRead()
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true, readAt: new Date() }))
      )
      setUnreadCount(0)
      toast.success('All notifications marked as read')
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const value = {
    notifications,
    unreadCount,
    isLoading,
    markNotificationAsRead,
    markAllAsRead,
    loadNotifications: () => debouncedLoad()
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}