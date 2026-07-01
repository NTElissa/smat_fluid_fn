import { useState, useEffect } from 'react'
import {
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineViewColumns,
  HiOutlineBars3,
  HiOutlineChevronDown,
  HiOutlineArrowPath,
  HiOutlineXMark
} from 'react-icons/hi2'
import PatientCard from '../components/Patients/PatientCard'
import PatientForm from '../components/Patients/PatientForm'
import { getPatients, deletePatient } from '../services/patientService'
import Spinner from '../components/Common/Spinner'
import Modal from '../components/Common/Modal'
import Button from '../components/Common/Button'
import toast from 'react-hot-toast'

const PatientsPage = () => {
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  const [filters, setFilters] = useState({
    ward: 'all',
    status: 'all',
    gender: 'all'
  })

  // Get unique wards for filter
  const wards = ['all', ...new Set(patients.map(p => p.ward).filter(Boolean))]
  const statuses = ['all', 'admitted', 'discharged', 'transferred']
  const genders = ['all', 'male', 'female', 'other']

  useEffect(() => {
    loadPatients()
  }, [])

  useEffect(() => {
    filterPatients()
  }, [searchTerm, filters, patients])

  const loadPatients = async () => {
    try {
      setLoading(true)
      const response = await getPatients()
      setPatients(response.data || [])
      setFilteredPatients(response.data || [])
    } catch (error) {
      toast.error('Failed to load patients')
      console.error('Error loading patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterPatients = () => {
    let filtered = patients
    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patientId?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (filters.ward !== 'all') {
      filtered = filtered.filter(patient => patient.ward === filters.ward)
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter(patient => patient.status === filters.status)
    }
    if (filters.gender !== 'all') {
      filtered = filtered.filter(patient => patient.gender === filters.gender)
    }
    setFilteredPatients(filtered)
  }

  const handleDeletePatient = async (id) => {
    try {
      await deletePatient(id)
      toast.success('Patient deleted successfully')
      loadPatients()
    } catch (error) {
      toast.error('Failed to delete patient')
    }
  }

  const clearFilters = () => {
    setFilters({
      ward: 'all',
      status: 'all',
      gender: 'all'
    })
    setSearchTerm('')
  }

  // Stats for the header
  const stats = {
    total: patients.length,
    admitted: patients.filter(p => p.status === 'admitted').length,
    discharged: patients.filter(p => p.status === 'discharged').length,
    male: patients.filter(p => p.gender === 'male').length,
    female: patients.filter(p => p.gender === 'female').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6 bg-gray-50/40">
      {/* Header with Stats – softer gradient, modern teal-blue */}
      <div className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-teal-900/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Patients</h1>
            <p className="text-teal-100/90 mt-1.5 text-lg">Overview & management of all patients</p>
          </div>
          <Button
            variant="white"
            size="lg"
            onClick={() => setShowAddModal(true)}
            className="shadow-lg shadow-teal-950/30 hover:shadow-teal-950/40 transition-shadow"
          >
            <HiOutlinePlus className="w-5 h-5" />
            <span>Add Patient</span>
          </Button>
        </div>

        {/* Quick Stats – cleaner cards with subtle glass effect */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-teal-100/80 text-sm font-medium">Total</p>
            <p className="text-3xl font-bold mt-1">{stats.total}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-teal-100/80 text-sm font-medium">Admitted</p>
            <p className="text-3xl font-bold mt-1 text-teal-200">{stats.admitted}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-teal-100/80 text-sm font-medium">Discharged</p>
            <p className="text-3xl font-bold mt-1 text-gray-200">{stats.discharged}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-teal-100/80 text-sm font-medium">Male</p>
            <p className="text-3xl font-bold mt-1 text-blue-200">{stats.male}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-teal-100/80 text-sm font-medium">Female</p>
            <p className="text-3xl font-bold mt-1 text-pink-200">{stats.female}</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar – cleaner, elevated look */}
      <div className="bg-white rounded-2xl shadow border border-gray-200/70 p-5">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
          {/* Search */}
          <div className="flex-1 relative">
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500/40 focus:border-teal-400 transition-all"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`min-w-[140px] px-5 py-3.5 border rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${
              showFilters
                ? 'bg-teal-50 border-teal-300 text-teal-700 shadow-sm'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <HiOutlineAdjustmentsHorizontal className="w-5 h-5" />
            <span>Filters</span>
            <HiOutlineChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* View Toggle */}
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-3 transition-colors ${
                viewMode === 'grid' ? 'bg-teal-50 text-teal-700' : 'text-gray-500 hover:bg-gray-50'
              }`}
              title="Grid view"
            >
              <HiOutlineViewColumns className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-3 border-l border-gray-200 transition-colors ${
                viewMode === 'list' ? 'bg-teal-50 text-teal-700' : 'text-gray-500 hover:bg-gray-50'
              }`}
              title="List view"
            >
              <HiOutlineBars3 className="w-5 h-5" />
            </button>
          </div>

          {/* Refresh */}
          <button
            onClick={loadPatients}
            className="p-3.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-teal-600 transition-colors group"
            title="Refresh list"
          >
            <HiOutlineArrowPath className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Ward</label>
                <select
                  value={filters.ward}
                  onChange={(e) => setFilters({ ...filters, ward: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-300 bg-white text-gray-800"
                >
                  {wards.map(ward => (
                    <option key={ward} value={ward}>
                      {ward === 'all' ? 'All Wards' : ward}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-300 bg-white text-gray-800"
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>
                      {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Gender</label>
                <select
                  value={filters.gender}
                  onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-300 bg-white text-gray-800"
                >
                  {genders.map(g => (
                    <option key={g} value={g}>
                      {g === 'all' ? 'All Genders' : g.charAt(0).toUpperCase() + g.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
              <Button variant="primary" size="sm" onClick={() => setShowFilters(false)}>
                Apply
              </Button>
            </div>

            {/* Active filters pills */}
            {(filters.ward !== 'all' || filters.status !== 'all' || filters.gender !== 'all' || searchTerm) && (
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <span className="text-gray-500 self-center">Active:</span>
                {filters.ward !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium border border-teal-100">
                    Ward: {filters.ward}
                    <button onClick={() => setFilters({ ...filters, ward: 'all' })}>
                      <HiOutlineXMark className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {/* similar for status & gender */}
                {filters.status !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium border border-teal-100">
                    Status: {filters.status}
                    <button onClick={() => setFilters({ ...filters, status: 'all' })}>
                      <HiOutlineXMark className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {filters.gender !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium border border-teal-100">
                    Gender: {filters.gender}
                    <button onClick={() => setFilters({ ...filters, gender: 'all' })}>
                      <HiOutlineXMark className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <p>
          Showing <span className="font-semibold text-gray-900">{filteredPatients.length}</span> of{' '}
          <span className="font-semibold text-gray-900">{patients.length}</span> patients
        </p>
        {(searchTerm || filters.ward !== 'all' || filters.status !== 'all' || filters.gender !== 'all') && (
          <button
            onClick={clearFilters}
            className="text-teal-600 hover:text-teal-800 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Patients content */}
      {filteredPatients.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-7xl mb-5 opacity-70">🏥</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">No patients found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchTerm || filters.ward !== 'all' || filters.status !== 'all' || filters.gender !== 'all'
              ? 'Try adjusting your filters or search term'
              : 'Start by adding your first patient record'}
          </p>
          {!searchTerm && filters.ward === 'all' && filters.status === 'all' && filters.gender === 'all' && (
            <Button
              variant="primary"
              size="lg"
              className="mt-6"
              onClick={() => setShowAddModal(true)}
            >
              <HiOutlinePlus className="w-5 h-5" />
              Add Patient
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredPatients.map(patient => (
            <PatientCard
              key={patient._id}
              patient={patient}
              onUpdate={loadPatients}
              onDelete={handleDeletePatient}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/70">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Admitted</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPatients.map(patient => (
                <tr key={patient._id} className="hover:bg-teal-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm ${
                        patient.gender === 'male' ? 'bg-blue-100 text-blue-700' :
                        patient.gender === 'female' ? 'bg-pink-100 text-pink-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {patient.gender === 'male' ? '♂' : patient.gender === 'female' ? '♀' : '?'}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-1">{patient.diagnosis || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{patient.patientId || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {patient.ward || '—'} • {patient.room || '—'}{patient.bed ? ` (${patient.bed})` : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                      patient.status === 'admitted' ? 'bg-green-100 text-green-800 border border-green-200' :
                      patient.status === 'discharged' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                      patient.status === 'transferred' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                      'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {patient.status ? patient.status.charAt(0).toUpperCase() + patient.status.slice(1) : 'Admitted'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {patient.admissionDate ? new Date(patient.admissionDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-teal-600 hover:text-teal-800 mr-4">View</button>
                    <button className="text-gray-600 hover:text-gray-800">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Patient Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Patient"
        size="lg"
      >
        <PatientForm
          onSuccess={() => {
            setShowAddModal(false)
            loadPatients()
            toast.success('Patient added successfully')
          }}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Mobile FAB */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 text-white p-5 rounded-full shadow-2xl hover:bg-teal-700 transition-all active:scale-95"
        >
          <HiOutlinePlus className="w-7 h-7" />
        </button>
      </div>
    </div>
  )
}

export default PatientsPage