// src/components/Monitors/MonitorList.jsx
import React, { useState } from 'react'
import MonitorCard from './MonitorCard'
import { HiOutlineFilter, HiOutlineRefresh } from 'react-icons/hi'

const MonitorList = ({ monitors, onRefresh, loading }) => {
  const [filter, setFilter] = useState('all')

  const filteredMonitors = monitors?.filter(monitor => {
    if (filter === 'all') return true
    return monitor.status === filter
  }) || []

  const stats = {
    all: monitors?.length || 0,
    active: monitors?.filter(m => m.status === 'active').length || 0,
    alert: monitors?.filter(m => m.status === 'alert').length || 0,
    completed: monitors?.filter(m => m.status === 'completed').length || 0
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <HiOutlineFilter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border-none bg-transparent focus:ring-0"
          >
            <option value="all">All Monitors ({stats.all})</option>
            <option value="active">Active ({stats.active})</option>
            <option value="alert">Alert ({stats.alert})</option>
            <option value="completed">Completed ({stats.completed})</option>
          </select>
        </div>
        <button
          onClick={onRefresh}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          title="Refresh"
        >
          <HiOutlineRefresh className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Monitor Grid */}
      {filteredMonitors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No monitors found</h3>
          <p className="text-gray-500 text-sm">
            {filter === 'all' 
              ? 'No IV monitors are currently active'
              : `No ${filter} monitors available`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMonitors.map(monitor => (
            <MonitorCard 
              key={monitor._id} 
              monitor={monitor} 
              onRefresh={onRefresh}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MonitorList