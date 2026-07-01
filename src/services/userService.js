import api from './api'

// Get all users
export const getUsers = async (params = {}) => {
  try {
    const response = await api.get('/users', { params })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch users' }
  }
}

// Get single user
export const getUser = async (id) => {
  try {
    const response = await api.get(`/users/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user' }
  }
}

// Update user
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update user' }
  }
}

// Delete user
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete user' }
  }
}

// Get users by role
export const getUsersByRole = async (role) => {
  try {
    const response = await api.get('/users', { params: { role } })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch users' }
  }
}

// Get online users (if you have socket.io tracking)
export const getOnlineUsers = async () => {
  try {
    const response = await api.get('/users/online')
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch online users' }
  }
}