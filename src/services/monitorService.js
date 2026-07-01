import api from './api'

export const getMonitors = (params = {}) => {
  return api.get('/iv-monitors', { params })
}

export const getMonitor = (id) => {
  return api.get(`/iv-monitors/${id}`)
}

export const createMonitor = (monitorData) => {
  return api.post('/iv-monitors', monitorData)
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