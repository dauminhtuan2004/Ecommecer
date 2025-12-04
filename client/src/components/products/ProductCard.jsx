import { Link } from 'react-router-dom';
import { FaHeart, FaEye, FaStar } from 'react-icons/fa';
import Button from '../common/Button';
import { formatPrice, calculateDiscountPercent } from '../../utils/formatters';

const ProductCard = ({ product }) => {
  const {
    id,
    name,
    price,
    basePrice,
    originalPrice,
    image,
    images,
    rating = 0,
    reviews = 0,
    badge,
    discount,
  } = product;

  // Lấy ảnh đầu tiên hoặc ảnh thumbnail
  const productImage = image || (images && images.length > 0 ? images[0].url : '/placeholder-product.jpg');
  
  // Lấy giá từ basePrice hoặc price
  const productPrice = basePrice || price || 0;
  const productOriginalPrice = originalPrice;
  
  // Tính % giảm giá
  const discountPercent = calculateDiscountPercent(productOriginalPrice, productPrice) || discount || 0;

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Badge */}
      {(badge || discountPercent > 0) && (
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-3 py-1 text-xs font-bold rounded-full text-white ${
            badge === 'Hot' ? 'bg-red-500' :
            badge === 'New' ? 'bg-green-500' :
            badge === 'Best Seller' ? 'bg-blue-500' :
            'bg-orange-500'
          }`}>
            {badge || `${discountPercent}%`}
          </span>
        </div>
      )}

      {/* Quick Actions */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="p-2 bg-white rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors">
          <FaHeart size={18} />
        </button>
        <Link 
          to={`/products/${id}`}
          className="p-2 bg-white rounded-full shadow-md hover:bg-blue-500 hover:text-white transition-colors"
        >
          <FaEye size={18} />
        </Link>
      </div>

      {/* Product Image */}
      <Link to={`/products/${id}`} className="block relative overflow-hidden aspect-square">
        <img
          src={productImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  size={14}
                  className={i < Math.floor(rating) ? 'fill-current' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({reviews})</span>
          </div>
        )}

        {/* Product Name */}
        <Link to={`/products/${id}`}>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(productPrice)}
          </span>
          {productOriginalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(productOriginalPrice)}
            </span>
          )}
        </div>

        {/* View Detail Button */}
        <Link to={`/products/${id}`}>
          <Button
            variant="dark"
            fullWidth
            icon={FaEye}
            className="hover:bg-gray-800 transition-colors duration-300"
          >
            Xem chi tiết
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
