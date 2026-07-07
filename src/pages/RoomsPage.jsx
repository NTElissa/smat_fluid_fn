// pages/RoomsPage.js
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
import RoomCard from '../components/Rooms/RoomCard'
import RoomForm from '../components/Rooms/RoomForm'
import { getRooms, deleteRoom } from '../services/roomService'
import Spinner from '../components/Common/Spinner'
import Modal from '../components/Common/Modal'
import Button from '../components/Common/Button'
import toast from 'react-hot-toast'

const RoomsPage = () => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [filteredRooms, setFilteredRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [selectedRoom, setSelectedRoom] = useState(null)

  const [filters, setFilters] = useState({
    ward: 'all',
    status: 'all',
    type: 'all'
  })

  // Get unique values for filters
  const wards = ['all', ...new Set(rooms.map(r => r.ward).filter(Boolean))]
  const statuses = ['all', 'available', 'occupied', 'maintenance', 'reserved']
  const types = ['all', 'general', 'icu', 'maternity', 'pediatric', 'surgery']

  useEffect(() => {
    loadRooms()
  }, [])

  useEffect(() => {
    filterRooms()
  }, [searchTerm, filters, rooms])

  const loadRooms = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await getRooms()
      
      // Handle different response structures
      let roomData = []
      if (Array.isArray(response)) {
        roomData = response
      } else if (response?.data && Array.isArray(response.data)) {
        roomData = response.data
      } else if (response?.rooms && Array.isArray(response.rooms)) {
        roomData = response.rooms
      } else {
        roomData = []
      }
      
      setRooms(roomData)
      setFilteredRooms(roomData)
    } catch (err) {
      setError(err.message || 'Failed to load rooms')
      toast.error('Failed to load rooms')
      setRooms([])
      setFilteredRooms([])
    } finally {
      setLoading(false)
    }
  }

  const filterRooms = () => {
    let filtered = rooms
    if (searchTerm) {
      filtered = filtered.filter(room =>
        room.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.ward?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.floor?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (filters.ward !== 'all') {
      filtered = filtered.filter(room => room.ward === filters.ward)
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter(room => room.status === filters.status)
    }
    if (filters.type !== 'all') {
      filtered = filtered.filter(room => room.type === filters.type)
    }
    setFilteredRooms(filtered)
  }

  const openAddRoom = () => {
    setSelectedRoom(null)
    setShowAddModal(true)
  }

  const openEditRoom = (room) => {
    setSelectedRoom(room)
    setShowEditModal(true)
  }

  const openDetailRoom = (room) => {
    setSelectedRoom(room)
    setShowDetailModal(true)
  }

  const openDeleteRoom = (room) => {
    setSelectedRoom(room)
    setShowDeleteModal(true)
  }

  const handleRoomSuccess = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setShowDetailModal(false)
    setSelectedRoom(null)
    loadRooms()
  }

  const handleDeleteRoom = async (id) => {
    try {
      await deleteRoom(id)
      toast.success('Room deleted successfully')
      setShowDeleteModal(false)
      setShowDetailModal(false)
      setSelectedRoom(null)
      loadRooms()
    } catch (error) {
      toast.error(error?.message || 'Failed to delete room')
    }
  }

  const clearFilters = () => {
    setFilters({
      ward: 'all',
      status: 'all',
      type: 'all'
    })
    setSearchTerm('')
  }

  // Stats for the header
  const stats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading rooms...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadRooms} variant="primary">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-gray-50/40 pb-20 dark:bg-slate-950/60 lg:pb-6">
      {/* Header with Stats */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white shadow-xl shadow-indigo-900/20 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Rooms</h1>
            <p className="text-indigo-100/90 mt-1.5 text-lg">Room management and occupancy tracking</p>
          </div>
          <Button
            variant="white"
            size="lg"
            onClick={openAddRoom}
            className="shadow-lg shadow-indigo-950/30 hover:shadow-indigo-950/40 transition-shadow"
          >
            <HiOutlinePlus className="w-5 h-5" />
            <span>Add Room</span>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-indigo-100/80 text-sm font-medium">Total</p>
            <p className="text-3xl font-bold mt-1">{stats.total}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-indigo-100/80 text-sm font-medium">Available</p>
            <p className="text-3xl font-bold mt-1 text-green-300">{stats.available}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-indigo-100/80 text-sm font-medium">Occupied</p>
            <p className="text-3xl font-bold mt-1 text-blue-300">{stats.occupied}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-indigo-100/80 text-sm font-medium">Maintenance</p>
            <p className="text-3xl font-bold mt-1 text-yellow-300">{stats.maintenance}</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="rounded-2xl border border-gray-200/70 bg-white p-5 shadow dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
          {/* Search */}
          <div className="flex-1 relative">
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by room number, ward..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`min-w-[140px] px-5 py-3.5 border rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${
              showFilters
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm'
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
                viewMode === 'grid' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'
              }`}
              title="Grid view"
            >
              <HiOutlineViewColumns className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-3 border-l border-gray-200 transition-colors ${
                viewMode === 'list' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'
              }`}
              title="List view"
            >
              <HiOutlineBars3 className="w-5 h-5" />
            </button>
          </div>

          {/* Refresh */}
          <button
            onClick={loadRooms}
            className="p-3.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors group"
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
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-300 bg-white text-gray-800"
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
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-300 bg-white text-gray-800"
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>
                      {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-300 bg-white text-gray-800"
                >
                  {types.map(t => (
                    <option key={t} value={t}>
                      {t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}
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
            {(filters.ward !== 'all' || filters.status !== 'all' || filters.type !== 'all' || searchTerm) && (
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <span className="text-gray-500 self-center">Active:</span>
                {filters.ward !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
                    Ward: {filters.ward}
                    <button onClick={() => setFilters({ ...filters, ward: 'all' })}>
                      <HiOutlineXMark className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {filters.status !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
                    Status: {filters.status}
                    <button onClick={() => setFilters({ ...filters, status: 'all' })}>
                      <HiOutlineXMark className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {filters.type !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
                    Type: {filters.type}
                    <button onClick={() => setFilters({ ...filters, type: 'all' })}>
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
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-slate-400">
        <p>
          Showing <span className="font-semibold text-gray-900">{filteredRooms.length}</span> of{' '}
          <span className="font-semibold text-gray-900">{rooms.length}</span> rooms
        </p>
        {(searchTerm || filters.ward !== 'all' || filters.status !== 'all' || filters.type !== 'all') && (
          <button
            onClick={clearFilters}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Rooms content */}
      {filteredRooms.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="text-7xl mb-5 opacity-70">🏠</div>
          <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-slate-100">No rooms found</h3>
          <p className="mx-auto max-w-md text-gray-600 dark:text-slate-400">
            {searchTerm || filters.ward !== 'all' || filters.status !== 'all' || filters.type !== 'all'
              ? 'Try adjusting your filters or search term'
              : 'Start by adding your first room'}
          </p>
    
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredRooms.map(room => (
            <RoomCard
              key={room._id || room.id}
              room={room}
              onUpdate={loadRooms}
              onDelete={handleDeleteRoom}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow dark:border-slate-700 dark:bg-slate-900">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/70">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Room</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ward</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Floor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Occupancy</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRooms.map(room => (
                <tr key={room._id || room.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Room {room.roomNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{room.ward || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{room.floor || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">{room.type || 'General'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                      room.status === 'available' ? 'bg-green-100 text-green-800 border border-green-200' :
                      room.status === 'occupied' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      room.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                      room.status === 'reserved' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                      'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {room.status ? room.status.charAt(0).toUpperCase() + room.status.slice(1) : 'Available'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {room.currentOccupancy || 0} / {room.capacity || 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => openDetailRoom(room)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditRoom(room)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteRoom(room)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Room Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Room"
        size="lg"
      >
        <RoomForm
          onSuccess={handleRoomSuccess}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Room Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Room"
        size="lg"
      >
        <RoomForm
          room={selectedRoom}
          onSuccess={handleRoomSuccess}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      {/* Room Details Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Room Details"
        size="lg"
      >
        {selectedRoom && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Room Number</label>
                <p className="mt-1 text-lg font-medium text-gray-900">{selectedRoom.roomNumber}</p>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Ward</label>
                <p className="mt-1 text-lg font-medium text-gray-900">{selectedRoom.ward}</p>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Floor</label>
                <p className="mt-1 text-lg font-medium text-gray-900">{selectedRoom.floor || '—'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Status</label>
                <p className="mt-1 text-lg font-medium text-gray-900 capitalize">{selectedRoom.status || 'available'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Capacity</label>
                <p className="mt-1 text-lg font-medium text-gray-900">{selectedRoom.capacity || 1}</p>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Current Occupancy</label>
                <p className="mt-1 text-lg font-medium text-gray-900">{selectedRoom.currentOccupancy || 0}</p>
              </div>
            </div>

            {selectedRoom.amenities?.length > 0 && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Amenities</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedRoom.amenities.map((amenity, index) => (
                    <span key={index} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedRoom.notes && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Notes</label>
                <p className="mt-1 text-gray-700">{selectedRoom.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Room"
        size="sm"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <HiOutlineXMark className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Delete Room?</h3>
          <p className="mb-6 text-sm text-gray-500">
            Are you sure you want to delete <span className="font-medium text-gray-700">Room {selectedRoom?.roomNumber || ''}</span>? This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-3">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDeleteRoom(selectedRoom?._id)}
            >
              Delete Room
            </Button>
          </div>
        </div>
      </Modal>

      {/* Mobile FAB */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={openAddRoom}
          className="bg-indigo-600 text-white p-5 rounded-full shadow-2xl hover:bg-indigo-700 transition-all active:scale-95"
        >
          <HiOutlinePlus className="w-7 h-7" />
        </button>
      </div>
    </div>
  )
}

export default RoomsPage