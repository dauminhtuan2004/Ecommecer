// src/components/admin/AdminLayout.jsx
import { useState } from 'react';
import AdminHeader from '../admin/Header';
import AdminSidebar from '../../components/layouts/SideBar';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} />

      {/* Main Content */}
      <main
        className={`
          pt-16 transition-all duration-300 min-h-screen
          ${sidebarOpen ? 'ml-0 md:ml-64' : 'ml-0 md:ml-20'}
        `}
      >
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;