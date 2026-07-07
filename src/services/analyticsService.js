import api from './api'

export const getDashboardStats = async () => {
  const response = await api.get('/analytics/dashboard')
  return response.data
}

export const getWeeklyOverview = async () => {
  const response = await api.get('/analytics/weekly')
  return response.data
}

export const getPatientStats = async () => {
  const response = await api.get('/analytics/patients')
  return response.data
}

export const getSafetyMetrics = async () => {
  const response = await api.get('/analytics/safety')
  return response.data
}
