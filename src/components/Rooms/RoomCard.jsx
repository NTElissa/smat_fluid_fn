// components/Rooms/RoomCard.jsx
import {
  HiOutlineUserGroup,
  HiOutlineMapPin,
  HiOutlineBuildingOffice2,
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineTrash
} from 'react-icons/hi2'

const statusColors = {
  available: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    dot: 'bg-green-500',
    text: 'text-green-700 dark:text-green-400'
  },
  occupied: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
    text: 'text-blue-700 dark:text-blue-400'
  },
  maintenance: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    dot: 'bg-yellow-500',
    text: 'text-yellow-700 dark:text-yellow-400'
  },
  reserved: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    dot: 'bg-purple-500',
    text: 'text-purple-700 dark:text-purple-400'
  }
}

const RoomCard = ({ room, onView, onEdit, onDelete }) => {
  const statusStyle = statusColors[room.status] || statusColors.available
  const occupancyPercentage = room.capacity ? (room.currentOccupancy / room.capacity) * 100 : 0

  return (
    <div className={`${statusStyle.bg} ${statusStyle.border} border-2 rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1`}>
      {/* Status Bar */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${statusStyle.dot} animate-pulse`}></div>
          <span className={`text-sm font-medium capitalize ${statusStyle.text}`}>
            {room.status}
          </span>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
          {room.type}
        </span>
      </div>

      {/* Room Info */}
      <div className="px-5 py-3">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
          Room {room.roomNumber}
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <HiOutlineBuildingOffice2 className="w-4 h-4" />
            <span>{room.ward}</span>
          </div>
          {room.floor && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <HiOutlineMapPin className="w-4 h-4" />
              <span>{room.floor}</span>
            </div>
          )}
        </div>

        {/* Occupancy Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <HiOutlineUserGroup className="w-4 h-4" />
              <span>Occupancy</span>
            </div>
            <span className="font-medium text-slate-900 dark:text-white">
              {room.currentOccupancy || 0}/{room.capacity || 1}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                occupancyPercentage >= 100 ? 'bg-red-500' :
                occupancyPercentage >= 75 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-3 bg-white/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <button
          onClick={() => onView(room)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
        >
          <HiOutlineEye className="w-4 h-4" />
          View
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(room)}
            className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <HiOutlinePencilSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(room)}
            className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <HiOutlineTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoomCard