import { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { createRoom, updateRoom, assignRoomStaff } from '../../services/roomService';
import { getAssignableStaff } from '../../services/userService';
import { AuthContext } from '../../context/AuthContext';
import Button from '../Common/Button';
import Input from '../Common/Input';
import Spinner from '../Common/Spinner';
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineCog,
  HiOutlineUserPlus,
  HiOutlineXMark,
  HiOutlineShieldCheck,
  HiOutlineBuildingOffice2,
  HiOutlineMapPin,
  HiOutlineClipboard,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

const ROLE_LABELS = {
  doctor: 'Doctor',
  nurse: 'Nurse',
  support_staff: 'Support Staff',
};

const ROLE_STYLES = {
  doctor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  nurse: 'bg-teal-100 text-teal-700 border-teal-200',
  support_staff: 'bg-amber-100 text-amber-700 border-amber-200',
};

const RoomForm = ({ isOpen, onClose, onSuccess, room }) => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  const [loading, setLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffPool, setStaffPool] = useState({ doctors: [], nurses: [], supportStaff: [] });
  const [assignedStaff, setAssignedStaff] = useState([]);
  const [pickRole, setPickRole] = useState('doctor');
  const [pickUserId, setPickUserId] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      roomNumber: '',
      ward: '',
      floor: '',
      capacity: 1,
      currentOccupancy: 0,
      status: 'available',
      type: 'general',
      amenities: '',
      notes: '',
    },
  });

  // Reset form when room changes (edit vs add)
  useEffect(() => {
    if (!room) {
      reset({
        roomNumber: '',
        ward: '',
        floor: '',
        capacity: 1,
        currentOccupancy: 0,
        status: 'available',
        type: 'general',
        amenities: '',
        notes: '',
      });
      setAssignedStaff([]);
      return;
    }
    reset({
      roomNumber: room?.roomNumber || '',
      ward: room?.ward || '',
      floor: room?.floor || '',
      capacity: room?.capacity || 1,
      currentOccupancy: room?.currentOccupancy || 0,
      status: room?.status || 'available',
      type: room?.type || 'general',
      amenities: Array.isArray(room?.amenities) ? room.amenities.join(', ') : room?.amenities || '',
      notes: room?.notes || '',
    });
    const existing = Array.isArray(room?.assignedStaff)
      ? room.assignedStaff
          .filter((entry) => entry)
          .map((entry) => ({
            user: entry.user?._id || entry.user,
            role: entry.role,
            firstName: entry.user?.firstName,
            lastName: entry.user?.lastName,
          }))
      : [];
    setAssignedStaff(existing);
  }, [room, reset]);

  // Load staff pool (admin only)
  useEffect(() => {
    if (!isAdmin) return;
    const loadStaff = async () => {
      try {
        setStaffLoading(true);
        const data = await getAssignableStaff();
        setStaffPool({
          doctors: Array.isArray(data?.doctors) ? data.doctors : [],
          nurses: Array.isArray(data?.nurses) ? data.nurses : [],
          supportStaff: Array.isArray(data?.supportStaff) ? data.supportStaff : [],
        });
      } catch (error) {
        console.error('Failed to load staff:', error);
        toast.error('Failed to load staff list');
      } finally {
        setStaffLoading(false);
      }
    };
    loadStaff();
  }, [isAdmin]);

  const poolForRole = (role) => {
    if (role === 'doctor') return staffPool.doctors || [];
    if (role === 'nurse') return staffPool.nurses || [];
    return staffPool.supportStaff || [];
  };

  const availableForPickRole = poolForRole(pickRole).filter(
    (person) => person?._id && !assignedStaff.some((a) => a?.user === person._id)
  );

  const handleAddStaff = () => {
    if (!pickUserId) {
      toast.error('Select a staff member first');
      return;
    }
    const person = poolForRole(pickRole).find((p) => p?._id === pickUserId);
    if (!person) {
      toast.error('Staff member not found');
      return;
    }
    setAssignedStaff((prev) => [
      ...prev,
      {
        user: person._id,
        role: pickRole,
        firstName: person.firstName || '',
        lastName: person.lastName || '',
      },
    ]);
    setPickUserId('');
  };

  const handleRemoveStaff = (userId) => {
    setAssignedStaff((prev) => prev.filter((entry) => entry.user !== userId));
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        capacity: parseInt(data.capacity) || 1,
        currentOccupancy: parseInt(data.currentOccupancy) || 0,
        amenities: data.amenities
          ? data.amenities.split(',').map((item) => item.trim()).filter(Boolean)
          : [],
      };

      if (room?._id) {
        await updateRoom(room._id, payload);
        if (isAdmin) {
          await assignRoomStaff(room._id, assignedStaff);
        }
        toast.success('Room updated successfully');
      } else {
        if (isAdmin) {
          payload.assignedStaff = assignedStaff;
        }
        await createRoom(payload);
        toast.success('Room added successfully');
      }
      onSuccess?.();
    } catch (error) {
      console.error('Room operation failed:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Operation failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
              <HiOutlineBuildingOffice2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {room ? 'Edit Room' : 'Add New Room'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {room ? 'Update room details and staff assignments' : 'Create a new room for patient care'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Info */}
          <section className="rounded-xl bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-900/10 dark:to-slate-800/50 p-5 border border-indigo-100 dark:border-indigo-800/30">
            <div className="flex items-center gap-2 mb-4 text-indigo-700 dark:text-indigo-300">
              <HiOutlineHome className="w-5 h-5" />
              <h3 className="font-semibold text-sm uppercase tracking-wider">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                leftIcon={<HiOutlineMapPin className="w-4 h-4 text-slate-400" />}
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="reserved">Reserved</option>
                </select>
              </div>
            </div>
          </section>

          {/* Capacity & Type */}
          <section className="rounded-xl bg-gradient-to-br from-teal-50/50 to-white dark:from-teal-900/10 dark:to-slate-800/50 p-5 border border-teal-100 dark:border-teal-800/30">
            <div className="flex items-center gap-2 mb-4 text-teal-700 dark:text-teal-300">
              <HiOutlineUserGroup className="w-5 h-5" />
              <h3 className="font-semibold text-sm uppercase tracking-wider">Capacity & Type</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Capacity"
                type="number"
                {...register('capacity', { min: { value: 1, message: 'At least 1' } })}
                error={errors.capacity?.message}
                placeholder="Beds"
              />
              <Input
                label="Current Occupancy"
                type="number"
                {...register('currentOccupancy', { min: { value: 0, message: 'Cannot be negative' } })}
                error={errors.currentOccupancy?.message}
                placeholder="0"
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Type
                </label>
                <select
                  {...register('type')}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="icu">ICU</option>
                  <option value="maternity">Maternity</option>
                  <option value="pediatric">Pediatric</option>
                  <option value="surgery">Surgery</option>
                </select>
              </div>
            </div>
          </section>

          {/* Staff Assignment (admin only) */}
          {isAdmin && (
            <section className="rounded-xl bg-gradient-to-br from-purple-50/50 to-white dark:from-purple-900/10 dark:to-slate-800/50 p-5 border border-purple-100 dark:border-purple-800/30">
              <div className="flex items-center gap-2 mb-4 text-purple-700 dark:text-purple-300">
                <HiOutlineShieldCheck className="w-5 h-5" />
                <h3 className="font-semibold text-sm uppercase tracking-wider">Assign Staff</h3>
                <span className="ml-auto text-xs bg-purple-200/60 dark:bg-purple-800/30 px-2 py-0.5 rounded-full text-purple-800 dark:text-purple-200">
                  Admin only
                </span>
              </div>

              {staffLoading ? (
                <div className="flex items-center gap-2 py-3 text-sm text-slate-500">
                  <Spinner size="sm" />
                  <span>Loading staff...</span>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={pickRole}
                      onChange={(e) => {
                        setPickRole(e.target.value);
                        setPickUserId('');
                      }}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 sm:w-40"
                    >
                      <option value="doctor">Doctor</option>
                      <option value="nurse">Nurse</option>
                      <option value="support_staff">Support Staff</option>
                    </select>

                    <select
                      value={pickUserId}
                      onChange={(e) => setPickUserId(e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
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

                  <div className="mt-4 flex flex-wrap gap-2">
                    {assignedStaff.length === 0 ? (
                      <p className="text-sm text-slate-500 dark:text-slate-400">No staff assigned yet.</p>
                    ) : (
                      assignedStaff.map((entry) => (
                        <span
                          key={entry.user}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${ROLE_STYLES[entry.role] || 'bg-gray-100 text-gray-700 border-gray-200'}`}
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

          {/* Amenities & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="rounded-xl bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-800/30 dark:to-slate-800/50 p-5 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4 text-slate-600 dark:text-slate-300">
                <HiOutlineCog className="w-5 h-5" />
                <h3 className="font-semibold text-sm uppercase tracking-wider">Amenities</h3>
              </div>
              <Input
                {...register('amenities')}
                placeholder="e.g., TV, Air Conditioning, Private Bathroom"
                hint="Comma separated list"
              />
            </section>

            <section className="rounded-xl bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-800/30 dark:to-slate-800/50 p-5 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4 text-slate-600 dark:text-slate-300">
                <HiOutlineClipboard className="w-5 h-5" />
                <h3 className="font-semibold text-sm uppercase tracking-wider">Notes</h3>
              </div>
              <textarea
                {...register('notes')}
                rows="3"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                placeholder="Any additional notes..."
              />
            </section>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading} className="min-w-[120px]">
              {room ? 'Update Room' : 'Add Room'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomForm;