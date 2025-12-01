import { Link } from 'react-router-dom';
import ProductCard from '../products/ProductCard';
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

  // Map products từ API hoặc sử dụng default
  const displayProducts = products.length > 0 ? products : defaultProducts;

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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/products">
            <Button variant="dark" className="px-8 py-3 rounded-full font-semibold shadow-lg">
              Xem Tất Cả Sản Phẩm
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
