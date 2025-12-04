import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaClock, FaTruck, FaCheckCircle, FaTimesCircle, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Loading from '../../../components/common/Loading';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import orderService from '../../../services/orderService';
import { formatPrice, formatDateTime } from '../../../utils/formatters';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();
      // Backend returns {orders: [...], total, page, ...}
      const ordersList = response.data?.orders || response.data || [];
      
      // Transform orderItems to items for consistency
      const transformedOrders = (Array.isArray(ordersList) ? ordersList : []).map(order => ({
        ...order,
        items: order.orderItems || []
      }));
      
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Không thể tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        icon: FaClock,
        text: 'Chờ xác nhận',
        variant: 'warning',
        color: 'text-amber-600 bg-amber-50'
      },
      PROCESSING: {
        icon: FaBox,
        text: 'Đang xử lý',
        variant: 'info',
        color: 'text-blue-600 bg-blue-50'
      },
      SHIPPED: {
        icon: FaTruck,
        text: 'Đang giao',
        variant: 'info',
        color: 'text-purple-600 bg-purple-50'
      },
      DELIVERED: {
        icon: FaCheckCircle,
        text: 'Đã giao',
        variant: 'success',
        color: 'text-green-600 bg-green-50'
      },
      CANCELLED: {
        icon: FaTimesCircle,
        text: 'Đã hủy',
        variant: 'danger',
        color: 'text-red-600 bg-red-50'
      }
    };
    return configs[status] || configs.PENDING;
  };

  const safeOrders = Array.isArray(orders) ? orders : [];
  
  const filteredOrders = filter === 'ALL' 
    ? safeOrders 
    : safeOrders.filter(order => order.status === filter);

  const filterTabs = [
    { value: 'ALL', label: 'Tất cả', count: safeOrders.length },
    { value: 'PENDING', label: 'Chờ xác nhận', count: safeOrders.filter(o => o.status === 'PENDING').length },
    { value: 'PROCESSING', label: 'Đang xử lý', count: safeOrders.filter(o => o.status === 'PROCESSING').length },
    { value: 'SHIPPED', label: 'Đang giao', count: safeOrders.filter(o => o.status === 'SHIPPED').length },
    { value: 'DELIVERED', label: 'Đã giao', count: safeOrders.filter(o => o.status === 'DELIVERED').length },
    { value: 'CANCELLED', label: 'Đã hủy', count: safeOrders.filter(o => o.status === 'CANCELLED').length }
  ];

  if (loading) {
    return <Loading fullScreen text="Đang tải đơn hàng..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 pt-24">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaBox className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
              <p className="text-gray-600 text-sm mt-1">Quản lý và theo dõi đơn hàng của bạn</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden border border-gray-100">
          <div className="flex overflow-x-auto scrollbar-hide">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`flex-1 min-w-fit px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${
                  filter === tab.value
                    ? 'text-blue-600 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-900 border-transparent hover:bg-gray-50'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`ml-2 px-2.5 py-1 text-xs font-semibold rounded-full transition-colors ${
                    filter === tab.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-gray-100">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <FaBox size={48} className="text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {filter === 'ALL' 
                ? 'Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!'
                : `Không có đơn hàng ${filterTabs.find(t => t.value === filter)?.label.toLowerCase()}`
              }
            </p>
            <Button
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <span className="flex items-center gap-2">
                <FaBox size={18} />
                Mua sắm ngay
              </span>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200"
                >
                  {/* Order Header */}
                  <div className="p-5 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Đơn hàng</span>
                        <span className="font-bold text-gray-900 text-lg">
                          #{order.id}
                        </span>
                      </div>
                      <div className="h-5 w-px bg-gray-300" />
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaClock size={12} className="text-gray-400" />
                        {formatDateTime(order.createdAt)}
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm ${statusConfig.color}`}>
                      <StatusIcon size={16} />
                      <span className="text-sm font-semibold">{statusConfig.text}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4">
                    <div className="space-y-3 mb-4">
                      {order.items?.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                            <img
                              src={item.variant?.product?.images?.[0]?.url || '/placeholder-product.jpg'}
                              alt={item.variant?.product?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {item.variant?.product?.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {item.variant?.size && `Size: ${item.variant.size}`}
                              {item.variant?.size && item.variant?.color && ' • '}
                              {item.variant?.color && `Màu: ${item.variant.color}`}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-500">x{item.quantity}</span>
                              <span className="text-sm font-semibold text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {order.items?.length > 2 && (
                        <div className="text-sm text-gray-500 text-center py-2">
                          và {order.items.length - 2} sản phẩm khác...
                        </div>
                      )}
                    </div>

                    {/* Order Footer */}
                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-gray-500">Tổng thanh toán:</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        {order.status === 'PENDING' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
                                // TODO: Call cancel order API
                                toast.success('Đã hủy đơn hàng');
                                loadOrders();
                              }
                            }}
                            className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-600 transition-all"
                          >
                            Hủy đơn
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                        >
                          <FaEye />
                          Xem chi tiết
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
