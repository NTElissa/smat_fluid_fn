import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  HiOutlineUsers,
  HiOutlineCpuChip,
  HiOutlineBell,
  HiOutlineCheckCircle,
  HiOutlineUserGroup,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineArrowUp,
  HiOutlineArrowDown
} from 'react-icons/hi2'
import StatsCard from '../components/Dashboard/StatsCard'
import AlertCard from '../components/Dashboard/AlertCard'
import MonitorCard from '../components/Dashboard/MonitorCard'
import ActivityFeed from '../components/Dashboard/ActivityFeed'
import UsersCard from '../components/Dashboard/UsersCard'
import { useAlerts } from '../hooks/useAlerts'
import { getMonitors } from '../services/monitorService'
import { getPatients } from '../services/patientService'
import { getUsers } from '../services/userService'
import Spinner from '../components/Common/Spinner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const DashboardPage = () => {
  const [stats, setStats] = useState({
    patients: 0,
    monitors: 0,
    activeAlerts: 0,
    completedToday: 0,
    totalUsers: 0,
    doctors: 0,
    nurses: 0,
    supportStaff: 0,
    admins: 0
  })
  const [monitors, setMonitors] = useState([])
  const [activities, setActivities] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const { alerts, acknowledge } = useAlerts()

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch data in parallel
        const [patientsRes, monitorsRes, usersRes] = await Promise.all([
          getPatients({ limit: 1 }),
          getMonitors({ status: 'active' }),
          getUsers({ limit: 100 })
        ])

        const users = usersRes.data.data || []
        
        // Calculate user stats
        const doctors = users.filter(u => u.role === 'doctor').length
        const nurses = users.filter(u => u.role === 'nurse').length
        const supportStaff = users.filter(u => u.role === 'support_staff').length
        const admins = users.filter(u => u.role === 'admin').length

        setStats({
          patients: patientsRes.data.count || 0,
          monitors: monitorsRes.data.count || 0,
          activeAlerts: alerts.length,
          completedToday: 5, // This would come from a real API
          totalUsers: users.length,
          doctors,
          nurses,
          supportStaff,
          admins
        })

        setMonitors(monitorsRes.data.data.slice(0, 4))
        setRecentUsers(users.slice(0, 5))

        // Mock chart data - replace with real data
        setChartData([
          { name: 'Mon', patients: 4, alerts: 2 },
          { name: 'Tue', patients: 3, alerts: 1 },
          { name: 'Wed', patients: 5, alerts: 3 },
          { name: 'Thu', patients: 4, alerts: 2 },
          { name: 'Fri', patients: 6, alerts: 4 },
          { name: 'Sat', patients: 3, alerts: 1 },
          { name: 'Sun', patients: 2, alerts: 0 },
        ])

        // Mock activities - replace with real data
        setActivities([
          { 
            type: 'alert', 
            message: 'Low IV level alert for Patient Emmanuel Habimana', 
            timestamp: new Date(),
            user: 'Dr. Jean'
          },
          { 
            type: 'patient', 
            message: 'New patient admitted to Ward A - Alice Mukamana', 
            timestamp: new Date(Date.now() - 3600000),
            user: 'Nurse Marie'
          },
          { 
            type: 'monitor', 
            message: 'IV Monitor #001 completed for Patient Peter', 
            timestamp: new Date(Date.now() - 7200000),
            user: 'Support Kamali'
          },
          { 
            type: 'task', 
            message: 'Bag change completed for Room 101', 
            timestamp: new Date(Date.now() - 10800000),
            user: 'Dr. Jean'
          },
          { 
            type: 'user', 
            message: 'New staff member joined: Dr. Uwase', 
            timestamp: new Date(Date.now() - 14400000),
            user: 'Admin'
          },
        ])

      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [alerts])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header with Welcome Message */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening at CHUK today.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <span className="flex items-center space-x-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
            <HiOutlineClock className="w-4 h-4 text-primary-600" />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Patients"
          value={stats.patients}
          icon={HiOutlineUsers}
          trend={12}
          color="primary"
          subtitle="Active patients"
        />
        <StatsCard
          title="Active Monitors"
          value={stats.monitors}
          icon={HiOutlineCpuChip}
          trend={8}
          color="success"
          subtitle="Currently monitoring"
        />
        <StatsCard
          title="Active Alerts"
          value={stats.activeAlerts}
          icon={HiOutlineBell}
          trend={-5}
          color={stats.activeAlerts > 0 ? 'danger' : 'success'}
          subtitle="Require attention"
        />
        <StatsCard
          title="Total Staff"
          value={stats.totalUsers}
          icon={HiOutlineUserGroup}
          trend={15}
          color="info"
          subtitle="Active team members"
        />
      </div>

      {/* User Role Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">👨‍⚕️</span>
            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
              {((stats.doctors / stats.totalUsers) * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{stats.doctors}</p>
          <p className="text-xs text-blue-600">Doctors</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">👩‍⚕️</span>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
              {((stats.nurses / stats.totalUsers) * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-green-700">{stats.nurses}</p>
          <p className="text-xs text-green-600">Nurses</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🛠️</span>
            <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
              {((stats.supportStaff / stats.totalUsers) * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-purple-700">{stats.supportStaff}</p>
          <p className="text-xs text-purple-600">Support Staff</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">👔</span>
            <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full">
              {((stats.admins / stats.totalUsers) * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-orange-700">{stats.admins}</p>
          <p className="text-xs text-orange-600">Administrators</p>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <HiOutlineBell className="w-5 h-5 text-red-500" />
              <span>Active Alerts</span>
              {alerts.length > 0 && (
                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                  {alerts.length} new
                </span>
              )}
            </h2>
            <Link to="/alerts" className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {alerts.slice(0, 3).map(alert => (
              <AlertCard
                key={alert._id}
                alert={alert}
                onAcknowledge={acknowledge}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Active Monitors */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Monitors */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <HiOutlineCpuChip className="w-5 h-5 text-primary-600" />
                <span>Active IV Monitors</span>
              </h2>
              <Link to="/monitors" className="text-sm text-primary-600 hover:text-primary-700">
                View All ({stats.monitors})
              </Link>
            </div>
            {monitors.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <HiOutlineCpuChip className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No active monitors</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {monitors.map(monitor => (
                  <MonitorCard key={monitor._id} monitor={monitor} />
                ))}
              </div>
            )}
          </div>

          {/* Activity Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <HiOutlineChartBar className="w-5 h-5 text-primary-600" />
              <span>Weekly Overview</span>
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="patients" 
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    dot={{ fill: '#0ea5e9' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="alerts" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ fill: '#ef4444' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Users Card */}
          <UsersCard />
          
          {/* Activity Feed */}
          <ActivityFeed activities={activities} />
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-xl shadow-sm p-6">
        <div>
          <p className="text-sm text-gray-500">Completion Rate</p>
          <div className="flex items-end space-x-2 mt-1">
            <p className="text-2xl font-bold text-gray-900">94%</p>
            <span className="text-xs text-green-600 flex items-center">
              <HiOutlineArrowUp className="w-3 h-3" />
              2.5%
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Avg Response Time</p>
          <div className="flex items-end space-x-2 mt-1">
            <p className="text-2xl font-bold text-gray-900">2.4m</p>
            <span className="text-xs text-green-600 flex items-center">
              <HiOutlineArrowDown className="w-3 h-3" />
              0.3m
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Beds Available</p>
          <div className="flex items-end space-x-2 mt-1">
            <p className="text-2xl font-bold text-gray-900">23</p>
            <span className="text-xs text-gray-500">of 120</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Staff on Duty</p>
          <div className="flex items-end space-x-2 mt-1">
            <p className="text-2xl font-bold text-gray-900">18</p>
            <span className="text-xs text-green-600">Online</span>
          </div>
        </div>
      </div>

      {/* Quick Actions for Mobile */}
      <div className="lg:hidden fixed bottom-20 right-4 flex flex-col space-y-2">
        <button className="bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors">
          <HiOutlineBell className="w-6 h-6" />
        </button>
        <button className="bg-white text-primary-600 p-4 rounded-full shadow-lg hover:bg-gray-50 transition-colors border border-gray-200">
          <HiOutlineUserGroup className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

export default DashboardPage