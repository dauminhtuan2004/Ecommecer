// src/components/layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
// import Header from './Header/Header';
import Sidebar from './SideBar';  // Fix casing: Sidebar (không SideBar)
// import Footer from './Footer/Footer';

const Layout = ({ children, showSidebar = false }) => {
  const { user } = useAuth();  // Bây giờ OK vì wrap Provider
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* <Header /> */}
      <div className="flex flex-1">
        {showSidebar && isAdmin && <Sidebar />}
        <main className={`flex-1 ${showSidebar ? 'p-6' : 'p-4'}`}>
          {children || <Outlet />}
        </main>
      </div>
      {/* {!isAdmin && <Footer />} */}
    </div>
  );
};

export default Layout;