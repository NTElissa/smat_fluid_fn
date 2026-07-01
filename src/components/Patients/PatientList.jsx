import { useState } from 'react'
import PatientCard from './PatientCard'
import { HiOutlineFilter } from 'react-icons/hi'
import React from 'react'

const PatientList = ({ patients, onUpdate }) => {
  const [filter, setFilter] = useState('all')

  const filteredPatients = filter === 'all' 
    ? patients 
    : patients.filter(p => p.status === filter)

  const stats = {
    all: patients.length,
    admitted: patients.filter(p => p.status === 'admitted').length,
    discharged: patients.filter(p => p.status === 'discharged').length,
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
            ${filter === 'all' 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All Patients ({stats.all})
        </button>
        <button
          onClick={() => setFilter('admitted')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
            ${filter === 'admitted' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Admitted ({stats.admitted})
        </button>
        <button
          onClick={() => setFilter('discharged')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
            ${filter === 'discharged' 
              ? 'bg-gray-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Discharged ({stats.discharged})
        </button>
      </div>

      {/* Patient Grid */}
      {filteredPatients.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500">No patients found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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