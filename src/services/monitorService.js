// src/services/monitorService.js
import api from './api'

export const getMonitors = (params = {}) => {
  return api.get('/iv-monitors', { params })
}

export const getMonitorPatients = async () => {
  try {
    const response = await api.get('/iv-monitors/patients')
    return response
  } catch (error) {
    console.error('Error fetching monitor patients:', error)
    throw error
  }
}

export const getMonitor = (id) => {
  return api.get(`/iv-monitors/${id}`)
}

export const createMonitor = async (monitorData) => {
  try {
    const response = await api.post('/iv-monitors', monitorData)
    return response
  } catch (error) {
    console.error('Error creating monitor:', error)
    throw error
  }
}

export const updateReading = (id, readingData) => {
  return api.put(`/iv-monitors/${id}/reading`, readingData)
}

export const requestBagChange = (id, reason) => {
  return api.post(`/iv-monitors/${id}/request-change`, { reason })
}

export const completeSession = (id) => {
  return api.put(`/iv-monitors/${id}/complete`)
}