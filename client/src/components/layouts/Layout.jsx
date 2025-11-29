import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from './SideBar';

const Layout = ({ children, showSidebar = false }) => {
  const { user } = useAuth(); 
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1">
        {showSidebar && isAdmin && <Sidebar />}
        <main className={`flex-1 ${showSidebar ? 'p-6' : 'p-4'}`}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;