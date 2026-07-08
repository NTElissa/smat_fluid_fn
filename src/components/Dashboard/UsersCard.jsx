import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  HiOutlineUserGroup,
  HiOutlineChevronRight,
  HiOutlineBuildingOffice, // Correct name - not HiOutlineOfficeBuilding
  HiOutlineBuildingLibrary, // Alternative for hospital/location
  HiOutlineMapPin // For location if needed
} from 'react-icons/hi2'
import { getUsers } from '../../services/userService'

const roleColors = {
  doctor: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: '👨‍⚕️',
    label: 'Doctor'
  },
  nurse: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
    icon: '👩‍⚕️',
    label: 'Nurse'
  },
  support_staff: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: '🛠️',
    label: 'Support Staff'
  },
  admin: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    border: 'border-orange-200',
    icon: '👔',
    label: 'Admin'
  }
}

const UsersCard = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState('all')
  const [stats, setStats] = useState({
    total: 0,
    doctor: 0,
    nurse: 0,
    support_staff: 0,
    admin: 0
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await getUsers()
      const payload = response?.data || response || {}
      const usersData = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : []
      setUsers(usersData)
      
      // Calculate stats
      const newStats = {
        total: usersData.length,
        doctor: usersData.filter(u => u.role === 'doctor').length,
        nurse: usersData.filter(u => u.role === 'nurse').length,
        support_staff: usersData.filter(u => u.role === 'support_staff').length,
        admin: usersData.filter(u => u.role === 'admin').length
      }
      setStats(newStats)
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = selectedRole === 'all' 
    ? users 
    : users.filter(u => u.role === selectedRole)

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return 'U'
    const first = firstName?.charAt(0) || ''
    const last = lastName?.charAt(0) || ''
    return (first + last).toUpperCase() || 'U'
  }

  const getStatusColor = (lastLogin) => {
    if (!lastLogin) return 'bg-gray-400'
    
    const now = new Date()
    const lastLoginDate = new Date(lastLogin)
    const diffHours = (now - lastLoginDate) / (1000 * 60 * 60)
    
    if (diffHours < 1) return 'bg-green-500'
    if (diffHours < 24) return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary-50 rounded-lg">
            <HiOutlineUserGroup className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
            <p className="text-sm text-gray-500">{stats.total} active staff</p>
          </div>
        </div>
        <Link 
          to="/users" 
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
        >
          <span>View All</span>
          <HiOutlineChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Role Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedRole('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedRole === 'all'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setSelectedRole('doctor')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-1 ${
            selectedRole === 'doctor'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          }`}
        >
          <span>👨‍⚕️</span>
          <span>Doctors ({stats.doctor})</span>
        </button>
        <button
          onClick={() => setSelectedRole('nurse')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-1 ${
            selectedRole === 'nurse'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-green-50 text-green-700 hover:bg-green-100'
          }`}
        >
          <span>👩‍⚕️</span>
          <span>Nurses ({stats.nurse})</span>
        </button>
        <button
          onClick={() => setSelectedRole('support_staff')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-1 ${
            selectedRole === 'support_staff'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
          }`}
        >
          <span>🛠️</span>
          <span>Support ({stats.support_staff})</span>
        </button>
        <button
          onClick={() => setSelectedRole('admin')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-1 ${
            selectedRole === 'admin'
              ? 'bg-orange-600 text-white shadow-md'
              : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
          }`}
        >
          <span>👔</span>
          <span>Admins ({stats.admin})</span>
        </button>
      </div>

      {/* Users List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          // Loading skeletons
          [...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">👥</div>
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          filteredUsers.slice(0, 6).map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                {/* Avatar with role color */}
                <div className={`w-10 h-10 ${roleColors[user.role]?.bg || 'bg-gray-200'} rounded-full flex items-center justify-center relative`}>
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.firstName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className={`text-sm font-medium ${roleColors[user.role]?.text || 'text-gray-700'}`}>
                      {getInitials(user.firstName, user.lastName)}
                    </span>
                  )}
                  {/* Online indicator */}
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${getStatusColor(user.lastLogin)} border-2 border-white rounded-full`}></span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${roleColors[user.role]?.bg} ${roleColors[user.role]?.text} flex-shrink-0`}>
                      {roleColors[user.role]?.label || user.role}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                    <span className="flex items-center space-x-1">
                      <HiOutlineBuildingOffice className="w-3 h-3" />
                      <span className="truncate max-w-[100px]">{user.hospital || 'N/A'}</span>
                    </span>
                    {user.department && (
                      <>
                        <span>•</span>
                        <span className="truncate max-w-[80px]">{user.department}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Status badge */}
              <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                {user.isActive ? (
                  <span className="flex items-center space-x-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full whitespace-nowrap">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <span>Active</span>
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                    Offline
                  </span>
                )}
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <HiOutlineChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
        <div className="text-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="text-2xl font-bold text-blue-600">{stats.doctor}</div>
          <div className="text-xs text-gray-500 flex items-center justify-center space-x-1">
            <span>👨‍⚕️</span>
            <span>Doctors</span>
          </div>
        </div>
        <div className="text-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="text-2xl font-bold text-green-600">{stats.nurse}</div>
          <div className="text-xs text-gray-500 flex items-center justify-center space-x-1">
            <span>👩‍⚕️</span>
            <span>Nurses</span>
          </div>
        </div>
        <div className="text-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="text-2xl font-bold text-purple-600">{stats.support_staff}</div>
          <div className="text-xs text-gray-500 flex items-center justify-center space-x-1">
            <span>🛠️</span>
            <span>Support</span>
          </div>
        </div>
        <div className="text-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="text-2xl font-bold text-orange-600">{stats.admin}</div>
          <div className="text-xs text-gray-500 flex items-center justify-center space-x-1">
            <span>👔</span>
            <span>Admins</span>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  )
}

export default UsersCard