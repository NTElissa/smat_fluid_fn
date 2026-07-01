// src/components/Monitors/LevelIndicator.jsx
import React from 'react'

const LevelIndicator = ({ level, size = 'md', showLabel = true }) => {
  // Ensure level is between 0 and 100
  const safeLevel = Math.min(100, Math.max(0, level || 0))
  
  // Determine color based on level
  const getColor = () => {
    if (safeLevel <= 20) return 'bg-red-500'
    if (safeLevel <= 50) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  // Size classes
  const sizes = {
    sm: {
      bar: 'h-1.5',
      text: 'text-xs'
    },
    md: {
      bar: 'h-2.5',
      text: 'text-sm'
    },
    lg: {
      bar: 'h-4',
      text: 'text-base'
    }
  }

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Fluid Level</span>
          <span className={`font-medium ${sizes[size].text} ${
            safeLevel <= 20 ? 'text-red-600' : 
            safeLevel <= 50 ? 'text-yellow-600' : 
            'text-green-600'
          }`}>
            {safeLevel}%
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size].bar}`}>
        <div 
          className={`${getColor()} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${safeLevel}%`, height: '100%' }}
        />
      </div>
      {!showLabel && (
        <div className="text-right">
          <span className={`text-xs font-medium ${
            safeLevel <= 20 ? 'text-red-600' : 
            safeLevel <= 50 ? 'text-yellow-600' : 
            'text-green-600'
          }`}>
            {safeLevel}%
          </span>
        </div>
      )}
    </div>
  )
}

export default LevelIndicator