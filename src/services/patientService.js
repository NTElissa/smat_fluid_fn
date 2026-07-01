import api from './api'

// Get all patients with filters
export const getPatients = async (params = {}) => {
  try {
    const response = await api.get('/patients', { params })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch patients' }
  }
}

// Get single patient
export const getPatient = async (id) => {
  try {
    const response = await api.get(`/patients/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch patient' }
  }
}

// Create new patient
export const createPatient = async (patientData) => {
  try {
    // Format data for backend
    const formattedData = {
      ...patientData,
      allergies: patientData.allergies ? patientData.allergies.split(',').map(a => a.trim()) : []
    }
    const response = await api.post('/patients', formattedData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create patient' }
  }
}

// Update patient
export const updatePatient = async (id, patientData) => {
  try {
    const formattedData = {
      ...patientData,
      allergies: patientData.allergies ? patientData.allergies.split(',').map(a => a.trim()) : []
    }
    const response = await api.put(`/patients/${id}`, formattedData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update patient' }
  }
}

// Delete patient
export const deletePatient = async (id) => {
  try {
    const response = await api.delete(`/patients/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete patient' }
  }
}

// Get patients by ward
export const getPatientsByWard = async (ward) => {
  try {
    const response = await api.get('/patients', { params: { ward } })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch patients' }
  }
}

// Get patient statistics
export const getPatientStats = async () => {
  try {
    const response = await api.get('/patients/stats')
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch stats' }
  }
}