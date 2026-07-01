import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { 
  HiOutlineBell,
  HiOutlineUser,
  HiOutlineCpuChip,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle
} from 'react-icons/hi2'

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'alert': 
        return <HiOutlineExclamationCircle className="w-4 h-4 text-red-500" />
      case 'patient': 
        return <HiOutlineUser className="w-4 h-4 text-green-500" />
      case 'monitor':   
        return <HiOutlineCpuChip className="w-4 h-4 text-blue-500" />
      case 'task': 
        return <HiOutlineCheckCircle className="w-4 h-4 text-yellow-500" />
      default: 
        return <HiOutlineBell className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities && activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <HiOutlineBell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No recent activities</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityFeed