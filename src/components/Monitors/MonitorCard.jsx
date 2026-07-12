// src/components/Monitors/MonitorCard.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  HiOutlineEye,
  HiOutlineLightningBolt,
  HiOutlineDotsVertical,
  HiOutlineClock,
  HiOutlineBeaker,
  HiOutlineChartBar,
  HiOutlineUser
} from 'react-icons/hi'
import { requestBagChange } from '../../services/monitorService'
import LevelIndicator from './LevelIndicator'
import toast from 'react-hot-toast'

const MonitorCard = ({ monitor, onRefresh, compact = false }) => {
  const [requesting, setRequesting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-500'
      case 'alert': return 'bg-rose-500'
      case 'paused': return 'bg-amber-500'
      case 'completed': return 'bg-slate-400'
      default: return 'bg-slate-400'
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

  const getStatusBg = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-700'
      case 'alert': return 'bg-rose-50 text-rose-700'
      case 'paused': return 'bg-amber-50 text-amber-700'
      case 'completed': return 'bg-slate-50 text-slate-600'
      default: return 'bg-slate-50 text-slate-600'
    }
  }

  const handleBagChange = async (e) => {
    e.preventDefault()
    try {
      setRequesting(true)
      await requestBagChange(monitor._id, 'Low fluid level — bag change needed')
      toast.success('Bag change request sent to support staff')
      onRefresh?.()
    } catch {
      toast.error('Failed to send bag change request')
    } finally {
      setRequesting(false)
    }
  }

  const timeRemaining = () => {
    if (!monitor.estimatedEndTime) return 'N/A'
    const now = new Date()
    const end = new Date(monitor.estimatedEndTime)
    const diff = end - now
    if (diff <= 0) return 'Completed'
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  if (compact) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
            <span className="text-sm font-bold text-blue-600">
              {monitor.patientId?.firstName?.[0] || '?'}
              {monitor.patientId?.lastName?.[0] || ''}
            </span>
          </div>
          <div>
            <p className="font-medium text-slate-800">
              {monitor.patientId?.firstName} {monitor.patientId?.lastName}
            </p>
            <p className="text-xs text-slate-400">ID: {monitor.deviceId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(monitor.status)}`}>
            {getStatusText(monitor.status)}
          </span>
          <Link
            to={`/monitors/${monitor._id}`}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
          >
            <HiOutlineEye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative group"
    >
      <div className="relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        {/* Status indicator bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${getStatusColor(monitor.status)}`}></div>

        <div className="relative p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border border-slate-100">
                <span className="text-lg font-bold text-blue-600">
                  {monitor.patientId?.firstName?.[0] || '?'}
                  {monitor.patientId?.lastName?.[0] || ''}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-lg leading-tight">
                  {monitor.patientId?.firstName} {monitor.patientId?.lastName}
                </h3>
                <p className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                  <span>ID: {monitor.deviceId}</span>
                  <span>•</span>
                  <span>
                    {[
                      monitor.location?.ward || monitor.patientId?.roomId?.ward || monitor.patientId?.ward,
                      monitor.location?.room || monitor.patientId?.roomId?.roomNumber || monitor.patientId?.room,
                      monitor.location?.bed || monitor.patientId?.bed
                    ].filter(Boolean).join(' • ') || 'Location pending'}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBg(monitor.status)}`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusColor(monitor.status)}`}></span>
                {getStatusText(monitor.status)}
              </span>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                >
                  <HiOutlineDotsVertical className="w-4 h-4" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-10">
                    <Link
                      to={`/monitors/${monitor._id}`}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors block"
                      onClick={() => setShowMenu(false)}
                    >
                      View Details
                    </Link>
                    {monitor.status === 'active' && (
                      <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        Pause Monitor
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Level Indicator */}
          <div className="mb-4">
            <LevelIndicator level={monitor.currentLevel} size="md" showLabel={true} />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center space-x-2 text-slate-500 text-xs mb-1">
                <HiOutlineBeaker className="w-3 h-3" />
                <span>Fluid</span>
              </div>
              <p className="font-medium text-slate-800 text-sm">{monitor.fluidType || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center space-x-2 text-slate-500 text-xs mb-1">
                <HiOutlineChartBar className="w-3 h-3" />
                <span>Flow Rate</span>
              </div>
              <p className="font-medium text-slate-800 text-sm">{monitor.flowRate || 0} ml/h</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center space-x-2 text-slate-500 text-xs mb-1">
                <HiOutlineClock className="w-3 h-3" />
                <span>Time Left</span>
              </div>
              <p className="font-medium text-slate-800 text-sm">{timeRemaining()}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Link
              to={`/monitors/${monitor._id}`}
              className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-slate-800 text-sm font-medium transition-all duration-200 border border-slate-200"
            >
              <HiOutlineEye className="w-4 h-4" />
              <span>View Details</span>
            </Link>
            {monitor.status === 'active' && monitor.currentLevel <= 20 && (
              <button
                onClick={handleBagChange}
                disabled={requesting}
                className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl transition-all duration-200 disabled:opacity-50 border border-amber-200"
                title="Request bag change"
              >
                <HiOutlineLightningBolt className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Low Level Warning */}
          {monitor.currentLevel <= 20 && monitor.status === 'active' && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-2 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-amber-600">Low level — Change bag soon</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default MonitorCard