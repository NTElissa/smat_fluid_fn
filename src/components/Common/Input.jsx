import { forwardRef } from 'react'
import React from 'react'

const Input = forwardRef(({ 
  label,
  error,
  icon: Icon,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
        )}
        <input
          ref={ref}
          className={`
            w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-2
            border ${error ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'} 
            rounded-lg focus:outline-none focus:ring-2 
            ${error ? 'focus:ring-red-500' : 'focus:ring-primary-500'}
            focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input