import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import Button from '../../common/Button';

const VariantSection = ({
  variants,
  onVariantChange,
  onAddVariant,
  onRemoveVariant,
  onUploadVariantImages,
  onDeleteVariantImage,
  productImages = [],
  basePrice
}) => {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="border-b pb-2 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Biến Thể Sản Phẩm</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Thêm các phiên bản khác nhau (size, màu, v.v.)
          </p>
        </div>
        <Button
          type="button"
          onClick={onAddVariant}
          size="sm"
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5"
        >
          <Plus size={16} />
          Thêm
        </Button>
      </div>

      {/* Info Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800">
            <p className="font-semibold mb-0.5">💡 Lưu ý</p>
            <ul className="list-disc list-inside space-y-0.5 text-xs">
              <li>Nếu không nhập giá, sẽ sử dụng <strong>Giá Cơ Bản</strong> ({new Intl.NumberFormat('vi-VN').format(basePrice || 0)} VND)</li>
              <li>SKU giúp quản lý kho hàng dễ dàng hơn</li>
              <li>Ít nhất phải có <strong>1 variant</strong> có dữ liệu</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Variants List */}
      <div className="space-y-3">
        {variants.map((variant, index) => (
          <div
            key={index}
            className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700">
                Variant #{index + 1}
              </span>
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveVariant(index)}
                  className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                  title="Xóa variant này"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              {/* Size */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  Size
                </label>
                <input
                  type="text"
                  placeholder="M, L, XL..."
                  value={variant.size || ''}
                  onChange={(e) => onVariantChange(index, 'size', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-200"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  Màu
                </label>
                <input
                  type="text"
                  placeholder="Đỏ, Xanh..."
                  value={variant.color || ''}
                  onChange={(e) => onVariantChange(index, 'color', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-200"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  SKU
                </label>
                <input
                  type="text"
                  placeholder="SKU-001"
                  value={variant.sku || ''}
                  onChange={(e) => onVariantChange(index, 'sku', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-200"
                />
              </div>

              {/* Price Override */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  Giá
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  placeholder={basePrice || '0'}
                  value={variant.price || ''}
                  onChange={(e) => onVariantChange(index, 'price', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-200"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  Tồn
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={variant.stock || ''}
                  onChange={(e) => onVariantChange(index, 'stock', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-200"
                />
              </div>
            </div>
            {/* Upload images for this variant (only for saved variants) */}
            <div className="mt-2">
              {variant.id ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => onUploadVariantImages && onUploadVariantImages(index, e.target.files)}
                    />
                    <span className="text-xs text-gray-500">Tải ảnh cho variant này (nếu có)</span>
                  </div>
                  {/* Thumbnails for this variant */}
                  <div className="flex gap-2 flex-wrap mt-2">
                    {productImages.filter(img => img.variantId === variant.id).map(img => (
                      <div key={img.id} className="relative w-20 h-20 border rounded overflow-hidden">
                        <img src={img.url} alt={img.altText || ''} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => onDeleteVariantImage && onDeleteVariantImage(img.id)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded p-0.5 text-xs"
                          title="Xóa ảnh"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500">Lưu variant trước để tải ảnh cho variant này</div>
              )}
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