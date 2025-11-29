import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import Button from '../../common/Button';

const FeaturedProducts = ({ products = [] }) => {
  const defaultProducts = [
    {
      id: 1,
      name: 'Áo Thun Premium Cotton',
      price: 299000,
      originalPrice: 499000,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      rating: 4.8,
      reviews: 156,
      badge: 'Best Seller'
    },
    {
      id: 2,
      name: 'Quần Jean Slim Fit',
      price: 599000,
      originalPrice: 899000,
      image: 'https://images.unsplash.com/photo-1542272454315-7f6d5ff541df',
      rating: 4.6,
      reviews: 89,
      badge: 'Sale 33%'
    },
    {
      id: 3,
      name: 'Giày Sneaker Sport',
      price: 1299000,
      originalPrice: 1799000,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      rating: 4.9,
      reviews: 234,
      badge: 'Hot'
    },
    {
      id: 4,
      name: 'Túi Xách Da Cao Cấp',
      price: 899000,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7',
      rating: 4.7,
      reviews: 67,
      badge: 'New'
    },
    {
      id: 5,
      name: 'Áo Khoác Bomber',
      price: 799000,
      originalPrice: 1200000,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
      rating: 4.5,
      reviews: 123,
      badge: 'Sale 33%'
    },
    {
      id: 6,
      name: 'Đồng Hồ Thời Trang',
      price: 1599000,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      rating: 4.8,
      reviews: 178,
      badge: 'Trending'
    },
    {
      id: 7,
      name: 'Áo Sơ Mi Oxford',
      price: 449000,
      originalPrice: 699000,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
      rating: 4.6,
      reviews: 95,
      badge: 'Sale 36%'
    },
    {
      id: 8,
      name: 'Kính Mát Thời Trang',
      price: 399000,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f',
      rating: 4.7,
      reviews: 145,
      badge: 'Hot'
    }
  ];

  // Map products từ API
  const displayProducts = products.length > 0 
    ? products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.basePrice,
        originalPrice: product.originalPrice,
        image: product.images?.[0]?.url || product.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        rating: product.rating || 4.5,
        reviews: product.reviewCount || 0,
        badge: product.badge || (product.discount > 0 ? `Sale ${product.discount}%` : 'New')
      }))
    : defaultProducts;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateDiscount = (original, current) => {
    if (!original) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sản Phẩm Nổi Bật
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Những sản phẩm được yêu thích nhất trong tháng
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden aspect-square bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                      product.badge.includes('Sale') 
                        ? 'bg-red-500 text-white'
                        : product.badge === 'Hot' || product.badge === 'Trending'
                        ? 'bg-orange-500 text-white'
                        : product.badge === 'New'
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}>
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Heart size={18} />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-blue-50 hover:text-blue-500 transition-colors">
                    <Eye size={18} />
                  </button>
                </div>

                {/* Add to Cart Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 rounded-full font-semibold shadow-lg">
                    <ShoppingCart size={18} className="mr-2" />
                    Thêm Vào Giỏ
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>

                {/* Name */}
                <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="text-xs font-bold text-red-500">
                        -{calculateDiscount(product.originalPrice, product.price)}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button className="px-8 py-3 bg-gray-900 text-white hover:bg-gray-800 rounded-full font-semibold shadow-lg">
            Xem Tất Cả Sản Phẩm
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
