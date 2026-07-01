import { Link } from 'react-router-dom'
import { HiOutlineEye } from 'react-icons/hi' // Changed from hi2 to hi
import LevelIndicator from '../Monitors/LevelIndicator'

const MonitorCard = ({ monitor }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'alert': return 'bg-red-100 text-red-800 animate-pulse'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium text-gray-900">
            {monitor.patientId?.firstName} {monitor.patientId?.lastName}
          </h3>
          <p className="text-xs text-gray-500">
            Room {monitor.patientId?.room}{monitor.patientId?.bed}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(monitor.status)}`}>
          {monitor.status}
        </span>
      </div>

      <div className="mb-3">
        <LevelIndicator level={monitor.currentLevel} size="sm" />
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
        <span>{monitor.fluidType}</span>
        <span>{monitor.flowRate} ml/h</span>
      </div>

      <Link
        to={`/monitors/${monitor._id}`}
        className="flex items-center justify-center space-x-2 w-full py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <HiOutlineEye className="w-4 h-4" />
        <span>View Details</span>
      </Link>
    </div>
  )
}

export default MonitorCard