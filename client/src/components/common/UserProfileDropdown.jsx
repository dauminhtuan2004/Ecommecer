import React, { useState, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

function UserProfileDropdown() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition"
      >
        <img
          src="https://i.pravatar.cc/40?u=admin"
          alt="avatar"
          className="w-8 h-8 rounded-full border"
        />
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {showUserMenu && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
          <button
            onClick={() => {
              setShowUserMenu(false);
              setShowProfilePopup(true);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Profile
          </button>
          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            Settings
          </button>
          <hr className="my-1" />
          <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
            Sign out
          </button>
        </div>
      )}

      {showProfilePopup && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between">
            <h4 className="text-md font-semibold text-white">User Profile</h4>
            <button
              onClick={() => setShowProfilePopup(false)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Avatar + Info */}
          <div className="p-5 flex flex-col items-center text-center">
            <img
              src="https://i.pravatar.cc/80?u=admin"
              alt="avatar"
              className="w-16 h-16 rounded-full border-2 border-blue-500 mb-3"
            />
            <h3 className="text-lg font-semibold text-gray-800">{user?.name || 'Guest User'}</h3>
            <p className="text-sm text-gray-500">{user?.email || 'guest@example.com'}</p>
            <span className="mt-2 inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              {user?.role || 'GUEST'}
            </span>
          </div>

          {/* Info Details */}
          <div className="px-5 pb-5 space-y-2 text-sm text-gray-700">
            <div className="flex items-center space-x-2">
              <span className="font-medium">📛 Name:</span>
              <span>{user?.name || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">📧 Email:</span>
              <span>{user?.email || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">🎯 Role:</span>
              <span>{user?.role || 'N/A'}</span>
            </div>
          </div>

          <div className="px-5 pb-5">
            <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2">
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfileDropdown;