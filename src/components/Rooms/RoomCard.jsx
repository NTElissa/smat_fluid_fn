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

const STATUS_STYLES = {
  available: 'bg-green-100 text-green-700 border-green-200',
  occupied: 'bg-blue-100 text-blue-700 border-blue-200',
  maintenance: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  reserved: 'bg-purple-100 text-purple-700 border-purple-200'
}

const STATUS_DOT = {
  available: 'bg-green-500',
  occupied: 'bg-blue-500',
  maintenance: 'bg-yellow-500',
  reserved: 'bg-purple-500'
}

const STATUS_ICON = {
  available: '🟢',
  occupied: '🔵',
  maintenance: '🟡',
  reserved: '🟣'
}

const TYPE_STYLES = {
  icu: 'bg-red-100 text-red-700 border-red-200',
  maternity: 'bg-pink-100 text-pink-700 border-pink-200',
  pediatric: 'bg-orange-100 text-orange-700 border-orange-200',
  surgery: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  general: 'bg-slate-100 text-slate-700 border-slate-200'
}

const STAFF_ROLE_STYLES = {
  doctor: 'bg-indigo-100 text-indigo-700',
  nurse: 'bg-teal-100 text-teal-700',
  support_staff: 'bg-amber-100 text-amber-700'
}

const initials = (first, last) =>
  `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase() || '?'

const RoomCard = ({ room, onUpdate, onDelete }) => {
  const navigate = useNavigate()
  const [showEdit, setShowEdit] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const assignedStaff = Array.isArray(room.assignedStaff) ? room.assignedStaff : []

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
      <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <div className={`h-1.5 ${STATUS_DOT[room.status] || 'bg-gray-400'}`} />

        <div className="p-5">
          {/* Room Number and Status */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10">
                <HiHome className="h-4 w-4" />
              </span>
              <span className="font-semibold text-gray-900 dark:text-slate-100">
                Room {room.roomNumber}
              </span>
            </div>
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${STATUS_STYLES[room.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
              <span>{STATUS_ICON[room.status] || '⚪'}</span>
              <span>{room.status ? room.status.charAt(0).toUpperCase() + room.status.slice(1) : 'Available'}</span>
            </span>
          </div>

          {/* Ward / Floor */}
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-slate-400">
            <HiBuildingOffice2 className="h-3 w-3" />
            <span>{room.ward || '—'}</span>
            {room.floor && (
              <>
                <span>•</span>
                <span>{room.floor}</span>
              </>
            )}
          </div>

          {/* Capacity and Type */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center space-x-2 rounded-lg bg-gray-50 p-2 text-xs dark:bg-slate-800">
              <HiUserGroup className="h-3 w-3 text-gray-500" />
              <span className="text-gray-600 dark:text-slate-300">
                Capacity: {room.capacity || 1} • Occupancy: {room.currentOccupancy || 0}
              </span>
            </div>

            <div className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${TYPE_STYLES[room.type] || TYPE_STYLES.general}`}>
              {room.type ? room.type.charAt(0).toUpperCase() + room.type.slice(1) : 'General'}
            </div>
          </div>

          {/* Assigned Staff */}
          {assignedStaff.length > 0 && (
            <div className="mt-3 border-t border-gray-100 pt-3 dark:border-slate-700">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">
                Assigned Staff
              </p>
              <div className="flex -space-x-2">
                {assignedStaff.slice(0, 4).map((entry) => {
                  const u = entry.user || {}
                  return (
                    <span
                      key={entry._id || u._id || `${u.firstName}-${entry.role}`}
                      title={`${u.firstName || ''} ${u.lastName || ''} — ${entry.role}`}
                      className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold dark:border-slate-900 ${STAFF_ROLE_STYLES[entry.role] || 'bg-slate-200 text-slate-700'}`}
                    >
                      {initials(u.firstName, u.lastName)}
                    </span>
                  )
                })}
                {assignedStaff.length > 4 && (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-[10px] font-bold text-gray-700 dark:border-slate-900">
                    +{assignedStaff.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Amenities if any */}
          {room.amenities?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {room.amenities.slice(0, 3).map((amenity, index) => (
                <span key={index} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  {amenity}
                </span>
              ))}
              {room.amenities.length > 3 && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  +{room.amenities.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-slate-700">
            <button
              onClick={() => navigate(`/rooms/${room._id || room.id}`)}
              className="flex items-center space-x-1 text-sm text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400"
            >
              <HiEye className="h-4 w-4" />
              <span>View Details</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowEdit(true)}
                className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800"
                title="Edit Room"
              >
                <HiPencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-800"
                title="Delete Room"
              >
                <HiTrash className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Room Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Room" size="lg">
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
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete Room" size="sm">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <HiTrash className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Delete Room?</h3>
          <p className="mb-6 text-sm text-gray-500">
            Are you sure you want to delete <span className="font-medium text-gray-700">Room {room.roomNumber}</span>?
            This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-3">
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Room
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default RoomCard