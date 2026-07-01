// src/components/Monitors/MonitorCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { 
  HiOutlineEye,
  HiOutlineLightningBolt, // Changed from HiOutlineBolt
  HiOutlineExclamation 
} from 'react-icons/hi'
import LevelIndicator from './LevelIndicator'

const MonitorCard = ({ monitor, onRefresh }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'alert': return 'bg-red-100 text-red-800 animate-pulse'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active'
      case 'alert': return 'Alert!'
      case 'paused': return 'Paused'
      case 'completed': return 'Completed'
      default: return status
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-200 border border-gray-100">
      {/* Header with Patient Info and Status */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">
            {monitor.patientId?.firstName} {monitor.patientId?.lastName}
          </h3>
          <p className="text-xs text-gray-500 flex items-center space-x-1 mt-0.5">
            <span>Room {monitor.patientId?.room}{monitor.patientId?.bed}</span>
            <span>•</span>
            <span>ID: {monitor.deviceId}</span>
          </p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(monitor.status)}`}>
          {getStatusText(monitor.status)}
        </span>
      </div>

      {/* Fluid Level Indicator */}
      <div className="mb-4">
        <LevelIndicator level={monitor.currentLevel} size="md" showLabel={true} />
      </div>

      {/* Monitor Details */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div className="bg-gray-50 p-2 rounded-lg">
          <span className="text-gray-500 text-xs">Fluid Type</span>
          <p className="font-medium text-gray-900">{monitor.fluidType}</p>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg">
          <span className="text-gray-500 text-xs">Flow Rate</span>
          <p className="font-medium text-gray-900">{monitor.flowRate} ml/h</p>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg">
          <span className="text-gray-500 text-xs">Volume</span>
          <p className="font-medium text-gray-900">{monitor.fluidVolume} ml</p>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg">
          <span className="text-gray-500 text-xs">Est. End</span>
          <p className="font-medium text-gray-900 text-xs">
            {monitor.estimatedEndTime ? new Date(monitor.estimatedEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <Link
          to={`/monitors/${monitor._id}`}
          className="flex-1 flex items-center justify-center space-x-2 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
        >
          <HiOutlineEye className="w-4 h-4" />
          <span>View Details</span>
        </Link>
        {monitor.status === 'active' && monitor.currentLevel <= 20 && (
          <button
            onClick={() => onRefresh?.(monitor._id)}
            className="px-3 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors"
            title="Request bag change"
          >
            <HiOutlineLightningBolt className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Low Level Warning */}
      {monitor.currentLevel <= 20 && monitor.status === 'active' && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-orange-600 flex items-center space-x-1">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span>Low level - Change bag soon</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default MonitorCard