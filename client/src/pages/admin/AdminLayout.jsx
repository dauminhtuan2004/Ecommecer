import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import DashboardPage from '../../pages/admin/DashboardPage';
import ProductsPage from '../../pages/admin/ProductManagement';
// import OrdersPage from '../../pages/admin/OrdersPage';
// import CustomersPage from '../../pages/admin/CustomersPage';
// import AnalyticsPage from '../../pages/admin/AnalyticsPage';

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('Dashboard');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Page title mapping
  const getPageTitle = (pathname) => {
    const routes = {
      '/admin': 'Dashboard',
      '/admin/dashboard': 'Dashboard',
      '/admin/products': 'Products',
      '/admin/orders': 'Orders',
      '/admin/customers': 'Customers',
      '/admin/analytics': 'Analytics'
    };
    return routes[pathname] || 'Dashboard';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        collapsed={collapsed}
        toggleSidebar={toggleSidebar}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
        ${collapsed ? 'md:ml-16' : 'md:ml-64'}
      `}>
        <Header
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          collapsed={collapsed}
          toggleCollapsed={toggleCollapsed}
          currentPage={currentPage}
        />
        
        <main className="flex-1 p-6 pt-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;