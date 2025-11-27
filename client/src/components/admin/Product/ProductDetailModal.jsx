import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import productService from '../../../services/productService';
import Button from '../../common/Button';

const ProductDetailModal = ({ productId, isOpen, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setLoading(true);
      try {
        const res = await productService.getOne(productId);
        const data = res?.data || res;
        setProduct(data);
      } catch (err) {
        console.error('Error loading product details', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen, productId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center p-6">
      <div className="bg-white w-full max-w-4xl rounded-lg overflow-hidden shadow-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Chi tiết sản phẩm</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading && <div>Đang tải...</div>}
          {!loading && product && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <h4 className="font-semibold">Thông tin</h4>
                  <p className="text-sm text-gray-600 mt-2">{product.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                  <p className="text-sm text-gray-700 mt-2">Giá cơ bản: {new Intl.NumberFormat('vi-VN').format(product.basePrice)} VND</p>
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-semibold">Ảnh sản phẩm (chung)</h4>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {product.images?.filter(img => !img.variantId).map(img => (
                      <div key={img.id} className="w-32 h-32 border rounded overflow-hidden">
                        <img src={img.url} alt={img.altText || ''} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {(!product.images || product.images.filter(img => !img.variantId).length === 0) && (
                      <div className="text-sm text-gray-500">Chưa có ảnh chung cho sản phẩm</div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold">Biến thể</h4>
                <div className="mt-3 space-y-3">
                  {product.variants?.map(variant => (
                    <div key={variant.id} className="border rounded p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{variant.size || '-'} / {variant.color || '-'}</div>
                          <div className="text-xs text-gray-500">SKU: {variant.sku || '—'} • Giá: {new Intl.NumberFormat('vi-VN').format(variant.price)} • Tồn: {variant.stock}</div>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2 flex-wrap">
                        {product.images?.filter(img => img.variantId === variant.id).map(img => (
                          <div key={img.id} className="w-24 h-24 border rounded overflow-hidden">
                            <img src={img.url} alt={img.altText || ''} className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {(!product.images || product.images.filter(img => img.variantId === variant.id).length === 0) && (
                          <div className="text-xs text-gray-500">Chưa có ảnh riêng cho variant này</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-end">
          <Button variant="secondary" onClick={onClose}>Đóng</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
