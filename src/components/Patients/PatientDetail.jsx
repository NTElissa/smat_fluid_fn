import { useState } from 'react'
import { 
  HiOutlineIdentification,
  HiOutlineCalendar,
  HiOutlinePhone,
  HiOutlineHome,
  HiOutlineBeaker,
  HiOutlineClipboard,
  HiOutlineUserCircle,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineMail // This is from 'react-icons/hi', not 'hi2'
} from 'react-icons/hi' // Change to 'react-icons/hi' for Mail icon
import { formatDate } from '../../utils/formatters'
import Button from '../Common/Button'

const PatientDetail = ({ patient, onClose }) => {
  const [activeTab, setActiveTab] = useState('info')

  const tabs = [
    { id: 'info', label: 'Information', icon: HiOutlineUserCircle },
    { id: 'medical', label: 'Medical', icon: HiOutlineBeaker },
    { id: 'history', label: 'History', icon: HiOutlineClock }
  ]

  const getGenderIcon = (gender) => {
    switch (gender) {
      case 'male': return '👨'
      case 'female': return '👩'
      default: return '🧑'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'admitted': return 'bg-green-100 text-green-700'
      case 'discharged': return 'bg-gray-100 text-gray-700'
      case 'transferred': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-blue-100 text-blue-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Patient Header */}
      <div className="flex items-start space-x-4 pb-4 border-b border-gray-100">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
          patient.gender === 'male' ? 'bg-blue-100' :
          patient.gender === 'female' ? 'bg-pink-100' :
          'bg-purple-100'
        }`}>
          {getGenderIcon(patient.gender)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {patient.firstName} {patient.lastName}
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <HiOutlineIdentification className="w-4 h-4" />
                <span className="font-mono">{patient.patientId}</span>
                <span>•</span>
                <HiOutlineCalendar className="w-4 h-4" />
                <span>DOB: {formatDate(patient.dateOfBirth, 'dd MMM yyyy')}</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
              {patient.status || 'Admitted'}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 flex items-center space-x-2">
              <HiOutlinePhone className="w-4 h-4 text-primary-600" />
              <span>Contact Information</span>
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <HiOutlinePhone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{patient.phoneNumber || 'Not provided'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <HiOutlineMail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{patient.email || 'Not provided'}</span>
              </div>
              <div className="flex items-start space-x-2 text-sm">
                <HiOutlineLocationMarker className="w-4 h-4 text-gray-400 mt-0.5" />
                <span className="text-gray-600">{patient.address || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 flex items-center space-x-2">
              <HiOutlineHome className="w-4 h-4 text-primary-600" />
              <span>Current Location</span>
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <HiOutlineHome className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  Ward {patient.ward || '—'} • Room {patient.room || '—'} • Bed {patient.bed || '—'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <HiOutlineClipboard className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Status: {patient.status || 'Admitted'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <HiOutlineCalendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Admitted: {formatDate(patient.admissionDate)}</span>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          {patient.emergencyContact && (
            <div className="md:col-span-2 space-y-3">
              <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                <span className="text-red-500">🚨</span>
                <span>Emergency Contact</span>
              </h3>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-orange-600 mb-1">Name</p>
                    <p className="text-sm font-medium text-gray-900">{patient.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-orange-600 mb-1">Relationship</p>
                    <p className="text-sm text-gray-700">{patient.emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <p className="text-xs text-orange-600 mb-1">Phone</p>
                    <p className="text-sm text-gray-700">{patient.emergencyContact.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'medical' && (
        <div className="space-y-4">
          {/* Diagnosis */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
              <HiOutlineBeaker className="w-4 h-4 text-primary-600" />
              <span>Diagnosis</span>
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{patient.diagnosis || 'No diagnosis recorded'}</p>
            </div>
          </div>

          {/* Allergies */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
              <span className="text-red-500">⚠️</span>
              <span>Allergies</span>
            </h3>
            {patient.allergies?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy, index) => (
                  <span key={index} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                    {allergy}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg">No known allergies</p>
            )}
          </div>

          {/* Notes */}
          {patient.notes && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Additional Notes</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">{patient.notes}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
            <HiOutlineClock className="w-4 h-4 text-primary-600" />
            <span>IV Therapy History</span>
          </h3>
          
          {patient.ivHistory?.length > 0 ? (
            <div className="space-y-3">
              {patient.ivHistory.map((history, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">💉</span>
                      <span className="font-medium text-gray-900">{history.fluidType}</span>
                    </div>
                    <span className="text-sm text-gray-500">{history.volume}ml</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Started: {formatDate(history.startTime)}</span>
                    <span>Ended: {formatDate(history.endTime)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-gray-500">No IV history available</p>
            </div>
          )}
        </div>
      )}

      {/* Close Button */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )
}

export default PatientDetail