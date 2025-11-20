import { useState } from "react";
import {
  LayoutDashboard,
  Menu,
  X,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import UserProfileDropdown from './UserProfileDropdown';

function Header({
  toggleSidebar,
  isSidebarOpen,
  collapsed,
  toggleCollapsed,
  currentPage = "Dashboard",
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const PageIcon = LayoutDashboard;

  return (
    <div
      className={`bg-white border-b border-gray-200 shadow-sm px-6 py-4 flex items-center justify-between z-50 fixed top-0 right-0 transition-all duration-300
        ${collapsed ? "left-0 md:left-16" : "left-0 md:left-64"}
      `}
    >
      <div className="flex items-center space-x-">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <button
          onClick={toggleCollapsed}
          className="text-gray-600 p-2 rounded-lg hover:bg-gray-100 hidden md:flex items-center justify-center transition"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        <div className="flex items-center">
          <PageIcon className="w-5 h-5 text-gray-600 mr-2" />
          <h1 className="text-lg font-semibold text-gray-800">{currentPage}</h1>
        </div>
      </div>

      <div className="flex items-center space-x-5">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative transition"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-800">
                  Notifications
                </h3>
              </div>
              <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                <li className="px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer">
                  New user registered
                </li>
                <li className="px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer">
                  Order #1234 has been placed
                </li>
                <li className="px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer">
                  Server reboot scheduled
                </li>
              </ul>
              <div className="px-4 py-2 text-center text-sm text-blue-600 hover:underline cursor-pointer">
                View all
              </div>
            </div>
          )}
        </div>
        <UserProfileDropdown />

      </div>
    </div>
  );
}

export default Header;
