// src/components/Monitors/MonitorDetail.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HiOutlineArrowLeft,
  HiOutlineExclamationCircle,
  HiOutlineClock,
  HiOutlineBeaker,
  HiOutlineChartBar,
  HiOutlineRefresh,
  HiOutlineUser,
  HiOutlineLocationMarker,
  HiOutlineCog,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineDeviceMobile,
  HiOutlineCube
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
  const [activeTab, setActiveTab] = useState('overview')

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
      const newLevel = Math.max(0, (monitor.currentLevel || 100) - 5)
      await updateReading(id, {
        level: newLevel,
        flowRate: monitor.flowRate,
        airBubbleDetected: newLevel <= 15
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
        <p className="text-slate-500">Monitor not found</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate('/monitors')}
        className="flex items-center space-x-2 text-slate-500 hover:text-slate-700 transition-colors group"
      >
        <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Monitors</span>
      </button>

      {/* Header */}
      <div className="relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100/20 rounded-full blur-3xl"></div>
        
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border border-blue-200">
                <span className="text-2xl font-bold text-blue-700">
                  {monitor.patientId?.firstName?.[0] || '?'}
                  {monitor.patientId?.lastName?.[0] || ''}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {monitor.patientId?.firstName} {monitor.patientId?.lastName}
                </h1>
                <p className="text-slate-500 flex items-center flex-wrap gap-2 mt-1">
                  <span className="flex items-center space-x-1">
                    <HiOutlineDeviceMobile className="w-3.5 h-3.5" />
                    <span>{monitor.deviceId}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <HiOutlineLocationMarker className="w-3.5 h-3.5" />
                    <span>
                      {[
                        monitor.location?.ward || monitor.patientId?.roomId?.ward || monitor.patientId?.ward,
                        monitor.location?.room || monitor.patientId?.roomId?.roomNumber || monitor.patientId?.room,
                        monitor.location?.bed || monitor.patientId?.bed
                      ].filter(Boolean).join(' • ') || 'Location pending'}
                    </span>
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={simulateReading}
                disabled={updating || monitor.status === 'completed'}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 hover:text-slate-800 transition-colors disabled:opacity-50 flex items-center space-x-2 border border-slate-200 text-sm"
              >
                <HiOutlineRefresh className={`w-4 h-4 ${updating ? 'animate-spin' : ''}`} />
                <span>Simulate Reading</span>
              </button>
              {monitor.status === 'active' && monitor.currentLevel <= 20 && (
                <button
                  onClick={handleRequestBagChange}
                  disabled={updating}
                  className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl transition-colors disabled:opacity-50 border border-amber-200 text-sm"
                >
                  Request Bag Change
                </button>
              )}
              {monitor.status === 'active' && (
                <button
                  onClick={handleCompleteSession}
                  disabled={updating}
                  className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-colors disabled:opacity-50 border border-emerald-200 text-sm"
                >
                  Complete Session
                </button>
              )}
              <span className={`px-4 py-2 rounded-xl text-sm font-medium border ${
                monitor.status === 'alert' 
                  ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' 
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                {monitor.status === 'alert' ? '⚠️ Alert' : '● ' + (monitor.status || 'Unknown').toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-slate-100 rounded-xl p-1 border border-slate-200">
        {['overview', 'history', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Column - Current Status */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Level Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                  <HiOutlineChartBar className="w-5 h-5 text-blue-600" />
                  <span>Current Status</span>
                </h2>
                <div className="space-y-6">
                  <LevelIndicator level={monitor.currentLevel} size="lg" showLabel={true} />
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                      <HiOutlineBeaker className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                      <span className="text-xs text-slate-500">Fluid Type</span>
                      <p className="font-medium text-slate-800 text-sm mt-1">{monitor.fluidType}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                      <HiOutlineChartBar className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                      <span className="text-xs text-slate-500">Flow Rate</span>
                      <p className="font-medium text-slate-800 text-sm mt-1">{monitor.flowRate} ml/h</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                      <HiOutlineClock className="w-5 h-5 text-amber-600 mx-auto mb-2" />
                      <span className="text-xs text-slate-500">Started</span>
                      <p className="font-medium text-slate-800 text-sm mt-1">
                        {monitor.startTime ? format(new Date(monitor.startTime), 'HH:mm') : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                      <HiOutlineClock className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                      <span className="text-xs text-slate-500">Est. End</span>
                      <p className="font-medium text-slate-800 text-sm mt-1">
                        {monitor.estimatedEndTime ? format(new Date(monitor.estimatedEndTime), 'HH:mm') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Alerts */}
              {monitor.status === 'alert' && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-rose-100 rounded-xl">
                      <HiOutlineExclamationCircle className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-rose-700">Active Alert</h3>
                      {monitor.airBubbleDetected ? (
                        <p className="text-sm text-rose-600 mt-1">⚠️ Air bubble detected in IV line</p>
                      ) : monitor.currentLevel <= monitor.lowLevelThreshold ? (
                        <p className="text-sm text-rose-600 mt-1">⚠️ Low fluid level: {monitor.currentLevel}%</p>
                      ) : (
                        <p className="text-sm text-rose-600 mt-1">⚠️ Abnormal flow rate detected</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Patient Info & Thresholds */}
            <div className="space-y-6">
              {/* Patient Info */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                  <HiOutlineUser className="w-5 h-5 text-emerald-600" />
                  <span>Patient Information</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Name</span>
                    <span className="text-slate-800">{monitor.patientId?.firstName} {monitor.patientId?.lastName}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Patient ID</span>
                    <span className="text-slate-800">{monitor.patientId?.patientId}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Location</span>
                    <span className="text-slate-800">
                      {[
                        monitor.location?.ward || monitor.patientId?.roomId?.ward || monitor.patientId?.ward,
                        monitor.location?.room || monitor.patientId?.roomId?.roomNumber || monitor.patientId?.room,
                        monitor.location?.bed || monitor.patientId?.bed
                      ].filter(Boolean).join(' • ') || 'Not assigned'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Diagnosis</span>
                    <span className="text-slate-800">{monitor.patientId?.diagnosis || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Threshold Info */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                  <HiOutlineChartBar className="w-5 h-5 text-blue-600" />
                  <span>Alert Thresholds</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Low Level Alert</p>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-2 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-300"
                          style={{ width: `${monitor.lowLevelThreshold || 20}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{monitor.lowLevelThreshold || 20}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-2">High Level Alert</p>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${100 - (monitor.highLevelThreshold || 95)}%`, marginLeft: `${monitor.highLevelThreshold || 95}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{monitor.highLevelThreshold || 95}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
              <HiOutlineClock className="w-5 h-5 text-blue-600" />
              <span>Reading History</span>
            </h2>
            <div className="space-y-2">
              {monitor.readings && monitor.readings.length > 0 ? (
                monitor.readings.slice(-20).reverse().map((reading, index) => (
                  <div key={index} className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-sm text-slate-500">
                      {reading.timestamp ? format(new Date(reading.timestamp), 'HH:mm:ss') : 'N/A'}
                    </span>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <HiOutlineBeaker className="w-4 h-4 text-slate-400" />
                        <span className={`text-sm font-medium ${
                          reading.level <= 20 ? 'text-rose-600' : 
                          reading.level <= 50 ? 'text-amber-600' : 
                          'text-emerald-600'
                        }`}>
                          {reading.level}%
                        </span>
                      </div>
                      <span className="text-sm text-slate-500">{reading.flowRate} ml/h</span>
                      {reading.airBubbleDetected && (
                        <span className="text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          Air Bubble
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-400 py-8">No reading history available</p>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center space-x-2">
              <HiOutlineCog className="w-5 h-5 text-purple-600" />
              <span>Monitor Settings</span>
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <label className="text-xs text-slate-500 block mb-2">Low Level Threshold</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="5"
                      max="40"
                      value={monitor.lowLevelThreshold || 20}
                      className="flex-1 accent-blue-600"
                      disabled
                    />
                    <span className="text-slate-800 font-medium">{monitor.lowLevelThreshold || 20}%</span>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <label className="text-xs text-slate-500 block mb-2">High Level Threshold</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="60"
                      max="100"
                      value={monitor.highLevelThreshold || 95}
                      className="flex-1 accent-blue-600"
                      disabled
                    />
                    <span className="text-slate-800 font-medium">{monitor.highLevelThreshold || 95}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="text-slate-800 font-medium">Device Status</p>
                  <p className="text-sm text-slate-500">Device ID: {monitor.deviceId}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  monitor.status === 'active' 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                  {monitor.status === 'active' ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default MonitorDetail