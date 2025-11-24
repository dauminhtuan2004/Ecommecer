// src/pages/Home/HomePage.jsx
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Shield, Headphones } from 'lucide-react';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">
              Mua sắm thông minh, giá tốt nhất
            </h1>
            <p className="text-xl mb-8">
              Hàng ngàn sản phẩm công nghệ chính hãng với giá ưu đãi. 
              Giao hàng nhanh toàn quốc.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Mua sắm ngay
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                <Truck size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Giao hàng nhanh</h3>
              <p className="text-gray-600">Giao hàng trong 24h tại TP.HCM</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                <Shield size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Hàng chính hãng</h3>
              <p className="text-gray-600">100% sản phẩm chính hãng</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                <Headphones size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Hỗ trợ 24/7</h3>
              <p className="text-gray-600">Tư vấn nhiệt tình, chuyên nghiệp</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                <ShoppingBag size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Đổi trả dễ dàng</h3>
              <p className="text-gray-600">Đổi trả trong 7 ngày</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Sản phẩm nổi bật</h2>
            <Link to="/shop" className="text-blue-600 hover:text-blue-700 font-medium">
              Xem tất cả →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Placeholder product cards */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  <ShoppingBag size={48} className="text-gray-400" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Tên sản phẩm {item}</h3>
                  <p className="text-gray-600 text-sm mb-3">Mô tả ngắn gọn về sản phẩm</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">15.990.000₫</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Mua ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Danh mục sản phẩm</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Laptop', 'Điện thoại', 'Tablet', 'Phụ kiện'].map((category) => (
              <Link
                key={category}
                to={`/shop?category=${category.toLowerCase()}`}
                className="bg-gray-100 rounded-lg p-8 text-center hover:bg-gray-200 transition-colors"
              >
                <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <ShoppingBag size={40} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;