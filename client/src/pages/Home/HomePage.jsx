// src/pages/Home/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // ✅ Đảm bảo import đúng path

const HomePage = () => {
  const { logout, user } = useAuth(); // ✅ Sử dụng 'logout' thay vì 'handleLogout'

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Chào mừng đến E-commerce!</h1>
        <div className="text-center space-y-4">
          {user ? (
            <div>
              <p>Xin chào, {user.name || user.email}! (Role: {user.role})</p>
              <button 
                onClick={logout} // ✅ Sử dụng logout
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
              <Link to="/account" className="ml-4 text-indigo-600 hover:underline">Đi Account</Link>
            </div>
          ) : (
            <div>
              <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mr-4">
                Đăng nhập
              </Link>
              <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Đăng ký
              </Link>
            </div>
          )}
          <Link to="/shop" className="text-indigo-600 hover:underline">Xem Shop</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;