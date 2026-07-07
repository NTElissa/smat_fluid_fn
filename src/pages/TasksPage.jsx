import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getTasks, acceptTask, startTask, completeTask, cancelTask } from '../services/taskService'
import Spinner from '../components/Common/Spinner'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import {
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineLocationMarker,
} from 'react-icons/hi'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-600',
}

const priorityColors = {
  low: 'border-l-gray-400',
  medium: 'border-l-yellow-400',
  high: 'border-l-orange-500',
  critical: 'border-l-red-600',
}

const TasksPage = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const response = await getTasks()
      setTasks(response.data.data || [])
    } catch {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (taskId, action) => {
    try {
      setActionLoading(taskId)
      switch (action) {
        case 'accept':
          await acceptTask(taskId)
          toast.success('Task accepted')
          break
        case 'start':
          await startTask(taskId)
          toast.success('Task started')
          break
        case 'complete':
          await completeTask(taskId, 'Bag change completed successfully')
          toast.success('Task completed — IV bag refreshed')
          break
        case 'cancel':
          await cancelTask(taskId)
          toast.success('Task cancelled')
          break
      }
      await loadTasks()
    } catch {
      toast.error('Action failed')
    } finally {
      setActionLoading(null)
    }
  }

  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(t => t.status === filter)

  const stats = {
    pending: tasks.filter(t => t.status === 'pending').length,
    active: tasks.filter(t => ['accepted', 'in_progress'].includes(t.status)).length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }

  const isSupportStaff = user?.role === 'support_staff'
  const canManage = ['nurse', 'doctor', 'admin'].includes(user?.role)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <HiOutlineClipboardList className="w-8 h-8 text-primary-600" />
            Task Delegation
          </h1>
          <p className="text-gray-600 mt-1">
            Coordinate IV bag changes and support tasks at  Hospital
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-yellow-700">{stats.pending}</p>
          <p className="text-sm text-yellow-600 mt-1">Pending</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-700">{stats.active}</p>
          <p className="text-sm text-blue-600 mt-1">In Progress</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-700">{stats.completed}</p>
          <p className="text-sm text-green-600 mt-1">Completed</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'accepted', 'in_progress', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {f === 'all' ? 'All Tasks' : f.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Task list */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <HiOutlineClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
          <p className="text-gray-500 text-sm">
            {isSupportStaff
              ? 'No pending tasks — check back when nurses request bag changes'
              : 'Request a bag change from the IV Monitors page when fluid levels are low'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`bg-white rounded-xl shadow-sm border-l-4 ${priorityColors[task.priority] || 'border-l-gray-300'} p-5 hover:shadow-md transition-shadow`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{task.taskType?.replace('_', ' ')}</span>
                    {task.priority === 'critical' && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">URGENT</span>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-900 text-lg">
                    {task.patientId?.firstName} {task.patientId?.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{task.reason}</p>

                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <HiOutlineUser className="w-4 h-4" />
                      Requested by {task.requestedBy?.firstName} {task.requestedBy?.lastName}
                    </span>
                    {task.location?.room && (
                      <span className="flex items-center gap-1">
                        <HiOutlineLocationMarker className="w-4 h-4" />
                        Room {task.location.room}{task.location.bed}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <HiOutlineClock className="w-4 h-4" />
                      {format(new Date(task.createdAt), 'MMM d, HH:mm')}
                    </span>
                    {task.monitorId && (
                      <span className="text-primary-600">
                        Level: {task.monitorId.currentLevel}%
                      </span>
                    )}
                  </div>

                  {task.assignedTo && (
                    <p className="text-sm text-blue-600 mt-2">
                      Assigned to: {task.assignedTo.firstName} {task.assignedTo.lastName}
                    </p>
                  )}
                  {task.responseTimeMinutes && (
                    <p className="text-xs text-green-600 mt-1">
                      Response time: {task.responseTimeMinutes} min
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 sm:flex-col sm:min-w-[140px]">
                  {isSupportStaff && task.status === 'pending' && (
                    <button
                      onClick={() => handleAction(task._id, 'accept')}
                      disabled={actionLoading === task._id}
                      className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
                    >
                      Accept Task
                    </button>
                  )}
                  {isSupportStaff && task.status === 'accepted' && (
                    <button
                      onClick={() => handleAction(task._id, 'start')}
                      disabled={actionLoading === task._id}
                      className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
                    >
                      Start Task
                    </button>
                  )}
                  {(isSupportStaff || canManage) && ['accepted', 'in_progress'].includes(task.status) && (
                    <button
                      onClick={() => handleAction(task._id, 'complete')}
                      disabled={actionLoading === task._id}
                      className="flex items-center justify-center gap-1 bg-green-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <HiOutlineCheckCircle className="w-4 h-4" />
                      Complete
                    </button>
                  )}
                  {canManage && task.status === 'pending' && (
                    <button
                      onClick={() => handleAction(task._id, 'cancel')}
                      disabled={actionLoading === task._id}
                      className="text-sm py-2 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TasksPage
