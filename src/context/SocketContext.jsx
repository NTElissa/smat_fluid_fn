import React, { createContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useAuth } from '../hooks/useAuth'

export const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const { token, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated && token) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin
      const newSocket = io(socketUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
        withCredentials: true,
        path: '/socket.io'
      })

      newSocket.on('connect', () => {
        console.log('Connected to socket server')
      })

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
      }
    }
  }, [isAuthenticated, token])

  const value = { socket }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}