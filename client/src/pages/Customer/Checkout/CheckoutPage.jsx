import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaMapMarkerAlt, FaCreditCard, FaShoppingBag, FaArrowLeft, FaCheck, FaTag, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import orderService from '../../../services/orderService';
import discountService from '../../../services/discountService';
import { formatPrice } from '../../../utils/formatters';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Discount code state
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [checkingDiscount, setCheckingDiscount] = useState(false);

  // Calculate totals
  const { subtotal, shipping, discount, total, itemCount } = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.product?.variant?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    const shipping = subtotal > 500000 ? 0 : 30000; // Free ship if > 500k
    
    // Calculate discount
    let discount = 0;
    if (appliedDiscount) {
      if (appliedDiscount.discountType === 'PERCENTAGE') {
        discount = (subtotal * appliedDiscount.discountValue) / 100;
        if (appliedDiscount.maxDiscount) {
          discount = Math.min(discount, appliedDiscount.maxDiscount);
        }
      } else if (appliedDiscount.discountType === 'FIXED') {
        discount = appliedDiscount.discountValue;
      }
    }
    
    const total = subtotal + shipping - discount;
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    return { subtotal, shipping, discount, total, itemCount };
  }, [cartItems, appliedDiscount]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống!');
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    try {
      setCheckingDiscount(true);
      // discountService already returns response.data, so result is the actual data
      const result = await discountService.validateDiscount(discountCode);
      
      console.log('Discount validation result:', result);
      
      if (result && result.isValid) {
        setAppliedDiscount(result.discount);
        toast.success(`Áp dụng mã giảm giá thành công! Giảm ${result.discount.discountType === 'PERCENTAGE' ? result.discount.discountValue + '%' : formatPrice(result.discount.discountValue)}`);
      } else {
        toast.error(result?.message || 'Mã giảm giá không hợp lệ');
      }
    } catch (error) {
      console.error('Discount validation error:', error);
      toast.error(error.response?.data?.message || 'Mã giảm giá không hợp lệ');
    } finally {
      setCheckingDiscount(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    toast.success('Đã xóa mã giảm giá');
  };

  const validateForm = () => {
    const { fullName, phone, address, city } = shippingInfo;
    
    if (!fullName.trim()) {
      toast.error('Vui lòng nhập họ tên');
      return false;
    }
    
    if (!phone.trim() || !/^[0-9]{10}$/.test(phone)) {
      toast.error('Số điện thoại không hợp lệ (10 chữ số)');
      return false;
    }
    
    if (!address.trim()) {
      toast.error('Vui lòng nhập địa chỉ');
      return false;
    }
    
    if (!city.trim()) {
      toast.error('Vui lòng chọn tỉnh/thành phố');
      return false;
    }

    if (!agreedToTerms) {
      toast.error('Vui lòng đồng ý điều khoản dịch vụ');
      return false;
    }
    
    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity
        })),
        shippingAddress: `${shippingInfo.address}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.city}`,
        shippingInfo: {
          fullName: shippingInfo.fullName,
          phone: shippingInfo.phone,
          note: shippingInfo.note
        },
        paymentMethod
      };

      const response = await orderService.createOrder(orderData);
      
      toast.success('Đặt hàng thành công!');
      
      // Clear cart and redirect
      setTimeout(() => {
        navigate(`/orders/${response.data.id}`);
      }, 1000);

    } catch (error) {
      console.error('Order creation error:', error);
      toast.error(error.response?.data?.message || 'Đặt hàng thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft /> Quay lại giỏ hàng
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaMapMarkerAlt className="text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Thông tin giao hàng</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0123456789"
                      maxLength={10}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Số nhà, tên đường"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tỉnh/Thành phố <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={shippingInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Cần Thơ">Cần Thơ</option>
                      <option value="Hải Phòng">Hải Phòng</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quận/Huyện
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Quận/Huyện"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phường/Xã
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.ward}
                      onChange={(e) => handleInputChange('ward', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Phường/Xã"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    value={shippingInfo.note}
                    onChange={(e) => handleInputChange('note', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Ghi chú cho người bán..."
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCreditCard className="text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Phương thức thanh toán</h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH"
                    checked={paymentMethod === 'CASH'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</div>
                    <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors opacity-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="VNPAY"
                    disabled
                    className="w-5 h-5 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">VNPay</div>
                    <div className="text-sm text-gray-500">Đang phát triển...</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors opacity-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="MOMO"
                    disabled
                    className="w-5 h-5 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">MoMo</div>
                    <div className="text-sm text-gray-500">Đang phát triển...</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaShoppingBag className="text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Đơn hàng</h2>
              </div>

              {/* Items List */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {cartItems.map((item) => {
                  const price = item.product?.variant?.price || 0;
                  const size = item.product?.variant?.size;
                  const color = item.product?.variant?.color;
                  const productName = item.product?.name || 'Sản phẩm';
                  const image = item.product?.image || '/placeholder-product.jpg';
                  
                  return (
                    <div key={item.variantId} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        <img
                          src={image}
                          alt={productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {productName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {size && `Size: ${size}`}
                          {size && color && ' • '}
                          {color && `Màu: ${color}`}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">x{item.quantity}</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatPrice(price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Discount Code */}
              <div className="border-t pt-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <FaTag className="text-green-600" />
                  <span className="font-medium text-gray-900">Mã giảm giá</span>
                </div>
                
                {appliedDiscount ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <FaCheck className="text-green-600" />
                      <div>
                        <div className="font-medium text-green-900">{appliedDiscount.code}</div>
                        <div className="text-xs text-green-700">
                          {appliedDiscount.discountType === 'PERCENTAGE' 
                            ? `Giảm ${appliedDiscount.discountValue}%` 
                            : `Giảm ${formatPrice(appliedDiscount.discountValue)}`}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveDiscount}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      placeholder="Nhập mã giảm giá"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscount()}
                    />
                    <Button
                      onClick={handleApplyDiscount}
                      disabled={checkingDiscount}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                    >
                      {checkingDiscount ? 'Kiểm tra...' : 'Áp dụng'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Price Summary */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({itemCount} sản phẩm)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span className="font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}

                {subtotal < 500000 && shipping > 0 && (
                  <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    💡 Mua thêm {formatPrice(500000 - subtotal)} để được miễn phí ship!
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t">
                  <span>Tổng cộng</span>
                  <span className="text-red-600">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="mt-6">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-600">
                    Tôi đã đọc và đồng ý với{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Điều khoản dịch vụ
                    </a>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitOrder}
                disabled={submitting}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <FaCheck />
                    Đặt hàng ({formatPrice(total)})
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-gray-500 mt-4">
                Bằng cách đặt hàng, bạn đồng ý với điều khoản sử dụng của chúng tôi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
