import api from './api'

// Login user
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' }
  }
}

// Register user
export const register = async (userData) => {
  try {
    // Format phone number for Rwanda
    let phoneNumber = userData.phoneNumber
    if (phoneNumber) {
      // Remove any non-digit characters
      phoneNumber = phoneNumber.replace(/\D/g, '')
      
      // Format to international format
      if (phoneNumber.startsWith('0')) {
        phoneNumber = '250' + phoneNumber.substring(1)
      } else if (!phoneNumber.startsWith('250')) {
        phoneNumber = '250' + phoneNumber
      }
      userData.phoneNumber = '+' + phoneNumber
    }

    const response = await api.post('/auth/register', userData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' }
  }
}

// Get user profile
export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile')
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get profile' }
  }
}

// Update profile
export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/auth/profile', userData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' }
  }
}

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/auth/change-password', { 
      currentPassword, 
      newPassword 
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to change password' }
  }
}