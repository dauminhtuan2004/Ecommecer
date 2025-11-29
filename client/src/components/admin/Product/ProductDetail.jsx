import { Package, Layers, Edit2, Trash2 } from 'lucide-react';

const ProductDetails = ({ product, onEditVariant, onDeleteVariant }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const mainImages = product.images?.filter(img => !img.variantId) || [];

  return (
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
              <p className="text-xs text-gray-500 mt-2 leading-tight">
                {product.description ? product.description.substring(0, 80) + '...' : 'N/A'}
              </p>
            </div>

            {/* Main Images */}
            <div className="bg-white p-3 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Ảnh chung</p>
              <div className="flex gap-2 flex-wrap">
                {mainImages.slice(0, 4).map(img => (
                  <div key={img.id} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                    <img src={img.url} alt={img.altText || ''} className="w-full h-full object-cover" />
                  </div>
                ))}
                {mainImages.length === 0 && (
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
                {product.variants.map((variant) => {
                  const variantImages = product.images?.filter(img => img.variantId === variant.id) || [];
                  return (
                    <div key={variant.id} className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs hover:bg-slate-100 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-gray-900">
                          {variant.size || 'N/A'} • {variant.color || 'N/A'}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">SKU: {variant.sku || '—'}</span>
                          {onEditVariant && (
                            <button
                              onClick={() => onEditVariant(variant)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 rounded transition-colors"
                              title="Sửa"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                          {onDeleteVariant && (
                            <button
                              onClick={() => onDeleteVariant(variant)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                              title="Xóa"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
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
  );
};

export default ProductDetails;