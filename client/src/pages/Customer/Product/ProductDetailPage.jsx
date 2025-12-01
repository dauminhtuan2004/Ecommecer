import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaMinus, FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Layout from '../../../components/layouts/Layout';
import Button from '../../../components/common/Button';
import { productService } from '../../../services/productService';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  // Cập nhật variant khi chọn size hoặc color
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const matchingVariant = product.variants.find(
        v => (
          (!selectedSize || v.size === selectedSize) &&
          (!selectedColor || v.color === selectedColor)
        )
      );
      if (matchingVariant) {
        setSelectedVariant(matchingVariant);
      }
    }
  }, [selectedSize, selectedColor, product]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getOne(id);
      const productData = response.data || response;
      setProduct(productData);
      
      // Tách size và color từ variants
      if (productData.variants && productData.variants.length > 0) {
        const sizes = [...new Set(productData.variants.map(v => v.size).filter(Boolean))];
        const colors = [...new Set(productData.variants.map(v => v.color).filter(Boolean))];
        
        if (sizes.length > 0) setSelectedSize(sizes[0]);
        if (colors.length > 0) setSelectedColor(colors[0]);
        
        // Set variant mặc định
        setSelectedVariant(productData.variants[0]);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Không tìm thấy sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    toast.success('Đã thêm vào giỏ hàng!');
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
          <Link to="/products" className="text-blue-600 hover:underline">
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </Layout>
    );
  }

  const images = product.images || [];
  const currentPrice = selectedVariant?.price || product.basePrice || product.price;
  const originalPrice = product.originalPrice;

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-gray-900">Trang chủ</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-gray-900">Sản phẩm</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </nav>
          </div>

          {/* Product Detail */}
          <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Images */}
              <div>
                {/* Main Image với Navigation */}
                <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100 group">
                  <img
                    src={images[selectedImage]?.url || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation Buttons - hiện khi có nhiều ảnh */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        aria-label="Previous image"
                      >
                        <FaChevronLeft size={20} />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        aria-label="Next image"
                      >
                        <FaChevronRight size={20} />
                      </button>
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {selectedImage + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          selectedImage === idx 
                            ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' 
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={`${product.name} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} size={18} />
                    ))}
                  </div>
                  <span className="text-gray-600">(0 đánh giá)</span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(currentPrice)}
                    </span>
                    {originalPrice && (
                      <span className="text-2xl text-gray-400 line-through">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>
                  {selectedVariant && (selectedSize || selectedColor) && (
                    <p className="text-sm text-gray-600">
                      Đang chọn: {selectedSize && `Size ${selectedSize}`}{selectedSize && selectedColor && ' - '}{selectedColor && `Màu ${selectedColor}`}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-2">Mô tả</h3>
                  <p className="text-gray-600">
                    {product.description || 'Chưa có mô tả cho sản phẩm này.'}
                  </p>
                </div>

                {/* Size Selection */}
                {product.variants && product.variants.length > 0 && (
                  <>
                    {/* Sizes */}
                    {(() => {
                      const sizes = [...new Set(product.variants.map(v => v.size).filter(Boolean))];
                      if (sizes.length > 0) {
                        return (
                          <div className="mb-6">
                            <h3 className="font-bold text-gray-900 mb-3">Size</h3>
                            <div className="flex flex-wrap gap-2">
                              {sizes.map((size) => (
                                <button
                                  key={size}
                                  onClick={() => setSelectedSize(size)}
                                  className={`px-4 py-2 rounded-lg border-2 transition-colors font-medium ${
                                    selectedSize === size
                                      ? 'border-gray-900 bg-gray-900 text-white'
                                      : 'border-gray-300 hover:border-gray-400'
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {/* Colors */}
                    {(() => {
                      const colors = [...new Set(product.variants.map(v => v.color).filter(Boolean))];
                      if (colors.length > 0) {
                        return (
                          <div className="mb-6">
                            <h3 className="font-bold text-gray-900 mb-3">Màu sắc</h3>
                            <div className="flex flex-wrap gap-2">
                              {colors.map((color) => (
                                <button
                                  key={color}
                                  onClick={() => setSelectedColor(color)}
                                  className={`px-4 py-2 rounded-lg border-2 transition-colors font-medium ${
                                    selectedColor === color
                                      ? 'border-gray-900 bg-gray-900 text-white'
                                      : 'border-gray-300 hover:border-gray-400'
                                  }`}
                                >
                                  {color}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Số lượng</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="p-3 hover:bg-gray-100"
                      >
                        <FaMinus size={14} />
                      </button>
                      <span className="px-6 font-bold">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="p-3 hover:bg-gray-100"
                      >
                        <FaPlus size={14} />
                      </button>
                    </div>
                    <span className="text-gray-600">
                      {selectedVariant?.stock || product.stock || 0} sản phẩm có sẵn
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mb-6">
                  <Button
                    variant="dark"
                    icon={FaShoppingCart}
                    className="flex-1"
                    onClick={handleAddToCart}
                  >
                    Thêm vào giỏ
                  </Button>
                  <Button
                    variant="outline"
                    icon={FaHeart}
                    className="px-4"
                  >
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="border-t pt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-medium">{product.sku || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Danh mục:</span>
                    <span className="font-medium">{product.category?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thương hiệu:</span>
                    <span className="font-medium">{product.brand?.name || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
