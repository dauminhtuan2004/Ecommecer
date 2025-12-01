import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser, FaHeart, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../common/Button';
import Input from '../../common/Input';

const HeaderMain = ({ scrolled, searchOpen, setSearchOpen, mobileMenuOpen, setMobileMenuOpen }) => {
  const { user, logout } = useAuth();

  return (
    <div className="transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-30 h-30 object-contain"
            />
            <span className={`text-2xl font-bold transition-colors duration-300 ${
              scrolled ? 'text-gray-900' : 'text-white'
            }`}>
              MINH TUAN STORE
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-full focus:outline-none transition-all duration-300 ${
                  scrolled 
                    ? 'border-gray-300 bg-white focus:border-gray-900' 
                    : 'border-white/30 bg-white/20 text-white placeholder:text-white/70 focus:border-white'
                }`}
              />
              <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                scrolled ? 'text-gray-400' : 'text-white/70'
              }`} size={20} />
              <Button
                variant={scrolled ? 'dark' : 'primary'}
                className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full ${
                  scrolled 
                    ? 'bg-gray-900 text-white hover:bg-gray-800' 
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
              >
                Tìm
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search Mobile */}
            <button 
              className={`lg:hidden transition-colors duration-300 ${
                scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'
              }`}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <FaSearch size={24} />
            </button>

            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className={`hidden sm:flex relative transition-colors duration-300 ${
                scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'
              }`}
            >
              <FaHeart size={24} />
              <span className={`absolute -top-2 -right-2 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center transition-colors duration-300 ${
                scrolled ? 'bg-gray-900' : 'bg-white/30 backdrop-blur-sm'
              }`}>
                3
              </span>
            </Link>

            {/* Cart */}
            <Link 
              to="/cart" 
              className={`relative transition-colors duration-300 ${
                scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'
              }`}
            >
              <FaShoppingCart size={24} />
              <span className={`absolute -top-2 -right-2 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center transition-colors duration-300 ${
                scrolled ? 'bg-gray-900' : 'bg-white/30 backdrop-blur-sm'
              }`}>
                5
              </span>
            </Link>

            {/* User */}
            {user ? (
              <div className="relative group">
                <button className={`flex items-center gap-2 transition-colors duration-300 ${
                  scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'
                }`}>
                  <FaUser size={24} />
                  <span className="hidden md:inline font-medium">{user.name}</span>
                  <FaChevronDown size={16} />
                </button>
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-50">
                    Tài khoản
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-50">
                    Đơn hàng
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className="block px-4 py-2 hover:bg-gray-50">
                      Quản trị
                    </Link>
                  )}
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <Button
                  variant={scrolled ? 'dark' : 'primary'}
                  icon={FaUser}
                  className={`hidden sm:flex rounded-full ${
                    scrolled 
                      ? 'bg-gray-900 text-white hover:bg-gray-800' 
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Đăng nhập
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <button 
              className={`lg:hidden transition-colors duration-300 ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderMain;
