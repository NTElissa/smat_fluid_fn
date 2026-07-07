// pages/DashboardPage.js
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  HiOutlineUsers,
  HiOutlineCpuChip,
  HiOutlineBell,
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
import { getDashboardStats, getWeeklyOverview, getPatientStats } from '../services/analyticsService'
import Spinner from '../components/Common/Spinner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

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
    admins: 0,
    completionRate: 0,
    avgResponseTime: '0m',
    bedsAvailable: 0,
    totalBeds: 120,
    staffOnDuty: 0,
  })
  const [monitors, setMonitors] = useState([])
  const [activities, setActivities] = useState([])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { alerts, acknowledge } = useAlerts()

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [dashboardRes, monitorsRes, weeklyRes, patientStatsRes] = await Promise.all([
          getDashboardStats(),
          getMonitors({ status: 'active' }),
          getWeeklyOverview(),
          getPatientStats(),
        ])

        const dashData = dashboardRes?.data || dashboardRes || {}
        const patientStats = patientStatsRes?.data || patientStatsRes || {}

        setStats({
          patients: dashData.patients || 0,
          monitors: dashData.activeMonitors || 0,
          activeAlerts: dashData.activeAlerts || alerts.length || 0,
          completedToday: dashData.completedToday || 0,
          totalUsers: dashData.totalUsers || 0,
          doctors: dashData.doctors || 0,
          nurses: dashData.nurses || 0,
          supportStaff: dashData.supportStaff || 0,
          admins: dashData.admins || 0,
          completionRate: dashData.completionRate || 0,
          avgResponseTime: dashData.avgResponseTime || '0m',
          bedsAvailable: patientStats.bedsAvailable || 0,
          totalBeds: patientStats.totalBeds || 120,
          staffOnDuty: dashData.staffOnDuty || dashData.totalUsers || 0,
        })

        // Handle different response structures for monitors
        let monitorsData = []
        if (monitorsRes?.data?.data) {
          monitorsData = monitorsRes.data.data
        } else if (monitorsRes?.data) {
          monitorsData = Array.isArray(monitorsRes.data) ? monitorsRes.data : []
        } else if (Array.isArray(monitorsRes)) {
          monitorsData = monitorsRes
        }
        setMonitors(monitorsData.slice(0, 4))

        // Handle weekly data
        let weeklyData = []
        if (weeklyRes?.data) {
          weeklyData = Array.isArray(weeklyRes.data) ? weeklyRes.data : []
        } else if (Array.isArray(weeklyRes)) {
          weeklyData = weeklyRes
        }
        setChartData(weeklyData)

        // Handle activities
        setActivities(dashData.activities || [])

      } catch (error) {
        console.error('Failed to load dashboard data:', error)
        setError('Failed to load dashboard data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [alerts.length])

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  const safePercent = (part, total) => total > 0 ? ((part / total) * 100).toFixed(0) : 0

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Smart IV Monitoring System Overview
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <span className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700">
            <HiOutlineClock className="w-4 h-4 text-primary-600" />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
            })}</span>
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Patients" 
          value={stats.patients} 
          icon={HiOutlineUsers} 
          color="primary" 
          subtitle="Registered patients" 
        />
        <StatsCard 
          title="Active Monitors" 
          value={stats.monitors} 
          icon={HiOutlineCpuChip} 
          color="success" 
          subtitle="Currently monitoring" 
        />
        <StatsCard 
          title="Active Alerts" 
          value={stats.activeAlerts} 
          icon={HiOutlineBell} 
          color={stats.activeAlerts > 0 ? 'danger' : 'success'} 
          subtitle="Require attention" 
        />
        <StatsCard 
          title="Total Staff" 
          value={stats.totalUsers} 
          icon={HiOutlineUserGroup} 
          color="info" 
          subtitle="Active team members" 
        />
      </div>

      {/* Staff Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { emoji: '👨‍⚕️', count: stats.doctors, label: 'Doctors', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-400', badge: 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200' },
          { emoji: '👩‍⚕️', count: stats.nurses, label: 'Nurses', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-100 dark:border-green-800', text: 'text-green-700 dark:text-green-400', badge: 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200' },
          { emoji: '🛠️', count: stats.supportStaff, label: 'Support Staff', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-100 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-400', badge: 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200' },
          { emoji: '👔', count: stats.admins, label: 'Administrators', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-100 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-400', badge: 'bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200' },
        ].map((role) => (
          <div key={role.label} className={`${role.bg} rounded-lg p-4 border ${role.border}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{role.emoji}</span>
              <span className={`text-xs ${role.badge} px-2 py-1 rounded-full`}>
                {safePercent(role.count, stats.totalUsers)}%
              </span>
            </div>
            <p className={`text-2xl font-bold ${role.text}`}>{role.count}</p>
            <p className={`text-xs ${role.text}`}>{role.label}</p>
          </div>
        ))}
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <HiOutlineBell className="w-5 h-5 text-red-500" />
              <span>Active Alerts</span>
              <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs px-2 py-1 rounded-full">{alerts.length} new</span>
            </h2>
            <Link to="/alerts" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {alerts.slice(0, 3).map(alert => (
              <AlertCard key={alert._id} alert={alert} onAcknowledge={acknowledge} />
            ))}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Active Monitors */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <HiOutlineCpuChip className="w-5 h-5 text-primary-600" />
                <span>Active IV Monitors</span>
              </h2>
              <Link to="/monitors" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
                View All ({stats.monitors})
              </Link>
            </div>
            {monitors.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                <HiOutlineCpuChip className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No active monitors</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {monitors.map(monitor => (
                  <MonitorCard key={monitor._id} monitor={monitor} />
                ))}
              </div>
            )}
          </div>

          {/* Weekly Overview Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <HiOutlineChartBar className="w-5 h-5 text-primary-600" />
              <span>Weekly Overview</span>
            </h2>
            <div className="h-64 w-full">
              {chartData && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9ca3af"
                      tick={{ fill: '#9ca3af' }}
                    />
                    <YAxis 
                      stroke="#9ca3af"
                      tick={{ fill: '#9ca3af' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="patients" 
                      name="New Patients" 
                      stroke="#0ea5e9" 
                      strokeWidth={2} 
                      dot={{ fill: '#0ea5e9', r: 4 }} 
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="alerts" 
                      name="Alerts" 
                      stroke="#ef4444" 
                      strokeWidth={2} 
                      dot={{ fill: '#ef4444', r: 4 }} 
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                  No data available for the selected period
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <UsersCard />
          <ActivityFeed activities={activities} />
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Task Completion Rate</p>
          <div className="flex items-end space-x-2 mt-1">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completionRate}%</p>
            <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
              <HiOutlineArrowUp className="w-3 h-3" /> Staff efficiency
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg Response Time</p>
          <div className="flex items-end space-x-2 mt-1">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgResponseTime}</p>
            <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
              <HiOutlineArrowDown className="w-3 h-3" /> Task coordination
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Beds Available</p>
          <div className="flex items-end space-x-2 mt-1">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.bedsAvailable}</p>
            <span className="text-xs text-gray-500 dark:text-gray-400">of {stats.totalBeds}</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Completed Today</p>
          <div className="flex items-end space-x-2 mt-1">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedToday}</p>
            <span className="text-xs text-green-600 dark:text-green-400">Sessions & tasks</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage