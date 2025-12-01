import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../../../hooks/useAuth';

const MobileMenu = ({ searchOpen, mobileMenuOpen, categories }) => {
  const { user } = useAuth();

  return (
    <>
      {/* Mobile Search */}
      {searchOpen && (
        <div className="lg:hidden p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-full focus:border-blue-500 focus:outline-none"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
              Trang Chủ
            </Link>
            <div className="space-y-1">
              <div className="font-medium text-gray-900 py-2">Danh Mục</div>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
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
    </>
  );
};

export default MobileMenu;
