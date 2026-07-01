import { formatDistanceToNow } from 'date-fns'
import { 
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineClock 
} from 'react-icons/hi' // Changed from hi2 to hi

const AlertCard = ({ alert, onAcknowledge }) => {
  const severityColors = {
    critical: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
  }

  const severityIcons = {
    critical: HiOutlineExclamationCircle,
    warning: HiOutlineExclamationCircle,
    info: HiOutlineCheckCircle,
  }

  const Icon = severityIcons[alert.severity] || HiOutlineExclamationCircle

  return (
    <div className={`p-4 rounded-lg border ${severityColors[alert.severity]}`}>
      <div className="flex items-start space-x-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-sm">
              {alert.patientId?.firstName} {alert.patientId?.lastName}
            </h4>
            <span className="text-xs opacity-75">
              {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm mb-2">{alert.message}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs flex items-center space-x-1">
              <HiOutlineClock className="w-3 h-3" />
              <span>Room {alert.patientId?.room}{alert.patientId?.bed}</span>
            </span>
            {alert.status === 'active' && (
              <button
                onClick={() => onAcknowledge(alert._id)}
                className="text-xs font-medium underline hover:no-underline"
              >
                Acknowledge
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertCard