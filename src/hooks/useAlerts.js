import { useState, useEffect } from 'react'
import { getActiveAlerts, acknowledgeAlert } from '../services/alertService'
import { useSocket } from './useSocket'
import toast from 'react-hot-toast'

export const useAlerts = () => {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const { socket } = useSocket()

  useEffect(() => {
    loadAlerts()

    if (socket) {
      socket.on('new_alert', handleNewAlert)
      socket.on('alert_acknowledged', handleAlertAcknowledged)

      return () => {
        socket.off('new_alert')
        socket.off('alert_acknowledged')
      }
    }
  }, [socket])

  const loadAlerts = async () => {
    try {
      setLoading(true)
      const response = await getActiveAlerts()
      setAlerts(response.data.data)
    } catch (error) {
      console.error('Failed to load alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewAlert = (alert) => {
    setAlerts(prev => [alert, ...prev])
    
    if (alert.severity === 'critical') {
      toast.error(`🚨 CRITICAL: ${alert.message}`, {
        duration: 0,
        icon: '🔴'
      })
    } else {
      toast.warning(`⚠️ Alert: ${alert.message}`)
    }
  }

  const handleAlertAcknowledged = ({ alertId, acknowledgedBy }) => {
    setAlerts(prev =>
      prev.map(a =>
        a._id === alertId
          ? { ...a, status: 'acknowledged', acknowledgedBy }
          : a
      )
    )
  }

  const acknowledge = async (id) => {
    try {
      await acknowledgeAlert(id)
      setAlerts(prev =>
        prev.map(a => a._id === id ? { ...a, status: 'acknowledged' } : a)
      )
      toast.success('Alert acknowledged')
    } catch (error) {
      toast.error('Failed to acknowledge alert')
    }
  }

  return {
    alerts,
    loading,
    acknowledge,
    loadAlerts
  }
}