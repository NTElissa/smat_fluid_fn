import NotificationItem from './NotificationItem'
import React from 'react'

const NotificationList = ({ notifications, onNotificationClick }) => {
  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-500">No notifications</p>
      </div>
    )
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {notifications.map(notification => (
        <NotificationItem
          key={notification._id}
          notification={notification}
          onClick={() => onNotificationClick(notification._id)}
        />
      ))}
    </div>
  )
}

export default NotificationList