import { useState, useEffect } from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import toast from 'react-hot-toast';

const VariantManager = ({ product, onClose, onSave, onImagesUploaded, editingVariant }) => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    // Nếu đang edit variant, load data variant đó
    // Nếu không, tạo form trống
    if (editingVariant) {
      setVariants([{
        id: editingVariant.id,
        size: editingVariant.size || '',
        color: editingVariant.color || '',
        price: editingVariant.price || product?.basePrice || '',
        stock: editingVariant.stock || '',
        sku: editingVariant.sku || ''
      }]);
    } else {
      setVariants([{ size: '', color: '', price: product?.basePrice || '', stock: '', sku: '' }]);
    }
    setSelectedImages([]);
  }, [product, editingVariant]);

  // Xử lý variants
  const handleVariantChange = (field, value) => {
    setVariants([{ ...variants[0], [field]: value }]);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);
  };

  const handleSave = async () => {
    const variant = variants[0];
    
    // Validate
    if (!variant.size?.trim() && !variant.color?.trim()) {
      toast.error('Vui lòng nhập kích thước hoặc màu sắc');
      return;
    }

    setLoading(true);
    try {
      const existingVariants = product.variants || [];
      let allVariants;
      
      if (editingVariant) {
        // Cập nhật variant đang edit
        allVariants = existingVariants.map(v => 
          v.id === editingVariant.id 
            ? { 
                ...v,
                size: variant.size?.trim() || '',
                color: variant.color?.trim() || '',
                price: variant.price || product?.basePrice || 0,
                stock: variant.stock || 0,
                sku: variant.sku?.trim() || ''
              }
            : v
        );
        toast.success('Đã cập nhật variant!');
      } else {
        // Thêm variant mới
        const newVariant = {
          size: variant.size?.trim() || '',
          color: variant.color?.trim() || '',
          price: variant.price || product?.basePrice || 0,
          stock: variant.stock || 0,
          sku: variant.sku?.trim() || ''
        };
        allVariants = [...existingVariants, newVariant];
        toast.success('Đã thêm variant mới!');
      }
      
      await onSave(product.id, allVariants);
      
      // Upload images nếu có
      if (selectedImages.length > 0 && editingVariant?.id) {
        await onImagesUploaded?.(editingVariant.id, selectedImages);
      }
      
      onClose();
    } catch (error) {
      toast.error(error?.message || 'Không thể lưu variant');
    } finally {
      setLoading(false);
    }
  };

  const currentVariant = variants[0] || { size: '', color: '', price: '', stock: '', sku: '' };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={
        <div>
          <div className="text-xl font-semibold text-gray-900">Quản Lý Biến Thể</div>
          <p className="text-sm text-gray-600 mt-1">
            {product?.name} - {product?.sku || 'No SKU'}
          </p>
        </div>
      }
      size="2xl"
    >
      <div className="space-y-4">
        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-900">
            💡 <strong>Lưu ý:</strong> {editingVariant ? 'Chỉnh sửa thông tin variant và upload ảnh riêng cho variant này.' : 'Sau khi thêm, variant sẽ hiển thị ở bảng sản phẩm bên dưới. Click mũi tên xuống ở hàng sản phẩm để xem tất cả variants.'}
          </p>
        </div>

        {/* Variant Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <h3 className="text-base font-semibold text-gray-900">
            {editingVariant ? '✏️ Chỉnh Sửa Variant' : '➕ Thêm Biến Thể Mới'}
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kích Thước
              </label>
              <input
                type="text"
                value={currentVariant.size}
                onChange={(e) => handleVariantChange('size', e.target.value)}
                placeholder="S, M, L, XL..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Màu Sắc
              </label>
              <input
                type="text"
                value={currentVariant.color}
                onChange={(e) => handleVariantChange('color', e.target.value)}
                placeholder="Đỏ, Xanh, Đen..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá (₫)
              </label>
              <input
                type="number"
                value={currentVariant.price}
                onChange={(e) => handleVariantChange('price', e.target.value)}
                placeholder={product?.basePrice || '0'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tồn Kho
              </label>
              <input
                type="number"
                value={currentVariant.stock}
                onChange={(e) => handleVariantChange('stock', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* SKU */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU (Mã SP)
              </label>
              <input
                type="text"
                value={currentVariant.sku}
                onChange={(e) => handleVariantChange('sku', e.target.value)}
                placeholder="VD: PRD-S-RED-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Image Upload - Only show when editing existing variant */}
            {editingVariant?.id && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ảnh Variant
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {selectedImages.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Đã chọn {selectedImages.length} ảnh
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Current Variants Summary */}
          {!editingVariant && product?.variants && product.variants.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">
                <strong>Variants hiện tại:</strong> {product.variants.length} variants
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.slice(0, 5).map((v, idx) => (
                  <span key={idx} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {v.size} • {v.color}
                  </span>
                ))}
                {product.variants.length > 5 && (
                  <span className="inline-flex items-center px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded font-medium">
                    +{product.variants.length - 5} khác
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2"
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            loading={loading}
            className="px-5 py-2"
          >
            {editingVariant ? '💾 Lưu Thay Đổi' : '➕ Thêm Variant'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default VariantManager;