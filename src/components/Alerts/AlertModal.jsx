import { format } from 'date-fns'
import React from 'react'
import Modal from '../Common/Modal'
import Button from '../Common/Button'
import { HiOutlineExclamation, HiOutlineCheck, HiOutlineClock, HiOutlineUser } from 'react-icons/hi'

const AlertModal = ({ alert, isOpen, onClose, onAcknowledge }) => {
  if (!alert) return null

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-blue-600 bg-blue-50'
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Alert Details"
      size="md"
    >
      <div className="space-y-4">
        {/* Severity Badge */}
        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${getSeverityColor(alert.severity)}`}>
          <HiOutlineExclamation className="w-4 h-4" />
          <span className="text-sm font-medium uppercase">{alert.severity}</span>
        </div>

        {/* Patient Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Patient Information</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium">{alert.patientId?.firstName} {alert.patientId?.lastName}</p>
            </div>
            <div>
              <p className="text-gray-500">Patient ID</p>
              <p className="font-medium">{alert.patientId?.patientId}</p>
            </div>
            <div>
              <p className="text-gray-500">Location</p>
              <p className="font-medium">
                {alert.patientId?.room ? `Room ${alert.patientId.room}${alert.patientId.bed}` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Alert Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Alert Details</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium capitalize">{alert.alertType?.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Message</p>
              <p className="text-gray-900">{alert.message}</p>
            </div>
            {alert.currentValue && (
              <div>
                <p className="text-sm text-gray-500">Current Value</p>
                <p className="font-medium">{alert.currentValue}%</p>
              </div>
            )}
            {alert.threshold && (
              <div>
                <p className="text-sm text-gray-500">Threshold</p>
                <p className="font-medium">{alert.threshold}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Timeline</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Created</span>
              <span className="font-medium">{format(new Date(alert.createdAt), 'PPpp')}</span>
            </div>
            {alert.acknowledgedAt && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Acknowledged</span>
                <span className="font-medium">{format(new Date(alert.acknowledgedAt), 'PPpp')}</span>
              </div>
            )}
            {alert.resolvedAt && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Resolved</span>
                <span className="font-medium">{format(new Date(alert.resolvedAt), 'PPpp')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Acknowledged/Resolved By */}
        {(alert.acknowledgedBy || alert.resolvedBy) && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Actions</h3>
            <div className="space-y-2">
              {alert.acknowledgedBy && (
                <div className="flex items-center space-x-2 text-sm">
                  <HiOutlineCheck className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">Acknowledged by:</span>
                  <span className="font-medium">
                    {alert.acknowledgedBy.firstName} {alert.acknowledgedBy.lastName}
                  </span>
                </div>
              )}
              {alert.resolvedBy && (
                <div className="flex items-center space-x-2 text-sm">
                  <HiOutlineCheck className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">Resolved by:</span>
                  <span className="font-medium">
                    {alert.resolvedBy.firstName} {alert.resolvedBy.lastName}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {alert.status === 'active' && (
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onAcknowledge(alert._id)
                onClose()
              }}
            >
              Acknowledge Alert
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default AlertModal