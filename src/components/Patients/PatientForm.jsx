// src/components/Patients/PatientForm.jsx
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { createPatient, updatePatient } from '../../services/patientService'
import{getRooms} from '../../services/roomService'
import Button from '../Common/Button'
import toast from 'react-hot-toast'
import { 
  HiOutlineUser, 
  HiOutlineEnvelope, 
  HiOutlinePhone, 
  HiOutlineCalendarDays,
  HiOutlineMapPin,
  HiOutlineIdentification,
  HiOutlineExclamationTriangle,
  HiOutlineClipboardDocumentList,
  HiOutlineHome,
  HiOutlineBuildingOffice2,
  HiOutlineUserGroup,
  HiOutlineHeart,
  HiOutlineXMark,
  HiOutlineCheck,
  HiOutlineChevronDown
} from 'react-icons/hi2'

const PatientForm = ({ patient, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false)
  const [rooms, setRooms] = useState([])
  const [loadingRooms, setLoadingRooms] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [allergies, setAllergies] = useState([])
  const [allergyInput, setAllergyInput] = useState('')

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      patientId: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'male',
      phoneNumber: '',
      email: '',
      address: '',
      roomId: '',
      diagnosis: '',
      status: 'admitted',
      emergencyContact: {
        name: '',
        relationship: '',
        phoneNumber: ''
      }
    }
  })

  useEffect(() => {
    loadRooms()
  }, [])

  useEffect(() => {
    if (patient) {
      reset({
        patientId: patient.patientId || '',
        firstName: patient.firstName || '',
        lastName: patient.lastName || '',
        dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
        gender: patient.gender || 'male',
        phoneNumber: patient.phoneNumber || '',
        email: patient.email || '',
        address: patient.address || '',
        roomId: patient.roomId?._id || patient.roomId || '',
        diagnosis: patient.diagnosis || '',
        status: patient.status || 'admitted',
        emergencyContact: {
          name: patient.emergencyContact?.name || '',
          relationship: patient.emergencyContact?.relationship || '',
          phoneNumber: patient.emergencyContact?.phoneNumber || ''
        }
      })
      setAllergies(patient.allergies || [])
      setSelectedRoom(patient.roomId || null)
    }
  }, [patient, reset])

  const loadRooms = async () => {
    try {
      setLoadingRooms(true)
      const response = await getRooms()
      setRooms(response.data || [])
    } catch (error) {
      console.error('Failed to load rooms:', error)
    } finally {
      setLoadingRooms(false)
    }
  }

  const addAllergy = () => {
    if (allergyInput.trim() && !allergies.includes(allergyInput.trim())) {
      setAllergies([...allergies, allergyInput.trim()])
      setAllergyInput('')
    }
  }

  const removeAllergy = (index) => {
    setAllergies(allergies.filter((_, i) => i !== index))
  }

  const handleAllergyKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addAllergy()
    }
  }

  const handleRoomSelect = (roomId) => {
    const room = rooms.find(r => r._id === roomId)
    setSelectedRoom(room)
    setValue('roomId', roomId)
  }

  const normalizeRoomId = (value) => {
    if (typeof value !== 'string') return undefined
    const trimmed = value.trim()
    return trimmed && /^[a-f\d]{24}$/i.test(trimmed) ? trimmed : undefined
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const payload = {
        ...data,
        allergies,
        roomId: normalizeRoomId(data.roomId)
      }

      if (patient) {
        await updatePatient(patient._id, payload)
        toast.success('Patient updated successfully')
      } else {
        await createPatient(payload)
        toast.success('Patient registered successfully')
      }
      onSuccess?.()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: HiOutlineUser },
    { id: 'contact', label: 'Contact', icon: HiOutlinePhone },
    { id: 'medical', label: 'Medical', icon: HiOutlineHeart },
    { id: 'room', label: 'Room Assignment', icon: HiOutlineBuildingOffice2 }
  ]

  const watchGender = watch('gender')
  const watchStatus = watch('status')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-slate-900/10 overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <HiOutlineUser className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {patient ? 'Edit Patient Record' : 'New Patient Registration'}
              </h2>
              <p className="text-slate-300 text-sm mt-0.5">
                {patient ? 'Update patient information and room assignment' : 'Fill in the details to register a new patient'}
              </p>
            </div>
          </div>
          {patient && (
            <span className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider ${
              patient.status === 'admitted' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
              patient.status === 'discharged' ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30' :
              'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {patient.status}
            </span>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3.5 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {/* Tab: Personal Information */}
        {activeTab === 'personal' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Patient ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <HiOutlineIdentification className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...register('patientId', { required: 'Patient ID is required' })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., PT2024001"
                  />
                </div>
                {errors.patientId && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.patientId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="admitted">Admitted</option>
                  <option value="discharged">Discharged</option>
                  <option value="transferred">Transferred</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('firstName', { required: 'First name is required' })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('lastName', { required: 'Last name is required' })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <HiOutlineCalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="date"
                    {...register('dateOfBirth', { required: 'Date of birth is required' })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.dateOfBirth.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['male', 'female', 'other'].map((gender) => (
                    <label
                      key={gender}
                      className={`flex items-center justify-center px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                        watchGender === gender
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:border-blue-400 dark:text-blue-300'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <input
                        type="radio"
                        value={gender}
                        {...register('gender')}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium capitalize">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Contact Information */}
        {activeTab === 'contact' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...register('phoneNumber', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^(\+250|0)7[0-9]{8}$/,
                        message: 'Invalid Rwanda phone number'
                      }
                    })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0788123456"
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <HiOutlineEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="patient@example.com"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Address
                </label>
                <div className="relative">
                  <HiOutlineMapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <textarea
                    {...register('address')}
                    rows="3"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter full address"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <HiOutlineExclamationTriangle className="w-5 h-5 text-amber-500" />
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Contact Name
                  </label>
                  <input
                    {...register('emergencyContact.name')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Emergency contact name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Relationship
                  </label>
                  <input
                    {...register('emergencyContact.relationship')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., Spouse, Parent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Contact Phone
                  </label>
                  <input
                    {...register('emergencyContact.phoneNumber')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Emergency phone number"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Medical Information */}
        {activeTab === 'medical' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Diagnosis
              </label>
              <div className="relative">
                <HiOutlineClipboardDocumentList className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <textarea
                  {...register('diagnosis')}
                  rows="4"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter diagnosis details..."
                />
              </div>
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Allergies
              </label>
              <div className="flex gap-2">
                <input
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyDown={handleAllergyKeyDown}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Type allergy and press Enter"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addAllergy}
                >
                  Add
                </Button>
              </div>
              {allergies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 rounded-lg text-sm font-medium border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30"
                    >
                      {allergy}
                      <button
                        type="button"
                        onClick={() => removeAllergy(index)}
                        className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200"
                      >
                        <HiOutlineXMark className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Room Assignment */}
        {activeTab === 'room' && (
          <div className="space-y-6 animate-fadeIn">
            {selectedRoom ? (
              <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-6 border border-blue-200 dark:border-blue-500/30">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <HiOutlineCheck className="w-5 h-5" />
                  Room Assigned
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Room Number</p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-200">
                      {selectedRoom.roomNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Ward</p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-200">
                      {selectedRoom.ward}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Type</p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-200 capitalize">
                      {selectedRoom.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Occupancy</p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-200">
                      {selectedRoom.currentOccupancy} / {selectedRoom.capacity}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRoom(null)
                    setValue('roomId', '')
                  }}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
                >
                  Change Room
                </button>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Select Room (Optional)
                </label>
                {loadingRooms ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-slate-500 mt-2">Loading rooms...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                    {rooms.filter(r => r.status !== 'maintenance' && r.isActive).map((room) => (
                      <button
                        key={room._id}
                        type="button"
                        onClick={() => handleRoomSelect(room._id)}
                        className={`text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                          room.currentOccupancy >= room.capacity
                            ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-blue-500 dark:hover:bg-blue-500/10'
                        }`}
                        disabled={room.currentOccupancy >= room.capacity}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                              Room {room.roomNumber}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              {room.ward} • Floor {room.floor}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            room.currentOccupancy >= room.capacity
                              ? 'bg-red-100 text-red-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {room.currentOccupancy}/{room.capacity}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                          <span className="capitalize flex items-center gap-1">
                            <HiOutlineHome className="w-4 h-4" />
                            {room.type}
                          </span>
                          <span>
                            {room.currentOccupancy >= room.capacity ? 'Full' : `${room.capacity - room.currentOccupancy} available`}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <div className="flex items-center gap-3">
          {activeTab !== 'room' && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const currentIndex = tabs.findIndex(t => t.id === activeTab)
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1].id)
                }
              }}
            >
              Next
              <HiOutlineChevronDown className="w-4 h-4 rotate-270" />
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
          >
            <HiOutlineCheck className="w-5 h-5" />
            {patient ? 'Update Patient' : 'Register Patient'}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default PatientForm