// src/pages/MonitorsPage.jsx
import React, { useState, useEffect } from 'react'
import { HiOutlinePlus } from 'react-icons/hi'
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

  useEffect(() => {
    loadMonitors()
  }, [])

  const loadMonitors = async () => {
    try {
      setLoading(true)
      const response = await getMonitors()
      setMonitors(response.data.data)
    } catch (error) {
      toast.error('Failed to load monitors')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadMonitors()
  }

  const stats = {
    total: monitors.length,
    active: monitors.filter(m => m.status === 'active').length,
    alert: monitors.filter(m => m.status === 'alert').length,
    completed: monitors.filter(m => m.status === 'completed').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">IV Monitors</h1>
          <p className="text-gray-600 mt-1">Track and manage all active IV monitors</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center justify-center space-x-2"
        >
          <HiOutlinePlus className="w-5 h-5" />
          <span>Add Monitor</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
          <p className="text-sm text-gray-600">Total Monitors</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <span className="text-2xl font-bold text-green-600">{stats.active}</span>
          <p className="text-sm text-gray-600">Active</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <span className="text-2xl font-bold text-red-600">{stats.alert}</span>
          <p className="text-sm text-gray-600">Alert</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <span className="text-2xl font-bold text-gray-600">{stats.completed}</span>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
      </div>

      {/* Monitor List */}
      <MonitorList 
        monitors={monitors} 
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Add Monitor Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New IV Monitor"
        size="lg"
      >
        <MonitorForm
          onSuccess={() => {
            setShowAddModal(false)
            loadMonitors()
          }}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </div>
  )
}

export default MonitorsPage