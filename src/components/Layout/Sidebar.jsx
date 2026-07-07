import { NavLink } from 'react-router-dom'
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineChip,
  HiOutlineBell,
  HiOutlineClipboardList,
  HiOutlineCog,
  HiOutlineQuestionMarkCircle,
  HiOfficeBuilding
} from 'react-icons/hi'

const Sidebar = ({ closeSidebar }) => {
  const navItems = [
    { to: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { to: '/patients', icon: HiOutlineUsers, label: 'Patients' },
    { to: '/rooms', icon: HiOfficeBuilding, label: 'Rooms' },
    { to: '/monitors', icon: HiOutlineChip, label: 'IV Monitors' },
    { to: '/tasks', icon: HiOutlineClipboardList, label: 'Tasks' },
    { to: '/alerts', icon: HiOutlineBell, label: 'Alerts' },
    { to: '/settings', icon: HiOutlineCog, label: 'Settings' },
  ]

  const handleClick = () => {
    if (closeSidebar) closeSidebar()
  }

  return (
    <nav className="h-full py-6 flex flex-col">
      <div className="px-4 space-y-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={handleClick}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="px-4 mt-auto">
        <div className="bg-primary-50 rounded-lg p-4">
          <HiOutlineQuestionMarkCircle className="w-8 h-8 text-primary-600 mb-2" />
          <h4 className="font-medium text-gray-900 mb-1">Need Help?</h4>
          <p className="text-sm text-gray-600 mb-3">
            Contact support for assistance
          </p>
          <button className="text-sm text-primary-600 font-medium hover:text-primary-700">
            Contact Support
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Sidebar