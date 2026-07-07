import api from './api'

// Get all rooms with filters
export const getRooms = async (params = {}) => {
  try {
    const response = await api.get('/rooms', { params })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch rooms' }
  }
}

// Get single room
export const getRoom = async (id) => {
  try {
    const response = await api.get(`/rooms/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch room' }
  }
}

const normalizeRoomPayload = (roomData = {}) => {
  const amenities = Array.isArray(roomData.amenities)
    ? roomData.amenities.map((item) => item?.trim()).filter(Boolean)
    : typeof roomData.amenities === 'string'
      ? roomData.amenities.split(',').map((item) => item.trim()).filter(Boolean)
      : []

  return {
    ...roomData,
    capacity: Number(roomData.capacity ?? 1),
    currentOccupancy: Number(roomData.currentOccupancy ?? 0),
    amenities,
  }
}

// Create new room
export const createRoom = async (roomData) => {
  try {
    const formattedData = normalizeRoomPayload(roomData)
    const response = await api.post('/rooms', formattedData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to create room' }
  }
}

// Update room
export const updateRoom = async (id, roomData) => {
  try {
    const formattedData = normalizeRoomPayload(roomData)
    const response = await api.put(`/rooms/${id}`, formattedData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to update room' }
  }
}

// Delete room
export const deleteRoom = async (id) => {
  try {
    const response = await api.delete(`/rooms/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete room' }
  }
}