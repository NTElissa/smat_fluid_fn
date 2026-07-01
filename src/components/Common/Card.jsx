import React from 'react'
const Card = ({ children, className = '', padding = true }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm ${padding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>
  )
}

export default Card