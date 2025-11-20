import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LayoutDashboard, ShoppingCart, Package, Users, ClipboardList, Percent, BarChart } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import MenuItem from './MenuItems';

function Sidebar({ isSidebarOpen, collapsed, toggleCollapsed, toggleSidebar }) {
  const [activeItem, setActiveItem] = useState('/admin/dashboard');
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    let foundActive = '';
    let foundOpenSubmenu = null;

    menuItems.forEach(item => {
      if (item.path && currentPath.startsWith(item.path)) {
        foundActive = item.path;
      }
      if (item.children) {
        item.children.forEach(child => {
          if (child.path && currentPath.startsWith(child.path)) {
            foundActive = item.path; 
            foundOpenSubmenu = item.key;
          }
        });
      }
    });

    setActiveItem(foundActive || '/admin/dashboard');
    setOpenSubmenu(foundOpenSubmenu);
  }, [location.pathname]);

  const toggleSubmenu = (key) => {
    setOpenSubmenu(openSubmenu === key ? null : key);
  };

  const menuItems = [
    {
      key: '0',
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      key: '1',
      label: 'Quản lý sản phẩm',
      path: '/admin/products', 
      icon: Package,
      children: [
        { key: '1-1', label: 'Sản phẩm', path: '/admin/products' },
        { key: '1-2', label: 'Danh mục', path: '/admin/categories' },
        { key: '1-3', label: 'Thương hiệu', path: '/admin/brands' },
      ],
    },
    { key: '2', label: 'Quản lý người dùng', path: '/admin/users', icon: Users },
    { key: '3', label: 'Quản lý đơn hàng', path: '/admin/orders', icon: ClipboardList },
    { key: '4', label: 'Quản lý khuyến mãi', path: '/admin/discounts', icon: Percent },
    { key: '5', label: 'Báo cáo & Thống kê', path: '/admin/analytics', icon: BarChart },
  ];

  return (
    <>
      <div
        className={`bg-white text-gray-800 border-r border-gray-200 transition-all duration-300 fixed top-0 left-0 bottom-0 z-40 flex flex-col 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'w-16' : 'w-64'}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center p-6 border-b border-gray-200">
          {collapsed ? (
            <img src="../public/vite.svg" alt="Logo" className="w-8 h-8" />
          ) : (
            <div className="flex items-center space-x-2">
              <img src="../public/vite.svg" alt="Logo" className="w-8 h-8" />
              <span className="text-lg font-bold">Admin Panel</span>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="mt-4 flex-grow overflow-y-auto">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => {
              const isActive = activeItem === item.path;
              const isOpen = openSubmenu === item.key;
              return (
                <MenuItem
                  key={item.key}
                  item={item}
                  isActive={isActive}
                  collapsed={collapsed}
                  toggleSubmenu={toggleSubmenu}
                  isOpen={isOpen}
                />
              );
            })}
          </ul>
        </nav>
      </div>
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-black opacity-50 z-30 md:hidden"
        />
      )}
    </>
  );
}

export default Sidebar;
