import { useEffect } from 'react'
import { HiOutlineX } from 'react-icons/hi'
import React from 'react'

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-slate-900/75 transition-opacity"
          onClick={onClose}
        />

        <div className={`inline-block align-bottom rounded-2xl border border-slate-200 bg-white text-left shadow-2xl transition-all sm:my-8 sm:align-middle dark:border-slate-700 dark:bg-slate-900 ${sizes[size]} w-full`}>
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal