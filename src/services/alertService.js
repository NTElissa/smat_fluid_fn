import api from './api'

export const getAlerts = (params = {}) => {
  return api.get('/alerts', { params })
}

export const getActiveAlerts = () => {
  return api.get('/alerts/active')
}

export const acknowledgeAlert = (id) => {
  return api.put(`/alerts/${id}/acknowledge`)
}

export const resolveAlert = (id, resolutionNotes) => {
  return api.put(`/alerts/${id}/resolve`, { resolutionNotes })
}