import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  HiHome,
  HiEye,
  HiPencil,
  HiTrash,
  HiUserGroup,
  HiBuildingOffice2
} from 'react-icons/hi2'
import Modal from '../Common/Modal'
import RoomForm from './RoomForm'
import Button from '../Common/Button'
import toast from 'react-hot-toast'

const RoomCard = ({ room, onUpdate, onDelete }) => {
  const navigate = useNavigate()
  const [showEdit, setShowEdit] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'occupied':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'reserved':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return '🟢'
      case 'occupied': return '🔵'
      case 'maintenance': return '🟡'
      case 'reserved': return '🟣'
      default: return '⚪'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'icu':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'maternity':
        return 'bg-pink-100 text-pink-700 border-pink-200'
      case 'pediatric':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'surgery':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const handleDelete = async () => {
    try {
      await onDelete(room._id)
      setShowDeleteConfirm(false)
    } catch {
      toast.error('Failed to delete room')
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
        <div className={`h-2 ${
          room.status === 'available' ? 'bg-green-500' :
          room.status === 'occupied' ? 'bg-blue-500' :
          room.status === 'maintenance' ? 'bg-yellow-500' :
          room.status === 'reserved' ? 'bg-purple-500' :
          'bg-gray-500'
        }`}></div>
        
        <div className="p-5">
          {/* Room Number and Status */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <HiHome className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-gray-900 dark:text-slate-100">
                Room {room.roomNumber}
              </span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(room.status)}`}>
              <span>{getStatusIcon(room.status)}</span>
              <span>{room.status?.charAt(0).toUpperCase() + room.status?.slice(1) || 'Available'}</span>
            </span>
          </div>

          {/* Room Info */}
          <div className="flex-1 min-w-0">
            <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500 dark:text-slate-400">
              <HiBuildingOffice2 className="w-3 h-3" />
              <span>{room.ward || '—'}</span>
              {room.floor && (
                <>
                  <span>•</span>
                  <span>{room.floor}</span>
                </>
              )}
            </div>
          </div>

          {/* Capacity and Type */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center space-x-2 rounded-lg bg-gray-50 p-2 text-xs dark:bg-slate-800">
              <HiUserGroup className="w-3 h-3 text-gray-500" />
              <span className="text-gray-600 dark:text-slate-300">
                Capacity: {room.capacity || 1} • Occupancy: {room.currentOccupancy || 0}
              </span>
            </div>
            
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(room.type)}`}>
              {room.type ? room.type.charAt(0).toUpperCase() + room.type.slice(1) : 'General'}
            </div>
          </div>

          {/* Amenities if any */}
          {room.amenities?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {room.amenities.slice(0, 3).map((amenity, index) => (
                <span key={index} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">
                  {amenity}
                </span>
              ))}
              {room.amenities.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{room.amenities.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-slate-700">
            <button
              onClick={() => navigate(`/rooms/${room._id || room.id}`)}
              className="flex items-center space-x-1 text-sm text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
            >
              <HiEye className="w-4 h-4" />
              <span>View Details</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowEdit(true)}
                className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:text-slate-400 dark:hover:bg-slate-800"
                title="Edit Room"
              >
                <HiPencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-800"
                title="Delete Room"
              >
                <HiTrash className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Room Modal */}
      <Modal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Room"
        size="lg"
      >
        <RoomForm
          room={room}
          onSuccess={() => {
            setShowEdit(false)
            onUpdate()
          }}
          onCancel={() => setShowEdit(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Room"
        size="sm"
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <HiTrash className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Room?
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete <span className="font-medium text-gray-700">Room {room.roomNumber}</span>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete Room
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default RoomCard