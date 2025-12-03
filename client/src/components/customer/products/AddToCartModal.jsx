import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaCheck, FaMinus, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Button from '../../common/Button';

const AddToCartModal = ({ isOpen, onClose, product, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      console.log('Product variants:', product.variants);
      
      // Get unique sizes and colors
      const sizes = [...new Set(product.variants.map(v => v.size))].filter(Boolean).sort();
      const colors = [...new Set(product.variants.map(v => v.color))].filter(Boolean);
      
      setAvailableSizes(sizes);
      setAvailableColors(colors);
      
      // Auto-select if only one variant
      if (product.variants.length === 1) {
        const variant = product.variants[0];
        setSelectedVariant(variant);
        setSelectedSize(variant.size);
        setSelectedColor(variant.color);
      } else if (sizes.length > 0) {
        setSelectedSize(sizes[0]);
        // Auto select first color for first size
        const firstSizeColors = product.variants
          .filter(v => v.size === sizes[0])
          .map(v => v.color);
        if (firstSizeColors.length > 0) {
          setSelectedColor(firstSizeColors[0]);
        }
      }
    } else {
      console.error('Product has no variants:', product);
    }
  }, [product, isOpen]);

  useEffect(() => {
    // Find variant based on selected size and color
    if (selectedSize && selectedColor) {
      const variant = product?.variants?.find(
        v => v.size === selectedSize && v.color === selectedColor
      );
      setSelectedVariant(variant || null);
    }
  }, [selectedSize, selectedColor, product]);

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    // Auto-select first available color for this size
    const colorsForSize = product.variants
      .filter(v => v.size === size)
      .map(v => v.color);
    if (colorsForSize.length > 0 && !colorsForSize.includes(selectedColor)) {
      setSelectedColor(colorsForSize[0]);
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && (!selectedVariant || newQuantity <= selectedVariant.stock)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      console.log('No variant selected');
      toast.error('Vui lòng chọn phiên bản sản phẩm');
      return;
    }
    
    setIsAdding(true);
    console.log('Adding to cart:', { variantId: selectedVariant.id, quantity });
    
    // Prepare product data for cart
    const productData = {
      id: product.id,
      name: product.name,
      image: product.images?.[0]?.url || '/placeholder.jpg',
      category: product.category?.name,
      variant: {
        id: selectedVariant.id,
        size: selectedVariant.size,
        color: selectedVariant.color,
        price: selectedVariant.price,
        stock: selectedVariant.stock
      }
    };
    
    const success = await onAddToCart(selectedVariant.id, quantity, productData);
    console.log('Add to cart result:', success);
    
    setIsAdding(false);
    
    if (success) {
      onClose();
      setQuantity(1);
      setSelectedSize('');
      setSelectedColor('');
      setSelectedVariant(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getAvailableColorsForSize = (size) => {
    return product?.variants
      ?.filter(v => v.size === size)
      .map(v => v.color) || [];
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Chọn phiên bản</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Product Info */}
          <div className="flex gap-4 mb-6">
            <img
              src={product?.images?.[0]?.url || '/placeholder.jpg'}
              alt={product?.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-lg mb-1">{product?.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product?.category?.name}</p>
              {selectedVariant && (
                <p className="text-xl font-bold text-red-600">
                  {formatPrice(selectedVariant.price)}
                </p>
              )}
            </div>
          </div>

          {/* Size Selection */}
          {availableSizes.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Kích thước
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => {
                  const hasStock = product.variants.some(
                    v => v.size === size && v.stock > 0
                  );
                  return (
                    <button
                      key={size}
                      onClick={() => hasStock && handleSizeChange(size)}
                      disabled={!hasStock}
                      className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                        selectedSize === size
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : hasStock
                          ? 'border-gray-300 hover:border-gray-400'
                          : 'border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {size}
                      {selectedSize === size && <FaCheck className="inline ml-2" size={12} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {availableColors.length > 0 && selectedSize && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Màu sắc
              </label>
              <div className="flex flex-wrap gap-2">
                {availableColors
                  .filter((color) => {
                    // Chỉ hiển thị màu available cho size đã chọn và có stock
                    const variant = product.variants.find(
                      v => v.size === selectedSize && v.color === color
                    );
                    return variant && variant.stock > 0;
                  })
                  .map((color) => {
                    return (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                          selectedColor === color
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                        {selectedColor === color && <FaCheck className="inline ml-2" size={12} />}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Stock Info */}
          {selectedVariant && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Còn lại:</span>
                <span className={`font-semibold ${
                  selectedVariant.stock > 10 ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {selectedVariant.stock} sản phẩm
                </span>
              </div>
            </div>
          )}

          {/* Quantity */}
          {selectedVariant && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Số lượng
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaMinus size={14} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      if (val >= 1 && val <= selectedVariant.stock) {
                        setQuantity(val);
                      }
                    }}
                    className="w-20 text-center font-medium border-x border-gray-300 py-2 focus:outline-none"
                    min="1"
                    max={selectedVariant.stock}
                  />
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= selectedVariant.stock}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaPlus size={14} />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Tối đa: {selectedVariant.stock}
                </span>
              </div>
            </div>
          )}

          {/* Total */}
          {selectedVariant && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Tổng cộng:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(selectedVariant.price * quantity)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            variant="dark"
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock === 0 || isAdding}
            className="flex-1"
          >
            {isAdding 
              ? 'Đang thêm...' 
              : selectedVariant?.stock === 0 
              ? 'Hết hàng' 
              : 'Thêm vào giỏ'
            }
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AddToCartModal;
