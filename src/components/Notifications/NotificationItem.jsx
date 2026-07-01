import { formatDistanceToNow } from 'date-fns'
import { 
  HiOutlineBell, 
  HiOutlineExclamation, 
  HiOutlineCheckCircle,
  HiOutlineClock 
} from 'react-icons/hi'
import React from 'react'

const NotificationItem = ({ notification, onClick }) => {
  const getIcon = (type, priority) => {
    if (priority === 'high') return <HiOutlineExclamation className="w-5 h-5 text-red-500" />
    if (type === 'alert') return <HiOutlineBell className="w-5 h-5 text-yellow-500" />
    if (type === 'task') return <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />
    return <HiOutlineBell className="w-5 h-5 text-blue-500" />
  }

  const getBgColor = (priority, isRead) => {
    if (isRead) return 'bg-white'
    if (priority === 'high') return 'bg-red-50'
    if (priority === 'medium') return 'bg-yellow-50'
    return 'bg-blue-50'
  }

  return (
    <div
      onClick={onClick}
      className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${getBgColor(notification.priority, notification.isRead)}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon(notification.type, notification.priority)}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${notification.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
            {notification.title}
          </p>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <HiOutlineClock className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
        {!notification.isRead && (
          <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0"></span>
        )}
      </div>
    </div>
  )
}

export default NotificationItem