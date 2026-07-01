import { useState } from 'react'
import { 
  HiOutlineIdentification,
  HiOutlineHome,
  HiOutlineBeaker,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineClock,
  HiOutlineBuildingOffice, // Valid in hi2
  HiOutlineMapPin, // Valid in hi2 (use this instead of LocationMarker)
  HiOutlineHeart,
  HiOutlineUser
} from 'react-icons/hi2' // All icons here are valid in hi2
import { formatDate, formatTimeAgo } from '../../utils/formatters'
import Modal from '../Common/Modal'
import PatientDetail from './PatientDetail'
import PatientForm from './PatientForm'
import Button from '../Common/Button'
import toast from 'react-hot-toast'

const PatientCard = ({ patient, onUpdate, onDelete }) => {
  const [showDetail, setShowDetail] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'admitted':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'discharged':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'transferred':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'admitted': return '🟢'
      case 'discharged': return '⚪'
      case 'transferred': return '🟡'
      default: return '🔵'
    }
  }

  const getGenderIcon = (gender) => {
    switch (gender) {
      case 'male': return '👨'
      case 'female': return '👩'
      default: return '🧑'
    }
  }

  const handleDelete = async () => {
    try {
      await onDelete(patient._id)
      toast.success('Patient deleted successfully')
      setShowDeleteConfirm(false)
    } catch (error) {
      toast.error('Failed to delete patient')
    }
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-100">
        {/* Header with color accent based on status */}
        <div className={`h-2 ${
          patient.status === 'admitted' ? 'bg-green-500' :
          patient.status === 'discharged' ? 'bg-gray-500' :
          patient.status === 'transferred' ? 'bg-yellow-500' :
          'bg-blue-500'
        }`}></div>
        
        <div className="p-5">
          {/* Patient ID and Status */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <HiOutlineIdentification className="w-4 h-4" />
              <span className="font-mono text-xs">{patient.patientId || 'N/A'}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(patient.status)}`}>
              <span>{getStatusIcon(patient.status)}</span>
              <span>{patient.status || 'Admitted'}</span>
            </span>
          </div>

          {/* Patient Info */}
          <div className="flex items-start space-x-3">
            {/* Avatar with gender icon */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
              patient.gender === 'male' ? 'bg-blue-100' :
              patient.gender === 'female' ? 'bg-pink-100' :
              'bg-purple-100'
            }`}>
              {getGenderIcon(patient.gender)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {patient.firstName} {patient.lastName}
              </h3>
              <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                <span className="flex items-center space-x-1">
                  <HiOutlineClock className="w-3 h-3" />
                  <span>{formatTimeAgo(patient.admissionDate)}</span>
                </span>
                {patient.ward && (
                  <>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <HiOutlineHome className="w-3 h-3" />
                      <span>{patient.ward}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Location and Diagnosis */}
          <div className="mt-3 space-y-2">
            {(patient.room || patient.bed) && (
              <div className="flex items-center space-x-2 text-xs bg-gray-50 p-2 rounded-lg">
                <HiOutlineBuildingOffice className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">
                  Room {patient.room || '—'} • Bed {patient.bed || '—'}
                </span>
              </div>
            )}
            
            {patient.diagnosis && (
              <div className="flex items-start space-x-2 text-xs bg-blue-50 p-2 rounded-lg">
                <HiOutlineBeaker className="w-3 h-3 text-blue-500 mt-0.5" />
                <span className="text-blue-700 line-clamp-2">{patient.diagnosis}</span>
              </div>
            )}
          </div>

          {/* Allergies if any */}
          {patient.allergies?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {patient.allergies.slice(0, 2).map((allergy, index) => (
                <span key={index} className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{allergy}</span>
                </span>
              ))}
              {patient.allergies.length > 2 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{patient.allergies.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
            <button
              onClick={() => setShowDetail(true)}
              className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              <HiOutlineEye className="w-4 h-4" />
              <span>View Details</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowEdit(true)}
                className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Edit Patient"
              >
                <HiOutlinePencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Patient"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title="Patient Details"
        size="lg"
      >
        <PatientDetail patient={patient} onClose={() => setShowDetail(false)} />
      </Modal>

      {/* Edit Patient Modal */}
      <Modal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Patient"
        size="lg"
      >
        <PatientForm
          patient={patient}
          onSuccess={() => {
            setShowEdit(false)
            onUpdate()
            toast.success('Patient updated successfully')
          }}
          onCancel={() => setShowEdit(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Patient"
        size="sm"
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <HiOutlineTrash className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Patient?
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete <span className="font-medium text-gray-700">{patient.firstName} {patient.lastName}</span>? 
            This action cannot be undone and all associated data will be permanently removed.
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
              Delete Patient
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default PatientCard