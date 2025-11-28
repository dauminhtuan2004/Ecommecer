import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import VariantSection from './VariantSection';
import Button from '../../common/Button';
import toast from 'react-hot-toast';
import productService from '../../../services/productService';

const VariantManager = ({ product, onClose, onSave, onImagesUploaded }) => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product?.variants) {
      // Đảm bảo variants có đầy đủ field
      setVariants(product.variants.map(v => ({
        id: v.id,
        size: v.size || '',
        color: v.color || '',
        price: v.price || product.basePrice || '',
        stock: v.stock || '',
        sku: v.sku || ''
      })));
    } else {
      setVariants([{ size: '', color: '', price: product?.basePrice || '', stock: '', sku: '' }]);
    }
  }, [product]);

  // Xử lý variants (giống trong ProductForm)
  const handleVariantChange = (index, field, value) => {
    setVariants(prev => {
      const newVariants = [...prev];
      newVariants[index][field] = value;
      return newVariants;
    });
  };

  const handleAddVariant = () => {
    setVariants(prev => [...prev, { 
      size: '', 
      color: '', 
      price: product?.basePrice || '', 
      stock: '', 
      sku: '' 
    }]);
  };

  const handleRemoveVariant = (index) => {
    if (variants.length > 1) {
      setVariants(prev => prev.filter((_, i) => i !== index));
    } else {
      toast.error('Phải có ít nhất 1 variant');
    }
  };

  const handleSave = async () => {
    // Validate variants: accept variants that have any meaningful field filled
    const validVariants = variants.filter(v => {
      const hasTextField = (v.size && String(v.size).trim()) || (v.color && String(v.color).trim()) || (v.sku && String(v.sku).trim());
      const hasNumberField = (v.price !== undefined && v.price !== '') || (v.stock !== undefined && v.stock !== '');
      return Boolean(hasTextField) || Boolean(hasNumberField);
    });

    if (validVariants.length === 0) {
      toast.error('Cần ít nhất 1 variant có dữ liệu (kích thước, màu, sku, giá hoặc tồn kho)');
      return;
    }

    // Debug log so developer can inspect payload sent to server
    console.log('Saving variants for product', product?.id, validVariants);

    setLoading(true);
    try {
      await onSave(product.id, validVariants);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadVariantImages = async (index, fileList) => {
    const v = variants[index];
    if (!v?.id) {
      toast.error('Variant chưa được lưu. Vui lòng lưu variant trước khi upload ảnh.');
      return;
    }
    const files = Array.from(fileList || []).filter(Boolean);
    if (files.length === 0) return;

    try {
      toast.loading('Đang upload ảnh...');
      await productService.uploadImages(product.id, files, { variantId: v.id });
      toast.dismiss();
      toast.success('Upload ảnh variant thành công');
      if (typeof onImagesUploaded === 'function') onImagesUploaded();
    } catch (err) {
      console.error('Error uploading variant images', err);
      toast.dismiss();
      toast.error('Không thể upload ảnh cho variant');
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-100 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Quản Lý Biến Thể</h2>
            <p className="text-sm text-gray-600 mt-1">
              {product?.name} - {product?.sku || 'No SKU'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <VariantSection
            variants={variants}
            onVariantChange={handleVariantChange}
            onAddVariant={handleAddVariant}
            onRemoveVariant={handleRemoveVariant}
            onUploadVariantImages={handleUploadVariantImages}
            onDeleteVariantImage={async (imageId) => {
              try {
                await productService.deleteImage(imageId);
                toast.success('Đã xóa ảnh');
                if (typeof onImagesUploaded === 'function') onImagesUploaded();
              } catch (err) {
                console.error('Error deleting variant image', err);
                toast.error('Không thể xóa ảnh');
              }
            }}
            productImages={product?.images || []}
            basePrice={product?.basePrice}
          />
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            loading={loading}
          >
            Lưu Biến Thể
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VariantManager;