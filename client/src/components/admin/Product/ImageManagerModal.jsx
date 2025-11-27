import { useState, useEffect } from 'react';
import ImageUploadSection from './ImageUploadSection';
import productService from '../../../services/productService';
import toast from 'react-hot-toast';
import Button from '../../common/Button';
import { X } from 'lucide-react';

const ImageManagerModal = ({ product, isOpen, onClose, onUpdated }) => {
  const [images, setImages] = useState(product?.images || []);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setImages(product?.images || []);
  }, [product]);

  const refresh = async () => {
    try {
      const res = await productService.getOne(product.id);
      const p = res?.data || res;
      setImages(p?.images || []);
      if (onUpdated) onUpdated(p);
    } catch (err) {
      console.error('Error refreshing product images:', err);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []).filter(f => f && f.size > 0);
    if (!files.length) return;
    setUploading(true);
    try {
      const resp = await productService.uploadImages(product.id, files);
      console.log('Upload response:', resp);
      toast.success('Upload ảnh thành công');
      await refresh();
    } catch (err) {
      console.error('Upload error:', err);
      console.error('Upload response data:', err?.response?.data);
      toast.error(err?.response?.data?.message || 'Không thể upload ảnh');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (img) => {
    if (!confirm('Bạn có chắc muốn xóa ảnh này?')) return;
    try {
      await productService.deleteImage(img.id);
      toast.success('Đã xóa ảnh');
      await refresh();
    } catch (err) {
      console.error('Error deleting image:', err);
      toast.error('Không thể xóa ảnh');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Quản lý ảnh - {product.name}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X size={18} /></button>
        </div>

        <ImageUploadSection
          product={product}
          images={images}
          uploading={uploading}
          onImageUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage}
        />

        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={onClose}>Đóng</Button>
        </div>
      </div>
    </div>
  );
};

export default ImageManagerModal;
