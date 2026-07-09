// src/pages/PatientsPage.jsx
import { useState, useEffect, useCallback } from 'react'
import {
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineViewColumns,
  HiOutlineListBullet,
  HiOutlineChevronDown,
  HiOutlineArrowPath,
  HiOutlineXMark,
  HiOutlineFunnel,
  HiOutlineUserGroup,
  HiOutlineHome,
  HiOutlineHeart,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineArrowRightCircle
} from 'react-icons/hi2'
import PatientCard from '../components/Patients/PatientCard'
import PatientForm from '../components/Patients/PatientForm'
import { getPatients, deletePatient, getPatientStats } from '../services/patientService'
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
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [stats, setStats] = useState({
    total: 0,
    admitted: 0,
    discharged: 0,
    transferred: 0,
    male: 0,
    female: 0
  })

  const [filters, setFilters] = useState({
    status: 'all',
    gender: 'all'
  })

  useEffect(() => {
    loadPatients()
    loadStats()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [searchTerm, filters, patients])

  const loadPatients = async () => {
    try {
      setLoading(true)
      const response = await getPatients()
      const patientData = response.data || []
      setPatients(patientData)
      setFilteredPatients(patientData)
    } catch (error) {
      toast.error('Failed to load patients')
      console.error('Error loading patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await getPatientStats()
      if (response.data) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const applyFilters = useCallback(() => {
    let filtered = [...patients]

    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(patient =>
        patient.firstName?.toLowerCase().includes(search) ||
        patient.lastName?.toLowerCase().includes(search) ||
        patient.patientId?.toLowerCase().includes(search)
      )
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(patient => patient.status === filters.status)
    }

    if (filters.gender !== 'all') {
      filtered = filtered.filter(patient => patient.gender === filters.gender)
    }

    setFilteredPatients(filtered)
  }, [patients, searchTerm, filters])

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient)
    setShowEditModal(true)
  }

  const handleDeletePatient = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return
    
    try {
      await deletePatient(id)
      toast.success('Patient deleted successfully')
      loadPatients()
      loadStats()
    } catch (error) {
      toast.error(error.message || 'Failed to delete patient')
    }
  }

  const clearFilters = () => {
    setFilters({
      status: 'all',
      gender: 'all'
    })
    setSearchTerm('')
  }

  const handleFormSuccess = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setSelectedPatient(null)
    loadPatients()
    loadStats()
  }

  const activeFiltersCount = Object.values(filters).filter(v => v !== 'all').length + (searchTerm ? 1 : 0)

  const statCards = [
    { label: 'Total Patients', value: stats.total, icon: HiOutlineUserGroup, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-500/10', textColor: 'text-blue-600 dark:text-blue-400' },
    { label: 'Admitted', value: stats.admitted, icon: HiOutlineCheckCircle, color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-500/10', textColor: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Discharged', value: stats.discharged, icon: HiOutlineXCircle, color: 'from-slate-500 to-slate-600', bgColor: 'bg-slate-50 dark:bg-slate-500/10', textColor: 'text-slate-600 dark:text-slate-400' },
    { label: 'Transferred', value: stats.transferred, icon: HiOutlineArrowRightCircle, color: 'from-amber-500 to-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-500/10', textColor: 'text-amber-600 dark:text-amber-400' },
    { label: 'Male', value: stats.male, icon: HiOutlineUserGroup, color: 'from-sky-500 to-sky-600', bgColor: 'bg-sky-50 dark:bg-sky-500/10', textColor: 'text-sky-600 dark:text-sky-400' },
    { label: 'Female', value: stats.female, icon: HiOutlineUserGroup, color: 'from-pink-500 to-pink-600', bgColor: 'bg-pink-50 dark:bg-pink-500/10', textColor: 'text-pink-600 dark:text-pink-400' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-slate-500 dark:text-slate-400">Loading patients...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</span>
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative min-w-[130px] px-5 py-3.5 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all ${
              showFilters || activeFiltersCount > 0
                ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/50 dark:text-blue-400'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <HiOutlineFunnel className="w-5 h-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* View Toggle */}
          <div className="flex items-center border border-slate-200 dark:border-slate-600 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-3 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title="Grid view"
            >
              <HiOutlineViewColumns className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-3 border-l border-slate-200 dark:border-slate-600 transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title="List view"
            >
              <HiOutlineListBullet className="w-5 h-5" />
            </button>
          </div>

          {/* Refresh */}
          <button
            onClick={() => {
              loadPatients()
              loadStats()
              toast.success('Data refreshed')
            }}
            className="p-3.5 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-all group"
            title="Refresh data"
          >
            <HiOutlineArrowPath className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          </button>

          {/* Add Patient Button - UNIQUE DESIGN */}
          <button
            onClick={() => setShowAddModal(true)}
            className="group relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center gap-2">
              <HiOutlinePlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Add New Patient</span>
              <span className="absolute -right-1 -top-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            </span>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {['all', 'admitted', 'discharged', 'transferred'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFilters({ ...filters, status })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.status === status
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                      }`}
                    >
                      {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Gender
                </label>
                <div className="flex flex-wrap gap-2">
                  {['all', 'male', 'female', 'other'].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setFilters({ ...filters, gender })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.gender === gender
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                      }`}
                    >
                      {gender === 'all' ? 'All' : gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 font-medium text-sm"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredPatients.length}</span> of{' '}
          <span className="font-semibold text-slate-900 dark:text-white">{patients.length}</span> patients
        </p>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Patients Display */}
      {filteredPatients.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-16 text-center">
          <div className="text-7xl mb-6">🏥</div>
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
            No patients found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {activeFiltersCount > 0
              ? 'No patients match your current filters. Try adjusting your search or filter criteria.'
              : 'Start building your patient database by adding your first patient.'}
          </p>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredPatients.map(patient => (
            <PatientCard
              key={patient._id}
              patient={patient}
              onEdit={() => handleEditPatient(patient)}
              onDelete={() => handleDeletePatient(patient._id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Admitted
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredPatients.map(patient => (
                  <tr
                    key={patient._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                          patient.gender === 'male'
                            ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400'
                            : patient.gender === 'female'
                            ? 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400'
                        }`}>
                          {patient.firstName?.[0]}{patient.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {patient.firstName} {patient.lastName}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {patient.gender} • {patient.age || 'N/A'} yrs
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
                        {patient.patientId || 'N/A'}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.roomId ? (
                        <div className="text-sm">
                          <p className="font-medium text-slate-900 dark:text-white">
                            Room {patient.roomId.roomNumber}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400">
                            {patient.roomId.ward}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        patient.status === 'admitted'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400'
                          : patient.status === 'discharged'
                          ? 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400'
                      }`}>
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                      {patient.admissionDate
                        ? new Date(patient.admissionDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleEditPatient(patient)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 font-medium mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePatient(patient._id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Patient Modal - UNIQUE DESIGN */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title=""
        size="xl"
        className="!p-0"
      >
        <div className="relative">
          {/* Decorative Header */}
          <div className="absolute -top-0 left-0 right-0 h-2 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500"></div>
          
          <div className="pt-8 pb-6 px-8 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-br from-violet-50/50 to-indigo-50/50 dark:from-violet-950/20 dark:to-indigo-950/20">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <HiOutlinePlus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                      Register New Patient
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Add a new patient to the system
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors group"
              >
                <HiOutlineXMark className="w-6 h-6 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
              </button>
            </div>
          </div>

          {/* Patient Form with Unique Styling */}
          <div className="p-8">
            <PatientForm
              onSuccess={handleFormSuccess}
              onCancel={() => setShowAddModal(false)}
              uniqueDesign={true}
            />
          </div>

          {/* Floating Decorative Elements */}
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
        </div>
      </Modal>

      {/* Edit Patient Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedPatient(null)
        }}
        title=""
        size="xl"
        className="!p-0"
      >
        {selectedPatient && (
          <div className="relative">
            {/* Decorative Header */}
            <div className="absolute -top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
            
            <div className="pt-8 pb-6 px-8 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <HiOutlineAdjustmentsHorizontal className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Update Patient
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Edit patient information
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedPatient(null)
                  }}
                  className="p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors group"
                >
                  <HiOutlineXMark className="w-6 h-6 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                </button>
              </div>
            </div>

            <div className="p-8">
              <PatientForm
                patient={selectedPatient}
                onSuccess={handleFormSuccess}
                onCancel={() => {
                  setShowEditModal(false)
                  setSelectedPatient(null)
                }}
                uniqueDesign={true}
              />
            </div>

            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl pointer-events-none"></div>
          </div>
        )}
      </Modal>

      {/* Mobile FAB */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-5 rounded-full shadow-2xl shadow-violet-500/40 hover:shadow-violet-500/60 active:scale-95 transition-all duration-200"
        >
          <HiOutlinePlus className="w-7 h-7" />
        </button>
      </div>
    </div>
  )
}

export default PatientsPage