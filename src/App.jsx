// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout/Layout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import PatientsPage from './pages/PatientsPage'
import MonitorsPage from './pages/MonitorsPage'
import AlertsPage from './pages/AlertsPage'
import SettingsPage from './pages/SettingsPage'
import MonitorDetail from './components/Monitors/MonitorDetail'
import TasksPage from './pages/TasksPage'
import PrivateRoute from './components/Auth/PrivateRoute'
import Spinner from './components/Common/Spinner'
import RoomsPage from './pages/RoomsPage'
// import ErrorBoundary from './components/ErrorBoundary' // Add this import

function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="monitors" element={<MonitorsPage />} />
          <Route path="monitors/:id" element={<MonitorDetail />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          {/* <Route 
            path="rooms" 
            element={
              <ErrorBoundary>
                <RoomsPage />
              </ErrorBoundary>
            } 
          /> */}
        </Route>
      </Route>
      
      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App