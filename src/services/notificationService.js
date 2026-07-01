// src/services/notificationService.js - ADD RETRY LOGIC
import api from './api'

const MAX_RETRIES = 3
const RETRY_DELAY = 1000

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getNotifications = async (params = {}, retryCount = 0) => {
  try {
    const response = await api.get('/notifications', { params })
    return response
  } catch (error) {
    if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
      // Rate limited - wait and retry
      console.log(`Rate limited, retrying in ${RETRY_DELAY}ms... (attempt ${retryCount + 1}/${MAX_RETRIES})`)
      await sleep(RETRY_DELAY * (retryCount + 1)) // Exponential backoff
      return getNotifications(params, retryCount + 1)
    }
    throw error
  }
}

export const markAsRead = (id) => {
  return api.put(`/notifications/${id}/read`)
}

export const markAllAsRead = () => {
  return api.put('/notifications/mark-all-read')
}

export const deleteNotification = (id) => {
  return api.delete(`/notifications/${id}`)
}

export const createTestNotification = (data) => {
  return api.post('/notifications/test-create', data)
}