import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import Button from '../../common/Button';

const VariantSection = ({
  variants,
  onVariantChange,
  onAddVariant,
  onRemoveVariant,
  basePrice
}) => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Biến Thể Sản Phẩm</h3>
          <p className="text-sm text-gray-500 mt-1">
            Thêm các phiên bản khác nhau của sản phẩm (size, màu, v.v.)
          </p>
        </div>
        <Button
          type="button"
          onClick={onAddVariant}
          size="sm"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={18} />
          Thêm Variant
        </Button>
      </div>

      {/* Info Alert */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">💡 Lưu ý về Variants</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Nếu không nhập giá, sẽ sử dụng <strong>Giá Cơ Bản</strong> ({new Intl.NumberFormat('vi-VN').format(basePrice || 0)} VND)</li>
              <li>SKU giúp quản lý kho hàng dễ dàng hơn</li>
              <li>Ít nhất phải có <strong>1 variant</strong> có dữ liệu</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Variants List */}
      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div
            key={index}
            className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">
                Variant #{index + 1}
              </span>
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveVariant(index)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Xóa variant này"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {/* Size */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Size
                </label>
                <input
                  type="text"
                  placeholder="M, L, XL..."
                  value={variant.size || ''}
                  onChange={(e) => onVariantChange(index, 'size', e.target.value)}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Màu Sắc
                </label>
                <input
                  type="text"
                  placeholder="Đỏ, Xanh..."
                  value={variant.color || ''}
                  onChange={(e) => onVariantChange(index, 'color', e.target.value)}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  placeholder="SKU-001"
                  value={variant.sku || ''}
                  onChange={(e) => onVariantChange(index, 'sku', e.target.value)}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Price Override */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Giá (VND)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  placeholder={basePrice || '0'}
                  value={variant.price || ''}
                  onChange={(e) => onVariantChange(index, 'price', e.target.value)}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tồn Kho
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={variant.stock || ''}
                  onChange={(e) => onVariantChange(index, 'stock', e.target.value)}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Preview giá nếu không nhập */}
            {!variant.price && basePrice && (
              <div className="mt-3 text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded px-3 py-2">
                💰 Giá áp dụng: <strong>{new Intl.NumberFormat('vi-VN').format(basePrice)} VND</strong> (giá cơ bản)
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {variants.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="text-gray-400 mb-3">
            <Plus size={48} className="mx-auto" />
          </div>
          <p className="text-gray-600 mb-2">Chưa có variant nào</p>
          <button
            type="button"
            onClick={onAddVariant}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Thêm variant đầu tiên
          </button>
        </div>
      )}
    </div>
  );
};

export default VariantSection;