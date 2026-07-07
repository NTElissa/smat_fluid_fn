import { useEffect, useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { createRoom, updateRoom, assignRoomStaff } from '../../services/roomService'
import { getAssignableStaff } from '../../services/userService'
import { AuthContext } from '../../context/AuthContext'
import Button from '../Common/Button'
import Input from '../Common/Input'
import Spinner from '../Common/Spinner'
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineCog,
  HiOutlineUserPlus,
  HiOutlineXMark,
  HiOutlineShieldCheck
} from 'react-icons/hi2'
import toast from 'react-hot-toast'

const ROLE_LABELS = {
  doctor: 'Doctor',
  nurse: 'Nurse',
  support_staff: 'Support Staff'
}

const ROLE_STYLES = {
  doctor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  nurse: 'bg-teal-100 text-teal-700 border-teal-200',
  support_staff: 'bg-amber-100 text-amber-700 border-amber-200'
}

const RoomForm = ({ room, onSuccess, onCancel }) => {
  // Fix: Use useContext with AuthContext
  const auth = useContext(AuthContext)
  const user = auth?.user
  const isAdmin = user?.role === 'admin'

  const [loading, setLoading] = useState(false)
  const [staffLoading, setStaffLoading] = useState(false)
  const [staffPool, setStaffPool] = useState({ doctors: [], nurses: [], supportStaff: [] })
  const [assignedStaff, setAssignedStaff] = useState([])
  const [pickRole, setPickRole] = useState('doctor')
  const [pickUserId, setPickUserId] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      roomNumber: '',
      ward: '',
      floor: '',
      capacity: 1,
      currentOccupancy: 0,
      status: 'available',
      type: 'general',
      amenities: '',
      notes: ''
    }
  })

  // Load base room fields
  useEffect(() => {
    if (!room) {
      // Reset to defaults if no room provided
      reset({
        roomNumber: '',
        ward: '',
        floor: '',
        capacity: 1,
        currentOccupancy: 0,
        status: 'available',
        type: 'general',
        amenities: '',
        notes: ''
      })
      setAssignedStaff([])
      return
    }

    reset({
      roomNumber: room?.roomNumber || '',
      ward: room?.ward || '',
      floor: room?.floor || '',
      capacity: room?.capacity || 1,
      currentOccupancy: room?.currentOccupancy || 0,
      status: room?.status || 'available',
      type: room?.type || 'general',
      amenities: Array.isArray(room?.amenities) ? room.amenities.join(', ') : (room?.amenities || ''),
      notes: room?.notes || ''
    })

    // Seed staff already assigned to this room (edit mode)
    const existing = Array.isArray(room?.assignedStaff)
      ? room.assignedStaff
          .filter(entry => entry) // Filter out null/undefined entries
          .map((entry) => ({
            user: entry.user?._id || entry.user,
            role: entry.role,
            firstName: entry.user?.firstName,
            lastName: entry.user?.lastName
          }))
      : []
    setAssignedStaff(existing)
  }, [room, reset])

  // Admin-only: load doctors/nurses/support staff for the picker
  useEffect(() => {
    if (!isAdmin) return
    
    const loadStaff = async () => {
      try {
        setStaffLoading(true)
        const data = await getAssignableStaff()
        
        // Ensure data has the expected structure with fallbacks
        setStaffPool({
          doctors: Array.isArray(data?.doctors) ? data.doctors : [],
          nurses: Array.isArray(data?.nurses) ? data.nurses : [],
          supportStaff: Array.isArray(data?.supportStaff) ? data.supportStaff : []
        })
      } catch (error) {
        console.error('Failed to load staff:', error)
        toast.error('Failed to load staff list')
        // Keep existing pool on error
      } finally {
        setStaffLoading(false)
      }
    }
    loadStaff()
  }, [isAdmin])

  const poolForRole = (role) => {
    if (role === 'doctor') return staffPool.doctors || []
    if (role === 'nurse') return staffPool.nurses || []
    return staffPool.supportStaff || []
  }

  const availableForPickRole = poolForRole(pickRole).filter(
    (person) => person?._id && !assignedStaff.some((a) => a?.user === person._id)
  )

  const handleAddStaff = () => {
    if (!pickUserId) {
      toast.error('Select a staff member first')
      return
    }
    const person = poolForRole(pickRole).find((p) => p?._id === pickUserId)
    if (!person) {
      toast.error('Staff member not found')
      return
    }

    setAssignedStaff((prev) => [
      ...prev,
      { 
        user: person._id, 
        role: pickRole, 
        firstName: person.firstName || '', 
        lastName: person.lastName || '' 
      }
    ])
    setPickUserId('')
  }

  const handleRemoveStaff = (userId) => {
    setAssignedStaff((prev) => prev.filter((entry) => entry.user !== userId))
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const payload = {
        ...data,
        capacity: parseInt(data.capacity) || 1,
        currentOccupancy: parseInt(data.currentOccupancy) || 0,
        amenities: data.amenities
          ? data.amenities.split(',').map((item) => item.trim()).filter(Boolean)
          : []
      }

      if (room?._id) {
        // Update existing room
        await updateRoom(room._id, payload)
        if (isAdmin) {
          // Only update staff if there are changes
          await assignRoomStaff(room._id, assignedStaff)
        }
        toast.success('Room updated successfully')
      } else {
        // Create new room
        if (isAdmin) {
          payload.assignedStaff = assignedStaff
        }
        await createRoom(payload)
        toast.success('Room added successfully')
      }
      onSuccess?.()
    } catch (error) {
      console.error('Room operation failed:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Operation failed'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-900/20">
          <HiOutlineHome className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {room ? 'Update room' : 'Add room'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {room ? 'Update room details and assigned staff' : 'Create a new room for patient care'}
          </p>
        </div>
      </div>

      {/* Section: Basic Info */}
      <section className="rounded-xl border-l-4 border-indigo-500 bg-indigo-50/40 p-4 dark:border-indigo-400 dark:bg-indigo-500/5">
        <span className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
          <HiOutlineHome className="h-4 w-4" />
          Basic Information
        </span>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Room Number"
            {...register('roomNumber', { required: 'Room number is required' })}
            error={errors.roomNumber?.message}
            placeholder="e.g., 101"
          />
          <Input
            label="Ward"
            {...register('ward', { required: 'Ward is required' })}
            error={errors.ward?.message}
            placeholder="e.g., Ward A"
          />
          <Input
            label="Floor"
            {...register('floor')}
            placeholder="e.g., 1st Floor"
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
            <select {...register('status')} className="input-field">
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
        </div>
      </section>

      {/* Section: Capacity & Type */}
      <section className="rounded-xl border-l-4 border-teal-500 bg-teal-50/40 p-4 dark:border-teal-400 dark:bg-teal-500/5">
        <span className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300">
          <HiOutlineUserGroup className="h-4 w-4" />
          Capacity & Type
        </span>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Capacity"
            type="number"
            {...register('capacity', { min: { value: 1, message: 'Capacity must be at least 1' } })}
            error={errors.capacity?.message}
            placeholder="Number of beds"
          />
          <Input
            label="Current Occupancy"
            type="number"
            {...register('currentOccupancy', { min: { value: 0, message: 'Occupancy cannot be negative' } })}
            error={errors.currentOccupancy?.message}
            placeholder="0"
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
            <select {...register('type')} className="input-field">
              <option value="general">General</option>
              <option value="icu">ICU</option>
              <option value="maternity">Maternity</option>
              <option value="pediatric">Pediatric</option>
              <option value="surgery">Surgery</option>
            </select>
          </div>
        </div>
      </section>

      {/* Section: Staff Assignment — admin only */}
      {isAdmin && (
        <section className="rounded-xl border-l-4 border-purple-500 bg-purple-50/40 p-4 dark:border-purple-400 dark:bg-purple-500/5">
          <span className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300">
            <HiOutlineShieldCheck className="h-4 w-4" />
            Assign Staff
            <span className="ml-1 rounded-full bg-purple-200/60 px-2 py-0.5 text-[10px] font-medium normal-case text-purple-800">
              Admin only
            </span>
          </span>

          {staffLoading ? (
            <div className="flex items-center gap-2 py-2 text-sm text-slate-500">
              <Spinner size="sm" />
              <span>Loading staff...</span>
            </div>
          ) : (
            <>
              {/* Picker row */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  value={pickRole}
                  onChange={(e) => {
                    setPickRole(e.target.value)
                    setPickUserId('')
                  }}
                  className="input-field sm:w-40"
                >
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="support_staff">Support Staff</option>
                </select>

                <select
                  value={pickUserId}
                  onChange={(e) => setPickUserId(e.target.value)}
                  className="input-field flex-1"
                >
                  <option value="">
                    {availableForPickRole.length === 0
                      ? `No available ${ROLE_LABELS[pickRole].toLowerCase()}s`
                      : `Select ${ROLE_LABELS[pickRole].toLowerCase()}...`}
                  </option>
                  {availableForPickRole.map((person) => (
                    <option key={person._id} value={person._id}>
                      {person.firstName} {person.lastName}
                      {person.department ? ` — ${person.department}` : ''}
                    </option>
                  ))}
                </select>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddStaff}
                  disabled={!pickUserId}
                  className="sm:w-auto"
                >
                  <HiOutlineUserPlus className="w-4 h-4" />
                  <span>Add</span>
                </Button>
              </div>

              {/* Assigned staff chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                {assignedStaff.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No staff assigned yet.</p>
                ) : (
                  assignedStaff.map((entry) => (
                    <span
                      key={entry.user}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${ROLE_STYLES[entry.role] || 'bg-gray-100 text-gray-700 border-gray-200'}`}
                    >
                      <span>
                        {entry.firstName || 'Staff'} {entry.lastName || ''}
                      </span>
                      <span className="opacity-70">· {ROLE_LABELS[entry.role] || entry.role}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStaff(entry.user)}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-black/10"
                      >
                        <HiOutlineXMark className="h-3 w-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </>
          )}
        </section>
      )}

      {/* Section: Amenities */}
      <section className="rounded-xl border-l-4 border-slate-400 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/40">
        <span className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          <HiOutlineCog className="h-4 w-4" />
          Amenities
        </span>
        <Input
          label="Amenities"
          {...register('amenities')}
          placeholder="e.g., TV, Air Conditioning, Private Bathroom"
        />
      </section>

      {/* Section: Notes */}
      <section className="rounded-xl border-l-4 border-slate-400 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/40">
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Notes</label>
        <textarea {...register('notes')} rows="3" className="input-field" placeholder="Additional notes..." />
      </section>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={loading}>
          {room ? 'Update room' : 'Add room'}
        </Button>
      </div>
    </form>
  )
}

export default RoomForm