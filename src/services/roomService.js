// services/roomService.js
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

// Helper to normalize room payload
const normalizeRoomPayload = (roomData = {}) => {
  const amenities = Array.isArray(roomData.amenities)
    ? roomData.amenities.map((item) => item?.trim()).filter(Boolean)
    : typeof roomData.amenities === 'string'
      ? roomData.amenities.split(',').map((item) => item.trim()).filter(Boolean)
      : []

  const assignedStaff = Array.isArray(roomData.assignedStaff)
    ? roomData.assignedStaff
        .filter((entry) => entry?.user && entry?.role)
        .map((entry) => ({
          user: typeof entry.user === 'object' ? entry.user._id || entry.user.id : entry.user,
          role: entry.role
        }))
    : undefined

  const payload = {
    roomNumber: roomData.roomNumber,
    ward: roomData.ward,
    floor: roomData.floor || '',
    capacity: Number(roomData.capacity) || 1,
    currentOccupancy: Number(roomData.currentOccupancy) || 0,
    status: roomData.status || 'available',
    type: roomData.type || 'general',
    amenities,
    notes: roomData.notes || '',
  }

  if (assignedStaff) {
    payload.assignedStaff = assignedStaff
  }

  return payload
}

// Create new room (admin can include assignedStaff)
export const createRoom = async (roomData) => {
  try {
    const formattedData = normalizeRoomPayload(roomData)
    const response = await api.post('/rooms', formattedData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to create room' }
  }
}

// Update room (general fields only)
export const updateRoom = async (id, roomData) => {
  try {
    const formattedData = normalizeRoomPayload(roomData)
    delete formattedData.assignedStaff
    const response = await api.put(`/rooms/${id}`, formattedData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to update room' }
  }
}

// Assign/replace staff on room (admin only)
export const assignRoomStaff = async (id, assignedStaff) => {
  try {
    const cleaned = (assignedStaff || [])
      .filter((entry) => entry?.user && entry?.role)
      .map((entry) => ({
        user: typeof entry.user === 'object' ? entry.user._id || entry.user.id : entry.user,
        role: entry.role
      }))

    const response = await api.put(`/rooms/${id}/assign-staff`, {
      assignedStaff: cleaned
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to assign staff' }
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


// Get available rooms
export const getAvailableRooms = async (params = {}) => {
  try {
    const response = await api.get('/rooms/available', { params })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch available rooms' }
  }
}