// pages/RoomsPage.jsx
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { getRooms, deleteRoom } from '../services/roomService'
import RoomCard from '../components/Rooms/RoomCard'
import RoomForm from '../components/Rooms/RoomForm'
import RoomDetail from '../components/Rooms/RoomDetail'
import Spinner from '../components/Common/Spinner'
import toast from 'react-hot-toast'
import {
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineXMark,
  HiOutlineBuildingOffice2,
  HiOutlineHomeModern,
  HiOutlineCheckCircle,
  HiOutlineUserGroup,
  HiOutlineWrenchScrewdriver,
  HiOutlineClock,
  HiOutlineViewColumns,
  HiOutlineListBullet,
  HiOutlineArrowPath
} from 'react-icons/hi2'

const RoomsPage = () => {
  const { user } = useContext(AuthContext)
  // eslint-disable-next-line no-unused-vars
  const isAdmin = user?.role === 'admin'

  const [rooms, setRooms] = useState([])
  const [filteredRooms, setFilteredRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // UI states
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  
  // Filter states
  const [filters, setFilters] = useState({
    ward: '',
    status: '',
    type: '',
    floor: ''
  })

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    maintenance: 0,
    reserved: 0
  })

  useEffect(() => {
    loadRooms()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [searchTerm, filters, rooms])

  const loadRooms = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await getRooms()
      const roomData = response?.data || response || []
      const roomsArray = Array.isArray(roomData) ? roomData : []
      
      setRooms(roomsArray)
      setFilteredRooms(roomsArray)
      calculateStats(roomsArray)
    } catch (err) {
      setError(err.message || 'Failed to load rooms')
      toast.error('Failed to load rooms')
      setRooms([])
      setFilteredRooms([])
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (roomsData) => {
    setStats({
      total: roomsData.length,
      available: roomsData.filter(r => r.status === 'available').length,
      occupied: roomsData.filter(r => r.status === 'occupied').length,
      maintenance: roomsData.filter(r => r.status === 'maintenance').length,
      reserved: roomsData.filter(r => r.status === 'reserved').length
    })
  }

  const applyFilters = () => {
    let filtered = [...rooms]
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(room =>
        room.roomNumber?.toLowerCase().includes(term) ||
        room.ward?.toLowerCase().includes(term) ||
        room.floor?.toLowerCase().includes(term) ||
        room.type?.toLowerCase().includes(term)
      )
    }
    
    if (filters.ward) filtered = filtered.filter(r => r.ward === filters.ward)
    if (filters.status) filtered = filtered.filter(r => r.status === filters.status)
    if (filters.type) filtered = filtered.filter(r => r.type === filters.type)
    if (filters.floor) filtered = filtered.filter(r => r.floor === filters.floor)
    
    setFilteredRooms(filtered)
  }

  const handleAddRoom = () => {
    setSelectedRoom(null)
    setShowAddModal(true)
  }

  const handleEditRoom = (room) => {
    setSelectedRoom(room)
    setShowEditModal(true)
  }

  const handleViewRoom = (room) => {
    setSelectedRoom(room)
    setShowDetailModal(true)
  }

  const handleDeleteClick = (room) => {
    setSelectedRoom(room)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedRoom?._id) return
    
    try {
      await deleteRoom(selectedRoom._id)
      toast.success('Room deleted successfully')
      setShowDeleteConfirm(false)
      setSelectedRoom(null)
      loadRooms()
    } catch (err) {
      toast.error(err.message || 'Failed to delete room')
    }
  }

  const handleRoomSuccess = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setSelectedRoom(null)
    loadRooms()
  }

  const clearFilters = () => {
    setFilters({ ward: '', status: '', type: '', floor: '' })
    setSearchTerm('')
  }

  const hasActiveFilters = filters.ward || filters.status || filters.type || filters.floor || searchTerm

  // Get unique values for filter dropdowns
  const uniqueWards = [...new Set(rooms.map(r => r.ward).filter(Boolean))]
  const uniqueFloors = [...new Set(rooms.map(r => r.floor).filter(Boolean))]
  const roomTypes = ['general', 'icu', 'maternity', 'pediatric', 'surgery']
  const roomStatuses = ['available', 'occupied', 'maintenance', 'reserved']

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center">
          <div className="relative">
            <Spinner size="xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <HiOutlineHomeModern className="w-8 h-8 text-indigo-500 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 font-medium">Loading rooms...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <HiOutlineXMark className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Failed to Load Rooms</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={loadRooms}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
          >
            <HiOutlineArrowPath className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <HiOutlineBuildingOffice2 className="w-6 h-6 text-white" />
                </span>
                Room Management
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Manage hospital rooms, occupancy, and staff assignments
              </p>
            </div>
            <button
              onClick={handleAddRoom}
              className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg shadow-indigo-600/25 font-medium"
            >
              <HiOutlinePlus className="w-5 h-5" />
              Add New Room
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatsCard
              icon={<HiOutlineBuildingOffice2 className="w-5 h-5" />}
              label="Total Rooms"
              value={stats.total}
              color="slate"
            />
            <StatsCard
              icon={<HiOutlineCheckCircle className="w-5 h-5" />}
              label="Available"
              value={stats.available}
              color="green"
            />
            <StatsCard
              icon={<HiOutlineUserGroup className="w-5 h-5" />}
              label="Occupied"
              value={stats.occupied}
              color="blue"
            />
            <StatsCard
              icon={<HiOutlineWrenchScrewdriver className="w-5 h-5" />}
              label="Maintenance"
              value={stats.maintenance}
              color="yellow"
            />
            <StatsCard
              icon={<HiOutlineClock className="w-5 h-5" />}
              label="Reserved"
              value={stats.reserved}
              color="purple"
            />
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search rooms by number, ward, floor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"
                >
                  <HiOutlineXMark className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border font-medium transition-all ${
                showFilters || hasActiveFilters
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <HiOutlineFunnel className="w-5 h-5" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              )}
            </button>

            {/* View Toggle */}
            <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <HiOutlineViewColumns className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 border-l border-slate-200 dark:border-slate-700 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <HiOutlineListBullet className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FilterSelect
                  label="Ward"
                  value={filters.ward}
                  onChange={(e) => setFilters({ ...filters, ward: e.target.value })}
                  options={uniqueWards}
                  placeholder="All Wards"
                />
                <FilterSelect
                  label="Status"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  options={roomStatuses}
                  placeholder="All Statuses"
                />
                <FilterSelect
                  label="Type"
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  options={roomTypes}
                  placeholder="All Types"
                />
                <FilterSelect
                  label="Floor"
                  value={filters.floor}
                  onChange={(e) => setFilters({ ...filters, floor: e.target.value })}
                  options={uniqueFloors}
                  placeholder="All Floors"
                />
              </div>
              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4 text-sm text-slate-600 dark:text-slate-400">
          <p>
            Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredRooms.length}</span> of{' '}
            <span className="font-semibold text-slate-900 dark:text-white">{rooms.length}</span> rooms
          </p>
        </div>

        {/* Room Display */}
        {filteredRooms.length === 0 ? (
          <EmptyState
            hasFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            onAddRoom={handleAddRoom}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRooms.map(room => (
              <RoomCard
                key={room._id || room.id}
                room={room}
                onView={handleViewRoom}
                onEdit={handleEditRoom}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <RoomTable
            rooms={filteredRooms}
            onView={handleViewRoom}
            onEdit={handleEditRoom}
            onDelete={handleDeleteClick}
          />
        )}

        {/* Modals */}
        <RoomForm
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleRoomSuccess}
          room={null}
        />

        <RoomForm
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleRoomSuccess}
          room={selectedRoom}
        />

        <RoomDetail
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          room={selectedRoom}
          onEdit={() => {
            setShowDetailModal(false)
            handleEditRoom(selectedRoom)
          }}
          onDelete={() => {
            setShowDetailModal(false)
            handleDeleteClick(selectedRoom)
          }}
        />

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && selectedRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <HiOutlineXMark className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Delete Room</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Are you sure you want to delete room{' '}
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedRoom.roomNumber}</span>?
                  This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Stats Card Component
const StatsCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        </div>
      </div>
    </div>
  )
}

// Filter Select Component
const FilterSelect = ({ label, value, onChange, options, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
    >
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt} value={opt} className="capitalize">
          {opt.replace('_', ' ')}
        </option>
      ))}
    </select>
  </div>
)

// Empty State Component
const EmptyState = ({ hasFilters, onClearFilters, onAddRoom }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
      <HiOutlineHomeModern className="w-12 h-12 text-slate-400" />
    </div>
    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
      {hasFilters ? 'No matching rooms found' : 'No rooms yet'}
    </h3>
    <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
      {hasFilters
        ? 'Try adjusting your filters or search criteria'
        : 'Get started by adding your first room to the system'}
    </p>
    {hasFilters ? (
      <button
        onClick={onClearFilters}
        className="inline-flex items-center gap-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors font-medium"
      >
        Clear Filters
      </button>
    ) : (
      <button
        onClick={onAddRoom}
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium"
      >
        <HiOutlinePlus className="w-5 h-5" />
        Add First Room
      </button>
    )}
  </div>
)

// Room Table Component
const RoomTable = ({ rooms, onView, onEdit, onDelete }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
            <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Room</th>
            <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Ward</th>
            <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Floor</th>
            <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Type</th>
            <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Status</th>
            <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Occupancy</th>
            <th className="text-right p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {rooms.map(room => (
            <tr key={room._id || room.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">{room.roomNumber}</td>
              <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{room.ward || '—'}</td>
              <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{room.floor || '—'}</td>
              <td className="p-4 text-sm text-slate-600 dark:text-slate-400 capitalize">{room.type}</td>
              <td className="p-4">
                <StatusBadge status={room.status} />
              </td>
              <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                {room.currentOccupancy || 0} / {room.capacity || 1}
              </td>
              <td className="p-4">
                <div className="flex items-center justify-end gap-2">
                  <ActionButton onClick={() => onView(room)} label="View" variant="ghost" />
                  <ActionButton onClick={() => onEdit(room)} label="Edit" variant="ghost" />
                  <ActionButton onClick={() => onDelete(room)} label="Delete" variant="danger" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    available: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    occupied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    maintenance: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    reserved: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
  }

  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || styles.available}`}>
      {status}
    </span>
  )
}

// Action Button Component
const ActionButton = ({ onClick, label, variant }) => {
  const variants = {
    ghost: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700',
    danger: 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20'
  }

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${variants[variant]}`}
    >
      {label}
    </button>
  )
}

export default RoomsPage