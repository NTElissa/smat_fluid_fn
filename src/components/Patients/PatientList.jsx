import { useState } from 'react'
import PatientCard from './PatientCard'
import { HiOutlineFilter, HiOutlineUsers, HiOutlineUserAdd, HiOutlineSearch, HiOutlineChevronDown } from 'react-icons/hi'
import React from 'react'

const PatientList = ({ patients, onUpdate }) => {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)

  const filteredPatients = patients.filter(p => {
    // Status filter
    const statusMatch = filter === 'all' || p.status === filter
    
    // Search filter
    const searchMatch = searchTerm === '' || 
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return statusMatch && searchMatch
  })

  const stats = {
    all: patients.length,
    admitted: patients.filter(p => p.status === 'admitted').length,
    discharged: patients.filter(p => p.status === 'discharged').length,
    transferred: patients.filter(p => p.status === 'transferred').length
  }

  const filterOptions = [
    { id: 'all', label: 'All Patients', icon: HiOutlineUsers, color: 'primary' },
    { id: 'admitted', label: 'Admitted', icon: HiOutlineUserAdd, color: 'emerald' },
    { id: 'discharged', label: 'Discharged', icon: HiOutlineUserAdd, color: 'slate' },
    { id: 'transferred', label: 'Transferred', icon: HiOutlineUserAdd, color: 'amber' }
  ]

  const getFilterColor = (filterId) => {
    const colors = {
      primary: 'from-primary-500 to-primary-600',
      emerald: 'from-emerald-500 to-emerald-600',
      slate: 'from-slate-500 to-slate-600',
      amber: 'from-amber-500 to-amber-600'
    }
    return colors[filterId] || colors.primary
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-slate-800/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title & Stats */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-transparent bg-clip-text">
                Patient Management
              </span>
              <span className="text-sm font-normal text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                {stats.all} total
              </span>
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>{stats.admitted} admitted</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <span>{stats.discharged} discharged</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>{stats.transferred || 0} transferred</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search patients by name, ID, or diagnosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Tabs - Desktop */}
        <div className="hidden md:flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl">
          {filterOptions.map((option) => {
            const isActive = filter === option.id
            const Icon = option.icon
            return (
              <button
                key={option.id}
                onClick={() => setFilter(option.id)}
                className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2
                  ${isActive 
                    ? `bg-white dark:bg-slate-700 text-${option.color}-600 dark:text-${option.color}-400 shadow-lg shadow-${option.color}-500/20` 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? `text-${option.color}-500` : ''}`} />
                <span>{option.label}</span>
                <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                  isActive 
                    ? `bg-${option.color}-100 text-${option.color}-600 dark:bg-${option.color}-500/20 dark:text-${option.color}-400` 
                    : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400'
                }`}>
                  {stats[option.id]}
                </span>
                {isActive && (
                  <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-${option.color}-500 rounded-full`}></div>
                )}
              </button>
            )
          })}
        </div>

        {/* Filter Dropdown - Mobile */}
        <div className="md:hidden relative">
          <button
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
          >
            <div className="flex items-center gap-2">
              <HiOutlineFilter className="w-4 h-4 text-slate-400" />
              <span>{filterOptions.find(f => f.id === filter)?.label || 'Filter'}</span>
            </div>
            <HiOutlineChevronDown className={`w-4 h-4 transition-transform duration-300 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isFilterDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-10 overflow-hidden">
              {filterOptions.map((option) => {
                const isActive = filter === option.id
                const Icon = option.icon
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      setFilter(option.id)
                      setIsFilterDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-3 text-sm flex items-center justify-between transition-colors
                      ${isActive 
                        ? `bg-${option.color}-50 dark:bg-${option.color}-500/10 text-${option.color}-600 dark:text-${option.color}-400` 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isActive ? `text-${option.color}-500` : 'text-slate-400'}`} />
                      <span>{option.label}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      isActive 
                        ? `bg-${option.color}-100 text-${option.color}-600 dark:bg-${option.color}-500/20 dark:text-${option.color}-400` 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}>
                      {stats[option.id]}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span className="font-semibold text-slate-700 dark:text-slate-300">{filteredPatients.length}</span>
          <span>patient{filteredPatients.length !== 1 ? 's' : ''} found</span>
        </div>
      </div>

      {/* Patient Grid */}
      {filteredPatients.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No patients found</h3>
          <p className="text-slate-500 dark:text-slate-400">
            {searchTerm ? 'Try adjusting your search criteria' : 'No patients match the selected filter'}
          </p>
          {(filter !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setFilter('all')
                setSearchTerm('')
              }}
              className="mt-4 px-4 py-2 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-xl text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPatients.map(patient => (
            <PatientCard 
              key={patient._id} 
              patient={patient} 
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default PatientList