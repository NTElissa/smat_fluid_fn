import { Navigate, Outlet } from 'react-router-dom'
import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import Spinner from '../Common/Spinner'

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute