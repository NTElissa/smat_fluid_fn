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

const MobileNav = () => {
  const navItems = [
    { to: '/dashboard', icon: HiOutlineHome, label: 'Home' },
    { to: '/patients', icon: HiOutlineUsers, label: 'Patients' },
    { to: '/rooms', icon: HiOfficeBuilding, label: 'Rooms' },
    { to: '/monitors', icon: HiOutlineChip, label: 'Monitors' },
    { to: '/tasks', icon: HiOutlineClipboardList, label: 'Tasks' },
    { to: '/alerts', icon: HiOutlineBell, label: 'Alerts' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default MobileNav