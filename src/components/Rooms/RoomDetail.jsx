import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  HiOutlineArrowLeft,
  HiOutlineIdentification,
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineStar,
  HiOutlineClipboard
} from 'react-icons/hi'
import { getRoom } from '../../services/roomService'
import Spinner from '../Common/Spinner'
import Button from '../Common/Button'
import toast from 'react-hot-toast'

const RoomDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRoom()
  }, [id])

  const loadRoom = async () => {
    try {
      setLoading(true)
      const response = await getRoom(id)
      const roomData = response.data || response
      setRoom(roomData)
    } catch {
      // toast.error('Failed to load room details')
      navigate('/rooms')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700 border-green-200'
      case 'occupied': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'maintenance': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'reserved': return 'bg-purple-100 text-purple-700 border-purple-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'icu': return 'bg-red-100 text-red-700 border-red-200'
      case 'maternity': return 'bg-pink-100 text-pink-700 border-pink-200'
      case 'pediatric': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'surgery': return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading room details...</p>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Room not found</p>
        <Button variant="primary" onClick={() => navigate('/rooms')} className="mt-4">
          Back to Rooms
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/rooms')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <HiOutlineArrowLeft className="w-4 h-4" />
        <span>Back to Rooms</span>
      </button>

      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white shadow-xl shadow-indigo-900/20 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Room {room.roomNumber}</h1>
            <p className="text-indigo-100/90 mt-1.5 text-lg">
              {room.ward || 'No ward'} • {room.floor ? `Floor ${room.floor}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(room.status)}`}>
              {room.status ? room.status.charAt(0).toUpperCase() + room.status.slice(1) : 'Available'}
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getTypeColor(room.type)}`}>
              {room.type ? room.type.charAt(0).toUpperCase() + room.type.slice(1) : 'General'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <HiOutlineIdentification className="w-5 h-5 text-indigo-600" />
            <span>Room Information</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Room Number</span>
              <span className="font-medium text-gray-900">{room.roomNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Ward</span>
              <span className="font-medium text-gray-900">{room.ward || '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Floor</span>
              <span className="font-medium text-gray-900">{room.floor || '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Type</span>
              <span className="font-medium text-gray-900 capitalize">{room.type || 'General'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <HiOutlineUsers className="w-5 h-5 text-indigo-600" />
            <span>Occupancy</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Capacity</span>
              <span className="font-medium text-gray-900">{room.capacity || 1}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Current Occupancy</span>
              <span className="font-medium text-gray-900">{room.currentOccupancy || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(((room.currentOccupancy || 0) / (room.capacity || 1)) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <HiOutlineStar className="w-5 h-5 text-indigo-600" />
            <span>Status</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Current Status</span>
              <span className={`font-medium capitalize ${room.status === 'available' ? 'text-green-600' : room.status === 'occupied' ? 'text-blue-600' : room.status === 'maintenance' ? 'text-yellow-600' : 'text-gray-600'}`}>
                {room.status || 'Available'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {room.amenities?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <HiOutlineStar className="w-5 h-5 text-indigo-600" />
            <span>Amenities</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {room.amenities.map((amenity, index) => (
              <span key={index} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <HiOutlineClipboard className="w-5 h-5 text-indigo-600" />
          <span>Assigned Staff</span>
        </h3>
        {room.assignedStaff?.length ? (
          <div className="flex flex-wrap gap-2">
            {room.assignedStaff.map((entry) => (
              <span key={entry._id || entry.user?._id} className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
                {entry.user?.firstName || 'Staff'} {entry.user?.lastName || ''} • {entry.role}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No staff assigned to this room yet.</p>
        )}
      </div>

      {room.notes && (
        <div className="bg-white rounded-xl shadow-sm p-6 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <HiOutlineClipboard className="w-5 h-5 text-indigo-600" />
            <span>Notes</span>
          </h3>
          <p className="text-gray-700 text-sm">{room.notes}</p>
        </div>
      )}
    </div>
  )
}

export default RoomDetail
