import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaTimes } from 'react-icons/fa';

const CartItem = ({ groupedProduct, selectedItems, onToggleItem, onUpdateQuantity, onRemove, onRemoveAll, formatPrice }) => {
  const { productId, productName, productImage, variants, totalQuantity, totalPrice } = groupedProduct;
  
  // Check if all variants are selected
  const allVariantsSelected = variants.every(v => selectedItems.has(v.variantId));
  const someVariantsSelected = variants.some(v => selectedItems.has(v.variantId));
  
  const handleToggleAllVariants = () => {
    if (allVariantsSelected) {
      // Deselect all variants
      variants.forEach(v => {
        if (selectedItems.has(v.variantId)) {
          onToggleItem(v.variantId);
        }
      });
    } else {
      // Select all variants
      variants.forEach(v => {
        if (!selectedItems.has(v.variantId)) {
          onToggleItem(v.variantId);
        }
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Checkbox for all variants */}
        <div className="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            checked={allVariantsSelected}
            ref={input => {
              if (input) input.indeterminate = someVariantsSelected && !allVariantsSelected;
            }}
            onChange={handleToggleAllVariants}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </div>
        
        {/* Image */}
        <Link
          to={`/products/${productId}`}
          className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden"
        >
          <img
            src={productImage || '/placeholder.jpg'}
            alt={productName || 'Product'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder.jpg';
            }}
          />
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Product Name & Remove All Button */}
          <div className="flex items-start justify-between mb-3">
            <Link
              to={`/products/${productId}`}
              className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 flex-1"
            >
              {productName}
            </Link>
            <button
              onClick={() => onRemoveAll(variants.map(v => v.variantId))}
              className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Xóa tất cả"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Variants List */}
          <div className="space-y-3">
            {variants.map((variant) => (
              <div key={variant.variantId} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                {/* Checkbox for variant */}
                <div className="flex-shrink-0 pt-1">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(variant.variantId)}
                    onChange={() => onToggleItem(variant.variantId)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                
                {/* Variant Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 text-sm mb-2">
                    {variant.size && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                        Size: {variant.size}
                      </span>
                    )}
                    {variant.color && (
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                        Màu: {variant.color}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => onUpdateQuantity(variant.variantId, variant.quantity, -1)}
                        disabled={variant.quantity <= 1}
                        className="p-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <FaMinus size={10} />
                      </button>
                      <input
                        type="number"
                        value={variant.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          if (val >= 1 && val <= (variant.stock || 999)) {
                            onUpdateQuantity(variant.variantId, val, 0);
                          }
                        }}
                        className="w-12 text-center text-sm font-medium border-x border-gray-300 py-1.5 focus:outline-none"
                        min="1"
                        max={variant.stock || 999}
                      />
                      <button
                        onClick={() => onUpdateQuantity(variant.variantId, variant.quantity, 1)}
                        disabled={variant.quantity >= (variant.stock || 999)}
                        className="p-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-sm">
                      <span className="font-semibold text-red-600">
                        {formatPrice(variant.price * variant.quantity)}
                      </span>
                      {variant.quantity > 1 && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({formatPrice(variant.price)} / sp)
                        </span>
                      )}
                    </div>

                    {/* Remove Variant Button */}
                    <button
                      onClick={() => onRemove(variant.variantId)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Xóa"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Product Total */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Tổng số lượng: <span className="font-semibold text-gray-900">{totalQuantity}</span> sản phẩm
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Tổng tiền sản phẩm này</p>
              <p className="text-xl font-bold text-red-600">
                {formatPrice(totalPrice)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
