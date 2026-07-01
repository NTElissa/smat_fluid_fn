// src/components/Monitors/MonitorDetail.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  HiOutlineArrowLeft,
  HiOutlineExclamationCircle,
  HiOutlineClock,
  HiOutlineBeaker,
  HiOutlineChartBar,
  HiOutlineRefresh // Added for refresh icon
} from 'react-icons/hi'
import { getMonitor, updateReading, requestBagChange, completeSession } from '../../services/monitorService'
import LevelIndicator from './LevelIndicator'
import Spinner from '../Common/Spinner'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const MonitorDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [monitor, setMonitor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadMonitor()
  }, [id])

  const loadMonitor = async () => {
    try {
      setLoading(true)
      const response = await getMonitor(id)
      setMonitor(response.data.data)
    } catch (error) {
      toast.error('Failed to load monitor details')
      navigate('/monitors')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestBagChange = async () => {
    try {
      setUpdating(true)
      await requestBagChange(id, 'Manual request from staff')
      toast.success('Bag change request sent to support staff')
    } catch (error) {
      toast.error('Failed to send request')
    } finally {
      setUpdating(false)
    }
  }

  const handleCompleteSession = async () => {
    if (!window.confirm('Are you sure you want to complete this IV session?')) {
      return
    }

    try {
      setUpdating(true)
      await completeSession(id)
      toast.success('IV session completed')
      navigate('/monitors')
    } catch (error) {
      toast.error('Failed to complete session')
    } finally {
      setUpdating(false)
    }
  }

  const simulateReading = async () => {
    try {
      setUpdating(true)
      // Simulate a reading update (in real app, this comes from IoT device)
      const newLevel = Math.max(0, (monitor.currentLevel || 100) - 5)
      await updateReading(id, { 
        level: newLevel,
        flowRate: monitor.flowRate,
        airBubbleDetected: false
      })
      await loadMonitor()
      toast.success('Reading updated')
    } catch (error) {
      toast.error('Failed to update reading')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!monitor) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Monitor not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/monitors')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <HiOutlineArrowLeft className="w-4 h-4" />
        <span>Back to Monitors</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {monitor.patientId?.firstName} {monitor.patientId?.lastName}
            </h1>
            <p className="text-gray-600 mt-1">
              Device ID: {monitor.deviceId} • Room {monitor.patientId?.room}{monitor.patientId?.bed}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={simulateReading}
              disabled={updating || monitor.status === 'completed'}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <HiOutlineRefresh className="w-4 h-4" />
              <span>Simulate Reading</span>
            </button>
            {monitor.status === 'active' && monitor.currentLevel <= 20 && (
              <button
                onClick={handleRequestBagChange}
                disabled={updating}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
              >
                Request Bag Change
              </button>
            )}
            {monitor.status === 'active' && (
              <button
                onClick={handleCompleteSession}
                disabled={updating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Complete Session
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Current Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Level Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h2>
            <div className="space-y-6">
              <LevelIndicator level={monitor.currentLevel} size="lg" showLabel={true} />
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <HiOutlineBeaker className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                  <span className="text-xs text-gray-500">Fluid Type</span>
                  <p className="font-medium text-gray-900">{monitor.fluidType}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <HiOutlineChartBar className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                  <span className="text-xs text-gray-500">Flow Rate</span>
                  <p className="font-medium text-gray-900">{monitor.flowRate} ml/h</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <HiOutlineClock className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                  <span className="text-xs text-gray-500">Started</span>
                  <p className="font-medium text-gray-900 text-sm">
                    {monitor.startTime ? format(new Date(monitor.startTime), 'HH:mm') : 'N/A'}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <HiOutlineClock className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                  <span className="text-xs text-gray-500">Est. End</span>
                  <p className="font-medium text-gray-900 text-sm">
                    {monitor.estimatedEndTime ? format(new Date(monitor.estimatedEndTime), 'HH:mm') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reading History */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Reading History</h2>
            <div className="space-y-3">
              {monitor.readings && monitor.readings.length > 0 ? (
                monitor.readings.slice(-10).reverse().map((reading, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-600">
                      {reading.timestamp ? format(new Date(reading.timestamp), 'HH:mm:ss') : 'N/A'}
                    </span>
                    <div className="flex items-center space-x-4">
                      <span className={`text-sm font-medium ${
                        reading.level <= 20 ? 'text-red-600' : 
                        reading.level <= 50 ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {reading.level}%
                      </span>
                      <span className="text-sm text-gray-600">{reading.flowRate} ml/h</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No reading history available</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Alerts and Info */}
        <div className="space-y-6">
          {/* Active Alerts */}
          {monitor.status === 'alert' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center space-x-2 text-red-700 mb-3">
                <HiOutlineExclamationCircle className="w-5 h-5" />
                <h3 className="font-semibold">Active Alert</h3>
              </div>
              {monitor.airBubbleDetected ? (
                <p className="text-sm text-red-600">⚠️ Air bubble detected in IV line</p>
              ) : monitor.currentLevel <= monitor.lowLevelThreshold ? (
                <p className="text-sm text-red-600">⚠️ Low fluid level: {monitor.currentLevel}%</p>
              ) : (
                <p className="text-sm text-red-600">⚠️ Abnormal flow rate detected</p>
              )}
            </div>
          )}

          {/* Patient Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Patient Information</h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-500">Name:</span>{' '}
                <span className="text-gray-900">{monitor.patientId?.firstName} {monitor.patientId?.lastName}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Patient ID:</span>{' '}
                <span className="text-gray-900">{monitor.patientId?.patientId}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Location:</span>{' '}
                <span className="text-gray-900">{monitor.location?.ward} - Room {monitor.location?.room}{monitor.location?.bed}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Diagnosis:</span>{' '}
                <span className="text-gray-900">{monitor.patientId?.diagnosis || 'N/A'}</span>
              </p>
            </div>
          </div>

          {/* Threshold Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Alert Thresholds</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Low Level Alert</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-yellow-500 rounded-full"
                      style={{ width: `${monitor.lowLevelThreshold || 20}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{monitor.lowLevelThreshold || 20}%</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">High Level Alert</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${100 - (monitor.highLevelThreshold || 95)}%`, marginLeft: `${monitor.highLevelThreshold || 95}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{monitor.highLevelThreshold || 95}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MonitorDetail