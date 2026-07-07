import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createRoom, updateRoom } from '../../services/roomService'
import Button from '../Common/Button'
import Input from '../Common/Input'
import { HiOutlineHome, HiOutlineBuildingOffice2, HiOutlineUserGroup, HiOutlineCog } from 'react-icons/hi2'
import toast from 'react-hot-toast'

const RoomForm = ({ room, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false)
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

  useEffect(() => {
    reset({
      roomNumber: room?.roomNumber || '',
      ward: room?.ward || '',
      floor: room?.floor || '',
      capacity: room?.capacity || 1,
      currentOccupancy: room?.currentOccupancy || 0,
      status: room?.status || 'available',
      type: room?.type || 'general',
      amenities: Array.isArray(room?.amenities) ? room.amenities.join(', ') : '',
      notes: room?.notes || ''
    })
  }, [room, reset])

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const payload = {
        ...data,
        amenities: data.amenities
          ? data.amenities.split(',').map((item) => item.trim()).filter(Boolean)
          : []
      }

      if (room) {
        await updateRoom(room._id, payload)
        toast.success('Room updated successfully')
      } else {
        await createRoom(payload)
        toast.success('Room added successfully')
      }
      onSuccess?.()
    } catch (error) {
      toast.error(error?.message || error?.response?.data?.message || 'Operation failed')
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
            {room ? 'Update room details and settings' : 'Create a new room for patient care'}
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

      {/* Section: Amenities */}
      <section className="rounded-xl border-l-4 border-slate-400 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/40">
        <span className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          <HiOutlineCog className="h-4 w-4" />
          Amenities
        </span>
        <div className="relative">
          <Input
            label="Amenities"
            {...register('amenities')}
            placeholder="e.g., TV, Air Conditioning, Private Bathroom"
          />
        </div>
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