import { useState, useEffect } from 'react';
import { Edit, MoreVertical, Copy, Layers, ChevronDown, ChevronUp, Package } from 'lucide-react';
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
  const [expanded, setExpanded] = useState(false);

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
    if (n === 0) return { text: 'Hết hàng', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    if (n < 10) return { text: 'Sắp hết', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { text: 'Còn hàng', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  };

  const totalStock = (product.variants && product.variants.length > 0)
    ? product.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
    : (Number(product.stock) || 0);
  const stockStatus = getStockStatus(totalStock);
  const hasVariants = product.variants && product.variants.length > 0;

  return (
    <>
      <tr className={`border-b border-gray-100 transition-all duration-200 ${
        isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50/50'
      }`}>
        {/* Checkbox */}
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
          />
        </td>

        {/* Product Info */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-50 shadow-sm">
              {product.images?.[0] ? (
                <img
                  src={product.images[0].url || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-gray-900 truncate mb-0.5">
                {product.name}
              </div>
              <div className="text-sm text-gray-500">
                {product.sku || 'Chưa có SKU'}
              </div>
            </div>
          </div>
        </td>

        {/* Category */}
        <td className="px-6 py-4">
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {product.category?.name || 'N/A'}
          </span>
        </td>

        {/* Price */}
        <td className="px-6 py-4">
          <div className="font-semibold text-gray-900">
            {formatPrice(product.basePrice)}
          </div>
        </td>

        {/* Stock */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{totalStock}</span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${stockStatus.color}`}>
              {stockStatus.text}
            </span>
          </div>
        </td>

        {/* Variants */}
        <td className="px-6 py-4">
          {hasVariants ? (
            <button
              onClick={() => onManageVariants(product)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition-colors"
            >
              <Layers size={14} />
              {product.variants.length}
            </button>
          ) : (
            <span className="text-sm text-gray-400">—</span>
          )}
        </td>

        {/* Actions */}
        <td className="px-6 py-4">
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-2 transition-colors"
              title="Chi tiết"
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(product)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg p-2 transition-colors"
              title="Chỉnh sửa"
            >
              <Edit size={18} />
            </Button>

            {hasVariants && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onManageVariants(product)}
                className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg p-2 transition-colors"
                title="Biến thể"
              >
                <Layers size={18} />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActions(true)}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-2 transition-colors"
              title="Thêm"
            >
              <MoreVertical size={18} />
            </Button>
          </div>
        </td>
      </tr>

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

      {/* Expanded Details - Compact Layout */}
      {expanded && (
        <tr className="bg-slate-50">
          <td colSpan="7" className="px-4 py-3">
            <div className="space-y-3 text-sm">
              {/* Row 1: Info & Main Images */}
              <div className="grid grid-cols-2 gap-4">
                {/* Info */}
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Tên / Danh mục</p>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{product.category?.name || 'N/A'}</p>
                  <p className="text-xs text-gray-500 mt-2 leading-tight">{product.description ? product.description.substring(0, 80) + '...' : 'N/A'}</p>
                </div>

                {/* Main Images */}
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Ảnh chung</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.images?.filter(img => !img.variantId).slice(0, 4).map(img => (
                      <div key={img.id} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                        <img src={img.url} alt={img.altText || ''} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {(!product.images || product.images.filter(img => !img.variantId).length === 0) && (
                      <span className="text-xs text-gray-400 italic">Không có</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Biến thể</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {product.variants.map((variant, idx) => {
                      const variantImages = product.images?.filter(img => img.variantId === variant.id) || [];
                      return (
                        <div key={variant.id} className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs">
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-semibold text-gray-900">{variant.size || 'N/A'} • {variant.color || 'N/A'}</span>
                            <span className="text-gray-500">SKU: {variant.sku || '—'}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            <div>
                              <p className="text-gray-500 text-xs">Giá</p>
                              <p className="font-bold text-emerald-600">{formatPrice(variant.price)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Tồn</p>
                              <p className="font-bold text-blue-600">{variant.stock}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Trạng thái</p>
                              <p className={`font-bold text-xs ${variant.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {variant.stock > 0 ? '✓' : '✗'}
                              </p>
                            </div>
                          </div>
                          {variantImages.length > 0 && (
                            <div className="flex gap-1">
                              {variantImages.slice(0, 3).map(img => (
                                <div key={img.id} className="w-12 h-12 rounded border border-violet-200 overflow-hidden">
                                  <img src={img.url} alt={img.altText || ''} className="w-full h-full object-cover" />
                                </div>
                              ))}
                              {variantImages.length > 3 && (
                                <div className="w-12 h-12 rounded border border-gray-200 bg-gray-100 flex items-center justify-center text-xs text-gray-600 font-bold">
                                  +{variantImages.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default ProductRow;