import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

const CartItem = ({ item, onUpdateQuantity, onRemove, formatPrice }) => {
  const product = item.product;
  const variant = product?.variant;

  return (
    <div className="p-6">
      <div className="flex gap-4">
        {/* Image */}
        <Link
          to={`/products/${product?.id}`}
          className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden"
        >
          <img
            src={product?.image || '/placeholder.jpg'}
            alt={product?.name}
            className="w-full h-full object-cover"
          />
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link
            to={`/products/${product?.id}`}
            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
          >
            {product?.name}
          </Link>
          
          {/* Variant Info */}
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
            {variant?.size && (
              <span className="px-2 py-1 bg-gray-100 rounded">
                Size: {variant.size}
              </span>
            )}
            {variant?.color && (
              <span className="px-2 py-1 bg-gray-100 rounded">
                Màu: {variant.color}
              </span>
            )}
          </div>

          {/* Quantity & Price */}
          <div className="mt-3 flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => onUpdateQuantity(item.variantId, item.quantity, -1)}
                disabled={item.quantity <= 1}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaMinus size={12} />
              </button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  if (val >= 1 && val <= (variant?.stock || 999)) {
                    onUpdateQuantity(item.variantId, val, 0);
                  }
                }}
                className="w-16 text-center font-medium border-x border-gray-300 py-2 focus:outline-none"
                min="1"
                max={variant?.stock || 999}
              />
              <button
                onClick={() => onUpdateQuantity(item.variantId, item.quantity, 1)}
                disabled={item.quantity >= (variant?.stock || 999)}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaPlus size={12} />
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-lg font-bold text-red-600">
                {formatPrice((variant?.price || 0) * item.quantity)}
              </p>
              {item.quantity > 1 && (
                <p className="text-xs text-gray-500">
                  {formatPrice(variant?.price || 0)} / sp
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.variantId)}
          className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
          title="Xóa"
        >
          <FaTrash size={18} />
        </button>
      </div>

      {/* Stock Warning */}
      {variant?.stock && item.quantity > variant.stock && (
        <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
          Chỉ còn {variant.stock} sản phẩm trong kho
        </div>
      )}
    </div>
  );
};

export default CartItem;
