import React from 'react'
const AlertBadge = ({ count, severity = 'critical' }) => {
  if (count === 0) return null

  const colors = {
    critical: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }

  return (
    <span className={`absolute -top-1 -right-1 ${colors[severity]} text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1`}>
      {count > 9 ? '9+' : count}
    </span>
  )
}

export default AlertBadge