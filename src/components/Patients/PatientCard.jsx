// src/components/Patients/PatientCard.jsx
import { useState } from 'react'
import { 
  HiOutlineUser, 
  HiOutlineMapPin, 
  HiOutlineCalendar,
  HiOutlinePhone,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineKey,
  HiOutlineBuildingOffice2
} from 'react-icons/hi2'
import Modal from '../Common/Modal'
import Button from '../Common/Button'
import PatientForm from './PatientForm'

const PatientCard = ({ patient, onUpdate, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const getStatusColor = (status) => {
    const colors = {
      admitted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      discharged: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      transferred: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
    }
    return colors[status] || colors.admitted
  }

  const getGenderEmoji = (gender) => {
    return gender === 'male' ? '♂️' : gender === 'female' ? '♀️' : '⚧'
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await onDelete(patient._id)
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Delete failed:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <>
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/5 hover:border-teal-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-teal-700">
        {/* Card Header with Gradient */}
        <div className="relative h-24 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80"></div>
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(patient.status)}`}>
              {patient.status?.charAt(0).toUpperCase() + patient.status?.slice(1)}
            </span>
          </div>
        </div>

        {/* Patient Info */}
        <div className="relative px-5 pb-5 -mt-12">
          {/* Avatar */}
          <div className="mb-3 flex justify-center">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-3xl shadow-lg ring-4 ring-white dark:from-slate-700 dark:to-slate-800 dark:ring-slate-900">
                {getGenderEmoji(patient.gender)}
              </div>
              <div className="absolute -bottom-1 -right-1 rounded-full bg-teal-500 p-1 ring-2 ring-white dark:ring-slate-900">
                <HiOutlineUser className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          </div>

          {/* Name & ID */}
          <div className="mb-4 text-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {patient.firstName} {patient.lastName}
            </h3>
            <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              ID: {patient.patientId || 'N/A'}
            </p>
            {patient.dateOfBirth && (
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {calculateAge(patient.dateOfBirth)} years • {new Date(patient.dateOfBirth).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Details */}
          <div className="space-y-2.5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
            {patient.roomId && (
              <div className="flex items-center gap-3 text-sm">
                <HiOutlineBuildingOffice2 className="h-4 w-4 shrink-0 text-indigo-500" />
                <span className="text-slate-600 dark:text-slate-400">
                  Room {patient.roomId.roomNumber}
                  {patient.roomId.ward && ` • ${patient.roomId.ward}`}
                </span>
              </div>
            )}
            
            {patient.phoneNumber && (
              <div className="flex items-center gap-3 text-sm">
                <HiOutlinePhone className="h-4 w-4 shrink-0 text-sky-500" />
                <span className="text-slate-600 dark:text-slate-400">{patient.phoneNumber}</span>
              </div>
            )}
            
            {patient.admissionDate && (
              <div className="flex items-center gap-3 text-sm">
                <HiOutlineCalendar className="h-4 w-4 shrink-0 text-teal-500" />
                <span className="text-slate-600 dark:text-slate-400">
                  Admitted: {new Date(patient.admissionDate).toLocaleDateString()}
                </span>
              </div>
            )}

            {patient.diagnosis && (
              <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Diagnosis</p>
                <p className="mt-1 text-sm text-slate-700 line-clamp-2 dark:text-slate-300">
                  {patient.diagnosis}
                </p>
              </div>
            )}
          </div>

          {/* Allergies Alert */}
          {patient.allergies && patient.allergies.length > 0 && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30">
              <span className="text-lg">⚠️</span>
              <div className="text-xs text-amber-700 dark:text-amber-400">
                <span className="font-semibold">Allergies:</span>{' '}
                {patient.allergies.join(', ')}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-teal-950/50 dark:hover:border-teal-700"
            >
              <HiOutlinePencilSquare className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <HiOutlineTrash className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Patient"
        size="lg"
      >
        <PatientForm
          patient={patient}
          onSuccess={() => {
            setShowEditModal(false)
            onUpdate?.()
          }}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Patient"
        size="sm"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <HiOutlineTrash className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
            Confirm Deletion
          </h3>
          <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              {patient.firstName} {patient.lastName}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              className="flex-1"
            >
              Delete Patient
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default PatientCard