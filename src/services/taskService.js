import api from './api'

export const getTasks = (params = {}) => {
  return api.get('/tasks', { params })
}

export const getTask = (id) => {
  return api.get(`/tasks/${id}`)
}

export const createTask = (taskData) => {
  return api.post('/tasks', taskData)
}

export const acceptTask = (id) => {
  return api.put(`/tasks/${id}/accept`)
}

export const startTask = (id) => {
  return api.put(`/tasks/${id}/start`)
}

export const completeTask = (id, completionNotes) => {
  return api.put(`/tasks/${id}/complete`, { completionNotes })
}

export const cancelTask = (id) => {
  return api.put(`/tasks/${id}/cancel`)
}
