import { useState } from 'react'
import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { HiOutlineCheck, HiOutlineEye, HiOutlineExclamation } from 'react-icons/hi'
import Button from '../Common/Button'

const AlertList = ({ alerts, onAcknowledge, onView }) => {
  const [filter, setFilter] = useState('all')

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <HiOutlineExclamation className="w-5 h-5 text-red-600" />
      case 'warning': return <HiOutlineExclamation className="w-5 h-5 text-yellow-600" />
      default: return <HiOutlineEye className="w-5 h-5 text-blue-600" />
    }
  }

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'critical': return 'border-l-4 border-red-500 bg-red-50'
      case 'warning': return 'border-l-4 border-yellow-500 bg-yellow-50'
      default: return 'border-l-4 border-blue-500 bg-blue-50'
    }
  }

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => a.severity === filter)

  const stats = {
    all: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    warning: alerts.filter(a => a.severity === 'warning').length,
  }

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
            ${filter === 'all' 
              ? 'bg-gray-900 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All ({stats.all})
        </button>
        <button
          onClick={() => setFilter('critical')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
            ${filter === 'critical' 
              ? 'bg-red-600 text-white' 
              : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
        >
          Critical ({stats.critical})
        </button>
        <button
          onClick={() => setFilter('warning')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
            ${filter === 'warning' 
              ? 'bg-yellow-600 text-white' 
              : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'}`}
        >
          Warning ({stats.warning})
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map(alert => (
          <div
            key={alert._id}
            className={`bg-white rounded-lg p-4 shadow-sm ${getSeverityClass(alert.severity)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getSeverityIcon(alert.severity)}
                <div>
                  <h3 className="font-medium text-gray-900">
                    {alert.patientId?.firstName} {alert.patientId?.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                    <span>{formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}</span>
                    {alert.patientId?.room && (
                      <span>Room {alert.patientId.room}{alert.patientId.bed}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {alert.status === 'active' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAcknowledge(alert._id)}
                  >
                    <HiOutlineCheck className="w-4 h-4 mr-1" />
                    Acknowledge
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onView(alert)}
                >
                  <HiOutlineEye className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Additional Info for Critical Alerts */}
            {alert.severity === 'critical' && alert.currentValue && (
              <div className="mt-3 pt-3 border-t border-red-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-700">Current Level: {alert.currentValue}%</span>
                  <span className="text-red-700">Threshold: {alert.threshold}%</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">No alerts found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AlertList