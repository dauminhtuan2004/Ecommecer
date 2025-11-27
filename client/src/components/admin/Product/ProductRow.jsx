import { useState, useEffect } from 'react';
import { Edit, MoreVertical, Copy, Layers } from 'lucide-react';
import ProductActions from './ProductActions';
import Button from '../../common/Button';

const ProductRow = ({
  product,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onManageVariants
}) => {
  const [showActions, setShowActions] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };
  useEffect(() => {
  if (product.images && product.images.length > 0) {
  }
}, [product]);
  

  const getStockStatus = (stock) => {
    const n = Number(stock) || 0;
    if (n === 0) return { text: 'Hết hàng', color: 'text-red-600 bg-red-50' };
    if (n < 10) return { text: 'Sắp hết', color: 'text-orange-600 bg-orange-50' };
    return { text: 'Còn hàng', color: 'text-green-600 bg-green-50' };
  };

  // Compute total stock from variants if available
  const totalStock = (product.variants && product.variants.length > 0)
    ? product.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
    : (Number(product.stock) || 0);
  const stockStatus = getStockStatus(totalStock);
  const hasVariants = product.variants && product.variants.length > 0;

  return (
    <>
      <tr className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
        {/* Checkbox */}
        <td className="px-4 py-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </td>

        {/* Product Info */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
              {product.images?.[0] ? (
                <img
                  src={product.images[0].url || product.images[0]}
                  alt={product.name}
                  className="w-10 h-10 object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-100 flex items-center justify-center text-gray-400">
                  📷
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-gray-900 truncate">
                {product.name}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {product.sku || 'No SKU'}
              </div>
            </div>
          </div>
        </td>

        {/* Category */}
        <td className="px-4 py-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {product.category?.name || 'N/A'}
          </span>
        </td>

        {/* Price */}
        <td className="px-4 py-3">
          <div className="font-medium text-gray-900">
            {formatPrice(product.basePrice)}
          </div>
        </td>

        {/* Stock */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="font-medium">{totalStock}</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${stockStatus.color}`}>
              {stockStatus.text}
            </span>
          </div>
        </td>

        {/* Variants */}
        <td className="px-4 py-3">
          {hasVariants ? (
            <button
              onClick={() => onManageVariants(product)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200"
            >
              <Layers size={12} />
              {product.variants.length} variants
            </button>
          ) : (
            <span className="text-xs text-gray-500">No variants</span>
          )}
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
          <div className="flex items-center justify-end gap-2">
            {/* Quick Edit */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(product)}
              className="text-blue-600 hover:text-blue-800"
              title="Chỉnh sửa nhanh"
            >
              <Edit size={16} />
            </Button>

            {/* Manage Variants */}
            {hasVariants && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onManageVariants(product)}
                className="text-purple-600 hover:text-purple-800"
                title="Quản lý biến thể"
              >
                <Layers size={16} />
              </Button>
            )}

            {/* More Actions */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActions(true)}
              className="text-gray-600 hover:text-gray-800"
              title="Tùy chọn khác"
            >
              <MoreVertical size={16} />
            </Button>
          </div>
        </td>
      </tr>

      {/* Actions Menu */}
      {showActions && (
        <ProductActions
          product={product}
          onClose={() => setShowActions(false)}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onManageVariants={onManageVariants}
        />
      )}
    </>
  );
};

export default ProductRow;