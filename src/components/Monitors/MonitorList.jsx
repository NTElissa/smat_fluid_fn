// src/components/Monitors/MonitorsList.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlinePlus, HiOutlineSearch, HiOutlineFilter, HiOutlineX } from 'react-icons/hi'
import { getMonitors } from '../../services/monitorService'
import MonitorCard from './MonitorCard'
import MonitorForm from './MonitorForm'
import Spinner from '../Common/Spinner'
import toast from 'react-hot-toast'

const MonitorsList = () => {
  const [monitors, setMonitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

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

  const filteredMonitors = monitors.filter(monitor => {
    const matchesSearch = 
      monitor.deviceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      monitor.patientId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      monitor.patientId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || monitor.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const statusCounts = monitors.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20px 20px, #1e293b 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center space-x-3">
              <span>IV Monitors</span>
              <span className="text-sm font-normal text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                {monitors.length} Total
              </span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">Monitor and manage all IV devices in real-time</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 transform hover:scale-[1.02]"
          >
            <HiOutlinePlus className="w-5 h-5" />
            <span>New Monitor</span>
          </button>
        </div>

        {/* Stats - Clean Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { status: 'active', label: 'Active', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
            { status: 'alert', label: 'Alert', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
            { status: 'paused', label: 'Paused', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
            { status: 'completed', label: 'Completed', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' }
          ].map(({ status, label, color, bg, border }) => (
            <div
              key={status}
              className={`${bg} backdrop-blur-xl rounded-xl p-3 border ${border} text-center cursor-pointer hover:shadow-md transition-all duration-200`}
              onClick={() => setFilterStatus(filterStatus === status ? 'all' : status)}
            >
              <p className={`text-xs font-medium ${color}`}>
                {label}
              </p>
              <p className="text-lg font-bold text-slate-800 mt-0.5">
                {statusCounts[status] || 0}
              </p>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search monitors by patient or device ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl border transition-all duration-200 flex items-center space-x-2 shadow-sm ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <HiOutlineFilter className="w-4 h-4" />
            <span>Filter</span>
            {filterStatus !== 'all' && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            )}
          </button>
          {filterStatus !== 'all' && (
            <button
              onClick={() => setFilterStatus('all')}
              className="px-3 py-3 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-700 transition-colors flex items-center space-x-1 shadow-sm hover:bg-slate-50"
            >
              <HiOutlineX className="w-4 h-4" />
              <span className="text-sm">Clear</span>
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="flex flex-wrap gap-2 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-slate-500 text-sm font-medium mr-2 flex items-center">Status:</span>
                {['all', 'active', 'alert', 'paused', 'completed'].map((status) => (
                  <button
                    key={status}
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
                      ({status === 'all' ? monitors.length : statusCounts[status] || 0})
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Monitor Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : filteredMonitors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-6xl mb-4">📡</div>
            <p className="text-slate-600 text-lg">No monitors found</p>
            <p className="text-slate-400 text-sm mt-1">Try adjusting your search or create a new monitor</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMonitors.map((monitor) => (
              <MonitorCard
                key={monitor._id}
                monitor={monitor}
                onRefresh={loadMonitors}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowForm(false)
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <MonitorForm
                onSuccess={() => {
                  setShowForm(false)
                  loadMonitors()
                }}
                onCancel={() => setShowForm(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MonitorsList