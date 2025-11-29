import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Heart, 
  Menu, 
  X,
  ChevronDown,
  Phone,
  Mail
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import categoryService from '../../services/categoryService';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span>Hotline: 1900-xxxx</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Mail size={14} />
                <span>support@shop.com</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline">🔥 Miễn phí vận chuyển cho đơn hàng trên 500K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">SHOP</span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-full focus:border-blue-500 focus:outline-none transition-colors"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium">
                  Tìm
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Search Mobile */}
              <button 
                className="lg:hidden text-gray-700 hover:text-blue-600"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search size={24} />
              </button>

              {/* Wishlist */}
              <Link 
                to="/wishlist" 
                className="hidden sm:flex relative text-gray-700 hover:text-red-500 transition-colors"
              >
                <Heart size={24} />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Link>

              {/* Cart */}
              <Link 
                to="/cart" 
                className="relative text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  5
                </span>
              </Link>

              {/* User */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                    <User size={24} />
                    <span className="hidden md:inline font-medium">{user.name}</span>
                    <ChevronDown size={16} />
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
                <Link 
                  to="/login" 
                  className="hidden sm:flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium"
                >
                  <User size={18} />
                  Đăng nhập
                </Link>
              )}

              {/* Mobile Menu */}
              <button 
                className="lg:hidden text-gray-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="hidden lg:block bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center justify-center gap-8 h-14">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Trang Chủ
            </Link>
            
            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setCategoryDropdown(true)}
              onMouseLeave={() => setCategoryDropdown(false)}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Danh Mục
                <ChevronDown size={16} />
              </button>
              {categoryDropdown && (
                <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-lg shadow-xl py-2">
                  {categories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/products?category=${cat.slug}`}
                      className={`block px-4 py-2 hover:bg-gray-50 ${
                        cat.highlight ? 'text-red-500 font-bold' : 'text-gray-700'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Sản Phẩm
            </Link>
            <Link to="/products?filter=new" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Hàng Mới
            </Link>
            <Link to="/products?filter=sale" className="text-red-500 hover:text-red-600 font-bold transition-colors">
              🔥 Sale
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Blog
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Liên Hệ
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Search */}
      {searchOpen && (
        <div className="lg:hidden border-t border-gray-200 p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-full focus:border-blue-500 focus:outline-none"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
              Trang Chủ
            </Link>
            <div className="space-y-1">
              <div className="font-medium text-gray-900 py-2">Danh Mục</div>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className={`block py-2 pl-4 ${
                    cat.highlight ? 'text-red-500 font-bold' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <Link to="/products" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
              Sản Phẩm
            </Link>
            <Link to="/products?filter=new" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
              Hàng Mới
            </Link>
            <Link to="/products?filter=sale" className="block py-2 text-red-500 hover:text-red-600 font-bold">
              🔥 Sale
            </Link>
            <Link to="/blog" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
              Blog
            </Link>
            <Link to="/contact" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
              Liên Hệ
            </Link>
            {!user && (
              <Link to="/login" className="block py-2 text-blue-600 font-bold">
                Đăng nhập
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
