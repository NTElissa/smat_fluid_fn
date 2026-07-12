// src/pages/MonitorsPage.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HiOutlinePlus, 
  HiOutlineSearch, 
  HiOutlineFilter,
  HiOutlineX,
  HiOutlineRefresh,
  HiOutlineChartBar,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineDeviceMobile,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineCog,
  HiOutlineBeaker,
  HiOutlineUser
} from 'react-icons/hi'
import MonitorList from '../components/Monitors/MonitorList'
import MonitorForm from '../components/Monitors/MonitorForm'
import { getMonitors } from '../services/monitorService'
import Modal from '../components/Common/Modal'
import Spinner from '../components/Common/Spinner'
import toast from 'react-hot-toast'

const MonitorsPage = () => {
  const [monitors, setMonitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    loadMonitors()
  }, [])

  const loadMonitors = async () => {
    try {
      setLoading(true)
      const response = await getMonitors()
      setMonitors(response.data.data || [])
    } catch (error) {
      toast.error('Failed to load monitors')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadMonitors()
    setRefreshing(false)
    toast.success('Monitors refreshed')
  }

  const stats = {
    total: monitors.length,
    active: monitors.filter(m => m.status === 'active').length,
    alert: monitors.filter(m => m.status === 'alert').length,
    completed: monitors.filter(m => m.status === 'completed').length,
    paused: monitors.filter(m => m.status === 'paused').length
  }

  const filteredMonitors = monitors.filter(monitor => {
    const matchesSearch = 
      monitor.deviceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      monitor.patientId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      monitor.patientId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || monitor.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  // Clean, user-friendly stat cards with warm colors
  const statCards = [
    { 
      key: 'total', 
      label: 'Total Monitors', 
      value: stats.total, 
      icon: HiOutlineDeviceMobile,
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      border: 'border-blue-200',
      iconBg: 'bg-blue-500',
      iconColor: 'text-white',
      textColor: 'text-blue-700',
      valueColor: 'text-blue-800'
    },
    { 
      key: 'active', 
      label: 'Active', 
      value: stats.active, 
      icon: HiOutlineChartBar,
      bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-500',
      iconColor: 'text-white',
      textColor: 'text-emerald-700',
      valueColor: 'text-emerald-800'
    },
    { 
      key: 'alert', 
      label: 'Alerts', 
      value: stats.alert, 
      icon: HiOutlineExclamationCircle,
      bg: 'bg-gradient-to-br from-rose-50 to-rose-100',
      border: 'border-rose-200',
      iconBg: 'bg-rose-500',
      iconColor: 'text-white',
      textColor: 'text-rose-700',
      valueColor: 'text-rose-800'
    },
    { 
      key: 'paused', 
      label: 'Paused', 
      value: stats.paused, 
      icon: HiOutlineClock,
      bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
      border: 'border-amber-200',
      iconBg: 'bg-amber-500',
      iconColor: 'text-white',
      textColor: 'text-amber-700',
      valueColor: 'text-amber-800'
    },
    { 
      key: 'completed', 
      label: 'Completed', 
      value: stats.completed, 
      icon: HiOutlineCheckCircle,
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      border: 'border-purple-200',
      iconBg: 'bg-purple-500',
      iconColor: 'text-white',
      textColor: 'text-purple-700',
      valueColor: 'text-purple-800'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20px 20px, #1e293b 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section - Clean & Professional */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <HiOutlineDeviceMobile className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800 flex items-center space-x-3">
                  <span>IV Monitors</span>
                  <span className="text-sm font-normal text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    {monitors.length} Total
                  </span>
                </h1>
                <p className="text-slate-500 text-sm mt-1">Monitor and manage all IV devices in real-time</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800 transition-all duration-200 disabled:opacity-50 shadow-sm"
              >
                <HiOutlineRefresh className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 transform hover:scale-[1.02] group"
              >
                <HiOutlinePlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span>New Monitor</span>
              </button>
            </div>
          </div>
        </div>

        {/* Clean Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => {
                if (stat.key !== 'total') {
                  setFilterStatus(filterStatus === stat.key ? 'all' : stat.key)
                }
              }}
              className={`relative ${stat.bg} backdrop-blur-xl rounded-2xl p-5 border ${stat.border} transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md`}
            >
              <div className="relative flex items-start justify-between">
                <div>
                  <p className={`text-xs font-medium ${stat.textColor} uppercase tracking-wider`}>{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.valueColor} mt-2`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.iconBg} shadow-lg shadow-${stat.iconBg}/20`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
              {stat.key !== 'total' && filterStatus === stat.key && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-b-2xl"></div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Search & Filter - Clean Design */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <HiOutlineSearch className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by patient name, device ID, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-5 py-3.5 rounded-xl border transition-all duration-200 flex items-center space-x-2 shadow-sm ${
                showFilters || filterStatus !== 'all'
                  ? 'bg-blue-50 border-blue-300 text-blue-700' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <HiOutlineFilter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
              {filterStatus !== 'all' && (
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              )}
            </button>
            {filterStatus !== 'all' && (
              <button
                onClick={() => setFilterStatus('all')}
                className="px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-700 transition-colors flex items-center space-x-1 shadow-sm hover:bg-slate-50"
              >
                <HiOutlineX className="w-4 h-4" />
                <span className="text-sm">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Chips - Clean Design */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="overflow-hidden mb-6"
            >
              <div className="flex flex-wrap gap-2 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-slate-500 text-sm font-medium mr-2 flex items-center">Status:</span>
                {['all', 'active', 'alert', 'paused', 'completed'].map((status) => (
                  <motion.button
                    key={status}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setFilterStatus(status)
                      setShowFilters(false)
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filterStatus === status
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    <span className="ml-2 text-xs opacity-70">
                      ({status === 'all' ? monitors.length : stats[status] || 0})
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Monitor List - Clean Container */}
        <div className="relative">
          <div className="relative bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="text-center">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm mt-6">Loading monitors...</p>
                </div>
              </div>
            ) : filteredMonitors.length === 0 ? (
              <div className="text-center py-32">
                <div className="relative inline-block">
                  <div className="text-7xl mb-4">📡</div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
                </div>
                <p className="text-slate-600 text-xl font-medium">No monitors found</p>
                <p className="text-slate-400 text-sm mt-2">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'Get started by creating your first IV monitor'}
                </p>
                {!searchTerm && filterStatus === 'all' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddModal(true)}
                    className="mt-6 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
                  >
                    Create Monitor
                  </motion.button>
                )}
              </div>
            ) : (
              <MonitorList 
                monitors={filteredMonitors} 
                onRefresh={handleRefresh}
                loading={loading}
                viewMode={viewMode}
              />
            )}
          </div>
        </div>

        {/* Clean Footer */}
        <div className="mt-8 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>System Online</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              <span>{monitors.filter(m => m.status === 'active').length} active monitors</span>
            </span>
            <span>•</span>
            <span>🔒 Secure connection</span>
          </div>
          <div className="flex items-center space-x-6 mt-2 sm:mt-0">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <HiOutlineCog className="w-3 h-3" />
              <span>v3.0.0</span>
            </span>
          </div>
        </div>
      </div>

      {/* Clean Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowAddModal(false)
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <MonitorForm
                onSuccess={() => {
                  setShowAddModal(false)
                  loadMonitors()
                }}
                onCancel={() => setShowAddModal(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MonitorsPage