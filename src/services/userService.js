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


// Get all users, optionally filtered by role (doctor | nurse | support_staff | admin)
// export const getUsers = async (params = {}) => {
//   try {
//     const response = await api.get('/users', { params })
//     return response.data
//   } catch (error) {
//     throw error.response?.data || { message: 'Failed to fetch users' }
//   }
// }

// Convenience helper: fetch only the roles that can be assigned to a room
export const getAssignableStaff = async () => {
  try {
    const [doctors, nurses, supportStaff] = await Promise.all([
      api.get('/users', { params: { role: 'doctor' } }),
      api.get('/users', { params: { role: 'nurse' } }),
      api.get('/users', { params: { role: 'support_staff' } }),
    ])

    const extract = (res) =>
      Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : []

    return {
      doctors: extract(doctors),
      nurses: extract(nurses),
      supportStaff: extract(supportStaff),
    }
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch staff' }
  }
}

// services/userService.js
