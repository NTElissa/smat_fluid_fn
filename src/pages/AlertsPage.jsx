import { useState } from 'react'
import AlertList from '../components/Alerts/AlertList'
import AlertModal from '../components/Alerts/AlertModal'
import { useAlerts } from '../hooks/useAlerts'
import { HiOutlineBell } from 'react-icons/hi'
import Spinner from '../components/Common/Spinner'

const AlertsPage = () => {
  const { alerts, loading, acknowledge } = useAlerts()
  const [selectedAlert, setSelectedAlert] = useState(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Alerts</h1>
        <p className="text-gray-600 mt-1">Monitor and manage system alerts</p>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <HiOutlineBell className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Critical</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.severity === 'critical').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <HiOutlineBell className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Warning</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.severity === 'warning').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <HiOutlineBell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <AlertList
        alerts={alerts}
        onAcknowledge={acknowledge}
        onView={setSelectedAlert}
      />

      {/* Alert Detail Modal */}
      <AlertModal
        alert={selectedAlert}
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onAcknowledge={acknowledge}
      />
    </div>
  )
}

export default AlertsPage