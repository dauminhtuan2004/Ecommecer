// src/components/layout/Header/Header.jsx
import { Link } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, LogOut } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">E-Commerce</span>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>

          {/* Right menu */}
          <div className="flex items-center space-x-6">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative hover:text-blue-600 transition-colors"
            >
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
                >
                  <User size={24} />
                  <span className="hidden md:inline">{user?.name}</span>
                </button>

                {/* Dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
                    <Link
                      to="/account/profile"
                      className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Tài khoản
                    </Link>
                    <Link
                      to="/account/orders"
                      className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Đơn hàng
                    </Link>
                    {user?.role === "ADMIN" && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Quản trị
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center space-x-2 text-red-600"
                    >
                      <LogOut size={18} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
              >
                <User size={24} />
                <span className="hidden md:inline">Đăng nhập</span>
              </Link>
            )}

            {/* Mobile menu */}
            <button className="md:hidden">
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8 py-3 border-t">
          <Link
            to="/shop"
            className="hover:text-blue-600 transition-colors font-medium"
          >
            Tất cả sản phẩm
          </Link>
          <Link
            to="/shop?category=laptops"
            className="hover:text-blue-600 transition-colors"
          >
            Laptop
          </Link>
          <Link
            to="/shop?category=phones"
            className="hover:text-blue-600 transition-colors"
          >
            Điện thoại
          </Link>
          <Link
            to="/shop?category=accessories"
            className="hover:text-blue-600 transition-colors"
          >
            Phụ kiện
          </Link>
          <Link
            to="/shop?sale=true"
            className="hover:text-blue-600 transition-colors text-red-500"
          >
            Khuyến mãi
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
