// src/components/layout/Sidebar/Sidebar.jsx (cập nhật menu items)
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin-dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin-products', label: 'Products', icon: '🛍️' },
    { path: '/admin-orders', label: 'Orders', icon: '📦' },
    { path: '/admin-users', label: 'Users', icon: '👥' },
    { path: '/admin-categories', label: 'Categories', icon: '📂' },
    { path: '/admin-brands', label: 'Brands', icon: '🏷️' },
    { path: '/admin-discounts', label: 'Discounts', icon: '💰' },
  ];

  return (
    <aside className="w-64 bg-white shadow-md border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 ${
              location.pathname === item.path ? 'bg-indigo-100 border-r-2 border-indigo-500' : ''
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;