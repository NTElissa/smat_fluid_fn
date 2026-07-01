import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register, getProfile } from '../services/authService'
import toast from 'react-hot-toast'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      loadUser()
    } else {
      setIsLoading(false)
    }
  }, [token])

  const loadUser = async () => {
    try {
      setIsLoading(true)
      const response = await getProfile()
      setUser(response.user)
      setError(null)
    } catch (error) {
      console.error('Failed to load user:', error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const loginUser = async (email, password) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await login(email, password)
      const { token, user } = response
      
      // Store token
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      
      toast.success(`Welcome back, ${user.firstName}!`, {
        icon: '👋',
        duration: 4000
      })
      
      navigate('/dashboard')
      return { success: true }
    } catch (error) {
      const message = error.message || 'Login failed'
      setError(message)
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const registerUser = async (userData) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await register(userData)
      const { token, user } = response
      
      // Store token
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      
      toast.success(`Welcome to IV Monitoring, ${user.firstName}!`, {
        icon: '🎉',
        duration: 5000
      })
      
      navigate('/dashboard')
      return { success: true }
    } catch (error) {
      const message = error.message || 'Registration failed'
      setError(message)
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const value = {
    user,
    token,
    isLoading,
    error,
    loginUser,
    registerUser,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}